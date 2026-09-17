<?php

use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->superAdminRole = Role::firstOrCreate(['slug' => 'super_admin'], ['name' => 'Super Administrator']);
    $this->adminRole = Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Barangay Administrator']);
    $this->subAdminRole = Role::firstOrCreate(['slug' => 'sub_admin'], ['name' => 'Barangay Sub-admin / Staff']);
    $this->residentRole = Role::firstOrCreate(['slug' => 'resident'], ['name' => 'Resident']);

    $this->superAdmin = User::factory()->create(['role_id' => $this->superAdminRole->id, 'status' => 'active', 'email' => 'superadmin@example.com']);
    $this->admin = User::factory()->create(['role_id' => $this->adminRole->id, 'status' => 'active', 'email' => 'admin@example.com']);
    $this->subAdmin = User::factory()->create(['role_id' => $this->subAdminRole->id, 'status' => 'active', 'email' => 'subadmin@example.com']);
    $this->resident = User::factory()->create(['role_id' => $this->residentRole->id, 'status' => 'active', 'email' => 'resident@example.com']);
});

test('admin can access staff directory index', function () {
    $response = $this->actingAs($this->admin)->get('/admin/staff');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/staff/index')
        ->has('staff.data')
        ->has('stats')
        ->has('residentCandidates')
        ->has('filters')
    );
});

test('admin can filter staff by role and status', function () {
    $response = $this->actingAs($this->admin)->get('/admin/staff?role=sub_admin&status=active');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/staff/index')
        ->has('staff.data', 1)
        ->where('staff.data.0.email', 'subadmin@example.com')
    );
});

test('admin can search staff by name or email', function () {
    $response = $this->actingAs($this->admin)->get('/admin/staff?search=subadmin@example.com');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/staff/index')
        ->has('staff.data', 1)
        ->where('staff.data.0.email', 'subadmin@example.com')
    );
});

test('admin can provision new staff account directly with hashed password', function () {
    $response = $this->actingAs($this->admin)->post('/admin/staff', [
        'name' => 'Kagawad Maria Santos',
        'email' => 'maria.santos@lallana.gov.ph',
        'phone_number' => '+639171234567',
        'role_slug' => 'sub_admin',
        'password' => 'SecretPass123!',
        'status' => 'active',
    ]);

    $response->assertSessionHasNoErrors();

    $newStaff = User::where('email', 'maria.santos@lallana.gov.ph')->first();
    expect($newStaff)->not->toBeNull()
        ->and($newStaff->name)->toBe('Kagawad Maria Santos')
        ->and($newStaff->isSubAdmin())->toBeTrue()
        ->and(Hash::check('SecretPass123!', $newStaff->password))->toBeTrue();
});

test('admin can designate an existing registered resident as sub admin', function () {
    expect($this->resident->isResident())->toBeTrue();

    $response = $this->actingAs($this->admin)->post('/admin/staff/designate', [
        'user_id' => $this->resident->id,
    ]);

    $response->assertSessionHasNoErrors();
    $this->resident->refresh();
    expect($this->resident->isSubAdmin())->toBeTrue();
});

test('admin can update staff details and optional new password', function () {
    $response = $this->actingAs($this->admin)->put("/admin/staff/{$this->subAdmin->id}", [
        'name' => 'Updated Staff Name',
        'email' => 'updated.staff@example.com',
        'phone_number' => '+639198765432',
        'role_slug' => 'sub_admin',
        'status' => 'active',
        'password' => 'BrandNewSecret999!',
    ]);

    $response->assertSessionHasNoErrors();
    $this->subAdmin->refresh();

    expect($this->subAdmin->name)->toBe('Updated Staff Name')
        ->and($this->subAdmin->email)->toBe('updated.staff@example.com')
        ->and(Hash::check('BrandNewSecret999!', $this->subAdmin->password))->toBeTrue();
});

test('admin can toggle staff account active status', function () {
    expect($this->subAdmin->status)->toBe('active');

    // Deactivate
    $response = $this->actingAs($this->admin)->post("/admin/staff/{$this->subAdmin->id}/toggle-status");
    $response->assertSessionHasNoErrors();
    $this->subAdmin->refresh();
    expect($this->subAdmin->status)->toBe('inactive');

    // Reactivate
    $response = $this->actingAs($this->admin)->post("/admin/staff/{$this->subAdmin->id}/toggle-status");
    $response->assertSessionHasNoErrors();
    $this->subAdmin->refresh();
    expect($this->subAdmin->status)->toBe('active');
});

test('admin cannot deactivate own account', function () {
    $response = $this->actingAs($this->admin)->post("/admin/staff/{$this->admin->id}/toggle-status");

    $response->assertSessionHasErrors(['status']);
    $this->admin->refresh();
    expect($this->admin->status)->toBe('active');
});

test('admin cannot deactivate super admin', function () {
    $response = $this->actingAs($this->admin)->post("/admin/staff/{$this->superAdmin->id}/toggle-status");

    $response->assertSessionHasErrors(['status']);
    $this->superAdmin->refresh();
    expect($this->superAdmin->status)->toBe('active');
});

test('regular admin cannot deactivate another regular admin', function () {
    $otherAdmin = User::factory()->create(['role_id' => $this->adminRole->id, 'status' => 'active']);

    $response = $this->actingAs($this->admin)->post("/admin/staff/{$otherAdmin->id}/toggle-status");

    $response->assertSessionHasErrors(['status']);
    $otherAdmin->refresh();
    expect($otherAdmin->status)->toBe('active');
});

test('admin can revoke sub admin privileges back to resident', function () {
    expect($this->subAdmin->isSubAdmin())->toBeTrue();

    $response = $this->actingAs($this->admin)->post("/admin/staff/{$this->subAdmin->id}/revoke");

    $response->assertSessionHasNoErrors();
    $this->subAdmin->refresh();
    expect($this->subAdmin->isResident())->toBeTrue();
});

test('sub admin is forbidden with 403 from staff management', function () {
    $response = $this->actingAs($this->subAdmin)->get('/admin/staff');

    $response->assertForbidden();
});

test('resident is blocked with 404 from staff management', function () {
    $response = $this->actingAs($this->resident)->get('/admin/staff');

    $response->assertNotFound();
});

test('unauthenticated visitor is redirected to login from staff management', function () {
    $response = $this->get('/admin/staff');

    $response->assertRedirect('/login');
});
