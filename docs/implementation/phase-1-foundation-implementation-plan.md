# Implementation Plan — Phase 1: Foundation, Core Services & Landing Page

**Document:** Phase 1 Implementation Plan  
**Target System:** Barangay Lallana E-Government Web-Based Information System  
**Stack:** Laravel 13, React 19, Inertia.js v3, Tailwind CSS v4, Supabase PostgreSQL, Supabase Storage, TextBee, Resend, Cloudflare Turnstile, Pest PHP 5, Playwright  

---

## 1. Overview & Objectives

Phase 1 establishes the foundational infrastructure, security boundaries, database schemas, service contracts, and the public-facing landing page as defined in the system specifications:
* [`barangay-lallana-system-overview.md`](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-system-overview.md)
* [`barangay-lallana-implementation-blueprint.md`](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-implementation-blueprint.md)
* [`barangay-lallana-database-data-model-specification.md`](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-database-data-model-specification.md)
* [`barangay-lallana-workflow-state-machine-specification.md`](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-workflow-state-machine-specification.md)
* [`Landing Page Functional & Content Specification.md`](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/Landing%20Page%20Functional%20&%20Content%20Specification.md)

---

## 2. Scope of Phase 1 Deliverables

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PHASE 1 DELIVERABLES                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. Core Service Contracts & Security                                        │
│    ├── SmsService Contract (Interface) + DTOs                               │
│    ├── FakeSmsService + Local Developer SMS Inbox (/dev/sms)                │
│    ├── TextBeeSmsService (Production Primary Driver)                        │
│    ├── SemaphoreSmsService (Future Scale Adapter)                           │
│    ├── OtpService (5-min TTL, 5-attempt limit, 60s cooldown, SHA-256 hash)  │
│    └── ValidTurnstile Custom Validation Rule (Cloudflare API siteverify)    │
│                                                                             │
│ 2. Supabase PostgreSQL Database Foundation                                  │
│    ├── Migrations: users, roles, resident_profiles, households, members     │
│    ├── Migrations: verifications, document_types, document_requests (JSONB) │
│    ├── Migrations: files, announcements, sms_messages audit log             │
│    └── Seeders: Default roles, 3 document types, sample announcements       │
│                                                                             │
│ 3. Localization & Inertia Shared Props                                      │
│    ├── lang/en and lang/fil translation dictionaries                        │
│    └── HandleInertiaRequests props sharing (translations, auth status)      │
│                                                                             │
│ 4. Public Landing Page Implementation (8 Sections)                         │
│    ├── Hero Section (Headline, Subtitle, CTA buttons)                       │
│    ├── About Section (Barangay history & Trece Martires City context)       │
│    ├── About Barangay (Hon. Cecilia M. Decillo + message + officials grid)  │
│    ├── Services Grid (Clearance, Certificate, Indigency)                    │
│    ├── System Statistics (Aggregate DB counts)                              │
│    ├── Announcements Feed (Dynamic DB query + empty fallback)               │
│    ├── Location & Contact Info (Address, hotlines, static map image)        │
│    └── Public Inquiry Form (Turnstile bot challenge + Resend delivery)      │
│                                                                             │
│ 5. Automated Testing Suite                                                  │
│    ├── Pest PHP Feature tests for SmsService, OtpService, and Turnstile     │
│    └── Playwright E2E test for Public Landing Page and Inquiry Form         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Component Plan

### 3.1. SMS & Communication Service Layer

#### Architecture:
* **Contract:** `App\Services\Sms\Contracts\SmsService`
  * `send(string $to, string $message): SmsResult`
* **DTO:** `App\Services\Sms\DTOs\SmsResult` (`success`, `provider`, `messageId`, `errorCode`, `errorMessage`)
* **Implementations:**
  1. `FakeSmsService`: Stores simulated SMS in cache/database; exposes simulation modes (`SUCCESS`, `FAILURE`, `TIMEOUT`, `RATE_LIMITED`).
  2. `TextBeeSmsService`: Dispatches HTTP POST to `https://api.textbee.dev/api/v1/gateway/send-sms` using configured device credentials.
  3. `SemaphoreSmsService`: Dispatches HTTP POST to Semaphore API (`api.semaphore.co/api/v4/messages`).
* **Service Manager / Provider:** `App\Services\Sms\SmsManager` resolved via `config('sms.provider')`.
* **Dev Route:** `/dev/sms` controller & UI (strictly guarded by `abort_unless(app()->isLocal(), 404)`).

#### Files to Create:
- `[NEW]` `app/Services/Sms/Contracts/SmsService.php`
- `[NEW]` `app/Services/Sms/DTOs/SmsResult.php`
- `[NEW]` `app/Services/Sms/Providers/FakeSmsService.php`
- `[NEW]` `app/Services/Sms/Providers/TextBeeSmsService.php`
- `[NEW]` `app/Services/Sms/Providers/SemaphoreSmsService.php`
- `[NEW]` `app/Services/Sms/SmsManager.php`
- `[NEW]` `config/sms.php`
- `[NEW]` `app/Http/Controllers/Dev/DevSmsController.php`
- `[NEW]` `resources/js/pages/dev/sms-inbox.tsx`

---

### 3.2. OTP Lifecycle & Security Layer

#### Architecture:
* **Service:** `App\Services\Auth\OtpService`
* **Rules:**
  - 6-digit numeric codes generated with `random_int(100000, 999999)`.
  - Stored in cache with SHA-256 hash (never plain text).
  - 5-minute Time-To-Live (TTL).
  - Max 5 failed verification attempts before invalidation.
  - 60-second cooldown period between resend attempts.
  - Generates transport notification jobs dispatched asynchronously to the queue.

#### Files to Create:
- `[NEW]` `app/Services/Auth/OtpService.php`
- `[NEW]` `app/Jobs/SendOtpNotificationJob.php`

---

### 3.3. Bot Protection & Cloudflare Turnstile

#### Architecture:
* **Rule:** `App\Rules\ValidTurnstile`
  - Sends verification payload via `Http::asForm()->post('https://challenges.cloudflare.com/turnstile/v0/siteverify', [...])`.
  - Supports official Cloudflare dummy test keys (`1x00000000000000000000AA`) in local dev and testing.

#### Files to Create:
- `[NEW]` `app/Rules/ValidTurnstile.php`
- `[NEW]` `resources/js/components/turnstile-widget.tsx`

---

### 3.4. Supabase PostgreSQL Database Foundation

#### Entities & Schema:
1. **`users`** — Extended with `phone_number`, `phone_verified_at`, `status` (`pending`, `active`, `suspended`), `role`.
2. **`roles` / permissions** — `admin`, `sub_admin`, `resident`.
3. **`resident_profiles`** — Personal details (first, middle, last, suffix, birthdate, gender, civil status, citizenship, occupation, voter status).
4. **`households`** — Household code, address, purok/sitio, status (`unverified`, `verified`, `returned`, `rejected`, `restricted`).
5. **`household_members`** — Relationship to head, `is_family_head` boolean flag, residency status.
6. **`verifications`** — Polymorphic verification record (`target_type`, `target_id`, `status`, `reviewer_id`, `review_notes`, `reviewed_at`).
7. **`document_types`** — Slug, name, description, fee_cents, is_active, required_fields schema.
8. **`document_requests`** — Reference code, user_id, document_type_id, `submitted_data` (JSONB), current status (`pending`, `processing`, `on_hold`, `returned`, `completed`, `ready_for_pickup`, `rejected`, `cancelled`).
9. **`document_request_status_history`** — Status audit log with admin remarks and timestamps.
10. **`files`** — File metadata, bucket (`government-ids`, `verification-documents`, `announcement-attachments`), storage key, privacy flag.
11. **`announcements`** — Title, excerpt, content (HTML/JSON), category, is_published, published_at, banner_file_id.
12. **`sms_messages`** — Outbound SMS audit table.

#### Files to Create:
- `[NEW]` `database/migrations/2026_08_27_000001_create_roles_table.php`
- `[NEW]` `database/migrations/2026_08_27_000002_create_resident_profiles_table.php`
- `[NEW]` `database/migrations/2026_08_27_000003_create_households_table.php`
- `[NEW]` `database/migrations/2026_08_27_000004_create_household_members_table.php`
- `[NEW]` `database/migrations/2026_08_27_000005_create_verifications_table.php`
- `[NEW]` `database/migrations/2026_08_27_000006_create_document_types_table.php`
- `[NEW]` `database/migrations/2026_08_27_000007_create_document_requests_table.php`
- `[NEW]` `database/migrations/2026_08_27_000008_create_files_table.php`
- `[NEW]` `database/migrations/2026_08_27_000009_create_announcements_table.php`
- `[NEW]` `database/migrations/2026_08_27_000010_create_sms_messages_table.php`
- `[NEW]` `database/seeders/RoleSeeder.php`
- `[NEW]` `database/seeders/DocumentTypeSeeder.php`
- `[NEW]` `database/seeders/AnnouncementSeeder.php`
- `[NEW]` Eloquent Models in `app/Models/`: `ResidentProfile`, `Household`, `HouseholdMember`, `Verification`, `DocumentType`, `DocumentRequest`, `FileRecord`, `Announcement`, `SmsMessage`.

---

### 3.5. Public Landing Page (`resources/js/pages/welcome.tsx`)

#### 8 Modular Sections:
1. **`Navbar`**: Logo (`/lallana-icon.png`), nav links (About, Services, Announcements, Contact), Language selector, Login/Register buttons.
2. **`HeroSection`**: Clean background gradient + pattern, headline *"Barangay Lallana E-Government Services"*, subtitle, *"Request Document"* CTA and *"Create Household"* CTA.
3. **`AboutSection`**: Historical narrative of Barangay Lallana and Trece Martires City context.
4. **`LeadershipSection`**: Barangay Captain Hon. Cecilia M. Decillo feature + governance quote + officials card grid placeholders.
5. **`ServicesSection`**: 3 confirmed service cards (*Barangay Certificate*, *Barangay Clearance*, *Certificate of Indigency*) with requirements overview and action buttons.
6. **`StatisticsSection`**: 3 aggregate live statistic counters (Total Users, Verified Households, Officials).
7. **`AnnouncementsSection`**: Dynamic card feed displaying latest published announcements with empty state.
8. **`ContactSection`**: Barangay hall static map card, address, emergency contact numbers, and interactive **Inquiry Form** with Turnstile bot protection.
9. **`Footer`**: Official links, copyright, and emergency hotline bar.

#### Backend Controller:
- `[NEW]` `app/Http/Controllers/Public/LandingPageController.php`: Fetches aggregate stats, recent 3 published announcements, and passes props via `Inertia::render('welcome')`.
- `[NEW]` `app/Http/Controllers/Public/InquiryController.php`: Handles visitor contact form submissions, validates Turnstile, and dispatches email via Resend.

---

## 4. Verification & Testing Plan

### Automated Tests (Pest PHP):
* `tests/Feature/SmsServiceTest.php`: Tests `FakeSmsService` storage, status simulator (`SUCCESS`, `FAILURE`, `TIMEOUT`), and container binding.
* `tests/Feature/OtpServiceTest.php`: Tests OTP generation, SHA-256 caching, expiration at 5 minutes, 5-attempt lockout, and cooldown throttle.
* `tests/Feature/TurnstileValidationTest.php`: Tests `ValidTurnstile` rule with Cloudflare test keys.
* `tests/Feature/LandingPageTest.php`: Tests that the public landing page loads with HTTP 200, renders dynamic stats and announcements, and processes inquiries.
* `tests/Feature/DatabaseMigrationTest.php`: Verifies all migration tables and foreign key constraints on PostgreSQL.

### Automated Tests (Playwright E2E):
* `tests/e2e/landing-page.spec.ts`: Tests public accessibility, navigation scrolls, CTA link destinations, and contact form submission flow.

---

## 5. Execution Order

1. **Step 1:** Build Core Services (SMS Interface, Fake Driver, Dev Inbox, OTP Service, Turnstile Rule).
2. **Step 2:** Build Database Schema (Migrations, Models, Seeders) and verify on Supabase PostgreSQL.
3. **Step 3:** Build Localization dictionaries (`lang/en`, `lang/fil`) & Inertia middleware sharing.
4. **Step 4:** Build Public Landing Page Controller and React UI components.
5. **Step 5:** Write and run all Pest feature tests and Playwright E2E tests.
6. **Step 6:** Format with Laravel Pint and verify clean build.
