<?php

use App\Enums\DocumentRequestStatus;
use App\Enums\PaymentStatus;
use App\Mail\DocumentStatusUpdatedMail;
use App\Models\DocumentRequest;
use App\Models\DocumentType;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->adminRole = Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Admin']);
    $this->residentRole = Role::firstOrCreate(['slug' => 'resident'], ['name' => 'Resident']);

    $this->admin = User::factory()->create([
        'name' => 'Admin Officer',
        'email' => 'admin.officer@example.com',
        'role_id' => $this->adminRole->id,
    ]);

    $this->resident = User::factory()->create([
        'name' => 'Juan Dela Cruz',
        'email' => 'juan.walkin@example.com',
        'phone_number' => '09171234567',
        'role_id' => $this->residentRole->id,
    ]);

    $this->docType = DocumentType::create([
        'name' => 'Barangay Clearance',
        'slug' => 'barangay-clearance',
        'fee_cents' => 5000,
        'is_active' => true,
    ]);
});

test('admin can access walk-in document creation page and see inertia component', function () {
    $response = $this->actingAs($this->admin)->get('/admin/document-requests/walkin');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/document-requests/walkin')
        ->has('documentTypes')
        ->has('purokOptions')
    );
});

test('admin can search registered residents for walk-in form autofill', function () {
    $response = $this->actingAs($this->admin)->getJson('/admin/document-requests/residents/search?q=Juan');

    $response->assertOk();
    $response->assertJsonStructure([
        'residents' => [
            '*' => [
                'id',
                'name',
                'email',
                'phone_number',
            ],
        ],
    ]);
    expect($response->json('residents.0.name'))->toBe('Juan Dela Cruz');
});

test('admin can issue walk-in document for unregistered resident without creating master registry profile', function () {
    $initialUserCount = User::count();

    $response = $this->actingAs($this->admin)->post('/admin/document-requests/walkin', [
        'resident_mode' => 'unregistered',
        'walkin_name' => 'Pedro Penduko',
        'walkin_purok' => 'Purok 2',
        'walkin_address' => 'House #45, Purok 2',
        'walkin_age' => 45,
        'walkin_civil_status' => 'Married',
        'document_mode' => 'existing',
        'document_type_id' => $this->docType->id,
        'purpose' => 'Business Permit Requirement',
        'payment_status' => 'paid',
        'admin_notes' => 'Paid in cash at window 1.',
        'action' => 'create_processing',
    ]);

    $response->assertRedirect('/admin/document-requests');
    $response->assertSessionHas('success');

    // Confirm NO new record was added to users table
    expect(User::count())->toBe($initialUserCount);

    $docRequest = DocumentRequest::where('walkin_name', 'Pedro Penduko')->first();
    expect($docRequest)->not->toBeNull();
    expect($docRequest->user_id)->toBeNull();
    expect($docRequest->is_walkin)->toBeTrue();
    expect($docRequest->current_status)->toBe(DocumentRequestStatus::Processing);
    expect($docRequest->payment_status)->toBe(PaymentStatus::Paid);
    expect($docRequest->walkin_purok)->toBe('Purok 2');
});

test('admin can issue and complete walk-in document immediately with pdf generation', function () {
    $response = $this->actingAs($this->admin)->post('/admin/document-requests/walkin', [
        'resident_mode' => 'unregistered',
        'walkin_name' => 'Maria Makiling',
        'walkin_purok' => 'Purok 1',
        'walkin_age' => 30,
        'walkin_civil_status' => 'Single',
        'document_mode' => 'existing',
        'document_type_id' => $this->docType->id,
        'purpose' => 'Local Employment',
        'payment_status' => 'waived',
        'action' => 'complete_and_print',
    ]);

    $response->assertRedirect('/admin/document-requests');
    $response->assertSessionHas('success');

    $docRequest = DocumentRequest::where('walkin_name', 'Maria Makiling')->first();
    expect($docRequest)->not->toBeNull();
    expect($docRequest->current_status)->toBe(DocumentRequestStatus::Completed);
    expect($docRequest->payment_status)->toBe(PaymentStatus::Waived);
    expect($docRequest->generated_pdf_file_id)->not->toBeNull();
    expect($docRequest->is_walkin)->toBeTrue();
});

test('unregistered walk-in citizen without email or phone skips notifications without error', function () {
    Mail::fake();

    $response = $this->actingAs($this->admin)->post('/admin/document-requests/walkin', [
        'resident_mode' => 'unregistered',
        'walkin_name' => 'Lolo Jose',
        'walkin_purok' => 'Purok 3',
        'walkin_contact_number' => null,
        'walkin_email' => null,
        'document_mode' => 'existing',
        'document_type_id' => $this->docType->id,
        'purpose' => 'Senior Citizen Allowance',
        'payment_status' => 'waived',
        'action' => 'complete_and_print',
    ]);

    $response->assertRedirect('/admin/document-requests');
    Mail::assertNothingQueued();
});

test('unregistered walk-in citizen with email receives notification upon completion', function () {
    Mail::fake();

    $response = $this->actingAs($this->admin)->post('/admin/document-requests/walkin', [
        'resident_mode' => 'unregistered',
        'walkin_name' => 'Ana Santos',
        'walkin_purok' => 'Purok 4',
        'walkin_email' => 'ana.santos.walkin@example.com',
        'document_mode' => 'existing',
        'document_type_id' => $this->docType->id,
        'purpose' => 'Scholarship Application',
        'payment_status' => 'paid',
        'action' => 'complete_and_print',
    ]);

    $response->assertRedirect('/admin/document-requests');
    Mail::assertQueued(DocumentStatusUpdatedMail::class, function ($mail) {
        return $mail->hasTo('ana.santos.walkin@example.com');
    });
});

test('admin can issue walk-in document for registered resident', function () {
    $response = $this->actingAs($this->admin)->post('/admin/document-requests/walkin', [
        'resident_mode' => 'registered',
        'user_id' => $this->resident->id,
        'document_mode' => 'existing',
        'document_type_id' => $this->docType->id,
        'purpose' => 'Counter pickup clearance',
        'payment_status' => 'paid',
        'action' => 'create_processing',
    ]);

    $response->assertRedirect('/admin/document-requests');

    $docRequest = DocumentRequest::where('user_id', $this->resident->id)->first();
    expect($docRequest)->not->toBeNull();
    expect($docRequest->is_walkin)->toBeTrue();
});

test('admin can issue walk-in document with dynamic form schema submitted data', function () {
    $indigencyType = DocumentType::create([
        'name' => 'Certificate of Indigency',
        'slug' => 'certificate-of-indigency',
        'fee_cents' => 0,
        'form_schema' => [
            [
                'name' => 'assistance_type',
                'label' => 'Type of Assistance',
                'type' => 'text',
                'required' => true,
            ],
            [
                'name' => 'requesting_agency',
                'label' => 'Target Agency / Institution',
                'type' => 'text',
                'required' => true,
            ],
        ],
        'is_active' => true,
    ]);

    $response = $this->actingAs($this->admin)->post('/admin/document-requests/walkin', [
        'resident_mode' => 'unregistered',
        'walkin_name' => 'Jose Rizal',
        'walkin_purok' => 'Purok 5',
        'document_type_id' => $indigencyType->id,
        'submitted_data' => [
            'assistance_type' => 'Medical Assistance',
            'requesting_agency' => 'DSWD / PCSO',
        ],
        'purpose' => 'Hospital Billing Assistance',
        'payment_status' => 'waived',
        'action' => 'complete_and_print',
    ]);

    $response->assertRedirect('/admin/document-requests');

    $docRequest = DocumentRequest::where('walkin_name', 'Jose Rizal')->first();
    expect($docRequest)->not->toBeNull();
    expect($docRequest->document_type_id)->toBe($indigencyType->id);
    expect($docRequest->submitted_data)->toBe([
        'assistance_type' => 'Medical Assistance',
        'requesting_agency' => 'DSWD / PCSO',
    ]);
    expect($docRequest->generated_pdf_file_id)->not->toBeNull();
});

test('admin index and show endpoints display walk-in details correctly', function () {
    $docRequest = DocumentRequest::create([
        'reference_code' => 'REQ-2026-9876',
        'user_id' => null,
        'document_type_id' => $this->docType->id,
        'is_walkin' => true,
        'walkin_name' => 'Walkin Citizen Test',
        'walkin_purok' => 'Purok 1',
        'current_status' => DocumentRequestStatus::Processing,
        'fee_cents' => 5000,
        'payment_status' => PaymentStatus::Paid,
        'purpose' => 'Inspection test',
        'submitted_at' => now(),
    ]);

    // Test index
    $indexResponse = $this->actingAs($this->admin)->get('/admin/document-requests');
    $indexResponse->assertOk();
    $indexResponse->assertInertia(fn (Assert $page) => $page
        ->component('admin/document-requests/index')
        ->where('requests.data.0.is_walkin', true)
        ->where('requests.data.0.user.name', 'Walkin Citizen Test')
    );

    // Test show
    $showResponse = $this->actingAs($this->admin)->get("/admin/document-requests/{$docRequest->id}");
    $showResponse->assertOk();
    $showResponse->assertInertia(fn (Assert $page) => $page
        ->component('admin/document-requests/show')
        ->where('documentRequest.is_walkin', true)
        ->where('documentRequest.walkin_name', 'Walkin Citizen Test')
    );
});

test('non-admin user cannot access walkin store endpoint', function () {
    $response = $this->actingAs($this->resident)->post('/admin/document-requests/walkin', [
        'resident_mode' => 'unregistered',
        'walkin_name' => 'Intruder',
    ]);

    $response->assertNotFound();
});
