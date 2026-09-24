<?php

use App\Models\Announcement;
use App\Models\FileRecord as FileModel;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    Storage::fake('announcement-attachments');

    $this->adminRole = Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Barangay Administrator']);
    $this->subAdminRole = Role::firstOrCreate(['slug' => 'sub_admin'], ['name' => 'Barangay Sub-admin / Staff']);
    $this->residentRole = Role::firstOrCreate(['slug' => 'resident'], ['name' => 'Resident']);

    $this->admin = User::factory()->create(['role_id' => $this->adminRole->id]);
    $this->subAdmin = User::factory()->create(['role_id' => $this->subAdminRole->id]);
    $this->resident = User::factory()->create(['role_id' => $this->residentRole->id]);
});

test('guest is redirected to login when accessing admin announcements', function () {
    $this->get('/admin/announcements')->assertRedirect('/login');
    $this->get('/admin/announcements/create')->assertRedirect('/login');
});

test('resident receives 404 when accessing admin announcements', function () {
    $this->actingAs($this->resident)
        ->get('/admin/announcements')
        ->assertNotFound();

    $this->actingAs($this->resident)
        ->get('/admin/announcements/create')
        ->assertNotFound();
});

test('admin and subadmin can access admin announcements index', function () {
    Announcement::factory()->create([
        'title' => 'Barangay Assembly Notice',
        'is_published' => true,
    ]);

    $this->actingAs($this->admin)
        ->get('/admin/announcements')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/announcements/index')
            ->has('announcements.data', 1)
            ->has('stats')
            ->has('categories')
            ->where('announcements.data.0.title', 'Barangay Assembly Notice')
        );

    $this->actingAs($this->subAdmin)
        ->get('/admin/announcements')
        ->assertOk();
});

test('admin can filter announcements by category, search, and publication status', function () {
    Announcement::factory()->create([
        'title' => 'Typhoon Warning Alert',
        'category' => 'emergency',
        'is_published' => true,
    ]);

    Announcement::factory()->create([
        'title' => 'Youth Basketball Tournament',
        'category' => 'event',
        'is_published' => false,
    ]);

    // Search filter
    $response = $this->actingAs($this->admin)->get('/admin/announcements?search=Typhoon');
    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/announcements/index')
        ->has('announcements.data', 1)
        ->where('announcements.data.0.title', 'Typhoon Warning Alert')
    );

    // Category filter
    $response = $this->actingAs($this->admin)->get('/admin/announcements?category=event');
    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/announcements/index')
        ->has('announcements.data', 1)
        ->where('announcements.data.0.title', 'Youth Basketball Tournament')
    );

    // Status filter
    $response = $this->actingAs($this->admin)->get('/admin/announcements?status=draft');
    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/announcements/index')
        ->has('announcements.data', 1)
        ->where('announcements.data.0.title', 'Youth Basketball Tournament')
    );
});

test('admin can access announcement create page', function () {
    $this->actingAs($this->admin)
        ->get('/admin/announcements/create')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/announcements/create')
            ->has('categories')
        );
});

test('admin can store a new announcement with auto-generated slug and banner upload', function () {
    $banner = UploadedFile::fake()->image('banner.jpg', 1200, 600);

    $response = $this->actingAs($this->admin)->post('/admin/announcements', [
        'title' => 'Free Anti-Rabies Vaccination Drive',
        'category' => 'advisory',
        'excerpt' => 'Bring your pets to the Barangay Hall Covered Court this Saturday.',
        'content' => '<p>Vaccination starts at 8:00 AM until supplies last. Please bring vaccination cards if available.</p>',
        'banner' => $banner,
        'is_published' => true,
    ]);

    $response->assertRedirect('/admin/announcements');
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('announcements', [
        'title' => 'Free Anti-Rabies Vaccination Drive',
        'slug' => 'free-anti-rabies-vaccination-drive',
        'category' => 'Advisory',
        'is_published' => true,
        'author_id' => $this->admin->id,
    ]);

    $announcement = Announcement::where('slug', 'free-anti-rabies-vaccination-drive')->first();
    expect($announcement)->not->toBeNull();
    expect($announcement->banner_file_id)->not->toBeNull();
    expect($announcement->banner)->not->toBeNull();
    Storage::disk('announcement-attachments')->assertExists($announcement->banner->path);
});

test('storing announcement validates required fields', function () {
    $response = $this->actingAs($this->admin)->post('/admin/announcements', [
        'title' => '',
        'category' => 'invalid-category',
        'content' => '',
    ]);

    $response->assertSessionHasErrors(['title', 'category', 'content']);
});

test('storing announcement handles duplicate title by generating unique slug', function () {
    Announcement::factory()->create([
        'title' => 'Barangay Clean Up Drive',
        'slug' => 'barangay-clean-up-drive',
    ]);

    $this->actingAs($this->admin)->post('/admin/announcements', [
        'title' => 'Barangay Clean Up Drive',
        'category' => 'event',
        'content' => '<p>Second batch of clean up drive scheduled.</p>',
        'is_published' => true,
    ])->assertRedirect('/admin/announcements');

    $announcements = Announcement::where('title', 'Barangay Clean Up Drive')->get();
    expect($announcements)->toHaveCount(2);
    expect($announcements->pluck('slug')->unique())->toHaveCount(2);
});

test('admin can access edit page with prefilled announcement data', function () {
    $announcement = Announcement::factory()->create([
        'title' => 'Water Interruption Notice',
        'author_id' => $this->admin->id,
    ]);

    $this->actingAs($this->admin)
        ->get("/admin/announcements/{$announcement->id}/edit")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/announcements/edit')
            ->where('announcement.id', $announcement->id)
            ->where('announcement.title', 'Water Interruption Notice')
            ->has('categories')
        );
});

test('admin can update an announcement and replace its banner', function () {
    $oldBannerFile = UploadedFile::fake()->image('old-banner.jpg');
    $oldStoredPath = $oldBannerFile->store('announcements', 'announcement-attachments');
    $oldFileRecord = FileModel::create([
        'disk' => 'announcement-attachments',
        'path' => $oldStoredPath,
        'file_name' => 'old-banner.jpg',
        'mime_type' => 'image/jpeg',
        'size_bytes' => 1024,
    ]);

    $announcement = Announcement::factory()->create([
        'title' => 'Old Title',
        'slug' => 'old-title',
        'category' => 'advisory',
        'banner_file_id' => $oldFileRecord->id,
        'is_published' => false,
    ]);

    $newBanner = UploadedFile::fake()->image('new-banner.png');

    $response = $this->actingAs($this->admin)->put("/admin/announcements/{$announcement->id}", [
        'title' => 'Updated Advisory Title',
        'category' => 'meeting',
        'excerpt' => 'Updated excerpt text.',
        'content' => '<p>Updated announcement content.</p>',
        'banner' => $newBanner,
        'is_published' => true,
    ]);

    $response->assertRedirect('/admin/announcements');
    $response->assertSessionHas('success');

    $announcement->refresh();
    expect($announcement->title)->toBe('Updated Advisory Title');
    expect($announcement->category)->toBe('Meeting');
    expect($announcement->is_published)->toBeTrue();
    expect($announcement->banner_file_id)->not->toBe($oldFileRecord->id);

    // Old banner was purged
    Storage::disk('announcement-attachments')->assertMissing($oldStoredPath);
    // New banner exists
    Storage::disk('announcement-attachments')->assertExists($announcement->banner->path);
});

test('admin can remove banner from announcement without replacing it', function () {
    $bannerFile = UploadedFile::fake()->image('banner.jpg');
    $storedPath = $bannerFile->store('announcements', 'announcement-attachments');
    $fileRecord = FileModel::create([
        'disk' => 'announcement-attachments',
        'path' => $storedPath,
        'file_name' => 'banner.jpg',
        'mime_type' => 'image/jpeg',
        'size_bytes' => 1024,
    ]);

    $announcement = Announcement::factory()->create([
        'banner_file_id' => $fileRecord->id,
    ]);

    $response = $this->actingAs($this->admin)->put("/admin/announcements/{$announcement->id}", [
        'title' => $announcement->title,
        'category' => $announcement->category,
        'content' => $announcement->content,
        'remove_banner' => true,
        'is_published' => true,
    ]);

    $response->assertRedirect('/admin/announcements');
    $announcement->refresh();
    expect($announcement->banner_file_id)->toBeNull();
    Storage::disk('announcement-attachments')->assertMissing($storedPath);
});

test('admin can toggle publication status', function () {
    $announcement = Announcement::factory()->create([
        'is_published' => false,
        'published_at' => null,
    ]);

    // Publish
    $this->actingAs($this->admin)
        ->patch("/admin/announcements/{$announcement->id}/toggle")
        ->assertRedirect();

    $announcement->refresh();
    expect($announcement->is_published)->toBeTrue();
    expect($announcement->published_at)->not->toBeNull();

    // Move to draft
    $this->actingAs($this->admin)
        ->patch("/admin/announcements/{$announcement->id}/toggle")
        ->assertRedirect();

    $announcement->refresh();
    expect($announcement->is_published)->toBeFalse();
});

test('admin can delete announcement and purges attached banner file', function () {
    $bannerFile = UploadedFile::fake()->image('banner.jpg');
    $storedPath = $bannerFile->store('announcements', 'announcement-attachments');
    $fileRecord = FileModel::create([
        'disk' => 'announcement-attachments',
        'path' => $storedPath,
        'file_name' => 'banner.jpg',
        'mime_type' => 'image/jpeg',
        'size_bytes' => 1024,
    ]);

    $announcement = Announcement::factory()->create([
        'banner_file_id' => $fileRecord->id,
    ]);

    $this->actingAs($this->admin)
        ->delete("/admin/announcements/{$announcement->id}")
        ->assertRedirect('/admin/announcements');

    $this->assertDatabaseMissing('announcements', ['id' => $announcement->id]);
    $this->assertDatabaseMissing('files', ['id' => $fileRecord->id]);
    Storage::disk('announcement-attachments')->assertMissing($storedPath);
});
