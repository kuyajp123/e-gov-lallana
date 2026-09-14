<?php

namespace App\Services\Notification;

use App\Mail\DocumentStatusUpdatedMail;
use App\Mail\HouseholdStatusUpdatedMail;
use App\Models\AppNotification;
use App\Models\Household;
use App\Models\NotificationPreference;
use App\Models\SmsMessage;
use App\Models\User;
use App\Services\Sms\SmsManager;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class NotificationService
{
    /**
     * Send an in-app notification and dispatch external alerts (SMS/Email) based on user preferences.
     */
    public function send(
        User $user,
        string $type,
        string $title,
        string $message,
        ?string $actionUrl = null,
        ?Model $relatedEntity = null
    ): AppNotification {
        // 1. Create in-app notification record
        $notification = AppNotification::create([
            'user_id' => $user->id,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'action_url' => $actionUrl,
            'related_entity_type' => $relatedEntity ? get_class($relatedEntity) : null,
            'related_entity_id' => $relatedEntity?->getKey(),
        ]);

        // 2. Resolve user's notification preferences
        $preference = $user->getNotificationPreference();

        // Check if user disabled notifications for this category
        if (! $this->shouldSendExternalAlert($preference, $type)) {
            return $notification;
        }

        $channel = $preference->preferred_channel ?? 'email';

        // 3. Dispatch Email if enabled
        if (in_array($channel, ['email', 'both'], true) && ! empty($user->email)) {
            $this->dispatchEmail($user, $type, $title, $message, $actionUrl, $relatedEntity);
        }

        // 4. Dispatch SMS if enabled
        if (in_array($channel, ['sms', 'both'], true) && ! empty($user->phone_number)) {
            $this->dispatchSms($user, $title, $message);
        }

        return $notification;
    }

    /**
     * Check whether external alert should be dispatched based on notification topic.
     */
    protected function shouldSendExternalAlert(NotificationPreference $preference, string $type): bool
    {
        if ($preference->preferred_channel === 'in_app_only') {
            return false;
        }

        if (str_starts_with($type, 'document_') && ! $preference->notify_document_updates) {
            return false;
        }

        if (str_starts_with($type, 'household_') && ! $preference->notify_household_updates) {
            return false;
        }

        if (str_starts_with($type, 'announcement_') && ! $preference->notify_announcements) {
            return false;
        }

        return true;
    }

    /**
     * Send transactional email.
     */
    protected function dispatchEmail(
        User $user,
        string $type,
        string $title,
        string $message,
        ?string $actionUrl,
        ?Model $relatedEntity
    ): void {
        try {
            if ($relatedEntity instanceof Household || str_starts_with($type, 'household_')) {
                Mail::to($user->email)->queue(
                    new HouseholdStatusUpdatedMail($user->name, $title, $message, $actionUrl)
                );
            } else {
                Mail::to($user->email)->queue(
                    new DocumentStatusUpdatedMail($user->name, $title, $message, $actionUrl)
                );
            }
        } catch (Throwable $e) {
            Log::error('Failed to queue notification email: '.$e->getMessage(), [
                'user_id' => $user->id,
                'type' => $type,
            ]);
        }
    }

    /**
     * Send SMS and log to audit table.
     */
    protected function dispatchSms(User $user, string $title, string $message): void
    {
        if (empty($user->phone_number)) {
            return;
        }

        $smsText = "[Brgy. Lallana] {$title}: {$message}";

        try {
            $driver = SmsManager::createDriver();
            $result = $driver->send($user->phone_number, $smsText);

            SmsMessage::create([
                'recipient' => $user->phone_number,
                'message' => $smsText,
                'provider' => config('sms.default', 'fake'),
                'message_id' => $result->messageId,
                'status' => $result->success ? 'sent' : 'failed',
                'error_message' => $result->errorMessage,
                'raw_response' => $result->rawResponse,
                'sent_at' => $result->success ? Carbon::now() : null,
            ]);
        } catch (Throwable $e) {
            Log::error('Failed to send notification SMS: '.$e->getMessage(), [
                'user_id' => $user->id,
                'phone' => $user->phone_number,
            ]);
        }
    }

    /**
     * Mark a specific notification as read.
     */
    public function markAsRead(User $user, string $notificationId): bool
    {
        $notification = AppNotification::where('user_id', $user->id)
            ->where('id', $notificationId)
            ->first();

        if (! $notification) {
            return false;
        }

        $notification->markAsRead();

        return true;
    }

    /**
     * Mark all unread notifications as read for a user.
     */
    public function markAllAsRead(User $user): int
    {
        return AppNotification::where('user_id', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => Carbon::now()]);
    }

    /**
     * Get count of unread notifications for a user.
     */
    public function getUnreadCount(User $user): int
    {
        return AppNotification::where('user_id', $user->id)
            ->whereNull('read_at')
            ->count();
    }

    /**
     * Get recent notifications for header dropdown.
     *
     * @return Collection<int, AppNotification>
     */
    public function getRecent(User $user, int $limit = 5): Collection
    {
        return AppNotification::where('user_id', $user->id)
            ->latest('created_at')
            ->take($limit)
            ->get();
    }
}
