<?php

use App\Models\Household;
use App\Models\HouseholdMember;
use App\Models\Role;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->adminRole = Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Admin']);
    $this->residentRole = Role::firstOrCreate(['slug' => 'resident'], ['name' => 'Resident']);

    $this->admin = User::factory()->create(['role_id' => $this->adminRole->id]);
    $this->resident = User::factory()->create(['role_id' => $this->residentRole->id]);

    $this->household = Household::create([
        'household_code' => 'HH-2026-0001',
        'family_head_id' => $this->resident->id,
        'address' => '123 Rizal Street',
        'purok_sitio' => 'Purok 1',
        'status' => 'unverified',
        'submitted_at' => now(),
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

test('admin can view households queue index and stats', function () {
    $response = $this->actingAs($this->admin)->get('/admin/households');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/households/index')
        ->has('households.data', 1)
        ->has('statusCounts')
        ->has('purokOptions')
        ->where('households.data.0.household_code', 'HH-2026-0001')
    );
});

test('admin can filter households by status', function () {
    $verifiedHousehold = Household::create([
        'household_code' => 'HH-2026-0002',
        'family_head_id' => $this->resident->id,
        'address' => '456 Bonifacio Street',
        'purok_sitio' => 'Purok 2',
        'status' => 'verified',
        'submitted_at' => now(),
        'verified_at' => now(),
    ]);

    $response = $this->actingAs($this->admin)->get('/admin/households?status=verified');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/households/index')
        ->has('households.data', 1)
        ->where('households.data.0.household_code', 'HH-2026-0002')
    );
});

test('admin can filter households by purok_sitio', function () {
    $otherPurokHousehold = Household::create([
        'household_code' => 'HH-2026-0003',
        'family_head_id' => $this->resident->id,
        'address' => '789 Mabini Street',
        'purok_sitio' => 'Purok 4',
        'status' => 'unverified',
        'submitted_at' => now(),
    ]);

    $response = $this->actingAs($this->admin)->get('/admin/households?purok_sitio=Purok 4');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/households/index')
        ->has('households.data', 1)
        ->where('households.data.0.household_code', 'HH-2026-0003')
    );
});

test('admin can search households by household code', function () {
    $response = $this->actingAs($this->admin)->get('/admin/households?search=HH-2026-0001');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/households/index')
        ->has('households.data', 1)
        ->where('households.data.0.household_code', 'HH-2026-0001')
    );
});

test('admin can view household show dossier with members and details', function () {
    $response = $this->actingAs($this->admin)->get("/admin/households/{$this->household->id}");

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/households/show')
        ->where('household.household_code', 'HH-2026-0001')
        ->where('household.purok_sitio', 'Purok 1')
        ->has('household.members', 1)
    );
});

test('admin can approve household registration', function () {
    $response = $this->actingAs($this->admin)->post("/admin/households/{$this->household->id}/verify", [
        'action' => 'approve',
        'review_notes' => 'All documents verified.',
    ]);

    $response->assertSessionHasNoErrors();
    $this->household->refresh();
    expect($this->household->status)->toBe('verified');
    expect($this->household->verified_at)->not->toBeNull();
});

test('admin can return household registration for correction', function () {
    $response = $this->actingAs($this->admin)->post("/admin/households/{$this->household->id}/verify", [
        'action' => 'return',
        'review_notes' => 'Please provide proof of residency.',
    ]);

    $response->assertSessionHasNoErrors();
    $this->household->refresh();
    expect($this->household->status)->toBe('returned');
});

test('admin can reject household registration with required notes', function () {
    $response = $this->actingAs($this->admin)->post("/admin/households/{$this->household->id}/verify", [
        'action' => 'reject',
        'review_notes' => 'Duplicate household entry detected.',
    ]);

    $response->assertSessionHasNoErrors();
    $this->household->refresh();
    expect($this->household->status)->toBe('rejected');
});

test('admin can restrict and unrestrict household', function () {
    // Restrict
    $response = $this->actingAs($this->admin)->post("/admin/households/{$this->household->id}/restrict", [
        'action' => 'restrict',
        'reason' => 'Disputed tenancy.',
    ]);

    $response->assertSessionHasNoErrors();
    $this->household->refresh();
    expect($this->household->status)->toBe('restricted');

    // Unrestrict
    $response = $this->actingAs($this->admin)->post("/admin/households/{$this->household->id}/restrict", [
        'action' => 'unrestrict',
        'reason' => 'Tenancy dispute resolved.',
    ]);

    $response->assertSessionHasNoErrors();
    $this->household->refresh();
    expect($this->household->status)->toBe('verified');
});

test('admin can archive and restore household', function () {
    // Archive
    $response = $this->actingAs($this->admin)->post("/admin/households/{$this->household->id}/archive");

    $response->assertSessionHasNoErrors();
    $this->household->refresh();
    expect($this->household->status)->toBe('archived');

    // Restore
    $response = $this->actingAs($this->admin)->post("/admin/households/{$this->household->id}/archive");

    $response->assertSessionHasNoErrors();
    $this->household->refresh();
    expect($this->household->status)->toBe('verified');
});

test('admin can transfer family head authority to another adult member', function () {
    $successorUser = User::factory()->create(['role_id' => $this->residentRole->id]);
    $successorMember = HouseholdMember::create([
        'household_id' => $this->household->id,
        'user_id' => $successorUser->id,
        'first_name' => 'Maria',
        'last_name' => 'Dela Cruz',
        'relationship_to_head' => 'spouse',
        'is_family_head' => false,
        'birthdate' => '1992-05-15',
        'gender' => 'female',
        'residency_status' => 'resident',
    ]);

    $response = $this->actingAs($this->admin)->post("/admin/households/{$this->household->id}/transfer-head", [
        'new_family_head_member_id' => $successorMember->id,
    ]);

    $response->assertSessionHasNoErrors();
    $this->household->refresh();
    $successorMember->refresh();
    $this->member->refresh();

    expect($this->household->family_head_id)->toBe($successorUser->id);
    expect($successorMember->is_family_head)->toBeTrue();
    expect($this->member->is_family_head)->toBeFalse();
});

test('resident is blocked with 404 from household management', function () {
    $response = $this->actingAs($this->resident)->get('/admin/households');
    $response->assertNotFound();

    $response = $this->actingAs($this->resident)->get("/admin/households/{$this->household->id}");
    $response->assertNotFound();
});

test('unauthenticated user is redirected to login for households', function () {
    $response = $this->get('/admin/households');
    $response->assertRedirect('/login');
});
