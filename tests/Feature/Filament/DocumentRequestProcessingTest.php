<?php

use App\Enums\DocumentRequestStatus;
use App\Enums\PaymentStatus;
use App\Models\DocumentRequest;
use App\Models\DocumentType;
use App\Models\Role;
use App\Models\User;

beforeEach(function () {
    $this->adminRole = Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Admin']);
    $this->subAdminRole = Role::firstOrCreate(['slug' => 'sub_admin'], ['name' => 'Sub Admin']);
    $this->residentRole = Role::firstOrCreate(['slug' => 'resident'], ['name' => 'Resident']);

    $this->admin = User::factory()->create(['role_id' => $this->adminRole->id]);
    $this->subAdmin = User::factory()->create(['role_id' => $this->subAdminRole->id]);
    $this->resident = User::factory()->create(['role_id' => $this->residentRole->id]);

    $this->docType = DocumentType::create([
        'name' => 'Barangay Clearance',
        'slug' => 'barangay-clearance',
        'fee_cents' => 5000,
        'is_active' => true,
    ]);

    $this->request = DocumentRequest::create([
        'reference_code' => 'REQ-2026-0001',
        'user_id' => $this->resident->id,
        'document_type_id' => $this->docType->id,
        'current_status' => DocumentRequestStatus::Pending,
        'fee_cents' => 5000,
        'payment_status' => PaymentStatus::Unpaid,
        'purpose' => 'NBI clearance requirement',
        'submitted_at' => now(),
    ]);
});

test('admin can access filament document requests list', function () {
    $response = $this->actingAs($this->admin)->get('/admin/document-requests');

    $response->assertOk();
});

test('sub admin can access filament document requests list', function () {
    $response = $this->actingAs($this->subAdmin)->get('/admin/document-requests');

    $response->assertOk();
});

test('resident is blocked with 404 from accessing filament document requests list', function () {
    $response = $this->actingAs($this->resident)->get('/admin/document-requests');

    $response->assertNotFound();
});

test('admin can transition request from pending to processing and ready for pickup', function () {
    // 1. Start processing
    $this->request->transitionTo(
        DocumentRequestStatus::Processing,
        $this->admin->id,
        'Admin started processing.'
    );

    $this->request->refresh();
    expect($this->request->current_status)->toBe(DocumentRequestStatus::Processing);

    // 2. Mark Completed
    $this->request->transitionTo(
        DocumentRequestStatus::Completed,
        $this->admin->id,
        'Document printed and sealed.'
    );

    $this->request->refresh();
    expect($this->request->current_status)->toBe(DocumentRequestStatus::Completed)
        ->and($this->request->completed_at)->not->toBeNull();

    // 3. Mark Ready for Pickup
    $this->request->transitionTo(
        DocumentRequestStatus::ReadyForPickup,
        $this->admin->id,
        'Document ready for claiming at the counter.'
    );

    $this->request->refresh();
    expect($this->request->current_status)->toBe(DocumentRequestStatus::ReadyForPickup);

    // Assert status history has all steps
    expect($this->request->statusHistory)->toHaveCount(3);
});

test('admin can return request for correction with remarks', function () {
    $this->request->transitionTo(
        DocumentRequestStatus::Returned,
        $this->admin->id,
        'Please upload a clearer image of your government ID.'
    );

    $this->request->refresh();
    expect($this->request->current_status)->toBe(DocumentRequestStatus::Returned);

    $latestHistory = $this->request->statusHistory->last();
    expect($latestHistory->remarks)->toBe('Please upload a clearer image of your government ID.')
        ->and($latestHistory->changed_by_user_id)->toBe($this->admin->id);
});

test('admin can reject request with remarks', function () {
    $this->request->transitionTo(
        DocumentRequestStatus::Rejected,
        $this->admin->id,
        'Applicant is not a registered resident of Barangay Lallana.'
    );

    $this->request->refresh();
    expect($this->request->current_status)->toBe(DocumentRequestStatus::Rejected);

    $latestHistory = $this->request->statusHistory->last();
    expect($latestHistory->remarks)->toBe('Applicant is not a registered resident of Barangay Lallana.');
});

test('admin can update payment status', function () {
    $this->request->update(['payment_status' => PaymentStatus::Paid]);

    $this->request->refresh();
    expect($this->request->payment_status)->toBe(PaymentStatus::Paid);
});
