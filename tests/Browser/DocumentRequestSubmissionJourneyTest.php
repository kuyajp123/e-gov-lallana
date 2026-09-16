<?php

use App\Models\DocumentType;
use App\Models\FileRecord;
use App\Models\Household;
use App\Models\HouseholdMember;
use App\Models\ResidentProfile;
use App\Models\User;

test('verified resident can visit document services catalog', function () {
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

    $household = Household::create([
        'household_code' => 'HH-2026-0001',
        'family_head_id' => $user->id,
        'address' => '123 Rizal St.',
        'purok_sitio' => 'Purok 1',
        'status' => 'verified',
        'verified_at' => now(),
    ]);

    HouseholdMember::create([
        'household_id' => $household->id,
        'user_id' => $user->id,
        'first_name' => 'Juan',
        'last_name' => 'Dela Cruz',
        'relationship_to_head' => 'head',
        'is_family_head' => true,
        'birthdate' => '1990-05-10',
    ]);

    DocumentType::create([
        'name' => 'Barangay Clearance',
        'slug' => 'barangay-clearance',
        'description' => 'Official document certifying good moral character.',
        'fee_cents' => 5000,
        'requirements' => ['Valid Government ID'],
        'form_schema' => [
            ['name' => 'purpose', 'label' => 'Purpose', 'type' => 'text', 'required' => true],
        ],
        'is_active' => true,
    ]);

    $catalogPage = $this->actingAs($user)->visit('/documents');
    $catalogPage->assertSee('Barangay Document Services')
        ->assertSee('Barangay Clearance')
        ->assertNoJavaScriptErrors();
});

test('verified resident can view document request form in browser', function () {
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

    $household = Household::create([
        'household_code' => 'HH-2026-0002',
        'family_head_id' => $user->id,
        'address' => '123 Rizal St.',
        'purok_sitio' => 'Purok 1',
        'status' => 'verified',
        'verified_at' => now(),
    ]);

    HouseholdMember::create([
        'household_id' => $household->id,
        'user_id' => $user->id,
        'first_name' => 'Juan',
        'last_name' => 'Dela Cruz',
        'relationship_to_head' => 'head',
        'is_family_head' => true,
        'birthdate' => '1990-05-10',
    ]);

    $docType = DocumentType::create([
        'name' => 'Barangay Clearance',
        'slug' => 'barangay-clearance-test',
        'description' => 'Official document certifying good moral character.',
        'fee_cents' => 5000,
        'requirements' => ['Valid Government ID'],
        'form_schema' => [
            ['name' => 'purpose', 'label' => 'Purpose', 'type' => 'text', 'required' => true],
        ],
        'is_active' => true,
    ]);

    $page = $this->actingAs($user)->visit("/documents/create/{$docType->slug}");
    $page->assertSee('Barangay Clearance')
        ->assertNoJavaScriptErrors();
});
