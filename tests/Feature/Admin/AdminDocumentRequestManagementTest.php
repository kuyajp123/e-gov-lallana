<?php

use App\Enums\DocumentRequestStatus;
use App\Enums\PaymentStatus;
use App\Models\DocumentRequest;
use App\Models\DocumentType;
use App\Models\Role;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->adminRole = Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Admin']);
    $this->residentRole = Role::firstOrCreate(['slug' => 'resident'], ['name' => 'Resident']);

    $this->admin = User::factory()->create(['role_id' => $this->adminRole->id]);
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
        'purpose' => 'Employment requirement',
        'submitted_at' => now(),
    ]);
});

test('admin can access document requests queue index and see inertia component', function () {
    $response = $this->actingAs($this->admin)->get('/admin/document-requests');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/document-requests/index')
        ->has('requests.data', 1)
        ->has('statusCounts')
        ->has('documentTypes')
        ->where('requests.data.0.reference_code', 'REQ-2026-0001')
    );
});

test('admin can filter document requests by status', function () {
    // Create another request in completed status
    DocumentRequest::create([
        'reference_code' => 'REQ-2026-0002',
        'user_id' => $this->resident->id,
        'document_type_id' => $this->docType->id,
        'current_status' => DocumentRequestStatus::Completed,
        'fee_cents' => 5000,
        'payment_status' => PaymentStatus::Paid,
        'purpose' => 'Bank loan requirement',
        'submitted_at' => now(),
    ]);

    $response = $this->actingAs($this->admin)->get('/admin/document-requests?status=completed');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/document-requests/index')
        ->has('requests.data', 1)
        ->where('requests.data.0.reference_code', 'REQ-2026-0002')
    );
});

test('admin can search document requests by reference code or resident name', function () {
    $otherUser = User::factory()->create([
        'name' => 'Maria Clara',
        'role_id' => $this->residentRole->id,
    ]);

    DocumentRequest::create([
        'reference_code' => 'REQ-2026-9999',
        'user_id' => $otherUser->id,
        'document_type_id' => $this->docType->id,
        'current_status' => DocumentRequestStatus::Pending,
        'fee_cents' => 5000,
        'payment_status' => PaymentStatus::Unpaid,
        'purpose' => 'School scholarship',
        'submitted_at' => now(),
    ]);

    $response = $this->actingAs($this->admin)->get('/admin/document-requests?search=Maria');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/document-requests/index')
        ->has('requests.data', 1)
        ->where('requests.data.0.reference_code', 'REQ-2026-9999')
    );
});

test('admin can view document request details page', function () {
    $response = $this->actingAs($this->admin)->get("/admin/document-requests/{$this->request->id}");

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/document-requests/show')
        ->where('documentRequest.reference_code', 'REQ-2026-0001')
        ->where('documentRequest.user.name', $this->resident->name)
        ->has('documentRequest.timeline')
    );
});

test('admin can transition status to processing', function () {
    $response = $this->actingAs($this->admin)->patch("/admin/document-requests/{$this->request->id}/status", [
        'status' => 'processing',
    ]);

    $response->assertSessionHasNoErrors();
    $this->request->refresh();
    expect($this->request->current_status)->toBe(DocumentRequestStatus::Processing);
});

test('admin can return request for correction with remarks', function () {
    $response = $this->actingAs($this->admin)->patch("/admin/document-requests/{$this->request->id}/status", [
        'status' => 'returned',
        'remarks' => 'Please upload a valid ID photo.',
    ]);

    $response->assertSessionHasNoErrors();
    $this->request->refresh();
    expect($this->request->current_status)->toBe(DocumentRequestStatus::Returned);
    expect($this->request->statusHistory->last()->remarks)->toBe('Please upload a valid ID photo.');
});

test('admin status transition requires remarks when rejecting or returning', function () {
    $response = $this->actingAs($this->admin)->patch("/admin/document-requests/{$this->request->id}/status", [
        'status' => 'rejected',
        'remarks' => '',
    ]);

    $response->assertSessionHasErrors(['remarks']);
    $this->request->refresh();
    expect($this->request->current_status)->toBe(DocumentRequestStatus::Pending);
});

test('admin can update payment status', function () {
    $response = $this->actingAs($this->admin)->patch("/admin/document-requests/{$this->request->id}/payment", [
        'payment_status' => 'paid',
    ]);

    $response->assertSessionHasNoErrors();
    $this->request->refresh();
    expect($this->request->payment_status)->toBe(PaymentStatus::Paid);
});

test('admin can update internal staff notes', function () {
    $response = $this->actingAs($this->admin)->patch("/admin/document-requests/{$this->request->id}/notes", [
        'admin_notes' => 'Verified with kagawad on duty.',
    ]);

    $response->assertSessionHasNoErrors();
    $this->request->refresh();
    expect($this->request->admin_notes)->toBe('Verified with kagawad on duty.');
});

test('regular resident is blocked with 404 from document requests management', function () {
    $response = $this->actingAs($this->resident)->get('/admin/document-requests');
    $response->assertNotFound();

    $response = $this->actingAs($this->resident)->get("/admin/document-requests/{$this->request->id}");
    $response->assertNotFound();
});

test('unauthenticated user is redirected to login', function () {
    $response = $this->get('/admin/document-requests');
    $response->assertRedirect('/login');
});
