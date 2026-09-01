<?php

use App\Enums\DocumentRequestStatus;
use App\Models\DocumentRequest;
use App\Models\DocumentType;
use App\Models\ResidentProfile;
use App\Models\Role;
use App\Models\User;

beforeEach(function () {
    $this->residentRole = Role::firstOrCreate(['slug' => 'resident'], ['name' => 'Resident']);

    $this->user1 = User::factory()->create(['role_id' => $this->residentRole->id]);
    ResidentProfile::create([
        'user_id' => $this->user1->id,
        'first_name' => 'Juan',
        'last_name' => 'Dela Cruz',
        'birthdate' => '1990-01-01',
        'gender' => 'male',
        'civil_status' => 'married',
    ]);

    $this->user2 = User::factory()->create(['role_id' => $this->residentRole->id]);
    ResidentProfile::create([
        'user_id' => $this->user2->id,
        'first_name' => 'Maria',
        'last_name' => 'Clara',
        'birthdate' => '1992-02-02',
        'gender' => 'female',
        'civil_status' => 'single',
    ]);

    $this->docType = DocumentType::create([
        'name' => 'Barangay Certificate',
        'slug' => 'barangay-certificate',
        'fee_cents' => 3000,
        'is_active' => true,
    ]);

    $this->request1 = DocumentRequest::create([
        'reference_code' => 'REQ-2026-0001',
        'user_id' => $this->user1->id,
        'document_type_id' => $this->docType->id,
        'current_status' => DocumentRequestStatus::Processing,
        'fee_cents' => 3000,
        'purpose' => 'Scholarship application',
        'submitted_at' => now(),
    ]);

    $this->request1->statusHistory()->create([
        'status' => 'pending',
        'changed_by_user_id' => $this->user1->id,
        'remarks' => 'Submitted by resident.',
        'created_at' => now()->subHour(),
    ]);

    $this->request1->statusHistory()->create([
        'status' => 'processing',
        'remarks' => 'Staff started printing.',
        'created_at' => now(),
    ]);
});

test('resident can view own document request detail with timeline', function () {
    $response = $this->actingAs($this->user1)->get("/documents/{$this->request1->id}");

    $response->assertOk();
});

test('resident is forbidden from viewing another resident request', function () {
    $response = $this->actingAs($this->user2)->get("/documents/{$this->request1->id}");

    $response->assertForbidden();
});
