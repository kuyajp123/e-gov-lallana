<?php

use App\Mail\DocumentStatusUpdatedMail;
use App\Models\Role;
use App\Models\User;
use App\Services\Notification\NotificationService;
use Illuminate\Support\Facades\Mail;

beforeEach(function () {
    Mail::fake();

    $this->residentRole = Role::firstOrCreate(['slug' => 'resident'], ['name' => 'Resident']);

    $this->userWithPhone = User::factory()->create([
        'role_id' => $this->residentRole->id,
        'email' => 'juan@example.com',
        'phone_number' => '09171234567',
    ]);

    $this->userWithoutPhone = User::factory()->create([
        'role_id' => $this->residentRole->id,
        'email' => 'pedro@example.com',
        'phone_number' => null,
    ]);
});

test('resident can view notification settings page', function () {
    $response = $this->actingAs($this->userWithPhone)->get('/settings/notifications');

    $response->assertOk();
});

test('resident can update notification preferences', function () {
    $response = $this->actingAs($this->userWithPhone)->patch('/settings/notifications', [
        'preferred_channel' => 'both',
        'notify_document_updates' => true,
        'notify_household_updates' => false,
        'notify_announcements' => true,
    ]);

    $response->assertRedirect('/settings/notifications');

    $this->assertDatabaseHas('notification_preferences', [
        'user_id' => $this->userWithPhone->id,
        'preferred_channel' => 'both',
        'notify_document_updates' => true,
        'notify_household_updates' => false,
        'notify_announcements' => true,
    ]);
});

test('resident without phone number cannot select SMS or both channels', function () {
    $response = $this->actingAs($this->userWithoutPhone)->patch('/settings/notifications', [
        'preferred_channel' => 'sms',
        'notify_document_updates' => true,
        'notify_household_updates' => true,
        'notify_announcements' => true,
    ]);

    $response->assertSessionHasErrors(['preferred_channel']);
});

test('in_app_only preference does not queue email or send SMS', function () {
    $preference = $this->userWithPhone->getNotificationPreference();
    $preference->update(['preferred_channel' => 'in_app_only']);

    app(NotificationService::class)->send(
        $this->userWithPhone,
        'document_ready_for_pickup',
        'Ready for Pickup',
        'Your document is ready.'
    );

    Mail::assertNothingQueued();
    $this->assertDatabaseEmpty('sms_messages');
});

test('email preference queues email notification', function () {
    $preference = $this->userWithPhone->getNotificationPreference();
    $preference->update(['preferred_channel' => 'email']);

    app(NotificationService::class)->send(
        $this->userWithPhone,
        'document_ready_for_pickup',
        'Ready for Pickup',
        'Your document is ready.'
    );

    Mail::assertQueued(DocumentStatusUpdatedMail::class, function ($mail) {
        return $mail->hasTo('juan@example.com');
    });
});

test('sms preference sends and logs SMS message', function () {
    $preference = $this->userWithPhone->getNotificationPreference();
    $preference->update(['preferred_channel' => 'sms']);

    app(NotificationService::class)->send(
        $this->userWithPhone,
        'document_ready_for_pickup',
        'Ready for Pickup',
        'Your document is ready.'
    );

    Mail::assertNothingQueued();

    $this->assertDatabaseHas('sms_messages', [
        'recipient' => '09171234567',
        'status' => 'sent',
    ]);
});

test('disabled document updates toggle suppresses external alert', function () {
    $preference = $this->userWithPhone->getNotificationPreference();
    $preference->update([
        'preferred_channel' => 'email',
        'notify_document_updates' => false,
    ]);

    app(NotificationService::class)->send(
        $this->userWithPhone,
        'document_ready_for_pickup',
        'Ready for Pickup',
        'Your document is ready.'
    );

    Mail::assertNothingQueued();
});
