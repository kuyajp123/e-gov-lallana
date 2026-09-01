<?php

use App\Enums\DocumentRequestStatus;
use App\Models\DocumentRequest;
use App\Models\DocumentType;
use App\Models\FileRecord;
use App\Models\Household;
use App\Models\HouseholdMember;
use App\Models\ResidentProfile;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('government-ids');
    Storage::fake('verification-documents');

    $this->residentRole = Role::firstOrCreate(['slug' => 'resident'], ['name' => 'Resident']);

    $this->verifiedUser = User::factory()->create(['role_id' => $this->residentRole->id]);
    ResidentProfile::create([
        'user_id' => $this->verifiedUser->id,
        'first_name' => 'Juan',
        'last_name' => 'Dela Cruz',
        'birthdate' => '1990-01-01',
        'gender' => 'male',
        'civil_status' => 'married',
        'citizenship' => 'Filipino',
    ]);

    $this->household = Household::create([
        'household_code' => 'HH-2026-0001',
        'family_head_id' => $this->verifiedUser->id,
        'address' => '123 Rizal St.',
        'purok_sitio' => 'Purok 1',
        'status' => 'verified',
        'verified_at' => now(),
    ]);

    HouseholdMember::create([
        'household_id' => $this->household->id,
        'user_id' => $this->verifiedUser->id,
        'first_name' => 'Juan',
        'last_name' => 'Dela Cruz',
        'relationship_to_head' => 'head',
        'is_family_head' => true,
        'birthdate' => '1990-01-01',
    ]);

    $this->docType = DocumentType::create([
        'name' => 'Barangay Clearance',
        'slug' => 'barangay-clearance',
        'description' => 'Official document certifying good moral character.',
        'fee_cents' => 5000,
        'requirements' => ['Valid Government ID'],
        'form_schema' => [
            ['name' => 'purpose', 'label' => 'Purpose', 'type' => 'text', 'required' => true],
            ['name' => 'ctc_number', 'label' => 'CTC Number', 'type' => 'text', 'required' => false],
        ],
        'is_active' => true,
    ]);
});

test('unauthenticated users are redirected to login', function () {
    $response = $this->get('/documents');

    $response->assertRedirect('/login');
});

test('resident can view available document types on index page', function () {
    $response = $this->actingAs($this->verifiedUser)->get('/documents');

    $response->assertOk();
});

test('verified resident can view document request form', function () {
    $response = $this->actingAs($this->verifiedUser)->get("/documents/create/{$this->docType->slug}");

    $response->assertOk();
});

test('unverified household resident receives 403 forbidden when accessing request form', function () {
    $unverifiedUser = User::factory()->create(['role_id' => $this->residentRole->id]);
    ResidentProfile::create([
        'user_id' => $unverifiedUser->id,
        'first_name' => 'Pedro',
        'last_name' => 'Penduko',
        'birthdate' => '1995-05-05',
        'gender' => 'male',
        'civil_status' => 'single',
    ]);

    $response = $this->actingAs($unverifiedUser)->get("/documents/create/{$this->docType->slug}");

    $response->assertForbidden();
});

test('verified resident can submit document request with fresh ID upload', function () {
    $idFile = UploadedFile::fake()->image('government-id.jpg');

    $response = $this->actingAs($this->verifiedUser)->post('/documents', [
        'document_type_id' => $this->docType->id,
        'purpose' => 'Employment requirement at local company',
        'submitted_data' => [
            'purpose' => 'Employment requirement at local company',
            'ctc_number' => 'CTC-998877',
        ],
        'government_id_file' => $idFile,
    ]);

    $request = DocumentRequest::where('user_id', $this->verifiedUser->id)->first();
    expect($request)->not->toBeNull()
        ->and($request->reference_code)->toMatch('/REQ-\d{4}-\d{4}/')
        ->and($request->current_status)->toBe(DocumentRequestStatus::Pending)
        ->and($request->fee_cents)->toBe(5000);

    $response->assertRedirect("/documents/{$request->id}");

    // Status history created
    $this->assertDatabaseHas('document_request_status_history', [
        'document_request_id' => $request->id,
        'status' => 'pending',
    ]);

    // ID file attached in pivot
    $this->assertDatabaseHas('document_request_files', [
        'document_request_id' => $request->id,
        'file_type' => 'government_id',
    ]);
});

test('verified resident can reuse government ID from profile KYC', function () {
    $existingFile = FileRecord::create([
        'user_id' => $this->verifiedUser->id,
        'file_name' => 'kyc-id.jpg',
        'disk' => 'government-ids',
        'bucket' => 'government-ids',
        'path' => 'kyc-id.jpg',
        'mime_type' => 'image/jpeg',
        'is_private' => true,
    ]);

    $this->verifiedUser->residentProfile->update([
        'government_id_file_id' => $existingFile->id,
    ]);

    $response = $this->actingAs($this->verifiedUser)->post('/documents', [
        'document_type_id' => $this->docType->id,
        'purpose' => 'Bank loan application',
        'use_existing_id' => true,
        'submitted_data' => [
            'purpose' => 'Bank loan application',
        ],
    ]);

    $request = DocumentRequest::where('user_id', $this->verifiedUser->id)->first();
    expect($request)->not->toBeNull();

    $response->assertRedirect("/documents/{$request->id}");

    $this->assertDatabaseHas('document_request_files', [
        'document_request_id' => $request->id,
        'file_id' => $existingFile->id,
        'file_type' => 'government_id',
    ]);
});
