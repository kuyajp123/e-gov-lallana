<?php

use App\Models\Inquiry;
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
});

test('guest is redirected to login when accessing admin inquiries', function () {
    $this->get('/admin/inquiries')->assertRedirect('/login');
});

test('regular resident receives 404 when attempting to access admin inquiries', function () {
    $this->actingAs($this->resident)
        ->get('/admin/inquiries')
        ->assertNotFound();
});

test('admin and subadmin can access inquiries list and view props', function () {
    Inquiry::factory()->create([
        'name' => 'Juan Dela Cruz',
        'email' => 'juan@example.com',
        'subject' => 'Streetlight Repair Request',
        'status' => 'pending',
    ]);

    $this->actingAs($this->admin)
        ->get('/admin/inquiries')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/inquiries/index')
            ->has('inquiries.data', 1)
            ->has('stats')
            ->where('inquiries.data.0.name', 'Juan Dela Cruz')
            ->where('inquiries.data.0.subject', 'Streetlight Repair Request')
        );

    $this->actingAs($this->subAdmin)
        ->get('/admin/inquiries')
        ->assertOk();
});

test('admin can filter inquiries by status and search keyword', function () {
    Inquiry::factory()->create([
        'name' => 'Alice Guo',
        'subject' => 'Drainage Problem',
        'status' => 'pending',
    ]);

    Inquiry::factory()->create([
        'name' => 'Bob Marley',
        'subject' => 'Medical Mission Inquiry',
        'status' => 'resolved',
    ]);

    // Search by name
    $this->actingAs($this->admin)
        ->get('/admin/inquiries?search=Alice')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('inquiries.data', 1)
            ->where('inquiries.data.0.name', 'Alice Guo')
        );

    // Filter by status
    $this->actingAs($this->admin)
        ->get('/admin/inquiries?status=resolved')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('inquiries.data', 1)
            ->where('inquiries.data.0.name', 'Bob Marley')
        );
});

test('admin can update inquiry status and add notes', function () {
    $inquiry = Inquiry::factory()->create([
        'status' => 'pending',
        'admin_notes' => null,
    ]);

    $response = $this->actingAs($this->admin)
        ->patch("/admin/inquiries/{$inquiry->id}/status", [
            'status' => 'resolved',
            'admin_notes' => 'Contacted resident and provided details.',
        ]);

    $response->assertSessionHas('success');

    $this->assertDatabaseHas('inquiries', [
        'id' => $inquiry->id,
        'status' => 'resolved',
        'admin_notes' => 'Contacted resident and provided details.',
        'resolved_by_id' => $this->admin->id,
    ]);
});

test('admin can delete an inquiry', function () {
    $inquiry = Inquiry::factory()->create();

    $response = $this->actingAs($this->admin)
        ->delete("/admin/inquiries/{$inquiry->id}");

    $response->assertSessionHas('success');

    $this->assertDatabaseMissing('inquiries', [
        'id' => $inquiry->id,
    ]);
});
