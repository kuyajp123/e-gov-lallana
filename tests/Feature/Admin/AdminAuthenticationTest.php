<?php

use App\Models\Role;
use App\Models\User;

test('admin login screen can be rendered', function () {
    $response = $this->get(route('admin.login'));

    $response->assertOk();
});

test('admin can authenticate using the admin login screen', function () {
    $adminRole = Role::firstOrCreate(
        ['slug' => 'admin'],
        ['name' => 'Barangay Administrator', 'description' => 'Full administrative access']
    );

    $admin = User::factory()->create([
        'role_id' => $adminRole->id,
        'password' => 'password',
    ]);

    $response = $this->post(route('admin.login.store'), [
        'email' => $admin->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticatedAs($admin);
    $response->assertRedirect(route('filament.admin.pages.dashboard'));
});

test('resident user is denied access on the admin login screen', function () {
    $residentRole = Role::firstOrCreate(
        ['slug' => 'resident'],
        ['name' => 'Resident', 'description' => 'Standard resident user']
    );

    $resident = User::factory()->create([
        'role_id' => $residentRole->id,
        'password' => 'password',
    ]);

    $response = $this->post(route('admin.login.store'), [
        'email' => $resident->email,
        'password' => 'password',
    ]);

    $response->assertSessionHasErrors('email');
    $this->assertGuest();
});

test('admin cannot authenticate with invalid password', function () {
    $adminRole = Role::firstOrCreate(
        ['slug' => 'admin'],
        ['name' => 'Barangay Administrator', 'description' => 'Full administrative access']
    );

    $admin = User::factory()->create([
        'role_id' => $adminRole->id,
        'password' => 'password',
    ]);

    $response = $this->post(route('admin.login.store'), [
        'email' => $admin->email,
        'password' => 'wrong-password',
    ]);

    $response->assertSessionHasErrors('email');
    $this->assertGuest();
});

test('admin can logout from admin session', function () {
    $adminRole = Role::firstOrCreate(
        ['slug' => 'admin'],
        ['name' => 'Barangay Administrator', 'description' => 'Full administrative access']
    );

    $admin = User::factory()->create([
        'role_id' => $adminRole->id,
    ]);

    $response = $this->actingAs($admin)->post(route('admin.logout'));

    $response->assertRedirect(route('admin.login'));
    $this->assertGuest();
});
