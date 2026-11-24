<?php

use App\Models\Household;
use App\Models\HouseholdMember;
use App\Models\ResidentProfile;
use App\Models\Role;
use App\Models\User;

beforeEach(function () {
    $this->adminRole = Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Admin']);
    $this->residentRole = Role::firstOrCreate(['slug' => 'resident'], ['name' => 'Resident']);

    $this->admin = User::factory()->create(['role_id' => $this->adminRole->id]);
    $this->residentUser = User::factory()->create(['role_id' => $this->residentRole->id]);

    $this->profile = ResidentProfile::create([
        'user_id' => $this->residentUser->id,
        'first_name' => 'Maria',
        'last_name' => 'Santos',
        'birthdate' => '1995-05-15',
        'birth_place' => 'Trece Martires City, Cavite',
        'gender' => 'female',
        'civil_status' => 'married',
        'citizenship' => 'Filipino',
        'occupation' => 'Teacher',
        'educational_attainment' => 'college',
        'educational_status' => 'graduate',
        'philsys_card_no' => '1234-5678-9012-3456',
        'is_ofw' => false,
        'is_ip' => false,
        'is_out_of_school' => false,
    ]);

    $this->household = Household::create([
        'household_code' => 'HH-2026-9999',
        'family_head_id' => $this->residentUser->id,
        'address' => '456 Bonifacio St',
        'purok_sitio' => 'Purok 2',
        'status' => 'verified',
        'submitted_at' => now(),
    ]);

    $this->headMember = HouseholdMember::create([
        'household_id' => $this->household->id,
        'user_id' => $this->residentUser->id,
        'first_name' => 'Maria',
        'last_name' => 'Santos',
        'relationship_to_head' => 'head',
        'is_family_head' => true,
        'birthdate' => '1995-05-15',
        'gender' => 'female',
        'residency_status' => 'resident',
    ]);
});

test('admin can export RBI Form A as PDF for a household', function () {
    $response = $this->actingAs($this->admin)
        ->get("/admin/households/{$this->household->id}/export/form-a");

    $response->assertOk();
    $response->assertHeader('content-type', 'application/pdf');
    expect($response->headers->get('content-disposition'))->toContain('RBI-Form-A-HH-2026-9999');
});

test('admin can export RBI Form B as PDF for an individual resident', function () {
    $response = $this->actingAs($this->admin)
        ->get("/admin/resident-profiles/{$this->profile->id}/export/form-b");

    $response->assertOk();
    $response->assertHeader('content-type', 'application/pdf');
    expect($response->headers->get('content-disposition'))->toContain('RBI-Form-B-Santos');
});

test('admin can export RBI Form B as PDF for a resident with no household', function () {
    $userWithoutHousehold = User::factory()->create(['role_id' => $this->residentRole->id]);
    $profileWithoutHousehold = ResidentProfile::create([
        'user_id' => $userWithoutHousehold->id,
        'first_name' => 'Juan',
        'last_name' => 'Dela Cruz',
        'citizenship' => 'Filipino',
        'residency_status' => 'resident',
    ]);

    $response = $this->actingAs($this->admin)
        ->get("/admin/resident-profiles/{$profileWithoutHousehold->id}/export/form-b");

    $response->assertOk();
    $response->assertHeader('content-type', 'application/pdf');
});

test('admin can export RBI Form C as PDF for semestral monitoring', function () {
    $response = $this->actingAs($this->admin)
        ->get('/admin/households/export/form-c?year=2026&semester=1st');

    $response->assertOk();
    $response->assertHeader('content-type', 'application/pdf');
    expect($response->headers->get('content-disposition'))->toContain('RBI-Form-C-2026-1st-Semester');
});

test('unauthenticated user cannot export RBI forms', function () {
    $this->get("/admin/households/{$this->household->id}/export/form-a")
        ->assertRedirect('/login');

    $this->get("/admin/resident-profiles/{$this->profile->id}/export/form-b")
        ->assertRedirect('/login');

    $this->get('/admin/households/export/form-c?year=2026&semester=1st')
        ->assertRedirect('/login');
});
