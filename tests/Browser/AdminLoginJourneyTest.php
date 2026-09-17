<?php

use App\Models\Role;
use App\Models\User;

test('admin can access the admin panel in browser', function () {
    $role = Role::firstOrCreate(['slug' => 'sub_admin'], ['name' => 'Barangay Sub-admin / Staff']);
    $user = User::factory()->create(['role_id' => $role->id]);

    $page = $this->actingAs($user)->visit('/admin');

    $page->assertPathIs('/admin')
        ->assertSee('Admin Console')
        ->assertNoJavaScriptErrors();
});
