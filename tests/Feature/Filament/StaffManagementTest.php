<?php

use App\Models\Role;
use App\Models\User;

beforeEach(function () {
    $this->adminRole = Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Barangay Administrator']);
    $this->subAdminRole = Role::firstOrCreate(['slug' => 'sub_admin'], ['name' => 'Barangay Sub-admin / Staff']);
    $this->residentRole = Role::firstOrCreate(['slug' => 'resident'], ['name' => 'Resident']);

    $this->admin = User::factory()->create(['role_id' => $this->adminRole->id]);
    $this->subAdmin = User::factory()->create(['role_id' => $this->subAdminRole->id]);
    $this->resident = User::factory()->create(['role_id' => $this->residentRole->id]);
});

test('super admin can access staff management resource', function () {
    $response = $this->actingAs($this->admin)->get('/admin/staff');

    $response->assertOk();
});

test('sub admin is forbidden from accessing staff management resource', function () {
    $response = $this->actingAs($this->subAdmin)->get('/admin/staff');

    $response->assertForbidden();
});

test('resident accessing staff management receives 404 not found', function () {
    $response = $this->actingAs($this->resident)->get('/admin/staff');

    $response->assertNotFound();
});

test('super admin can designate an existing registered resident as sub admin', function () {
    expect($this->resident->isResident())->toBeTrue();

    // Promote resident to sub admin
    $this->resident->update(['role_id' => $this->subAdminRole->id]);
    $this->resident->refresh();

    expect($this->resident->isSubAdmin())->toBeTrue()
        ->and($this->resident->canAccessPanel(filament()->getDefaultPanel()))->toBeTrue();
});

test('super admin can revoke sub admin privileges back to resident', function () {
    expect($this->subAdmin->isSubAdmin())->toBeTrue();

    // Revoke privileges back to resident
    $this->subAdmin->update(['role_id' => $this->residentRole->id]);
    $this->subAdmin->refresh();

    expect($this->subAdmin->isResident())->toBeTrue()
        ->and($this->subAdmin->canAccessPanel(filament()->getDefaultPanel()))->toBeFalse();
});
