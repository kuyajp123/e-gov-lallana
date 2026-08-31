<?php

use App\Models\Household;
use App\Models\Role;
use App\Models\User;
use App\Models\Verification;

beforeEach(function () {
    $this->adminRole = Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Admin']);
    $this->residentRole = Role::firstOrCreate(['slug' => 'resident'], ['name' => 'Resident']);

    $this->admin = User::factory()->create(['role_id' => $this->adminRole->id]);
    $this->resident = User::factory()->create(['role_id' => $this->residentRole->id]);

    $this->household = Household::create([
        'household_code' => 'HH-2026-0099',
        'family_head_id' => $this->resident->id,
        'address' => '100 Sampaguita St.',
        'purok_sitio' => 'Purok 1',
        'status' => 'unverified',
        'submitted_at' => now(),
    ]);

    $this->verification = Verification::create([
        'verifiable_type' => Household::class,
        'verifiable_id' => $this->household->id,
        'status' => 'pending',
    ]);
});

test('admin can access filament admin panel', function () {
    $response = $this->actingAs($this->admin)->get('/admin');

    $response->assertOk();
});

test('resident user is forbidden from accessing filament admin panel', function () {
    $response = $this->actingAs($this->resident)->get('/admin');

    $response->assertForbidden();
});

test('admin can approve household registration', function () {
    $this->household->update([
        'status' => 'verified',
        'verified_at' => now(),
    ]);

    $this->verification->update([
        'status' => 'approved',
        'reviewer_id' => $this->admin->id,
        'reviewed_at' => now(),
    ]);

    $this->household->refresh();
    $this->verification->refresh();

    expect($this->household->status)->toBe('verified')
        ->and($this->household->verified_at)->not->toBeNull()
        ->and($this->verification->status)->toBe('approved')
        ->and($this->verification->reviewer_id)->toBe($this->admin->id);
});

test('admin can return household registration for correction with notes', function () {
    $this->household->update(['status' => 'returned']);
    $this->verification->update([
        'status' => 'returned',
        'review_notes' => 'Please provide a clearer photo of your government ID.',
        'reviewer_id' => $this->admin->id,
        'reviewed_at' => now(),
    ]);

    $this->household->refresh();
    $this->verification->refresh();

    expect($this->household->status)->toBe('returned')
        ->and($this->verification->status)->toBe('returned')
        ->and($this->verification->review_notes)->toBe('Please provide a clearer photo of your government ID.');
});
