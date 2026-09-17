<?php

use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;

beforeEach(function () {
    $this->superAdminRole = Role::firstOrCreate(['slug' => 'super_admin'], ['name' => 'Super Administrator']);
    $this->adminRole = Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Barangay Administrator']);
    $this->subAdminRole = Role::firstOrCreate(['slug' => 'sub_admin'], ['name' => 'Barangay Sub-admin / Staff']);
    $this->residentRole = Role::firstOrCreate(['slug' => 'resident'], ['name' => 'Resident']);

    $this->superAdmin = User::factory()->create(['role_id' => $this->superAdminRole->id, 'status' => 'active']);
    $this->admin = User::factory()->create(['role_id' => $this->adminRole->id, 'status' => 'active']);
    $this->subAdmin = User::factory()->create(['role_id' => $this->subAdminRole->id, 'status' => 'active']);
    $this->resident = User::factory()->create(['role_id' => $this->residentRole->id, 'status' => 'active']);
});

test('admin can access staff management resource', function () {
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

    $this->resident->update(['role_id' => $this->subAdminRole->id]);
    $this->resident->refresh();

    expect($this->resident->isSubAdmin())->toBeTrue()
        ->and($this->resident->canAccessPanel(filament()->getDefaultPanel()))->toBeTrue();
});

test('super admin can revoke sub admin privileges back to resident', function () {
    expect($this->subAdmin->isSubAdmin())->toBeTrue();

    $this->subAdmin->update(['role_id' => $this->residentRole->id]);
    $this->subAdmin->refresh();

    expect($this->subAdmin->isResident())->toBeTrue()
        ->and($this->subAdmin->canAccessPanel(filament()->getDefaultPanel()))->toBeFalse();
});

test('admin can provision new staff account directly with hashed password', function () {
    $newStaff = User::create([
        'name' => 'Kagawad Maria Santos',
        'email' => 'maria.santos@lallana.gov.ph',
        'phone_number' => '+639171234567',
        'role_id' => $this->subAdminRole->id,
        'password' => Hash::make('Secret123!'),
        'status' => 'active',
        'email_verified_at' => now(),
    ]);

    expect($newStaff->exists)->toBeTrue()
        ->and($newStaff->isSubAdmin())->toBeTrue()
        ->and(Hash::check('Secret123!', $newStaff->password))->toBeTrue()
        ->and($newStaff->canAccessPanel(filament()->getDefaultPanel()))->toBeTrue();
});

test('deactivated staff member is blocked from admin panel access', function () {
    expect($this->subAdmin->canAccessPanel(filament()->getDefaultPanel()))->toBeTrue();

    // Deactivate staff
    $this->subAdmin->update(['status' => 'inactive']);
    $this->subAdmin->refresh();

    expect($this->subAdmin->status)->toBe('inactive')
        ->and($this->subAdmin->canAccessPanel(filament()->getDefaultPanel()))->toBeFalse();

    // When attempting to access /admin, inactive staff is blocked
    $response = $this->actingAs($this->subAdmin)->get('/admin');
    expect($response->status())->toBeIn([302, 403, 404]);

    // Reactivate staff
    $this->subAdmin->update(['status' => 'active']);
    $this->subAdmin->refresh();

    expect($this->subAdmin->canAccessPanel(filament()->getDefaultPanel()))->toBeTrue();
});

test('super admin account cannot be deleted or demoted by regular admin', function () {
    // Normal admin cannot delete super admin
    expect(Gate::forUser($this->admin)->allows('delete', $this->superAdmin))->toBeFalse();

    // Normal admin cannot update/demote super admin
    expect(Gate::forUser($this->admin)->allows('update', $this->superAdmin))->toBeFalse();

    // Super admin can update other staff
    expect(Gate::forUser($this->superAdmin)->allows('update', $this->subAdmin))->toBeTrue();

    // User cannot delete themselves
    expect(Gate::forUser($this->admin)->allows('delete', $this->admin))->toBeFalse();
    expect(Gate::forUser($this->superAdmin)->allows('delete', $this->superAdmin))->toBeFalse();
});

test('admin cannot edit or update co-admin account', function () {
    $coAdmin = User::factory()->create(['role_id' => $this->adminRole->id, 'status' => 'active']);
    $coSuperAdmin = User::factory()->create(['role_id' => $this->superAdminRole->id, 'status' => 'active']);

    // Admin cannot update co-admin
    expect(Gate::forUser($this->admin)->allows('update', $coAdmin))->toBeFalse();

    // Admin can update self
    expect(Gate::forUser($this->admin)->allows('update', $this->admin))->toBeTrue();

    // Admin can update sub-admin
    expect(Gate::forUser($this->admin)->allows('update', $this->subAdmin))->toBeTrue();

    // Super admin cannot update co-super-admin
    expect(Gate::forUser($this->superAdmin)->allows('update', $coSuperAdmin))->toBeFalse();

    // Super admin can update regular admin
    expect(Gate::forUser($this->superAdmin)->allows('update', $this->admin))->toBeTrue();
});
