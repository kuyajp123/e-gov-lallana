# Implementation Plan — Phase 4: Notifications & In-App Alerts

## Goal
Implement the **Notification Engine** for Barangay Lallana:
1. In-app notification center with real-time badge count, bell dropdown, and dedicated `/notifications` page.
2. User notification preferences in settings (`/settings/notifications`).
3. Automated event-driven alerts for Document Requests (`ready_for_pickup`, `returned`, `rejected`) and Household Verifications (`verified`, `returned`, `rejected`).
4. Dual-channel delivery: In-app + external (SMS via `SmsManager` and Transactional Email).

---

## User Review Required

> [!IMPORTANT]
> **External Channel Defaults:**
> - By default, every registered resident receives **In-App + Email** notifications.
> - If a valid Philippine mobile number is verified on file, residents can opt into **SMS alerts** in their Notification Settings.
> - Transactional emails use Resend (or local log/database in dev/staging).

> [!NOTE]
> **Audit Trail Integration:**
> Outbound SMS alerts automatically record into the existing `sms_messages` audit log table built in Phase 1.

---

## Architecture Decision Record (ADR-002)

### ADR-002: In-App Notification Center & Channel Routing Engine
* **Status:** PROPOSED
* **Date:** 2026-09-14
* **Context:**
  Residents need timely updates when documents are ready for pickup at the Barangay Hall or require correction. The system needs persistent in-app history, deep links to entities, and configurable external alerts (SMS/Email).
* **Decision:**
  - Use custom `notifications` and `notification_preferences` tables per [Data Model §19–§20](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-database-data-model-specification.md).
  - Implement a centralized `NotificationService` that handles:
    1. Storing in-app notification with entity relation (`related_entity_type`, `related_entity_id`, `action_url`).
    2. Inspecting user's `NotificationPreference`.
    3. Queuing external SMS via `SmsManager` and email via Mailable classes.
  - Expose unread notification count in Inertia shared props (`HandleInertiaRequests`) for global header badge availability without extra network calls.
* **Consequences:**
  - Zero frontend polling needed on standard page transitions; header badge stays synchronized.
  - Clean separation between core business models and alert delivery.

---

## Proposed Changes

### 1. Database & Migrations

#### [NEW] [`database/migrations/2026_09_15_000001_create_notifications_table.php`](file:///c:/Users/Paul/Projects/e-gov-lallana/database/migrations/2026_09_15_000001_create_notifications_table.php)
- Columns:
  - `id`: UUID primary key
  - `user_id`: foreign key to `users(id)` onDelete cascade
  - `type`: string (e.g. `document_ready_for_pickup`, `document_returned`, `document_rejected`, `household_verified`, `household_returned`)
  - `title`: string
  - `message`: text
  - `action_url`: string nullable (deep link)
  - `related_entity_type`: string nullable
  - `related_entity_id`: unsignedBigInteger nullable
  - `read_at`: timestamp nullable
  - `timestamps`
- Indexes: `['user_id', 'read_at']`, `['user_id', 'created_at']`

#### [NEW] [`database/migrations/2026_09_15_000002_create_notification_preferences_table.php`](file:///c:/Users/Paul/Projects/e-gov-lallana/database/migrations/2026_09_15_000002_create_notification_preferences_table.php)
- Columns:
  - `id`: bigIncrements
  - `user_id`: foreign key to `users(id)` unique onDelete cascade
  - `preferred_channel`: enum(`in_app_only`, `email`, `sms`, `both`), default: `email`
  - `notify_document_updates`: boolean, default: true
  - `notify_household_updates`: boolean, default: true
  - `notify_announcements`: boolean, default: true
  - `timestamps`

---

### 2. Models & Services

#### [NEW] [`app/Models/AppNotification.php`](file:///c:/Users/Paul/Projects/e-gov-lallana/app/Models/AppNotification.php)
- UUID key, casts (`read_at` => datetime), relationship `user()`, scopes `unread()`, `recent()`.

#### [NEW] [`app/Models/NotificationPreference.php`](file:///c:/Users/Paul/Projects/e-gov-lallana/app/Models/NotificationPreference.php)
- Fillable fields, casts (`boolean`), relationship `user()`.

#### [MODIFY] [`app/Models/User.php`](file:///c:/Users/Paul/Projects/e-gov-lallana/app/Models/User.php)
- Relationships: `appNotifications()`, `notificationPreference()`.
- Helper: `getNotificationPreference()`.

#### [NEW] [`app/Services/Notification/NotificationService.php`](file:///c:/Users/Paul/Projects/e-gov-lallana/app/Services/Notification/NotificationService.php)
- Methods:
  - `send(User $user, string $type, string $title, string $message, ?string $actionUrl = null, ?Model $relatedEntity = null): AppNotification`
  - `markAsRead(User $user, string $notificationId): bool`
  - `markAllAsRead(User $user): int`

#### [NEW] [`app/Mail/DocumentStatusUpdatedMail.php`](file:///c:/Users/Paul/Projects/e-gov-lallana/app/Mail/DocumentStatusUpdatedMail.php)
- Resend/SMTP transactional email view for document status changes.

#### [NEW] [`app/Mail/HouseholdStatusUpdatedMail.php`](file:///c:/Users/Paul/Projects/e-gov-lallana/app/Mail/HouseholdStatusUpdatedMail.php)
- Transactional email for household verification approvals / returns.

---

### 3. Automated Event Listeners

#### [MODIFY] [`app/Models/DocumentRequest.php`](file:///c:/Users/Paul/Projects/e-gov-lallana/app/Models/DocumentRequest.php)
- Trigger `NotificationService` in `transitionTo()` when status moves to:
  - `ReadyForPickup`: "Your document [name] (Ref: [code]) is ready for pickup at Barangay Hall."
  - `Returned`: "Your request (Ref: [code]) was returned for correction: [remarks]."
  - `Rejected`: "Your request (Ref: [code]) was rejected. Reason: [remarks]."

#### [MODIFY] [`app/Models/Household.php`](file:///c:/Users/Paul/Projects/e-gov-lallana/app/Models/Household.php)
- Trigger notification on verification approval or return for the Family Head.

---

### 4. HTTP Controllers & Shared Inertia Data

#### [NEW] [`app/Http/Controllers/Notification/NotificationController.php`](file:///c:/Users/Paul/Projects/e-gov-lallana/app/Http/Controllers/Notification/NotificationController.php)
- `GET /notifications`: Full list with pagination.
- `PATCH /notifications/{id}/read`: Mark specific notification as read.
- `POST /notifications/read-all`: Mark all as read.

#### [NEW] [`app/Http/Controllers/Settings/NotificationPreferenceController.php`](file:///c:/Users/Paul/Projects/e-gov-lallana/app/Http/Controllers/Settings/NotificationPreferenceController.php)
- `GET /settings/notifications`: Render settings tab.
- `PATCH /settings/notifications`: Validate and save preferences.

#### [MODIFY] [`app/Http/Middleware/HandleInertiaRequests.php`](file:///c:/Users/Paul/Projects/e-gov-lallana/app/Http/Middleware/HandleInertiaRequests.php)
- Share `unreadNotificationsCount` and `recentNotifications` in global `auth` prop.

---

### 5. Frontend Components & Pages

#### [NEW] [`resources/js/shared/components/notification-dropdown.tsx`](file:///c:/Users/Paul/Projects/e-gov-lallana/resources/js/shared/components/notification-dropdown.tsx)
- Bell button with badge counter.
- Popover / dropdown listing recent notifications with relative timestamps (`5m ago`, `2h ago`).
- Action link to navigate and mark as read.
- Quick "Mark all as read" button.

#### [MODIFY] [`resources/js/app/components/app-header.tsx`](file:///c:/Users/Paul/Projects/e-gov-lallana/resources/js/app/components/app-header.tsx)
- Add `NotificationDropdown` next to theme switcher and user avatar.

#### [NEW] [`resources/js/pages/notifications/index.tsx`](file:///c:/Users/Paul/Projects/e-gov-lallana/resources/js/pages/notifications/index.tsx)
- Dedicated notifications management page with filter tabs (All / Unread), pagination, and clear actions.

#### [NEW] [`resources/js/features/settings/pages/notifications.tsx`](file:///c:/Users/Paul/Projects/e-gov-lallana/resources/js/features/settings/pages/notifications.tsx)
- Notification settings page with channel selection (In-App, Email, SMS, Both) and topic toggles.

---

## Verification Plan

### Automated Feature Tests
- `tests/Feature/Notification/NotificationCenterTest.php`:
  - Notification generation on document status transitions.
  - Unread count calculation.
  - Marking single and all notifications as read.
  - Authorization protection (residents cannot read other residents' notifications).
- `tests/Feature/Notification/NotificationPreferenceTest.php`:
  - Saving and validating channel preferences.
  - SMS routing respects user preference and phone number existence.
  - Email routing respects user preference.

### Automated Browser Tests
- `tests/Browser/NotificationJourneyTest.php`:
  - Bell icon shows unread badge.
  - Clicking dropdown displays notifications.
  - Clicking item marks as read and navigates to target document.

### Pipeline Gate
- `composer test:all` (ESLint, Prettier, TypeScript, Pint, PHPStan, Pest).
