<?php

use App\Models\ResidentProfile;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('local');
    Storage::fake('public');
});

test('resident can view resident profile page', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/resident/profile');

    $response->assertOk();
});

test('resident can view resident profile edit form', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/resident/profile/edit');

    $response->assertOk();
});

test('resident can complete their resident profile with ID upload', function () {
    $user = User::factory()->create();
    $idFile = UploadedFile::fake()->create('national_id.png', 500, 'image/png');

    $response = $this->actingAs($user)->post('/resident/profile', [
        'first_name' => 'Maria',
        'middle_name' => 'Clara',
        'last_name' => 'Santos',
        'suffix' => null,
        'birthdate' => '1995-05-15',
        'gender' => 'female',
        'civil_status' => 'single',
        'citizenship' => 'Filipino',
        'religion' => 'Roman Catholic',
        'residency_status' => 'official',
        'occupation' => 'Software Engineer',
        'educational_attainment' => 'college',
        'employment_status' => 'employed',
        'is_voter' => true,
        'voter_id_number' => 'VIN-123456789',
        'senior_citizen_status' => false,
        'pwd_status' => false,
        'solo_parent_status' => false,
        'government_id' => $idFile,
    ]);

    $response->assertRedirect('/resident/profile');

    $this->assertDatabaseHas('resident_profiles', [
        'user_id' => $user->id,
        'first_name' => 'Maria',
        'last_name' => 'Santos',
        'is_voter' => true,
        'educational_attainment' => 'college',
    ]);

    $profile = ResidentProfile::where('user_id', $user->id)->first();
    expect($profile->government_id_file_id)->not->toBeNull();
});

test('resident profile validation fails on future birthdate', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/resident/profile', [
        'first_name' => 'Maria',
        'last_name' => 'Santos',
        'birthdate' => now()->addYear()->format('Y-m-d'),
        'gender' => 'female',
        'civil_status' => 'single',
        'citizenship' => 'Filipino',
    ]);

    $response->assertSessionHasErrors(['birthdate']);
});

test('middleware redirects incomplete resident profiles when accessing household services', function () {
    $user = User::factory()->create(); // No profile created yet

    $response = $this->actingAs($user)->get('/household');

    $response->assertRedirect('/resident/profile/edit');
    $response->assertSessionHas('warning');
});
