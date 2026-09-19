<?php

use App\Enums\DocumentRequestStatus;
use App\Models\DocumentRequest;
use App\Models\DocumentType;
use App\Models\FileRecord;
use App\Models\ResidentProfile;
use App\Models\Role;
use App\Models\User;

test('resident with pending request sees cancellation option on detail page', function () {
    $residentRole = Role::firstOrCreate(['slug' => 'resident'], ['name' => 'Resident']);
    $user = User::factory()->create(['role_id' => $residentRole->id]);

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

    $docType = DocumentType::create([
        'name' => 'Barangay Clearance',
        'slug' => 'barangay-clearance',
        'fee_cents' => 5000,
        'is_active' => true,
    ]);

    $request = DocumentRequest::create([
        'reference_code' => 'REQ-2026-0008',
        'user_id' => $user->id,
        'document_type_id' => $docType->id,
        'current_status' => DocumentRequestStatus::Pending,
        'fee_cents' => 5000,
        'purpose' => 'Employment',
        'submitted_at' => now(),
    ]);

    $request->statusHistory()->create([
        'status' => 'pending',
        'remarks' => 'Submitted by resident.',
        'created_at' => now(),
    ]);

    $page = $this->actingAs($user)->visit("/documents/{$request->id}");

    $page->assertSee('REQ-2026-0008')
        ->assertSee('Cancel Request')
        ->assertNoJavaScriptErrors();
});
