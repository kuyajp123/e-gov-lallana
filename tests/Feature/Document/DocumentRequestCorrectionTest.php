<?php

use App\Enums\DocumentRequestStatus;
use App\Models\DocumentRequest;
use App\Models\DocumentType;
use App\Models\Household;
use App\Models\ResidentProfile;
use App\Models\Role;
use App\Models\User;

beforeEach(function () {
    $this->residentRole = Role::firstOrCreate(['slug' => 'resident'], ['name' => 'Resident']);

    $this->user = User::factory()->create(['role_id' => $this->residentRole->id]);
    ResidentProfile::create([
        'user_id' => $this->user->id,
        'first_name' => 'Juan',
        'last_name' => 'Dela Cruz',
        'birthdate' => '1990-01-01',
        'gender' => 'male',
        'civil_status' => 'married',
    ]);

    $this->household = Household::create([
        'household_code' => 'HH-2026-0001',
        'family_head_id' => $this->user->id,
        'address' => '123 Rizal St.',
        'purok_sitio' => 'Purok 1',
        'status' => 'verified',
        'verified_at' => now(),
    ]);

    $this->docType = DocumentType::create([
        'name' => 'Barangay Clearance',
        'slug' => 'barangay-clearance',
        'fee_cents' => 5000,
        'is_active' => true,
    ]);

    $this->returnedRequest = DocumentRequest::create([
        'reference_code' => 'REQ-2026-0001',
        'user_id' => $this->user->id,
        'document_type_id' => $this->docType->id,
        'current_status' => DocumentRequestStatus::Returned,
        'fee_cents' => 5000,
        'purpose' => 'Old incorrect purpose',
        'submitted_at' => now()->subDay(),
    ]);

    $this->returnedRequest->statusHistory()->create([
        'status' => 'returned',
        'remarks' => 'Please provide full organization details for your purpose.',
        'created_at' => now()->subHours(2),
    ]);
});

test('resident can view edit page for returned request', function () {
    $response = $this->actingAs($this->user)->get("/documents/{$this->returnedRequest->id}/edit");

    $response->assertOk();
});

test('resident cannot edit pending request', function () {
    $this->returnedRequest->update(['current_status' => DocumentRequestStatus::Pending]);

    $response = $this->actingAs($this->user)->get("/documents/{$this->returnedRequest->id}/edit");

    $response->assertForbidden();
});

test('resident can resubmit corrected request and status becomes pending', function () {
    $response = $this->actingAs($this->user)->put("/documents/{$this->returnedRequest->id}", [
        'purpose' => 'Corrected and detailed purpose for employment at ABC Corp',
        'submitted_data' => [
            'purpose' => 'Corrected and detailed purpose for employment at ABC Corp',
        ],
    ]);

    $response->assertRedirect("/documents/{$this->returnedRequest->id}");

    $this->returnedRequest->refresh();
    expect($this->returnedRequest->current_status)->toBe(DocumentRequestStatus::Pending)
        ->and($this->returnedRequest->purpose)->toBe('Corrected and detailed purpose for employment at ABC Corp');

    $this->assertDatabaseHas('document_request_status_history', [
        'document_request_id' => $this->returnedRequest->id,
        'status' => 'pending',
    ]);
});
