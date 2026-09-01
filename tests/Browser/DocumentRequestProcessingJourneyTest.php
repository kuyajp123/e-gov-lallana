<?php

use App\Enums\DocumentRequestStatus;
use App\Models\DocumentRequest;
use App\Models\DocumentType;
use App\Models\ResidentProfile;
use App\Models\Role;
use App\Models\User;

test('resident can view document request details and timeline in browser', function () {
    $residentRole = Role::firstOrCreate(['slug' => 'resident'], ['name' => 'Resident']);
    $user = User::factory()->create(['role_id' => $residentRole->id]);

    ResidentProfile::create([
        'user_id' => $user->id,
        'first_name' => 'Juan',
        'last_name' => 'Dela Cruz',
        'birthdate' => '1990-05-10',
        'gender' => 'male',
        'civil_status' => 'single',
    ]);

    $docType = DocumentType::create([
        'name' => 'Certificate of Indigency',
        'slug' => 'certificate-of-indigency',
        'fee_cents' => 0,
        'is_active' => true,
    ]);

    $request = DocumentRequest::create([
        'reference_code' => 'REQ-2026-0005',
        'user_id' => $user->id,
        'document_type_id' => $docType->id,
        'current_status' => DocumentRequestStatus::ReadyForPickup,
        'fee_cents' => 0,
        'purpose' => 'Medical assistance',
        'submitted_at' => now(),
    ]);

    $request->statusHistory()->create([
        'status' => 'pending',
        'remarks' => 'Submitted by resident.',
        'created_at' => now()->subDay(),
    ]);

    $request->statusHistory()->create([
        'status' => 'ready_for_pickup',
        'remarks' => 'Document signed and ready for pickup at Barangay Hall.',
        'created_at' => now(),
    ]);

    $page = $this->actingAs($user)->visit("/documents/{$request->id}");

    $page->assertSee('REQ-2026-0005')
        ->assertSee('Ready For Physical Pickup!')
        ->assertSee('Status Timeline')
        ->assertNoJavaScriptErrors();
});
