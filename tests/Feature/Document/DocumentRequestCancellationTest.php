<?php

use App\Enums\CancellationReason;
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

    $this->pendingRequest = DocumentRequest::create([
        'reference_code' => 'REQ-2026-0001',
        'user_id' => $this->user->id,
        'document_type_id' => $this->docType->id,
        'current_status' => DocumentRequestStatus::Pending,
        'fee_cents' => 5000,
        'purpose' => 'Job application',
        'submitted_at' => now(),
    ]);
});

test('resident can cancel own pending request with valid reason', function () {
    $response = $this->actingAs($this->user)->post("/documents/{$this->pendingRequest->id}/cancel", [
        'cancellation_reason' => CancellationReason::NoLongerNeeded->value,
    ]);

    $response->assertRedirect("/documents/{$this->pendingRequest->id}");

    $this->pendingRequest->refresh();
    expect($this->pendingRequest->current_status)->toBe(DocumentRequestStatus::Cancelled)
        ->and($this->pendingRequest->cancellation_reason)->toBe(CancellationReason::NoLongerNeeded)
        ->and($this->pendingRequest->cancelled_at)->not->toBeNull();

    $this->assertDatabaseHas('document_request_status_history', [
        'document_request_id' => $this->pendingRequest->id,
        'status' => 'cancelled',
    ]);
});

test('cancellation with reason other requires cancellation notes', function () {
    $response = $this->actingAs($this->user)->post("/documents/{$this->pendingRequest->id}/cancel", [
        'cancellation_reason' => 'other',
        'cancellation_notes' => '',
    ]);

    $response->assertSessionHasErrors(['cancellation_notes']);
});

test('cannot cancel already completed or ready for pickup request', function () {
    $this->pendingRequest->update(['current_status' => DocumentRequestStatus::ReadyForPickup]);

    $response = $this->actingAs($this->user)->post("/documents/{$this->pendingRequest->id}/cancel", [
        'cancellation_reason' => CancellationReason::NoLongerNeeded->value,
    ]);

    $response->assertForbidden();
});
