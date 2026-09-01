<?php

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
        'name' => 'Certificate of Residency',
        'slug' => 'certificate-of-residency',
        'fee_cents' => 4000,
        'requirements' => ['Utility Bill'],
        'is_active' => true,
    ]);
});

test('admin can access filament document types list', function () {
    $response = $this->actingAs($this->admin)->get('/admin/document-types');

    $response->assertOk();
});

test('admin can create and update document types with custom price', function () {
    $newType = DocumentType::create([
        'name' => 'Barangay Business Clearance',
        'slug' => 'barangay-business-clearance',
        'fee_cents' => 15000, // ₱150.00
        'requirements' => ['DTI Registration', 'Lease Contract'],
        'form_schema' => [
            ['name' => 'business_name', 'label' => 'Business Trade Name', 'type' => 'text', 'required' => true],
        ],
        'is_active' => true,
    ]);

    expect($newType->formatted_fee)->toBe('₱150.00');

    // Admin updates price to ₱200.00
    $newType->update(['fee_cents' => 20000]);
    $newType->refresh();

    expect($newType->formatted_fee)->toBe('₱200.00');
});

test('deactivated document types are not returned by active scope', function () {
    $this->docType->update(['is_active' => false]);

    $activeTypes = DocumentType::active()->get();

    expect($activeTypes->pluck('id'))->not->toContain($this->docType->id);
});

test('resident is blocked with 404 from accessing filament document types management', function () {
    $response = $this->actingAs($this->resident)->get('/admin/document-types');

    $response->assertNotFound();
});
