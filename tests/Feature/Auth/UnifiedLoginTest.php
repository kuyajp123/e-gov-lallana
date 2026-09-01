<?php

use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Config;

beforeEach(function () {
    $this->adminRole = Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Barangay Administrator']);
    $this->subAdminRole = Role::firstOrCreate(['slug' => 'sub_admin'], ['name' => 'Barangay Sub-admin / Staff']);
    $this->residentRole = Role::firstOrCreate(['slug' => 'resident'], ['name' => 'Resident']);
});

test('admin logging in via global login is redirected to admin panel', function () {
    Config::set('auth.super_admins', [
        [
            'name' => 'Test Admin',
            'email' => 'unified.admin@example.com',
            'password' => 'secret-password',
        ],
    ]);

    $response = $this->post('/login', [
        'email' => 'unified.admin@example.com',
        'password' => 'secret-password',
    ]);

    $response->assertRedirect('/admin');
    $this->assertAuthenticated();
});

test('sub admin logging in via global login is redirected to admin panel', function () {
    $subAdmin = User::factory()->create([
        'role_id' => $this->subAdminRole->id,
        'password' => 'staff-password',
    ]);

    $response = $this->post('/login', [
        'email' => $subAdmin->email,
        'password' => 'staff-password',
    ]);

    $response->assertRedirect('/admin');
    $this->assertAuthenticatedAs($subAdmin);
});

test('resident logging in via global login is redirected to resident dashboard', function () {
    $resident = User::factory()->create([
        'role_id' => $this->residentRole->id,
        'password' => 'resident-password',
    ]);

    $response = $this->post('/login', [
        'email' => $resident->email,
        'password' => 'resident-password',
    ]);

    $response->assertRedirect('/dashboard');
    $this->assertAuthenticatedAs($resident);
});
