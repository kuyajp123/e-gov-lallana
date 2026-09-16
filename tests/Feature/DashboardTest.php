<?php

use App\Models\Role;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('admin user has can_access_admin true in auth props', function () {
    $adminRole = Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Administrator']);
    $user = User::factory()->create(['role_id' => $adminRole->id]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->where('auth.user.can_access_admin', true)
        );
});

test('regular user has can_access_admin false in auth props', function () {
    $residentRole = Role::firstOrCreate(['slug' => 'resident'], ['name' => 'Resident']);
    $user = User::factory()->create(['role_id' => $residentRole->id]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->where('auth.user.can_access_admin', false)
        );
});
