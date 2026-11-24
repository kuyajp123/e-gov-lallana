<?php

use App\Models\ResidentProfile;
use App\Models\Role;
use App\Models\User;

beforeEach(function () {
    $this->adminRole = Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Admin']);
    $this->residentRole = Role::firstOrCreate(['slug' => 'resident'], ['name' => 'Resident']);

    $this->admin = User::factory()->create(['role_id' => $this->adminRole->id]);
    $this->residentUser = User::factory()->create(['role_id' => $this->residentRole->id]);

    $this->profile1 = ResidentProfile::create([
        'user_id' => $this->residentUser->id,
        'first_name' => 'Maria',
        'last_name' => 'Santos',
        'birthdate' => '1955-03-10', // Senior
        'gender' => 'female',
        'civil_status' => 'married',
        'citizenship' => 'Filipino',
        'residency_status' => 'official',
        'occupation' => 'Retired Teacher',
        'employment_status' => 'retired',
        'is_voter' => true,
        'senior_citizen_status' => true,
        'pwd_status' => false,
        'solo_parent_status' => false,
        'is_ofw' => false,
        'is_ip' => false,
        'is_out_of_school' => false,
    ]);

    $this->otherResidentUser = User::factory()->create(['role_id' => $this->residentRole->id]);
    $this->profile2 = ResidentProfile::create([
        'user_id' => $this->otherResidentUser->id,
        'first_name' => 'Juan',
        'last_name' => 'Dela Cruz',
        'birthdate' => '1998-07-20',
        'gender' => 'male',
        'civil_status' => 'single',
        'citizenship' => 'Filipino',
        'residency_status' => 'resident',
        'occupation' => 'Engineer',
        'employment_status' => 'employed',
        'is_voter' => false,
        'senior_citizen_status' => false,
        'pwd_status' => true,
        'solo_parent_status' => false,
        'is_ofw' => true,
        'is_ip' => false,
        'is_out_of_school' => false,
    ]);
});

test('unauthenticated users cannot export resident registry PDF', function () {
    $response = $this->get('/admin/resident-profiles/export-pdf');

    $response->assertRedirect('/login');
});

test('regular residents cannot export resident registry PDF', function () {
    $response = $this->actingAs($this->residentUser)
        ->get('/admin/resident-profiles/export-pdf');

    $response->assertNotFound();
});

test('admin can export unfiltered resident registry masterlist as landscape PDF', function () {
    $response = $this->actingAs($this->admin)
        ->get('/admin/resident-profiles/export-pdf');

    $response->assertOk();
    $response->assertHeader('content-type', 'application/pdf');
    expect($response->headers->get('content-disposition'))->toContain('Barangay-Lallana-Resident-Registry');
});

test('admin can export resident registry PDF with active candidate filters', function () {
    $response = $this->actingAs($this->admin)
        ->get('/admin/resident-profiles/export-pdf?gender=female&senior_citizen_status=yes&is_voter=yes');

    $response->assertOk();
    $response->assertHeader('content-type', 'application/pdf');
});

test('admin index passes complete filter props including advanced filters to Inertia', function () {
    $response = $this->actingAs($this->admin)
        ->get('/admin/resident-profiles?gender=female&is_voter=yes&pwd_status=no');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/resident-profiles/index')
        ->has('filters.search')
        ->has('filters.gender')
        ->has('filters.is_voter')
        ->has('filters.pwd_status')
        ->has('filters.senior_citizen_status')
        ->has('filters.is_ofw')
        ->has('filters.is_ip')
        ->has('filters.is_out_of_school')
        ->where('filters.gender', 'female')
        ->where('filters.is_voter', 'yes')
        ->where('filters.pwd_status', 'no')
    );
});
