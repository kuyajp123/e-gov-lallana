<?php

use App\Models\Role;
use App\Models\SystemSetting;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->adminRole = Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Barangay Administrator']);
    $this->residentRole = Role::firstOrCreate(['slug' => 'resident'], ['name' => 'Barangay Resident']);

    $this->admin = User::factory()->create([
        'role_id' => $this->adminRole->id,
        'email_verified_at' => now(),
    ]);

    $this->resident = User::factory()->create([
        'role_id' => $this->residentRole->id,
        'email_verified_at' => now(),
    ]);
});

test('unauthenticated users are redirected from /settings/system', function () {
    $this->get('/settings/system')
        ->assertRedirect('/login');
});

test('regular residents receive 404 when accessing /settings/system', function () {
    $this->actingAs($this->resident)
        ->get('/settings/system')
        ->assertNotFound();
});

test('admin can view /settings/system page with keep alive status', function () {
    $this->actingAs($this->admin)
        ->get('/settings/system')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('settings/system')
            ->has('keepAlive')
            ->where('keepAlive.enabled', false)
            ->where('keepAlive.interval', 11)
        );
});

test('admin can update keep alive settings via post', function () {
    $this->actingAs($this->admin)
        ->post('/settings/system/keep-alive', [
            'enabled' => true,
            'interval' => 12,
            'target_url' => 'https://example.onrender.com/healthz',
        ])
        ->assertRedirect();

    expect(SystemSetting::get('render_keep_alive_enabled'))->toBeTrue();
    expect(SystemSetting::get('render_keep_alive_interval_minutes'))->toBe(12);
    expect(SystemSetting::get('render_keep_alive_target_url'))->toBe('https://example.onrender.com/healthz');
});
