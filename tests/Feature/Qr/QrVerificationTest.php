<?php

use App\Enums\DocumentRequestStatus;
use App\Enums\PaymentStatus;
use App\Enums\QrStatus;
use App\Models\DocumentRequest;
use App\Models\DocumentType;
use App\Models\Household;
use App\Models\ResidentProfile;
use App\Models\Role;
use App\Models\User;
use App\Services\QrCode\QrCodeService;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->adminRole = Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Barangay Administrator']);
    $this->residentRole = Role::firstOrCreate(['slug' => 'resident'], ['name' => 'Resident']);

    $this->admin = User::factory()->create(['role_id' => $this->adminRole->id]);
    $this->resident = User::factory()->create(['role_id' => $this->residentRole->id, 'name' => 'Juan Dela Cruz']);

    $this->household = Household::create([
        'household_code' => 'HH-2026-0002',
        'family_head_id' => $this->resident->id,
        'address' => 'House 456, Purok 4',
        'purok_sitio' => 'Purok 4',
        'status' => 'verified',
    ]);

    $this->profile = ResidentProfile::create([
        'user_id' => $this->resident->id,
        'first_name' => 'Juan',
        'last_name' => 'Dela Cruz',
        'civil_status' => 'single',
        'birthdate' => '1995-10-20',
        'is_voter' => true,
    ]);

    $this->docType = DocumentType::create([
        'name' => 'Barangay Clearance',
        'slug' => 'barangay-clearance',
        'fee_cents' => 5000,
        'is_active' => true,
    ]);

    $this->request = DocumentRequest::create([
        'reference_code' => 'REQ-2026-0099',
        'user_id' => $this->resident->id,
        'document_type_id' => $this->docType->id,
        'current_status' => DocumentRequestStatus::Completed,
        'fee_cents' => 5000,
        'payment_status' => PaymentStatus::Paid,
        'purpose' => 'Police Clearance Requirement',
        'submitted_at' => now(),
    ]);
});

test('QrCodeService generates token with valid cryptographic HMAC signature', function () {
    $service = app(QrCodeService::class);
    $qr = $service->generateForDocument($this->request, $this->admin);

    expect($qr)->not->toBeNull();
    expect($qr->token)->toHaveLength(32);
    expect($qr->status)->toBe(QrStatus::Active);
    expect($qr->reference_code)->toBe('REQ-2026-0099');

    // Validation check
    $validation = $service->validateToken($qr->token);
    expect($validation['valid'])->toBeTrue();
    expect($validation['status'])->toBe('authentic');
});

test('QrCodeService detects expired tokens', function () {
    $service = app(QrCodeService::class);
    $qr = $service->generateForDocument($this->request, $this->admin);

    // Fast-forward past expiration
    $qr->update(['expires_at' => now()->subDay()]);

    $validation = $service->validateToken($qr->token);
    expect($validation['valid'])->toBeFalse();
    expect($validation['status'])->toBe('expired');
});

test('QrCodeService detects revoked tokens', function () {
    $service = app(QrCodeService::class);
    $qr = $service->generateForDocument($this->request, $this->admin);

    $qr->update(['status' => QrStatus::Revoked]);

    $validation = $service->validateToken($qr->token);
    expect($validation['valid'])->toBeFalse();
    expect($validation['status'])->toBe('revoked');
});

test('QrCodeService detects tampered or forged signatures', function () {
    $service = app(QrCodeService::class);
    $qr = $service->generateForDocument($this->request, $this->admin);

    $qr->update(['security_hash' => 'forged_fake_hash_12345']);

    $validation = $service->validateToken($qr->token);
    expect($validation['valid'])->toBeFalse();
    expect($validation['status'])->toBe('tampered');
});

test('public verification portal renders masked resident name and authentic status', function () {
    $service = app(QrCodeService::class);
    $qr = $service->generateForDocument($this->request, $this->admin);

    $this->get("/verify/qr/{$qr->token}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/verify-document')
            ->where('valid', true)
            ->where('status', 'authentic')
            ->where('document.reference_code', 'REQ-2026-0099')
            // Masked name Juan Dela Cruz -> J*** D*** C***
            ->where('document.masked_name', fn ($name) => str_contains($name, 'J') && str_contains($name, '*'))
        );
});

test('resident receives 404 when accessing staff QR scanner', function () {
    $this->actingAs($this->resident)
        ->get('/admin/qr-scanner')
        ->assertNotFound();
});

test('admin can access staff QR scanner and verify document token via API', function () {
    $service = app(QrCodeService::class);
    $qr = $service->generateForDocument($this->request, $this->admin);

    $this->actingAs($this->admin)
        ->get('/admin/qr-scanner')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/qr-scanner')
        );

    $response = $this->actingAs($this->admin)
        ->postJson('/admin/qr/verify', [
            'token' => $qr->token,
        ]);

    $response->assertOk()
        ->assertJson([
            'success' => true,
            'status' => 'authentic',
            'payload' => [
                'reference_code' => 'REQ-2026-0099',
                'document_type' => 'Barangay Clearance',
                'resident' => [
                    'name' => 'Juan Dela Cruz',
                ],
            ],
        ]);

    $qr->refresh();
    expect($qr->scanned_count)->toBe(1);
    expect($qr->last_scanned_at)->not->toBeNull();
});

test('admin can verify document using reference code in scanner API', function () {
    $service = app(QrCodeService::class);
    $service->generateForDocument($this->request, $this->admin);

    $response = $this->actingAs($this->admin)
        ->postJson('/admin/qr/verify', [
            'token' => 'REQ-2026-0099',
        ]);

    $response->assertOk()
        ->assertJson([
            'success' => true,
            'status' => 'authentic',
            'payload' => [
                'reference_code' => 'REQ-2026-0099',
                'document_type' => 'Barangay Clearance',
            ],
        ]);
});
