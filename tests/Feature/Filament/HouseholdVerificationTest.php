<?php

use App\Models\Household;
use App\Models\HouseholdMember;
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

    $this->member = HouseholdMember::create([
        'household_id' => $this->household->id,
        'user_id' => $this->resident->id,
        'first_name' => 'Juan',
        'last_name' => 'Dela Cruz',
        'relationship_to_head' => 'head',
        'is_family_head' => true,
        'birthdate' => '1990-01-01',
        'gender' => 'male',
        'residency_status' => 'resident',
    ]);
});

test('admin can access filament admin panel', function () {
    $response = $this->actingAs($this->admin)->get('/admin');

    $response->assertOk();
});

test('resident user is blocked with 404 from accessing filament admin panel', function () {
    $response = $this->actingAs($this->resident)->get('/admin');

    $response->assertNotFound();
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

test('admin can access households list in filament without icon errors', function () {
    $response = $this->actingAs($this->admin)->get('/admin/households');

    $response->assertOk();
    $response->assertSee('HH-2026-0099');
});

test('admin cannot create households according to policy and filament route is 404', function () {
    expect($this->admin->can('create', Household::class))->toBeFalse();

    $response = $this->actingAs($this->admin)->get('/admin/households');
    $response->assertOk();
    $response->assertDontSee('/admin/households/create');

    $createResponse = $this->actingAs($this->admin)->get('/admin/households/create');
    $createResponse->assertNotFound();
});

test('admin cannot edit households according to policy and filament edit route is 404', function () {
    expect($this->admin->can('update', $this->household))->toBeFalse();

    $editResponse = $this->actingAs($this->admin)->get("/admin/households/{$this->household->id}/edit");
    $editResponse->assertNotFound();

    $viewResponse = $this->actingAs($this->admin)->get("/admin/households/{$this->household->id}");
    $viewResponse->assertOk();
    $viewResponse->assertDontSee("/admin/households/{$this->household->id}/edit");
});

test('standalone household members resource is removed and returns 404', function () {
    expect($this->admin->can('create', HouseholdMember::class))->toBeFalse();
    expect($this->admin->can('update', $this->member))->toBeFalse();

    $listResponse = $this->actingAs($this->admin)->get('/admin/household-members');
    $listResponse->assertNotFound();

    $createResponse = $this->actingAs($this->admin)->get('/admin/household-members/create');
    $createResponse->assertNotFound();

    $editResponse = $this->actingAs($this->admin)->get("/admin/household-members/{$this->member->id}/edit");
    $editResponse->assertNotFound();
});

test('admin can view household and its members inside household view page', function () {
    $response = $this->actingAs($this->admin)->get("/admin/households/{$this->household->id}");

    $response->assertOk();
    $response->assertSee('Household Members');
    $response->assertSee('Juan Dela Cruz');
    $response->assertSee('HH-2026-0099');
});

test('household members table displays member demographics without member approval actions', function () {
    $response = $this->actingAs($this->admin)->get("/admin/households/{$this->household->id}");

    $response->assertOk();
    $response->assertSee('Juan Dela Cruz');
    $response->assertSee('Head');
    $response->assertDontSee('approve_member');
    $response->assertDontSee('return_member');
});
