<?php

use App\Models\FileRecord;
use App\Models\ResidentProfile;
use App\Models\User;

test('resident can navigate to household registration page in browser', function () {
    $user = User::factory()->create();
    $file = FileRecord::create([
        'user_id' => $user->id,
        'file_name' => 'id.png',
        'disk' => 'local',
        'path' => 'ids/id.png',
        'mime_type' => 'image/png',
        'is_private' => true,
    ]);

    ResidentProfile::create([
        'user_id' => $user->id,
        'first_name' => 'Juan',
        'last_name' => 'Dela Cruz',
        'birthdate' => '1990-05-10',
        'gender' => 'male',
        'civil_status' => 'single',
        'citizenship' => 'Filipino',
        'government_id_file_id' => $file->id,
    ]);

    $page = $this->actingAs($user)->visit('/household/register');

    $page->assertSee('Barangay Lallana Household Registration')
        ->assertSee('Household Location in Barangay Lallana')
        ->assertNoJavaScriptErrors();
});

test('resident can view resident profile page in browser', function () {
    $user = User::factory()->create(['name' => 'Maria Santos']);
    $file = FileRecord::create([
        'user_id' => $user->id,
        'file_name' => 'id.png',
        'disk' => 'local',
        'path' => 'ids/id.png',
        'mime_type' => 'image/png',
        'is_private' => true,
    ]);

    ResidentProfile::create([
        'user_id' => $user->id,
        'first_name' => 'Maria',
        'last_name' => 'Santos',
        'birthdate' => '1995-03-12',
        'gender' => 'female',
        'civil_status' => 'married',
        'citizenship' => 'Filipino',
        'government_id_file_id' => $file->id,
    ]);

    $page = $this->actingAs($user)->visit('/resident/profile');

    $page->assertSee('Resident Profile & KYC')
        ->assertSee('KYC Complete')
        ->assertValue('#first_name', 'Maria')
        ->assertValue('#last_name', 'Santos')
        ->assertNoJavaScriptErrors();
});
