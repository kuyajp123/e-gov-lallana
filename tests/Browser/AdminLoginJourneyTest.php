<?php

use App\Models\Role;
use App\Models\User;

test('admin can log in via global login and is properly navigated to admin panel in browser', function () {
    $subAdminRole = Role::firstOrCreate(['slug' => 'sub_admin'], ['name' => 'Barangay Sub-admin / Staff']);
    $user = User::factory()->create([
        'role_id' => $subAdminRole->id,
        'password' => 'secret-password',
    ]);

    $page = visit('/login');

    $page->assertSee('Log in to your account')
        ->fill('email', $user->email)
        ->fill('password', 'secret-password')
        ->click('button[type="submit"]');

    $page->assertPathIs('/admin')
        ->assertSee('Barangay Lallana Admin')
        ->assertNoJavaScriptErrors();
});
