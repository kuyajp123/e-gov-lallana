<?php

use App\Enums\DocumentRequestStatus;
use App\Enums\PaymentStatus;
use App\Models\DocumentRequest;
use App\Models\DocumentType;
use App\Models\Household;
use App\Models\ResidentProfile;
use App\Models\Role;
use App\Models\User;
use App\Services\Pdf\PdfGenerationService;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('verification-documents');

    $this->adminRole = Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Barangay Administrator']);
    $this->residentRole = Role::firstOrCreate(['slug' => 'resident'], ['name' => 'Resident']);

    $this->admin = User::factory()->create(['role_id' => $this->adminRole->id]);
    $this->resident = User::factory()->create(['role_id' => $this->residentRole->id]);

    $this->household = Household::create([
        'household_code' => 'HH-2026-0001',
        'family_head_id' => $this->resident->id,
        'address' => 'House 123, Purok 3',
        'purok_sitio' => 'Purok 3',
        'status' => 'verified',
    ]);

    $this->profile = ResidentProfile::create([
        'user_id' => $this->resident->id,
        'first_name' => 'Juan',
        'last_name' => 'Dela Cruz',
        'civil_status' => 'married',
        'birthdate' => '1990-05-15',
        'is_voter' => true,
    ]);

    $this->clearanceType = DocumentType::create([
        'name' => 'Barangay Clearance',
        'slug' => 'barangay-clearance',
        'fee_cents' => 5000,
        'is_active' => true,
    ]);

    $this->indigencyType = DocumentType::create([
        'name' => 'Certificate of Indigency',
        'slug' => 'certificate-of-indigency',
        'fee_cents' => 0,
        'is_active' => true,
    ]);

    $this->residencyType = DocumentType::create([
        'name' => 'Certificate of Residency',
        'slug' => 'certificate-of-residency',
        'fee_cents' => 5000,
        'is_active' => true,
    ]);
});

test('can generate official Barangay Clearance PDF with embedded QR and store in files', function () {
    $request = DocumentRequest::create([
        'reference_code' => 'REQ-2026-0001',
        'user_id' => $this->resident->id,
        'document_type_id' => $this->clearanceType->id,
        'current_status' => DocumentRequestStatus::Processing,
        'fee_cents' => 5000,
        'payment_status' => PaymentStatus::Paid,
        'purpose' => 'Employment requirement',
        'submitted_at' => now(),
    ]);

    $pdfService = app(PdfGenerationService::class);
    $fileRecord = $pdfService->generateDocumentPdf($request, $this->admin);

    expect($fileRecord)->not->toBeNull();
    expect($fileRecord->file_name)->toBe('REQ-2026-0001.pdf');
    expect($fileRecord->mime_type)->toBe('application/pdf');
    expect($fileRecord->disk)->toBe('verification-documents');

    // Verify storage persistence
    Storage::disk('verification-documents')->assertExists($fileRecord->path);

    // Verify relation to document request
    $request->refresh();
    expect($request->generated_pdf_file_id)->toBe($fileRecord->id);

    // Verify QR code was created
    $qr = $request->latestQrIdentifier();
    expect($qr)->not->toBeNull();
    expect($qr->reference_code)->toBe('REQ-2026-0001');
    expect($qr->isValid())->toBeTrue();
});

test('can generate Certificate of Indigency PDF', function () {
    $request = DocumentRequest::create([
        'reference_code' => 'REQ-2026-0002',
        'user_id' => $this->resident->id,
        'document_type_id' => $this->indigencyType->id,
        'current_status' => DocumentRequestStatus::ReadyForPickup,
        'fee_cents' => 0,
        'payment_status' => PaymentStatus::Waived,
        'purpose' => 'Hospital Medical Assistance',
        'submitted_at' => now(),
    ]);

    $pdfService = app(PdfGenerationService::class);
    $fileRecord = $pdfService->generateDocumentPdf($request, $this->admin);

    expect($fileRecord)->not->toBeNull();
    Storage::disk('verification-documents')->assertExists($fileRecord->path);

    $request->refresh();
    expect($request->generated_pdf_file_id)->toBe($fileRecord->id);
});

test('can generate Certificate of Residency PDF', function () {
    $request = DocumentRequest::create([
        'reference_code' => 'REQ-2026-0003',
        'user_id' => $this->resident->id,
        'document_type_id' => $this->residencyType->id,
        'current_status' => DocumentRequestStatus::Completed,
        'fee_cents' => 5000,
        'payment_status' => PaymentStatus::Paid,
        'purpose' => 'Bank Account Requirement',
        'submitted_at' => now(),
    ]);

    $pdfService = app(PdfGenerationService::class);
    $fileRecord = $pdfService->generateDocumentPdf($request, $this->admin);

    expect($fileRecord)->not->toBeNull();
    Storage::disk('verification-documents')->assertExists($fileRecord->path);

    $request->refresh();
    expect($request->generated_pdf_file_id)->toBe($fileRecord->id);
});

test('can generate Record of Barangay Inhabitants (RBI) summary report', function () {
    $pdfService = app(PdfGenerationService::class);
    $pdfOutput = $pdfService->generateRbiReport(purok: '3', issuer: $this->admin);

    expect($pdfOutput)->toBeString();
    expect(strlen($pdfOutput))->toBeGreaterThan(100);
    // PDF signature begins with %PDF-
    expect(str_starts_with($pdfOutput, '%PDF-'))->toBeTrue();
});

test('admin can access and download document request pdf route', function () {
    $request = DocumentRequest::create([
        'reference_code' => 'REQ-2026-0004',
        'user_id' => $this->resident->id,
        'document_type_id' => $this->clearanceType->id,
        'current_status' => DocumentRequestStatus::Completed,
        'fee_cents' => 5000,
        'payment_status' => PaymentStatus::Paid,
        'purpose' => 'Employment requirement',
        'submitted_at' => now(),
    ]);

    $response = $this->actingAs($this->admin)->get("/admin/document-requests/{$request->id}/pdf");

    $response->assertOk();
    $response->assertHeader('content-type', 'application/pdf');
    $request->refresh();
    expect($request->generated_pdf_file_id)->not->toBeNull();
});

test('admin can access and export rbi pdf report', function () {
    $response = $this->actingAs($this->admin)->get('/admin/households/export/rbi-pdf');

    $response->assertOk();
    $response->assertHeader('content-type', 'application/pdf');
});
