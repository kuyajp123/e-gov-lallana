<?php

use App\Models\Household;
use App\Models\HouseholdMember;
use App\Models\ResidentProfile;
use App\Models\Role;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

beforeEach(function () {
    /** @var TestCase $this */
    $this->adminRole = Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Admin']);
    $this->residentRole = Role::firstOrCreate(['slug' => 'resident'], ['name' => 'Resident']);

    $this->admin = User::factory()->create(['role_id' => $this->adminRole->id]);
    $this->resident = User::factory()->create(['role_id' => $this->residentRole->id]);

    $this->profile = ResidentProfile::create([
        'user_id' => $this->resident->id,
        'first_name' => 'Juan',
        'last_name' => 'Dela Cruz',
        'birthdate' => '1990-01-01',
        'gender' => 'male',
        'civil_status' => 'single',
        'citizenship' => 'Filipino',
        'residency_status' => 'official',
        'is_voter' => true,
        'voter_id_number' => 'VR-123456',
        'senior_citizen_status' => false,
        'pwd_status' => false,
        'solo_parent_status' => false,
    ]);
});

test('admin can view resident profiles registry index', function () {
    $response = $this->actingAs($this->admin)->get('/admin/resident-profiles');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/resident-profiles/index')
        ->has('residents.data', 1)
        ->has('sectorCounts')
        ->has('filters')
        ->where('residents.data.0.first_name', 'Juan')
        ->where('residents.data.0.last_name', 'Dela Cruz')
    );
});

test('admin can filter resident profiles by sector', function () {
    $seniorUser = User::factory()->create(['role_id' => $this->residentRole->id]);
    $seniorProfile = ResidentProfile::create([
        'user_id' => $seniorUser->id,
        'first_name' => 'Pedro',
        'last_name' => 'Penduko',
        'birthdate' => '1955-03-10',
        'gender' => 'male',
        'civil_status' => 'married',
        'citizenship' => 'Filipino',
        'residency_status' => 'official',
        'is_voter' => false,
        'senior_citizen_status' => true,
        'pwd_status' => false,
        'solo_parent_status' => false,
    ]);

    $response = $this->actingAs($this->admin)->get('/admin/resident-profiles?sector=seniors');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/resident-profiles/index')
        ->has('residents.data', 1)
        ->where('residents.data.0.first_name', 'Pedro')
    );
});

test('admin can search resident profiles by keyword', function () {
    $response = $this->actingAs($this->admin)->get('/admin/resident-profiles?search=VR-123456');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/resident-profiles/index')
        ->has('residents.data', 1)
        ->where('residents.data.0.first_name', 'Juan')
    );
});

test('admin can view resident profile show dossier', function () {
    $household = Household::create([
        'household_code' => 'HH-2026-0088',
        'family_head_id' => $this->resident->id,
        'address' => '789 Sampaguita Street',
        'purok_sitio' => 'Purok 3',
        'status' => 'verified',
    ]);

    HouseholdMember::create([
        'household_id' => $household->id,
        'user_id' => $this->resident->id,
        'first_name' => 'Juan',
        'last_name' => 'Dela Cruz',
        'relationship_to_head' => 'head',
        'is_family_head' => true,
        'birthdate' => '1990-01-01',
        'gender' => 'male',
        'residency_status' => 'resident',
    ]);

    $response = $this->actingAs($this->admin)->get("/admin/resident-profiles/{$this->profile->id}");

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/resident-profiles/show')
        ->where('residentProfile.first_name', 'Juan')
        ->where('residentProfile.last_name', 'Dela Cruz')
        ->where('residentProfile.household.household_code', 'HH-2026-0088')
    );
});

test('resident user is blocked with 404 from resident profile admin endpoints', function () {
    $response = $this->actingAs($this->resident)->get('/admin/resident-profiles');
    $response->assertNotFound();

    $response = $this->actingAs($this->resident)->get("/admin/resident-profiles/{$this->profile->id}");
    $response->assertNotFound();
});

test('unauthenticated user is redirected to login for resident profiles', function () {
    $response = $this->get('/admin/resident-profiles');
    $response->assertRedirect('/login');
});

test('admin can see admin and subadmin role flags for residents in registry index', function () {
    $subAdminRole = Role::firstOrCreate(['slug' => 'sub_admin'], ['name' => 'Sub-admin']);

    $adminResident = User::factory()->create(['role_id' => $this->adminRole->id]);
    ResidentProfile::create([
        'user_id' => $adminResident->id,
        'first_name' => 'Admin',
        'last_name' => 'Official',
        'birthdate' => '1985-05-15',
        'gender' => 'female',
        'civil_status' => 'single',
        'citizenship' => 'Filipino',
        'residency_status' => 'official',
        'is_voter' => true,
    ]);

    $subAdminResident = User::factory()->create(['role_id' => $subAdminRole->id]);
    ResidentProfile::create([
        'user_id' => $subAdminResident->id,
        'first_name' => 'Staff',
        'last_name' => 'Member',
        'birthdate' => '1995-08-20',
        'gender' => 'male',
        'civil_status' => 'single',
        'citizenship' => 'Filipino',
        'residency_status' => 'resident',
        'is_voter' => true,
    ]);

    $response = $this->actingAs($this->admin)->get('/admin/resident-profiles');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/resident-profiles/index')
        ->has('residents.data', 3)
        ->where('residents.data.0.is_sub_admin', true)
        ->where('residents.data.0.is_admin', false)
        ->where('residents.data.1.is_admin', true)
        ->where('residents.data.1.is_sub_admin', false)
        ->where('residents.data.2.is_admin', false)
        ->where('residents.data.2.is_sub_admin', false)
    );
});
