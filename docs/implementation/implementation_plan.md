# E-Gov Lallana — Revised Implementation Roadmap

> Aligned with: [Implementation Blueprint](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-implementation-blueprint.md), [System Overview](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-system-overview.md), [Database Spec](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-database-data-model-specification.md), [Workflow State Machine Spec](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-workflow-state-machine-specification.md), [Technology Stack](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/stack/technology-stack.md), [Phase 1 Plan](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/phase-1-foundation-implementation-plan.md)

---

## Phase 1 — Foundation ✅ COMPLETED

Defined in: [phase-1-foundation-implementation-plan.md](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/phase-1-foundation-implementation-plan.md)

| Item | Status |
| :--- | :--- |
| Laravel 12 + React 19 + Inertia v3 + Tailwind v4 project setup | ✅ Done |
| Supabase PostgreSQL connection + migrations (12 domain models) | ✅ Done |
| Authentication via Laravel Fortify (login, register, password reset, email verify) | ✅ Done |
| Cloudflare Turnstile bot protection on public forms | ✅ Done |
| SMS service contracts (`SmsService` + `FakeSmsService` + Semaphore + TextBee) | ✅ Done |
| OTP service (`OtpService` — 6-digit, SHA-256, TTL, cooldown, attempt limits) | ✅ Done |
| Developer SMS Inbox simulator (`/dev/sms`) | ✅ Done |
| Base UI layout, violet theme, light/dark/system appearance | ✅ Done |
| Bilingual localization (English / Filipino via `lang/en/` + `lang/fil/`) | ✅ Done |
| Public landing page (hero, stats, services catalog, announcements, FAQ, contact form) | ✅ Done |
| User settings (profile, security/password, appearance) | ✅ Done |
| Database seeders (3 roles, 3 document types with JSON schemas, 3 announcements) | ✅ Done |
| Row Level Security (RLS) + `service_role_only` policies on all public tables | ✅ Done |
| Unified test suite (55 Pest + Playwright browser tests, `composer test:all`) | ✅ Done |
| Vercel serverless deployment (production + staging) | ✅ Done |

> [!NOTE]
> **Deviation from blueprint:** Hosting uses **Vercel** instead of the originally planned **Render.com**. The blueprint's cron-job.org keepalive is not needed on Vercel serverless.

---

## Phase 2 — Household & Resident Management ⬅️ NEXT

Defined in: [Blueprint §7–§14](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-implementation-blueprint.md), [Workflow §3–§11](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-workflow-state-machine-specification.md), [Data Model §3–§10](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-database-data-model-specification.md)

**Models already exist:** `ResidentProfile`, `Household`, `HouseholdMember`, `Verification`, `FileRecord`

### 2A. Resident Profile Completion (KYC)
| Item | Spec Reference |
| :--- | :--- |
| Multi-section resident profile form (demographics, voter status, civil status, occupation, PWD/Senior/Solo Parent, "same as Family Head" convenience options) | [System Overview §8](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-system-overview.md) |
| Government ID upload with strict MIME/size validation → Supabase Storage private bucket (`government-ids`) | [Blueprint §13, §26](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-implementation-blueprint.md) |
| Avatar upload via `FileRecord` | [Data Model §4](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-database-data-model-specification.md) |
| Profile completion gate middleware (redirect to complete profile before accessing protected services) | Blueprint §14 |

### 2B. Household Registration
| Item | Spec Reference |
| :--- | :--- |
| Multi-step registration wizard: household info → personal info → gov ID upload → OTP verify (SMS or Email choice) → submit | [Workflow §3](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-workflow-state-machine-specification.md) |
| OTP verification during registration via `OtpService` (SMS/Email channel choice) | [Workflow §12](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-workflow-state-machine-specification.md) |
| Auto-generate `household_code` (e.g., `HH-2026-0001`) | [Data Model §5](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-database-data-model-specification.md) |
| Household verification state machine: `Pending → Approved / Returned / Rejected` | [Workflow §4](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-workflow-state-machine-specification.md) |
| Locked-module UI for unverified households (visible but locked, with explanation) | [Blueprint §14, System Overview §11](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-system-overview.md) |

### 2C. Household Member Management
| Item | Spec Reference |
| :--- | :--- |
| Family Head adds member: enter info → provide email/contact → member activates own account → admin verification | [Workflow §6–§7](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-workflow-state-machine-specification.md) |
| Member verification state machine: `Pending → Approved / Returned / Rejected` | [Workflow §8](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-workflow-state-machine-specification.md) |
| Family Head transfer authority | [Workflow §10](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-workflow-state-machine-specification.md) |
| Enforce: one household per resident, one Family Head per household | [Data Model §6–§7](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-database-data-model-specification.md) |
| New household from existing member (marriage scenario) with admin review | [Workflow §11](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-workflow-state-machine-specification.md) |

### 2D. Admin Verification Interface (Minimum Viable)
| Item | Spec Reference |
| :--- | :--- |
| Admin/Sub-admin layout + sidebar navigation (needed to process verifications) | [Blueprint §30](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-implementation-blueprint.md) |
| `EnsureUserIsAdmin` middleware for `/admin/*` routes | [Blueprint §6](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-implementation-blueprint.md) |
| Household verification queue (approve/return/reject with required notes) | [Workflow §4](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-workflow-state-machine-specification.md) |
| Member verification queue | [Workflow §8](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-workflow-state-machine-specification.md) |
| Gov ID preview via signed URL (admin can view without downloading) | [Blueprint §26](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-implementation-blueprint.md) |
| Authorization policies (`HouseholdPolicy`, `VerificationPolicy`) | [Blueprint §39, Workflow §30](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-workflow-state-machine-specification.md) |

### Database additions needed:
- None — all tables exist. May need to add missing columns from the spec (e.g., `resident_profiles` extended fields like `educational_attainment`, `employment_status`, `residency_status`, `date_of_residency`, `senior_citizen_status`, `pwd_status`, `solo_parent_status`).

---

## Phase 3 — Document Requests

Defined in: [Blueprint §15–§22](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-implementation-blueprint.md), [Workflow §14–§22](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-workflow-state-machine-specification.md)

**Models already exist:** `DocumentType`, `DocumentRequest`, `DocumentRequestStatusHistory`

| Item | Spec Reference |
| :--- | :--- |
| Document request wizard: select type → dynamic form from `form_schema` JSON → gov ID upload → review → submit | [Workflow §14](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-workflow-state-machine-specification.md) |
| Auto-generate `reference_code` (e.g., `REQ-2026-0001`) | [Data Model §12](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-database-data-model-specification.md) |
| Request state machine: `Pending → Processing → On Hold / Returned / Rejected / Completed → Ready for Pickup` | [Workflow §15–§16](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-workflow-state-machine-specification.md) |
| State transition validation (centralized — reject illegal transitions) | [Workflow §31](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-workflow-state-machine-specification.md) |
| Status history audit trail (each transition → `DocumentRequestStatusHistory` with remarks + changed_by) | [Data Model §14](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-database-data-model-specification.md) |
| Resident cancellation with required reason (No longer needed / Wrong document / Duplicate / Incorrect info / Other) | [Workflow §20](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-workflow-state-machine-specification.md) |
| My requests page (resident view with status badges, reference codes) | Blueprint §15 |
| Public tracking page (search by reference code, no login required) | System Overview §15 |
| Admin document processing queue (filterable, sortable table with status transition actions) | Blueprint §18 |
| Fee display (₱ amount or Free, physical payment only — no online gateway) | [Workflow §21, System Overview §20](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-system-overview.md) |
| `DocumentRequestPolicy` authorization | Blueprint §39 |

### Database additions needed:
- `document_request_files` table (links requests to uploaded files) per [Data Model §16](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-database-data-model-specification.md)

---

## Phase 4 — Notifications & Dev Tools

Defined in: [Blueprint §23](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-implementation-blueprint.md), [Workflow §23, §35](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-workflow-state-machine-specification.md)

**Services already built:** `SmsManager`, `OtpService`, `FakeSmsService`, `SemaphoreSmsService`, `TextBeeSmsService`

| Item | Spec Reference |
| :--- | :--- |
| In-app notification center (bell icon, read/unread, linked to related entity) | [Data Model §19](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-database-data-model-specification.md) |
| Notification preferences (user chooses SMS or Email for external alerts) | [Data Model §20](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-database-data-model-specification.md) |
| Event-driven SMS/Email triggers per the notification matrix | [Workflow §35](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-workflow-state-machine-specification.md) |
| Queued dispatch (all SMS/email via `QUEUE_CONNECTION=database`) | [Blueprint §23](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-implementation-blueprint.md) |
| Transactional email via Resend | [Tech Stack §7](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/stack/technology-stack.md) |
| SMS audit log (already exists via `sms_messages` table) | ✅ Already built |

### Notification Matrix (from [Workflow §35](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-workflow-state-machine-specification.md)):

| Event | In-App | External (SMS/Email) |
| :--- | :--- | :--- |
| Household returned for correction | ✅ | ✅ |
| Household rejected | ✅ | ✅ |
| Member returned | ✅ | ✅ |
| Member rejected | ✅ | ✅ |
| Document returned for correction | ✅ | ✅ |
| Document rejected | ✅ | ✅ |
| Document completed / ready for pickup | ✅ | ✅ |
| All other status changes | In-app only | ❌ No external |

### Database additions needed:
- `notifications` table per [Data Model §19](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-database-data-model-specification.md)
- `notification_preferences` table per [Data Model §20](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-database-data-model-specification.md)

---

## Phase 5 — Administration

Defined in: [Blueprint §30, §39](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-implementation-blueprint.md), [System Overview §21, §26–§27](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-system-overview.md)

> [!NOTE]
> The minimum admin verification interface is built in Phase 2D. This phase expands it into the full admin portal.

| Item | Spec Reference |
| :--- | :--- |
| Admin dashboard KPIs: total residents, households, pending registrations, pending doc requests, ready for release, processing count, demographic summaries, active sub-admins (admin only) | [Blueprint §30, System Overview §26](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-system-overview.md) |
| Sub-admin account management (Admin-only: add, edit, delete sub-admins) | [System Overview §21](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-system-overview.md) |
| Searchable, sortable, paginated data tables (`@tanstack/react-table` v8) | [Blueprint §27](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-implementation-blueprint.md) |
| Resident directory with search (name, household ref, contact, email, residency, verification status) | [Data Model §32](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-database-data-model-specification.md) |
| Household restriction (Admin-only, with required reason) | [Workflow §28](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-workflow-state-machine-specification.md) |
| Archive workflow: Active → Archived → Permanent deletion (Admin-only) | [Workflow §29, Data Model §25–§26](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-database-data-model-specification.md) |
| Demographic reporting (sex distribution, age groups, civil status, education, employment, voter, senior/PWD/solo parent counts) | [Data Model §39](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-database-data-model-specification.md) |

---

## Phase 6 — Announcements

Defined in: [Blueprint §24](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-implementation-blueprint.md), [Workflow §25](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-workflow-state-machine-specification.md), [System Overview §24](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-system-overview.md)

**Model already exists:** `Announcement`

| Item | Spec Reference |
| :--- | :--- |
| Admin CRUD for announcements (create, edit, publish/unpublish, delete) | System Overview §24 |
| Tiptap rich-text editor (`@tiptap/react` with starter-kit, image, link, placeholder) | Blueprint §24 |
| Announcement images & attachments upload to Supabase Storage bucket (`announcement-attachments`) | [Blueprint §26, Data Model §22](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-database-data-model-specification.md) |
| Announcement types: Event, Meeting, Advisory, General | System Overview §24 |
| Public announcements archive page + single-view page | Blueprint §24 |
| Resident dashboard announcement feed | Blueprint §24 |
| `AnnouncementPolicy` authorization | Blueprint §39 |

### Database additions needed:
- `announcement_attachments` table per [Data Model §22](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-database-data-model-specification.md)

---

## Phase 7 — Reports, QR & PDF

Defined in: [Blueprint §25, §28–§29](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-implementation-blueprint.md), [Workflow §26–§27](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-workflow-state-machine-specification.md)

**Libraries already installed:** `spatie/laravel-pdf`, `dompdf/dompdf`, `simplesoftwareio/simple-qrcode`

| Item | Spec Reference |
| :--- | :--- |
| PDF export engine (DOMPDF default, Browsershot per-document if needed) | [Blueprint §28](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-implementation-blueprint.md) |
| PDF templates: individual resident info, household info, family members | [Data Model §37](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-database-data-model-specification.md) |
| RBI (Record of Barangay Inhabitants) report — provisional layout | [Blueprint §29](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-implementation-blueprint.md) |
| QR code generation with opaque token (`simplesoftwareio/simple-qrcode`) | [Blueprint §25](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-implementation-blueprint.md) |
| Protected QR camera scanner (`@zxing/browser`) for Admin/Sub-admin only | [Workflow §26](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-workflow-state-machine-specification.md) |
| QR error states (invalid, unauthorized, inactive) | [Workflow §27](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-workflow-state-machine-specification.md) |

### Database additions needed:
- `qr_identifiers` table per [Data Model §23](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-database-data-model-specification.md)

---

## Phase 8 — Hardening, E2E QA & Deployment

Defined in: [Blueprint §40, Workflow §36](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-workflow-state-machine-specification.md)

| Item | Spec Reference |
| :--- | :--- |
| Expanded Playwright E2E test suite (all 11 journey scenarios from Workflow §36) | [Workflow §36](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-workflow-state-machine-specification.md) |
| Security review (rate limiting on auth/OTP/doc requests, signed URLs, authorization audit) | [Blueprint §36](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-implementation-blueprint.md) |
| WCAG accessibility audit (semantic HTML, keyboard nav, focus states, contrast, screen-reader) | [Blueprint §32](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-implementation-blueprint.md) |
| Concurrency protection (conflicting admin operations, race conditions) | [Workflow §33](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-workflow-state-machine-specification.md) |
| Production deployment hardening on Vercel | Blueprint §42 (adapted) |

---

## Open Questions Before Starting Phase 2

> [!IMPORTANT]
> These need your input before implementation begins:

1. **Resident profile extended fields:** The [Data Model §4](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-database-data-model-specification.md) spec lists fields like `educational_attainment`, `employment_status`, `religion`, `date_of_residency`, `senior_citizen_status`, `pwd_status`, `solo_parent_status` — some of these are not in the current `resident_profiles` migration. Should we add them now via a new migration?

2. **File storage provider:** The blueprint specifies **Supabase Storage** (S3-compatible). Is your Supabase project set up with Storage buckets (`government-ids`, `verification-documents`, `announcement-attachments`), or do we need to create them?

3. **Resident dashboard:** Should the resident dashboard (replacing the current placeholder) be built as part of Phase 2, or kept minimal until Phase 5?

4. **Admin portal approach:** Should the admin portal use the same Inertia/React stack with a separate admin layout, or would you prefer a package like Filament?
