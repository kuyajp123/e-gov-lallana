<?php

use App\Enums\DocumentRequestStatus;
use App\Models\AppNotification;
use App\Models\DocumentRequest;
use App\Models\DocumentType;
use App\Models\ResidentProfile;
use App\Models\Role;
use App\Models\User;
use App\Services\Notification\NotificationService;
use Illuminate\Support\Facades\Mail;

beforeEach(function () {
    Mail::fake();

    $this->residentRole = Role::firstOrCreate(['slug' => 'resident'], ['name' => 'Resident']);

    $this->user = User::factory()->create([
        'role_id' => $this->residentRole->id,
        'email' => 'juan@example.com',
    ]);

    ResidentProfile::create([
        'user_id' => $this->user->id,
        'first_name' => 'Juan',
        'last_name' => 'Dela Cruz',
        'birthdate' => '1990-01-01',
        'gender' => 'male',
        'civil_status' => 'married',
    ]);

    $this->otherUser = User::factory()->create([
        'role_id' => $this->residentRole->id,
        'email' => 'maria@example.com',
    ]);

    $this->docType = DocumentType::create([
        'name' => 'Barangay Clearance',
        'slug' => 'barangay-clearance',
        'fee_cents' => 5000,
        'is_active' => true,
    ]);

    $this->docRequest = DocumentRequest::create([
        'reference_code' => 'REQ-2026-0001',
        'user_id' => $this->user->id,
        'document_type_id' => $this->docType->id,
        'current_status' => DocumentRequestStatus::Processing,
        'fee_cents' => 5000,
        'purpose' => 'Employment requirement',
        'submitted_at' => now(),
    ]);
});

test('document request transition to ready_for_pickup creates in-app notification', function () {
    $this->docRequest->transitionTo(DocumentRequestStatus::ReadyForPickup);

    $this->assertDatabaseHas('notifications', [
        'user_id' => $this->user->id,
        'type' => 'document_ready_for_pickup',
        'related_entity_type' => DocumentRequest::class,
        'related_entity_id' => $this->docRequest->id,
        'read_at' => null,
    ]);

    $notification = AppNotification::where('user_id', $this->user->id)->first();
    expect($notification->title)->toBe('Document Ready for Pickup');
    expect($notification->message)->toContain('REQ-2026-0001');
});

test('document request transition to returned creates in-app notification with remarks', function () {
    $this->docRequest->transitionTo(DocumentRequestStatus::Returned, remarks: 'Please upload clearer ID image.');

    $this->assertDatabaseHas('notifications', [
        'user_id' => $this->user->id,
        'type' => 'document_returned',
    ]);

    $notification = AppNotification::where('user_id', $this->user->id)->first();
    expect($notification->message)->toContain('Please upload clearer ID image.');
});

test('resident can view notifications index page', function () {
    app(NotificationService::class)->send(
        $this->user,
        'system_notice',
        'Welcome Notice',
        'Welcome to Barangay Lallana Portal.'
    );

    $response = $this->actingAs($this->user)->get('/notifications');

    $response->assertOk();
});

test('resident can mark a single notification as read', function () {
    $notification = app(NotificationService::class)->send(
        $this->user,
        'system_notice',
        'Notice Title',
        'Notice Message'
    );

    expect($notification->isRead())->toBeFalse();

    $response = $this->actingAs($this->user)->patchJson("/notifications/{$notification->id}/read");

    $response->assertOk()->assertJson(['success' => true]);

    expect($notification->fresh()->isRead())->toBeTrue();
});

test('resident cannot mark another user notification as read', function () {
    $otherNotification = app(NotificationService::class)->send(
        $this->otherUser,
        'system_notice',
        'Private Notice',
        'For Maria only.'
    );

    $response = $this->actingAs($this->user)->patchJson("/notifications/{$otherNotification->id}/read");

    $response->assertOk()->assertJson(['success' => false]);
    expect($otherNotification->fresh()->isRead())->toBeFalse();
});

test('resident can mark all notifications as read', function () {
    $service = app(NotificationService::class);

    $service->send($this->user, 'notice_1', 'Title 1', 'Message 1');
    $service->send($this->user, 'notice_2', 'Title 2', 'Message 2');

    expect($service->getUnreadCount($this->user))->toBe(2);

    $response = $this->actingAs($this->user)->post('/notifications/read-all');

    $response->assertRedirect();
    expect($service->getUnreadCount($this->user))->toBe(0);
});
