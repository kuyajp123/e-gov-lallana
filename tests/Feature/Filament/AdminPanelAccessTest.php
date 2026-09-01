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

test('unauthenticated visitor accessing admin panel is redirected to global login', function () {
    $response = $this->get('/admin');

    $response->assertRedirect('/login');
});

test('authenticated resident accessing admin panel receives 404 not found', function () {
    $response = $this->actingAs($this->resident)->get('/admin');

    $response->assertNotFound();
});

test('authenticated admin accessing admin panel receives 200 ok', function () {
    $response = $this->actingAs($this->admin)->get('/admin');

    $response->assertOk();
});

test('authenticated sub admin accessing admin panel receives 200 ok', function () {
    $response = $this->actingAs($this->subAdmin)->get('/admin');

    $response->assertOk();
});

test('standalone admin login route is removed and returns 404 not found', function () {
    $response = $this->get('/admin/login');

    $response->assertNotFound();
});
