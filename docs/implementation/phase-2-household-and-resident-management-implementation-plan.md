# Implementation Plan — Phase 2: Household and Resident Management

**Document:** Phase 2 Implementation Plan  
**Target System:** Barangay Lallana E-Government Web-Based Information System  
**Stack:** Laravel 12 (PHP 8.4), React 19, Inertia.js v3, Tailwind CSS v4, Filament PHP (Admin Panel), Supabase PostgreSQL, Supabase Storage (S3-compatible), Pest PHP 5, Playwright  
**Reference Specs:**
* [`barangay-lallana-system-overview.md`](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-system-overview.md)
* [`barangay-lallana-implementation-blueprint.md`](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-implementation-blueprint.md)
* [`barangay-lallana-database-data-model-specification.md`](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-database-data-model-specification.md)
* [`barangay-lallana-workflow-state-machine-specification.md`](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-workflow-state-machine-specification.md)

---

## 1. Overview & Key Architectural Decisions

Phase 2 implements the core domain foundation of Barangay Lallana's e-government portal: **Resident Identity (KYC), Household Organization, Family Head Authority, and Administrative Verification Workflows**.

### Confirmed Architectural Decisions:
1. **Extended Resident Profile Fields:** Added via new migration (`2026_08_28_000001_extend_resident_profiles_table.php`) to capture full demographic, socio-economic, and special classification attributes per [Data Model §4](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-database-data-model-specification.md).
2. **Supabase Storage Buckets:** Buckets (`government-ids`, `verification-documents`, `avatars`) will be initialized upon reaching file upload implementation.
3. **Resident Dashboard Scope:** Kept **minimal** in Phase 2 (basic status indicators, alert banners, and direct links to register household / complete KYC). Full KPI analytics and dashboard widgets are deferred to Phase 5.
4. **Admin Portal Stack:** Powered by **Filament PHP** at `/admin`. Filament Resources and Action Modals will handle the verification queues (Approve, Return with remarks, Reject, Restrict), leveraging standard Laravel Policies for authorization and `FilamentUser` / `canAccessPanel()` for role guarding.

---

## 2. Scope of Phase 2 Deliverables

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PHASE 2 DELIVERABLES                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. Schema Extensions & Storage Setup                                        │
│    ├── Migration: Extend resident_profiles with full demographic attributes │
│    ├── Supabase Storage integration for private ID documents                │
│    └── File upload & secure temporary signed URL generation service         │
│                                                                             │
│ 2. Resident Profile Completion (KYC)                                        │
│    ├── ResidentProfileForm (personal info, demographics, voter status, IDs) │
│    ├── File upload endpoint for Government IDs and Avatars                  │
│    ├── Profile completion middleware (EnsureProfileIsComplete)              │
│    └── Resident Profile show / edit UI pages                                │
│                                                                             │
│ 3. Household Registration & Workflow (Inertia + React)                      │
│    ├── Multi-step Household Wizard (Address -> Family Info -> ID -> OTP)    │
│    ├── OTP contact verification step (SMS / Email channel selection)        │
│    ├── Auto-generation of unique Household Codes (e.g. HH-2026-0001)        │
│    ├── Household Status State Machine (unverified -> verified/returned/...)│
│    └── Locked-module presentation & status banners for unverified users     │
│                                                                             │
│ 4. Household Member Management (Inertia + React)                            │
│    ├── Add Member workflow by Family Head                                   │
│    ├── Member account invitation & independent activation workflow          │
│    ├── Family Head Authority Transfer workflow                              │
│    └── Household marriage / split branch registration support               │
│                                                                             │
│ 5. Admin Verification Portal (Filament PHP)                                 │
│    ├── Filament Admin Panel configuration (AdminPanelProvider at /admin)    │
│    ├── FilamentUser contract implementation on User model (canAccessPanel)  │
│    ├── HouseholdResource: table, view page, and verification actions        │
│    │   ├── Action: Approve (transitions to verified)                        │
│    │   ├── Action: Return for Correction (modal with mandatory notes)       │
│    │   ├── Action: Reject (modal with mandatory notes)                      │
│    │   └── Action: Restrict Household (Admin-only action with reason)       │
│    ├── HouseholdMemberResource: verification action queue                   │
│    ├── ID Document preview modal (using temporary signed URLs)              │
│    └── Authorization Policies: Household, Member, Profile, Verification    │
│                                                                             │
│ 6. Minimal Resident Dashboard Update                                        │
│    ├── Status banners (Profile incomplete / Household pending / Verified)  │
│    └── Quick CTAs (Complete Profile, Register Household, My Household)      │
│                                                                             │
│ 7. Automated Test Suite                                                     │
│    ├── Pest Feature Tests: KYC, Household Wizard, Member CRUD, Policies    │
│    └── Playwright E2E: Household Registration & Admin Approval Journeys     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Component Plan

### 3.1. Database Schema Extensions & Storage Architecture

#### Schema Updates:
The initial `resident_profiles` table requires extensions to match the full demographic specification from [Data Model §4](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-database-data-model-specification.md):
- `educational_attainment` (nullable string: `elementary`, `high_school`, `vocational`, `college`, `post_graduate`, `none`)
- `employment_status` (nullable string: `employed`, `unemployed`, `self_employed`, `student`, `retired`)
- `religion` (nullable string)
- `residency_status` (string default `'resident'`: `official`, `new_resident`, `tenant`, `boarder`, `student`, `temporary`)
- `date_of_residency` (nullable date)
- `senior_citizen_status` (boolean default `false`)
- `pwd_status` (boolean default `false`)
- `pwd_id_number` (nullable string)
- `solo_parent_status` (boolean default `false`)
- `solo_parent_id_number` (nullable string)
- `government_id_file_id` (foreignId constrained to `files` table, nullable)

#### Supabase Storage Configuration:
* Private bucket: `government-ids` (Restricted access, accessible only through signed URLs via `FileRecord::getUrl($minutes)`).
* Private bucket: `verification-documents` (Supporting residency proof, utility bills).
* Public bucket: `avatars` (Publicly cached profile pictures).

#### Files to Create / Modify:
- `[NEW]` `database/migrations/2026_08_28_000001_extend_resident_profiles_table.php`
- `[MODIFY]` [`app/Models/ResidentProfile.php`](file:///c:/Users/Paul/Projects/e-gov-lallana/app/Models/ResidentProfile.php) (Add new fillables, casts, and `governmentId()` relationship)
- `[NEW]` `app/Services/Files/FileUploadService.php` (Validates MIME types, optimizes image payload with Intervention Image, uploads to disk/bucket, generates `FileRecord`)

---

### 3.2. Resident Profile Completion (KYC)

#### Workflow:
1. User logs in. If no complete `ResidentProfile` exists, user is prompted or redirected to `/resident/profile/setup`.
2. Form fields are organized into structured tabs / sections:
   - **Personal Information:** First Name, Middle Name, Last Name, Suffix, Sex, Birthdate, Civil Status, Citizenship, Religion.
   - **Socio-Economic & Demographics:** Educational Attainment, Employment Status, Occupation, Special Classifications (Senior Citizen, PWD with ID No., Solo Parent with ID No.).
   - **Voter Information:** Voter Status (`is_voter`), Voter ID Number.
   - **Identity Document Upload:** Valid Government ID type selection + front/back image upload.
3. Server-side validation via `StoreResidentProfileRequest` enforces valid formats, age calculation, and file upload size/MIME constraints (JPEG, PNG, WebP, PDF; max 5MB).

#### Backend & Route Architecture:
* `GET /resident/profile` -> `Resident\ProfileController@show` (`resident.profile.show`)
* `GET /resident/profile/edit` -> `Resident\ProfileController@edit` (`resident.profile.edit`)
* `POST /resident/profile` -> `Resident\ProfileController@store` (`resident.profile.store`)
* `PUT /resident/profile` -> `Resident\ProfileController@update` (`resident.profile.update`)
* `POST /resident/profile/avatar` -> `Resident\ProfileAvatarController@update` (`resident.profile.avatar`)

#### Middleware:
* `[NEW]` `app/Http/Middleware/EnsureProfileIsComplete.php`: Checks if `auth()->user()->residentProfile` exists and has required personal fields completed. If incomplete, redirects to profile setup with a flash advisory.

#### Files to Create:
- `[NEW]` `app/Http/Controllers/Resident/ProfileController.php`
- `[NEW]` `app/Http/Controllers/Resident/ProfileAvatarController.php`
- `[NEW]` `app/Http/Requests/Resident/StoreResidentProfileRequest.php`
- `[NEW]` `app/Http/Requests/Resident/UpdateResidentProfileRequest.php`
- `[NEW]` `resources/js/pages/resident/profile/show.tsx`
- `[NEW]` `resources/js/pages/resident/profile/edit.tsx`
- `[NEW]` `resources/js/features/resident/components/profile-form.tsx`
- `[NEW]` `resources/js/features/resident/components/id-upload-dropzone.tsx`

---

### 3.3. Household Registration & Verification Workflow (Inertia + React)

#### Workflow ([Workflow §3–§5](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-workflow-state-machine-specification.md)):
1. **Initiation:** Family Head initiates registration at `/household/register`.
2. **Step 1: Household Details:** Purok/Sitio selection (Purok 1 through Purok 7, Sitio Pag-Asa, etc.), exact street address, date of residency, residency classification.
3. **Step 2: Family Head Details & ID:** Pre-filled from `ResidentProfile`, requirement to attach government-issued ID and residency verification document.
4. **Step 3: Contact Verification (OTP):** User selects SMS or Email. System dispatches a 6-digit OTP via `OtpService` + `SmsService` / `Mail`. User verifies OTP code to confirm contact ownership.
5. **Step 4: Review & Submit:** Summary review and Turnstile bot protection check.
6. **Submission:**
   - Database transaction creates `Household` with unique `household_code` (e.g. `HH-2026-0001` generated atomically).
   - Creates head `HouseholdMember` (`is_family_head = true`).
   - Creates polymorphic `Verification` record with status `pending`.
   - Household status set to `unverified`.
7. **Post-Submission State:** User is directed to `/household/status` showing submitted data in read-only mode with live status badge (`Pending Barangay Verification`). Protected modules remain locked.

#### Household State Transitions:
```
[unverified / pending]
        │
        ├── Admin Approves ────────> [verified] (Unlocks all protected modules)
        │
        ├── Admin Returns ─────────> [returned] (Creator can edit requested info & resubmit)
        │
        ├── Admin Rejects ─────────> [rejected] (Historical record preserved; creator can start new)
        │
        └── Admin Restricts ───────> [restricted] (Admin-only restriction with mandatory note)
```

#### Backend & Route Architecture:
* `GET /household` -> `Household\HouseholdController@index` (`household.index`) [Shows household overview or redirect to register]
* `GET /household/register` -> `Household\HouseholdRegistrationController@create` (`household.register`)
* `POST /household/register/otp/send` -> `Household\HouseholdRegistrationController@sendOtp` (`household.register.otp.send`)
* `POST /household/register/otp/verify` -> `Household\HouseholdRegistrationController@verifyOtp` (`household.register.otp.verify`)
* `POST /household/register` -> `Household\HouseholdRegistrationController@store` (`household.register.store`)
* `GET /household/edit` -> `Household\HouseholdController@edit` (`household.edit`) [Only accessible if status == 'returned']
* `PUT /household` -> `Household\HouseholdController@update` (`household.update`) [Resubmission transitions back to 'pending']

#### Files to Create:
- `[NEW]` `app/Http/Controllers/Household/HouseholdController.php`
- `[NEW]` `app/Http/Controllers/Household/HouseholdRegistrationController.php`
- `[NEW]` `app/Http/Requests/Household/RegisterHouseholdRequest.php`
- `[NEW]` `app/Http/Requests/Household/UpdateHouseholdRequest.php`
- `[NEW]` `app/Services/Household/HouseholdCodeGenerator.php`
- `[NEW]` `resources/js/pages/household/index.tsx`
- `[NEW]` `resources/js/pages/household/register.tsx`
- `[NEW]` `resources/js/pages/household/edit.tsx`
- `[NEW]` `resources/js/features/household/components/household-wizard.tsx`
- `[NEW]` `resources/js/features/household/components/verification-status-banner.tsx`
- `[NEW]` `resources/js/features/household/components/locked-module-card.tsx`

---

### 3.4. Household Member Management & Family Head Authority (Inertia + React)

#### Features ([Workflow §6–§10](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-workflow-state-machine-specification.md)):
1. **Add Member by Family Head:**
   - Family Head enters member demographics (First, Middle, Last, Suffix, Birthdate, Gender, Civil Status, Occupation, Relationship to Head).
   - Provides member's individual email and contact number.
   - Creates `HouseholdMember` record and associated `Verification` with status `pending`.
   - "Same as Family Head" toggle auto-populates address, citizenship, and residency details.
2. **Member Account Activation:**
   - System dispatches invitation / activation notification.
   - Member accesses link, sets their own secure password, confirms profile, and verifies contact.
3. **Family Head Transfer:**
   - Family Head initiates transfer at `/household/transfer-head`.
   - Selects eligible verified household member.
   - Database transaction validates membership, removes current head flag, sets new member `is_family_head = true`, and updates `household.family_head_id`.
4. **Branching / Marriage Flow ([Workflow §11](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-workflow-state-machine-specification.md)):**
   - Existing member establishes a new household.
   - System preserves previous household membership history while initiating a new verified household workflow.

#### Backend & Route Architecture:
* `POST /household/members` -> `Household\HouseholdMemberController@store` (`household.members.store`)
* `PUT /household/members/{member}` -> `Household\HouseholdMemberController@update` (`household.members.update`)
* `DELETE /household/members/{member}` -> `Household\HouseholdMemberController@destroy` (`household.members.destroy`)
* `POST /household/transfer-head` -> `Household\HouseholdHeadTransferController@store` (`household.transfer-head`)

#### Files to Create:
- `[NEW]` `app/Http/Controllers/Household/HouseholdMemberController.php`
- `[NEW]` `app/Http/Controllers/Household/HouseholdHeadTransferController.php`
- `[NEW]` `app/Http/Requests/Household/StoreHouseholdMemberRequest.php`
- `[NEW]` `app/Http/Requests/Household/UpdateHouseholdMemberRequest.php`
- `[NEW]` `app/Http/Requests/Household/TransferHouseholdHeadRequest.php`
- `[NEW]` `resources/js/features/household/components/add-member-dialog.tsx`
- `[NEW]` `resources/js/features/household/components/member-list-table.tsx`
- `[NEW]` `resources/js/features/household/components/transfer-head-dialog.tsx`

---

### 3.5. Admin Verification & Management Portal (Filament PHP)

#### Architecture:
* **Filament Panel:** Hosted at `/admin` via `app/Providers/Filament/AdminPanelProvider.php`.
* **Guard & Role Access:** `User` implements `Filament\Models\Contracts\FilamentUser`. `canAccessPanel(Panel $panel): bool` permits users where `$user->isAdmin() || $user->isSubAdmin()`.
* **Policies:** Standard Laravel Policies mapped to Filament resources ensure Sub-admins cannot trigger Admin-only operations.

#### Filament Resources & Verification Actions:
1. **`HouseholdResource`:**
   - **Table Columns:** `household_code`, Family Head name, Purok/Sitio, Address, `status` badge (Warning for `unverified`, Success for `verified`, Danger for `rejected`/`restricted`, Info for `returned`), `submitted_at`.
   - **Filter:** Status filter (`unverified`, `verified`, `returned`, `rejected`, `restricted`), Purok/Sitio filter.
   - **View Page / Infolist:** Full household summary, list of registered household members, uploaded Government ID image preview (rendered via time-limited signed URL).
   - **Table / Header Actions:**
     - **Approve Action:** Sets status to `verified`, timestamps `verified_at`, updates polymorphic `Verification` record to `approved` with `reviewer_id`.
     - **Return for Correction Action:** Modal requiring `review_notes` (textarea). Updates status to `returned` and records notes for resident resubmission.
     - **Reject Action:** Modal requiring `review_notes` (textarea). Updates status to `rejected`.
     - **Restrict Household Action (Admin only):** Restricts household with mandatory reason.
2. **`HouseholdMemberResource` / Member Verification Table:**
   - Infolist for member demographics, relationship to head.
   - Actions to Approve, Return for Correction, or Reject individual member verifications.
3. **`ResidentProfileResource`:**
   - Directory listing of all resident profiles with voter status, civil status, and contact details.

#### Authorization Policies:
* `[NEW]` `app/Policies/HouseholdPolicy.php` (`viewAny`, `view`, `create`, `update`, `delete`, `verify`, `restrict`, `transferHead`)
* `[NEW]` `app/Policies/HouseholdMemberPolicy.php` (`viewAny`, `view`, `create`, `update`, `delete`, `verify`)
* `[NEW]` `app/Policies/ResidentProfilePolicy.php` (`viewAny`, `view`, `update`)
* `[NEW]` `app/Policies/VerificationPolicy.php` (`review`)

#### Files to Create / Modify:
- `[MODIFY]` [`app/Models/User.php`](file:///c:/Users/Paul/Projects/e-gov-lallana/app/Models/User.php) (Implement `FilamentUser` contract and `canAccessPanel()`)
- `[NEW]` `app/Providers/Filament/AdminPanelProvider.php`
- `[NEW]` `app/Filament/Resources/HouseholdResource.php`
- `[NEW]` `app/Filament/Resources/HouseholdResource/Pages/ListHouseholds.php`
- `[NEW]` `app/Filament/Resources/HouseholdResource/Pages/ViewHousehold.php`
- `[NEW]` `app/Filament/Resources/HouseholdMemberResource.php`
- `[NEW]` `app/Filament/Resources/ResidentProfileResource.php`

---

### 3.6. Minimal Resident Dashboard Update

#### Implementation:
* Update [`resources/js/pages/dashboard.tsx`](file:///c:/Users/Paul/Projects/e-gov-lallana/resources/js/pages/dashboard.tsx) to provide immediate feedback based on user state:
  - **Incomplete KYC:** Prominent banner advising user to complete their resident profile.
  - **Unregistered Household:** CTA to initiate Household Registration as Family Head.
  - **Pending Verification:** Status banner informing user that household review is underway.
  - **Verified Household:** Overview showing household code, purok, member count, and quick link to "My Household".
* Full analytics, demographic charts, and rich widgets remain deferred to Phase 5.

#### Files to Modify:
- `[MODIFY]` [`resources/js/pages/dashboard.tsx`](file:///c:/Users/Paul/Projects/e-gov-lallana/resources/js/pages/dashboard.tsx)
- `[NEW]` `app/Http/Controllers/DashboardController.php`

---

## 4. Verification & Testing Plan

### 4.1. Automated Feature Tests (Pest PHP 5)

Run via: `php artisan test --compact tests/Feature/Resident/ tests/Feature/Household/ tests/Feature/Filament/`

| Test File | Key Test Cases Covered |
| :--- | :--- |
| `tests/Feature/Resident/ResidentProfileTest.php` | • Resident can view and update own profile.<br>• Validates demographic fields, voter ID format, and age calculation.<br>• Uploads and associates government ID with `FileRecord`.<br>• Middleware redirects users with incomplete profiles. |
| `tests/Feature/Household/HouseholdRegistrationTest.php` | • Generates and dispatches OTP for registration.<br>• Enforces OTP verification before final submission.<br>• Generates sequential unique `household_code`.<br>• Enforces one household creation per user.<br>• Sets status to `unverified` and attaches `Verification`. |
| `tests/Feature/Household/HouseholdMemberTest.php` | • Family Head can add members.<br>• Non-head members are forbidden from adding members.<br>• Member verification record created as `pending`.<br>• Enforces single active household membership per resident. |
| `tests/Feature/Household/HouseholdHeadTransferTest.php` | • Family Head can transfer authority to another household member.<br>• Ensures exactly one active Family Head remains.<br>• Prevents transfer to non-household members. |
| `tests/Feature/Filament/HouseholdVerificationTest.php` | • Admin & Sub-admin can access `/admin` panel via `canAccessPanel()`.<br>• Resident users receive 403 Forbidden on `/admin`.<br>• Admin can approve household -> updates status to `verified`.<br>• Admin can return household -> requires mandatory review notes.<br>• Admin can reject household -> requires mandatory review notes. |
| `tests/Feature/Filament/HouseholdRestrictionTest.php` | • Admin can restrict a household.<br>• Sub-admin is forbidden from restricting households (403). |

### 4.2. Automated End-to-End Browser Tests (Playwright / Pest Browser)

Run via: `php artisan test tests/Browser/`

1. **`tests/Browser/HouseholdRegistrationJourneyTest.php`**:
   - Log in as new resident.
   - Fill out KYC profile and upload ID image.
   - Complete multi-step household registration wizard.
   - Enter mock OTP.
   - Verify redirect to status page with pending banner and locked modules.
2. **`tests/Browser/AdminHouseholdVerificationJourneyTest.php`**:
   - Log in as Barangay Administrator at `/admin`.
   - Open Filament HouseholdResource review page, inspect submitted data and preview ID.
   - Click "Approve", verify success notification and status badge change.
   - Log back in as resident and verify household modules are now unlocked.
3. **`tests/Browser/HouseholdMemberAndTransferJourneyTest.php`**:
   - Family Head opens household page and adds new member.
   - Family Head initiates and confirms Family Head transfer.
   - Verify UI reflects updated Family Head badge.

---

## 5. Execution Order & Implementation Roadmap

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. Database & Infrastructure Layer                                          │
│    ├── Run migration extending resident_profiles table                     │
│    ├── Update ResidentProfile and FileRecord models with relationships      │
│    └── Implement FileUploadService & storage helper                         │
│                                                                             │
│ 2. Resident Profile & KYC Implementation                                    │
│    ├── Build StoreResidentProfileRequest and UpdateResidentProfileRequest   │
│    ├── Implement ProfileController & ProfileAvatarController                │
│    ├── Implement EnsureProfileIsComplete middleware                         │
│    └── Build React profile view, edit, and ID upload dropzone               │
│                                                                             │
│ 3. Household Registration & State Machine                                   │
│    ├── Implement HouseholdCodeGenerator utility                             │
│    ├── Build RegisterHouseholdRequest with Turnstile & OTP rules            │
│    ├── Implement HouseholdRegistrationController & HouseholdController     │
│    └── Build multi-step React HouseholdWizard and LockedModuleCard UI       │
│                                                                             │
│ 4. Member Management & Family Head Authority                                │
│    ├── Implement HouseholdMemberController & HouseholdHeadTransferController│
│    ├── Enforce single-head and single-household constraints                 │
│    └── Build AddMemberDialog, MemberListTable, and TransferHeadDialog       │
│                                                                             │
│ 5. Filament Admin Panel & Verification Workflows                            │
│    ├── Implement FilamentUser & canAccessPanel() on User model              │
│    ├── Configure AdminPanelProvider at /admin                               │
│    ├── Define HouseholdPolicy, HouseholdMemberPolicy, VerificationPolicy    │
│    └── Build Filament HouseholdResource, MemberResource, and Actions       │
│                                                                             │
│ 6. Minimal Resident Dashboard Update                                        │
│    ├── Connect DashboardController with real user & household data          │
│    └── Update dashboard.tsx with verification alert banners & quick CTAs    │
│                                                                             │
│ 7. Verification & Code Quality Gate                                         │
│    ├── Run Pest feature and unit test suite (php artisan test --compact)    │
│    ├── Run Playwright browser journey tests                                 │
│    ├── Run type check (npm run types:check && composer types:check)         │
│    └── Format code with Laravel Pint and Prettier                           │
└─────────────────────────────────────────────────────────────────────────────┘
```
