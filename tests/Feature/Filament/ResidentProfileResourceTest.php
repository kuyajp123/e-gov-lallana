<?php

use App\Models\ResidentProfile;
use App\Models\Role;
use App\Models\User;

beforeEach(function () {
    $this->superAdminRole = Role::firstOrCreate(['slug' => 'super_admin'], ['name' => 'Super Administrator']);
    $this->adminRole = Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Barangay Administrator']);
    $this->subAdminRole = Role::firstOrCreate(['slug' => 'sub_admin'], ['name' => 'Barangay Sub-admin / Staff']);
    $this->residentRole = Role::firstOrCreate(['slug' => 'resident'], ['name' => 'Resident']);

    $this->superAdmin = User::factory()->create(['role_id' => $this->superAdminRole->id, 'email' => 'superadmin@example.com']);
    $this->admin = User::factory()->create(['role_id' => $this->adminRole->id, 'email' => 'admin@example.com']);
    $this->subAdmin = User::factory()->create(['role_id' => $this->subAdminRole->id, 'email' => 'subadmin@example.com']);
    $this->residentUser = User::factory()->create(['role_id' => $this->residentRole->id, 'email' => 'resident@example.com']);

    $this->profile = ResidentProfile::create([
        'user_id' => $this->residentUser->id,
        'first_name' => 'Juan',
        'last_name' => 'Dela Cruz',
        'birthdate' => '1990-01-01',
        'gender' => 'male',
        'civil_status' => 'single',
        'citizenship' => 'Filipino',
        'residency_status' => 'official',
    ]);
});

test('admin and sub admin cannot create resident profiles according to policy', function () {
    expect($this->admin->can('create', ResidentProfile::class))->toBeFalse();
    expect($this->subAdmin->can('create', ResidentProfile::class))->toBeFalse();
});

test('resident without profile can create their own profile according to policy', function () {
    $newResident = User::factory()->create(['role_id' => $this->residentRole->id]);

    expect($newResident->can('create', ResidentProfile::class))->toBeTrue();
});

test('admin and sub admin cannot update resident profiles according to policy', function () {
    expect($this->admin->can('update', $this->profile))->toBeFalse();
    expect($this->subAdmin->can('update', $this->profile))->toBeFalse();
});

test('resident can update their own profile according to policy', function () {
    expect($this->residentUser->can('update', $this->profile))->toBeTrue();

    $otherResident = User::factory()->create(['role_id' => $this->residentRole->id]);
    expect($otherResident->can('update', $this->profile))->toBeFalse();
});

test('regular admin cannot delete resident profile according to policy', function () {
    config(['auth.super_admins' => [['email' => 'superadmin@example.com']]]);

    expect($this->admin->can('delete', $this->profile))->toBeFalse();
    expect($this->subAdmin->can('delete', $this->profile))->toBeFalse();
});

test('super admin can delete resident profile according to policy', function () {
    config(['auth.super_admins' => [['email' => 'superadmin@example.com']]]);

    expect($this->superAdmin->can('delete', $this->profile))->toBeTrue();
});

test('super admin with configured email in auth config can delete resident profile', function () {
    config(['auth.super_admins' => [['email' => 'configured-super@example.com']]]);

    $configuredAdmin = User::factory()->create([
        'role_id' => $this->adminRole->id,
        'email' => 'configured-super@example.com',
    ]);

    expect($configuredAdmin->isSuperAdmin())->toBeTrue();
    expect($configuredAdmin->can('delete', $this->profile))->toBeTrue();
});

test('admin can access filament resident profiles list', function () {
    $response = $this->actingAs($this->admin)->get('/admin/resident-profiles');

    $response->assertOk();
    $response->assertSee('Juan Dela Cruz');
    // Ensure no create button is rendered
    $response->assertDontSee('/admin/resident-profiles/create');
});

test('create resident profile route in admin panel returns 404', function () {
    $response = $this->actingAs($this->admin)->get('/admin/resident-profiles/create');

    $response->assertNotFound();
});

test('edit resident profile route in admin panel returns 404', function () {
    $response = $this->actingAs($this->admin)->get("/admin/resident-profiles/{$this->profile->id}/edit");

    $response->assertNotFound();
});

test('view resident profile route in admin panel returns 200 ok with resident information', function () {
    $response = $this->actingAs($this->admin)->get("/admin/resident-profiles/{$this->profile->id}");

    $response->assertOk();
    $response->assertSee('Juan Dela Cruz');
    $response->assertSee('Personal Information');
    $response->assertSee('Account & Contact Information');
});
