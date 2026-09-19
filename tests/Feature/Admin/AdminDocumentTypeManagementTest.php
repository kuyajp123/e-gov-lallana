<?php

use App\Enums\DocumentRequestStatus;
use App\Enums\PaymentStatus;
use App\Models\DocumentRequest;
use App\Models\DocumentType;
use App\Models\Role;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->adminRole = Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Barangay Administrator']);
    $this->subAdminRole = Role::firstOrCreate(['slug' => 'sub_admin'], ['name' => 'Barangay Sub-admin / Staff']);
    $this->residentRole = Role::firstOrCreate(['slug' => 'resident'], ['name' => 'Resident']);

    $this->admin = User::factory()->create(['role_id' => $this->adminRole->id]);
    $this->subAdmin = User::factory()->create(['role_id' => $this->subAdminRole->id]);
    $this->resident = User::factory()->create(['role_id' => $this->residentRole->id]);

    $this->docType = DocumentType::create([
        'name' => 'Barangay Clearance',
        'slug' => 'barangay-clearance',
        'fee_cents' => 5000,
        'description' => 'Issued for employment or residency proof.',
        'requirements' => ['Valid ID', 'Proof of Residency'],
        'form_schema' => [
            ['name' => 'purpose', 'label' => 'Purpose of Request', 'type' => 'text', 'required' => true],
        ],
        'is_active' => true,
    ]);
});

test('admin can access document types index page', function () {
    $response = $this->actingAs($this->admin)->get('/admin/document-types');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/document-types/index')
        ->has('documentTypes.data', 1)
        ->has('stats')
        ->has('filters')
        ->where('documentTypes.data.0.name', 'Barangay Clearance')
    );
});

test('admin can filter document types by active status', function () {
    DocumentType::create([
        'name' => 'Draft Clearance',
        'slug' => 'draft-clearance',
        'fee_cents' => 10000,
        'is_active' => false,
    ]);

    $response = $this->actingAs($this->admin)->get('/admin/document-types?status=inactive');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/document-types/index')
        ->has('documentTypes.data', 1)
        ->where('documentTypes.data.0.name', 'Draft Clearance')
    );
});

test('admin can search document types by keyword', function () {
    DocumentType::create([
        'name' => 'Certificate of Indigency',
        'slug' => 'certificate-of-indigency',
        'fee_cents' => 0,
        'is_active' => true,
    ]);

    $response = $this->actingAs($this->admin)->get('/admin/document-types?search=Indigency');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/document-types/index')
        ->has('documentTypes.data', 1)
        ->where('documentTypes.data.0.name', 'Certificate of Indigency')
    );
});

test('admin can view create document type page', function () {
    $response = $this->actingAs($this->admin)->get('/admin/document-types/create');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/document-types/create')
    );
});

test('admin can create new document type with dynamic schema and custom fee', function () {
    $response = $this->actingAs($this->admin)->post('/admin/document-types', [
        'name' => 'Barangay Business Clearance',
        'slug' => 'barangay-business-clearance',
        'fee_cents' => 15000,
        'description' => 'Required for operating local commercial enterprises.',
        'requirements' => ['DTI Permit', 'Lease Contract'],
        'form_schema' => [
            ['name' => 'business_name', 'label' => 'Business Name', 'type' => 'text', 'placeholder' => 'Trade name', 'required' => true],
            ['name' => 'capital_amount', 'label' => 'Initial Capital', 'type' => 'number', 'placeholder' => '0.00', 'required' => false],
        ],
        'is_active' => true,
    ]);

    $response->assertRedirect('/admin/document-types');
    $response->assertSessionHasNoErrors();

    $created = DocumentType::where('slug', 'barangay-business-clearance')->first();
    expect($created)->not->toBeNull()
        ->and($created->fee_cents)->toBe(15000)
        ->and($created->formatted_fee)->toBe('₱150.00')
        ->and(count($created->requirements))->toBe(2)
        ->and(count($created->form_schema))->toBe(2);
});

test('admin can view edit document type page', function () {
    $response = $this->actingAs($this->admin)->get("/admin/document-types/{$this->docType->id}/edit");

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('admin/document-types/edit')
        ->where('documentType.name', 'Barangay Clearance')
        ->where('documentType.fee_cents', 5000)
    );
});

test('admin can update document type', function () {
    $response = $this->actingAs($this->admin)->put("/admin/document-types/{$this->docType->id}", [
        'name' => 'Updated Barangay Clearance',
        'slug' => 'barangay-clearance',
        'fee_cents' => 7500,
        'description' => 'Updated clearance description.',
        'requirements' => ['Valid Government ID'],
        'form_schema' => [],
        'is_active' => true,
    ]);

    $response->assertRedirect('/admin/document-types');
    $response->assertSessionHasNoErrors();

    $this->docType->refresh();
    expect($this->docType->name)->toBe('Updated Barangay Clearance')
        ->and($this->docType->fee_cents)->toBe(7500)
        ->and($this->docType->formatted_fee)->toBe('₱75.00');
});

test('admin can toggle active status of document type', function () {
    expect($this->docType->is_active)->toBeTrue();

    $response = $this->actingAs($this->admin)->post("/admin/document-types/{$this->docType->id}/toggle");

    $response->assertSessionHasNoErrors();
    $this->docType->refresh();
    expect($this->docType->is_active)->toBeFalse();

    // Toggle back
    $response = $this->actingAs($this->admin)->post("/admin/document-types/{$this->docType->id}/toggle");
    $this->docType->refresh();
    expect($this->docType->is_active)->toBeTrue();
});

test('admin cannot delete document type that has existing document requests', function () {
    DocumentRequest::create([
        'reference_code' => 'REQ-TEST-0001',
        'user_id' => $this->resident->id,
        'document_type_id' => $this->docType->id,
        'current_status' => DocumentRequestStatus::Pending,
        'fee_cents' => 5000,
        'payment_status' => PaymentStatus::Unpaid,
        'purpose' => 'Employment',
        'submitted_at' => now(),
    ]);

    $response = $this->actingAs($this->admin)->delete("/admin/document-types/{$this->docType->id}");

    $response->assertSessionHasErrors(['delete']);
    expect($this->docType->fresh())->not->toBeNull();
});

test('admin can delete document type without existing requests', function () {
    $emptyType = DocumentType::create([
        'name' => 'Temporary Certificate',
        'slug' => 'temporary-certificate',
        'fee_cents' => 0,
        'is_active' => true,
    ]);

    $response = $this->actingAs($this->admin)->delete("/admin/document-types/{$emptyType->id}");

    $response->assertRedirect('/admin/document-types');
    $response->assertSessionHasNoErrors();
    expect(DocumentType::find($emptyType->id))->toBeNull();
});

test('resident is blocked with 404 from document types management', function () {
    $response = $this->actingAs($this->resident)->get('/admin/document-types');
    $response->assertNotFound();

    $response = $this->actingAs($this->resident)->get('/admin/document-types/create');
    $response->assertNotFound();
});

test('unauthenticated visitor is redirected to login from document types', function () {
    $response = $this->get('/admin/document-types');
    $response->assertRedirect('/login');
});
