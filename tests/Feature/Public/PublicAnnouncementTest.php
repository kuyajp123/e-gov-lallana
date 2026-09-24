<?php

use App\Models\Announcement;
use App\Models\Role;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->adminRole = Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Barangay Administrator']);
    $this->residentRole = Role::firstOrCreate(['slug' => 'resident'], ['name' => 'Resident']);

    $this->admin = User::factory()->create(['role_id' => $this->adminRole->id]);
    $this->resident = User::factory()->create(['role_id' => $this->residentRole->id]);
});

test('guests and residents can view public announcements directory', function () {
    Announcement::factory()->create([
        'title' => 'Scheduled Power Maintenance Advisory',
        'is_published' => true,
        'published_at' => now()->subDay(),
    ]);

    $this->get('/announcements')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/announcements/index')
            ->has('announcements.data', 1)
            ->has('counts')
            ->has('categories')
            ->where('announcements.data.0.title', 'Scheduled Power Maintenance Advisory')
        );

    $this->actingAs($this->resident)
        ->get('/announcements')
        ->assertOk();
});

test('public index excludes draft and future-scheduled announcements', function () {
    Announcement::factory()->create([
        'title' => 'Live Public Advisory',
        'is_published' => true,
        'published_at' => now()->subHour(),
    ]);

    Announcement::factory()->create([
        'title' => 'Unpublished Internal Draft',
        'is_published' => false,
    ]);

    Announcement::factory()->create([
        'title' => 'Future Scheduled Bulletin',
        'is_published' => true,
        'published_at' => now()->addDays(5),
    ]);

    $response = $this->get('/announcements');
    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('public/announcements/index')
        ->has('announcements.data', 1)
        ->where('announcements.data.0.title', 'Live Public Advisory')
    );
});

test('public index filters by category and search keywords', function () {
    Announcement::factory()->create([
        'title' => 'Typhoon Evacuation Protocol',
        'category' => 'emergency',
        'is_published' => true,
        'published_at' => now()->subHours(2),
    ]);

    Announcement::factory()->create([
        'title' => 'Community Clean-Up Drive',
        'category' => 'event',
        'is_published' => true,
        'published_at' => now()->subHours(4),
    ]);

    // Filter by emergency category
    $response = $this->get('/announcements?category=emergency');
    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->has('announcements.data', 1)
        ->where('announcements.data.0.title', 'Typhoon Evacuation Protocol')
    );

    // Search keyword
    $response = $this->get('/announcements?search=Evacuation');
    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->has('announcements.data', 1)
        ->where('announcements.data.0.title', 'Typhoon Evacuation Protocol')
    );
});

test('guests can read published announcement article by slug', function () {
    $announcement = Announcement::factory()->create([
        'title' => 'Barangay Health Center Consultation Schedule',
        'slug' => 'barangay-health-center-consultation-schedule',
        'category' => 'advisory',
        'content' => '<p>Doctors and nurses will be on duty every Monday, Wednesday, and Friday.</p>',
        'is_published' => true,
        'published_at' => now()->subDays(2),
    ]);

    $this->get("/announcements/{$announcement->slug}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/announcements/show')
            ->where('announcement.slug', 'barangay-health-center-consultation-schedule')
            ->where('announcement.title', 'Barangay Health Center Consultation Schedule')
            ->where('canEdit', false)
        );
});

test('unpublished draft announcement returns 404 for public guests and residents', function () {
    $announcement = Announcement::factory()->create([
        'title' => 'Secret Internal Memo',
        'slug' => 'secret-internal-memo',
        'is_published' => false,
    ]);

    $this->get("/announcements/{$announcement->slug}")->assertNotFound();

    $this->actingAs($this->resident)
        ->get("/announcements/{$announcement->slug}")
        ->assertNotFound();
});

test('admin can preview unpublished draft announcement by slug', function () {
    $announcement = Announcement::factory()->create([
        'title' => 'Upcoming Civic Project Draft',
        'slug' => 'upcoming-civic-project-draft',
        'is_published' => false,
    ]);

    $this->actingAs($this->admin)
        ->get("/announcements/{$announcement->slug}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/announcements/show')
            ->where('announcement.is_published', false)
            ->where('canEdit', true)
        );
});

test('article page includes related announcements in the same category', function () {
    $article = Announcement::factory()->create([
        'title' => 'Flood Safety Precautions',
        'slug' => 'flood-safety-precautions',
        'category' => 'emergency',
        'is_published' => true,
        'published_at' => now()->subDay(),
    ]);

    $related1 = Announcement::factory()->create([
        'title' => 'Typhoon Evacuation Center Open',
        'slug' => 'typhoon-evacuation-center-open',
        'category' => 'emergency',
        'is_published' => true,
        'published_at' => now()->subHours(10),
    ]);

    $unrelated = Announcement::factory()->create([
        'title' => 'Townhall Meeting Schedule',
        'slug' => 'townhall-meeting-schedule',
        'category' => 'meeting',
        'is_published' => true,
        'published_at' => now()->subHours(12),
    ]);

    $this->get("/announcements/{$article->slug}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('relatedAnnouncements', 1)
            ->where('relatedAnnouncements.0.title', 'Typhoon Evacuation Center Open')
        );
});
