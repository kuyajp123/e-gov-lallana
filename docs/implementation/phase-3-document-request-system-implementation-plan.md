# Implementation Plan — Phase 3: Document Request System

**Document:** Phase 3 Implementation Plan  
**Target System:** Barangay Lallana E-Government Web-Based Information System  
**Stack:** Laravel 12 (PHP 8.4), React 19, Inertia.js v3, Tailwind CSS v4, Filament PHP (Admin Panel), Supabase PostgreSQL, Supabase Storage (S3-compatible), Pest PHP 5, Playwright  
**Reference Specs:**
* [`barangay-lallana-system-overview.md`](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-system-overview.md) — §15–§20 (Document Request Module, Processing, Cancellation, Fees, Pickup)
* [`barangay-lallana-implementation-blueprint.md`](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-implementation-blueprint.md) — §15–§22, §41 Phase 3
* [`barangay-lallana-database-data-model-specification.md`](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-database-data-model-specification.md) — §11–§16 (Document Types, Requests, Status History, Files)
* [`barangay-lallana-workflow-state-machine-specification.md`](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-workflow-state-machine-specification.md) — §14–§22 (Document Request State Machine, Processing, Cancellation, Fees)
* [`phase-2-household-and-resident-management-implementation-plan.md`](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/phase-2-household-and-resident-management-implementation-plan.md) (Preceding phase)

---

## 1. Overview & Key Architectural Decisions

Phase 3 implements the **Document Request System** — the primary service delivery module that allows verified residents to request official barangay documents (Clearance, Certificate, Certificate of Indigency, etc.), track their request status, and receive notification when documents are ready for physical pickup.

### Confirmed Architectural Decisions:

1. **Dynamic Form Schema:** Each `DocumentType` defines a JSONB `form_schema` column that describes the additional fields a resident must complete when requesting that document type. The React frontend dynamically renders form inputs based on this schema, eliminating the need for hardcoded forms per document type.

2. **Provisional Document Types (Client TBD):** The exact documents offered by Barangay Lallana have not been finalized by the client. Phase 3 will seed **3 provisional document types** (Barangay Clearance, Barangay Certificate, Certificate of Indigency) with reasonable default fields. The `DocumentType` model and admin management panel are designed so the client can add, modify, or deactivate document types without code changes.

3. **Sequential Reference Codes:** Each document request receives a unique sequential reference code (e.g., `REQ-2026-0001`) generated atomically, following the same pattern used for `household_code` in Phase 2.

4. **Status State Machine:** Document requests follow the state machine defined in [Workflow §15](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-workflow-state-machine-specification.md): `pending → processing → on_hold / returned / rejected / completed → ready_for_pickup`. Additionally, residents can `cancel` their own active requests at any time before completion.

5. **Household Verification Gate:** Only residents belonging to a **verified household** can submit document requests. Unverified household members see the document request module as a locked card explaining why access is restricted (reusing the `LockedModuleCard` component from Phase 2).

6. **Government ID Reuse:** The resident's government ID uploaded during KYC (Phase 2) is referenced automatically. If no ID is on file, the request form requires a fresh upload.

7. **Document Request Files Pivot:** A new `document_request_files` pivot table links document requests to uploaded files (government ID, supporting documents) via the existing `files` table.

8. **Admin Processing in Filament:** Admin/Sub-admin document processing is handled through a new `DocumentRequestResource` in Filament with action buttons for each status transition, mandatory notes on returns/rejections, and a full status history timeline.

9. **No Online Payment:** Fees are display-only. Payment is handled physically at the Barangay Hall. The system tracks `payment_status` (unpaid / paid / waived) as an admin-set field.

10. **No Document Download:** Completed documents are released via physical pickup only. The system notifies the resident when the document is ready for pickup.

---

## 2. Scope of Phase 3 Deliverables

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PHASE 3 DELIVERABLES                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. Schema Extensions & Seeder                                               │
│    ├── Migration: document_request_files pivot table                        │
│    ├── Migration: Add cancellation fields to document_requests              │
│    ├── Seeder: Provisional document types (Clearance, Certificate, etc.)    │
│    └── RLS policy for new tables                                            │
│                                                                             │
│ 2. Document Request Submission (Resident — Inertia + React)                 │
│    ├── Document selection page with type cards, descriptions, and fees      │
│    ├── Dynamic request form rendered from DocumentType.form_schema          │
│    ├── Government ID upload (reuse from profile or fresh upload)            │
│    ├── Purpose field and submission review step                             │
│    ├── Reference code generation service (REQ-YYYY-XXXX)                    │
│    └── Verified-household middleware gate                                    │
│                                                                             │
│ 3. Document Request Tracking (Resident — Inertia + React)                   │
│    ├── My Requests list page with status badges, filters, and pagination    │
│    ├── Request detail page with full status timeline                        │
│    ├── Cancellation dialog with reason selection                            │
│    ├── Correction & resubmission flow for returned requests                 │
│    └── Fee display (₱ amount or "Free / Libre")                             │
│                                                                             │
│ 4. Admin Document Processing (Filament PHP)                                 │
│    ├── DocumentRequestResource: table, view, and processing actions         │
│    │   ├── Action: Start Processing (pending → processing)                  │
│    │   ├── Action: Put On Hold (processing → on_hold, with note)            │
│    │   ├── Action: Resume Processing (on_hold → processing)                 │
│    │   ├── Action: Return for Correction (with mandatory notes)             │
│    │   ├── Action: Reject (with mandatory notes)                            │
│    │   ├── Action: Mark Completed (processing → completed)                  │
│    │   ├── Action: Mark Ready for Pickup (completed → ready_for_pickup)     │
│    │   └── Action: Update Payment Status (unpaid / paid / waived)           │
│    ├── DocumentTypeResource: CRUD management for document types             │
│    │   ├── Form schema builder (JSON editor for dynamic fields)             │
│    │   ├── Fee configuration (centavos)                                     │
│    │   └── Requirements list editor                                         │
│    ├── Status history timeline in request detail view                       │
│    ├── Government ID preview (signed URL from FileRecord)                   │
│    └── Authorization Policy: DocumentRequestPolicy                          │
│                                                                             │
│ 5. Sidebar Navigation Update                                                │
│    ├── Add "Document Requests" nav item to resident sidebar                 │
│    └── Add DocumentRequestResource and DocumentTypeResource to Filament nav │
│                                                                             │
│ 6. Automated Test Suite                                                     │
│    ├── Pest Feature Tests: Request CRUD, Status Transitions, Policies       │
│    └── Playwright E2E: Document Request & Admin Processing Journeys         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Component Plan

### 3.1. Schema Extensions & Data Seeding

#### New Migration: `document_request_files` Pivot Table

Per [Data Model §16](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-database-data-model-specification.md), a document request may have multiple associated uploaded files:

```text
document_request_files
├── id
├── document_request_id  (FK → document_requests.id)
├── file_id              (FK → files.id)
├── file_type            (string: 'government_id', 'supporting_document')
├── purpose              (nullable string: description of the file's purpose)
├── created_at
└── updated_at
```

#### Schema Update: Add Cancellation Fields to `document_requests`

The existing `document_requests` table needs two additional fields for cancellation tracking:

- `cancellation_reason` (nullable string: `no_longer_needed`, `wrong_document`, `duplicate_request`, `incorrect_information`, `other`)
- `cancellation_notes` (nullable text: required when reason is `other`)
- `cancelled_at` (nullable timestamp)

#### Provisional Document Type Seeder

Since the exact document list is **TBD** from the client, we seed 3 common Philippine barangay documents as provisional types:

| Document Type | Slug | Fee | Dynamic Form Fields |
| :--- | :--- | :--- | :--- |
| **Barangay Clearance** | `barangay-clearance` | ₱50.00 | `purpose` (text) |
| **Barangay Certificate** | `barangay-certificate` | ₱30.00 | `purpose` (text), `certificate_type` (select: residency, indigency, good_moral) |
| **Certificate of Indigency** | `certificate-of-indigency` | ₱0.00 (Free) | `purpose` (text), `requesting_agency` (text) |

Each document type's `form_schema` JSONB column stores an array of field definitions:

```json
[
  {
    "name": "purpose",
    "label": "Purpose of Request",
    "type": "text",
    "required": true,
    "placeholder": "e.g., Employment, Scholarship, Legal proceedings"
  },
  {
    "name": "requesting_agency",
    "label": "Requesting Agency / Organization",
    "type": "text",
    "required": false,
    "placeholder": "e.g., DSWD, DepEd, NBI"
  }
]
```

#### Files to Create / Modify:
- `[NEW]` `database/migrations/2026_09_XX_000001_create_document_request_files_table.php`
- `[NEW]` `database/migrations/2026_09_XX_000002_add_cancellation_fields_to_document_requests.php`
- `[NEW]` `database/seeders/DocumentTypeSeeder.php`
- `[MODIFY]` [`app/Models/DocumentRequest.php`](file:///c:/Users/Paul/Projects/e-gov-lallana/app/Models/DocumentRequest.php) — Add `files()` relationship, cancellation fields, status constants, and state transition validation methods
- `[NEW]` `app/Models/DocumentRequestFile.php` — Pivot model

---

### 3.2. Document Request Submission (Resident — Inertia + React)

#### Workflow ([Workflow §14](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-workflow-state-machine-specification.md)):

1. **Initiation:** Verified resident navigates to `/documents`.
2. **Step 1: Select Document Type:** Grid of available document type cards showing name, description, fee badge, and requirements list.
3. **Step 2: Complete Request Form:** Dynamic form fields rendered from `DocumentType.form_schema`. Includes:
   - Auto-generated dynamic fields from the schema
   - `purpose` text field (required)
   - Government ID upload (auto-populated from profile if already on file, or fresh upload required)
   - Supporting document upload (optional, depending on document type requirements)
4. **Step 3: Review & Submit:** Summary showing selected document, filled fields, uploaded files, and fee amount.
5. **Submission:**
   - Database transaction creates `DocumentRequest` with unique `reference_code` (e.g., `REQ-2026-0001`).
   - Associates uploaded files via `document_request_files` pivot.
   - Creates initial `DocumentRequestStatusHistory` entry with status `pending`.
   - Sets `submitted_at` timestamp.
6. **Post-Submission:** Redirects to request detail page showing reference code, status badge, and status timeline.

#### Access Control:
- Resident must be authenticated and email-verified.
- Resident profile must be complete (`EnsureProfileIsComplete` middleware).
- Resident must belong to a **verified household** (`EnsureHouseholdIsVerified` middleware).

#### Document Request State Machine ([Workflow §15](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-workflow-state-machine-specification.md)):

```
                    ┌───────────┐
                    │  pending   │◄──── Resident submits request
                    └─────┬─────┘
                          │ Admin starts processing
                          ▼
                    ┌────────────┐
             ┌──────│ processing │──────┐
             │      └─────┬──────┘      │
             │            │             │
             ▼            ▼             ▼
        ┌────────┐  ┌──────────┐  ┌──────────┐
        │on_hold │  │ returned │  │ rejected │
        └────┬───┘  └────┬─────┘  └──────────┘
             │           │
             │    Resident corrects
             │    & resubmits
             │           │
             └───────────┘
                    │
                    ▼
              ┌───────────┐
              │ completed  │
              └─────┬──────┘
                    │
                    ▼
           ┌──────────────────┐
           │ ready_for_pickup  │
           └──────────────────┘

  ───── At any active state (pending, processing, on_hold): ─────
                    │
                    ▼
              ┌───────────┐
              │ cancelled  │  ◄── Resident cancels with reason
              └───────────┘
```

#### Status Constants:

```php
class DocumentRequestStatus
{
    const PENDING = 'pending';
    const PROCESSING = 'processing';
    const ON_HOLD = 'on_hold';
    const RETURNED = 'returned';
    const REJECTED = 'rejected';
    const COMPLETED = 'completed';
    const READY_FOR_PICKUP = 'ready_for_pickup';
    const CANCELLED = 'cancelled';
}
```

#### Cancellation Reasons ([Workflow §20](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-workflow-state-machine-specification.md)):

```php
enum CancellationReason: string
{
    case NoLongerNeeded = 'no_longer_needed';
    case WrongDocument = 'wrong_document';
    case DuplicateRequest = 'duplicate_request';
    case IncorrectInformation = 'incorrect_information';
    case Other = 'other';
}
```

When `Other` is selected, `cancellation_notes` (free-text) is required.

#### Backend & Route Architecture:

* `GET /documents` → `Document\DocumentRequestController@index` (`documents.index`) — Lists user's requests + document type selection
* `GET /documents/create/{documentType}` → `Document\DocumentRequestController@create` (`documents.create`) — Dynamic form for selected type
* `POST /documents` → `Document\DocumentRequestController@store` (`documents.store`) — Submit new request
* `GET /documents/{documentRequest}` → `Document\DocumentRequestController@show` (`documents.show`) — Request detail with timeline
* `GET /documents/{documentRequest}/edit` → `Document\DocumentRequestController@edit` (`documents.edit`) — Edit returned request
* `PUT /documents/{documentRequest}` → `Document\DocumentRequestController@update` (`documents.update`) — Resubmit corrected request
* `POST /documents/{documentRequest}/cancel` → `Document\DocumentRequestController@cancel` (`documents.cancel`) — Cancel request

#### Files to Create:
- `[NEW]` `app/Http/Controllers/Document/DocumentRequestController.php`
- `[NEW]` `app/Http/Requests/Document/StoreDocumentRequestRequest.php`
- `[NEW]` `app/Http/Requests/Document/UpdateDocumentRequestRequest.php`
- `[NEW]` `app/Http/Requests/Document/CancelDocumentRequestRequest.php`
- `[NEW]` `app/Http/Middleware/EnsureHouseholdIsVerified.php`
- `[NEW]` `app/Services/Document/ReferenceCodeGenerator.php`
- `[NEW]` `app/Enums/DocumentRequestStatus.php`
- `[NEW]` `app/Enums/CancellationReason.php`
- `[NEW]` `app/Enums/PaymentStatus.php`
- `[NEW]` `resources/js/pages/documents/index.tsx` — Request list + document type selection cards
- `[NEW]` `resources/js/pages/documents/create.tsx` — Dynamic request form
- `[NEW]` `resources/js/pages/documents/show.tsx` — Request detail + status timeline
- `[NEW]` `resources/js/pages/documents/edit.tsx` — Edit returned request
- `[NEW]` `resources/js/features/documents/components/document-type-card.tsx`
- `[NEW]` `resources/js/features/documents/components/dynamic-form-renderer.tsx` — Renders form fields from `form_schema` JSONB
- `[NEW]` `resources/js/features/documents/components/status-timeline.tsx`
- `[NEW]` `resources/js/features/documents/components/cancel-request-dialog.tsx`
- `[NEW]` `resources/js/features/documents/components/request-summary-card.tsx`

---

### 3.3. Admin Document Processing (Filament PHP)

#### DocumentRequestResource:

1. **Table Columns:** `reference_code`, Resident name, Document type, `current_status` badge (colored per state), `fee_cents` formatted, `payment_status` badge, `submitted_at`, `completed_at`.
2. **Filters:** Status filter (multi-select), Document type filter, Payment status filter, Date range filter.
3. **Search:** Searchable by `reference_code`, resident name, and document type name.
4. **View Page / Infolist:**
   - Request summary: reference code, document type, fee, payment status.
   - Resident information: name, household code, contact details.
   - Submitted form data rendered from `submitted_data` JSONB.
   - Uploaded files section with Government ID preview (signed URL) and supporting documents.
   - Status history timeline showing all transitions with timestamps, actors, and remarks.
   - Admin notes field.
5. **Table / Header Actions:**
   - **Start Processing:** `pending → processing`. Requires confirmation.
   - **Put On Hold:** `processing → on_hold`. Modal with mandatory reason/note.
   - **Resume Processing:** `on_hold → processing`. Requires confirmation.
   - **Return for Correction:** `processing → returned`. Modal with mandatory `remarks` textarea explaining what the resident must fix.
   - **Reject:** `processing / pending → rejected`. Modal with mandatory `remarks` textarea.
   - **Mark Completed:** `processing → completed`. Optional admin notes.
   - **Mark Ready for Pickup:** `completed → ready_for_pickup`. Requires confirmation.
   - **Update Payment Status:** Dropdown action to set `unpaid` / `paid` / `waived`.

Every status transition creates a `DocumentRequestStatusHistory` record with the admin's `user_id`, the new status, remarks, and timestamp.

#### DocumentTypeResource:

1. **Table Columns:** `name`, `slug`, `fee_cents` formatted, `is_active` toggle, request count.
2. **Form:**
   - Name, slug (auto-generated from name), description (textarea).
   - Fee in centavos (numeric input with peso display preview).
   - Requirements list (repeater / key-value entries).
   - Form schema (JSON editor or repeater with field name, label, type, required, placeholder).
   - Active toggle.
3. **Authorization:** Admin-only. Sub-admins can view but not create/edit/delete document types.

#### Authorization Policy:

```php
// DocumentRequestPolicy
viewAny()     → Admin, Sub-admin
view()        → Admin, Sub-admin, or request owner (resident)
create()      → Resident with verified household
update()      → Request owner (only when status === 'returned')
cancel()      → Request owner (only when status in ['pending', 'processing', 'on_hold'])
process()     → Admin, Sub-admin
delete()      → Admin only (archived requests)

// DocumentTypePolicy
viewAny()     → Admin, Sub-admin
view()        → Admin, Sub-admin
create()      → Admin only
update()      → Admin only
delete()      → Admin only
```

#### Files to Create:
- `[NEW]` `app/Policies/DocumentRequestPolicy.php`
- `[NEW]` `app/Policies/DocumentTypePolicy.php`
- `[NEW]` `app/Filament/Resources/DocumentRequests/DocumentRequestResource.php`
- `[NEW]` `app/Filament/Resources/DocumentRequests/Pages/ListDocumentRequests.php`
- `[NEW]` `app/Filament/Resources/DocumentRequests/Pages/ViewDocumentRequest.php`
- `[NEW]` `app/Filament/Resources/DocumentRequests/Tables/DocumentRequestsTable.php`
- `[NEW]` `app/Filament/Resources/DocumentRequests/Schemas/DocumentRequestInfolist.php`
- `[NEW]` `app/Filament/Resources/DocumentTypes/DocumentTypeResource.php`
- `[NEW]` `app/Filament/Resources/DocumentTypes/Pages/ListDocumentTypes.php`
- `[NEW]` `app/Filament/Resources/DocumentTypes/Pages/CreateDocumentType.php`
- `[NEW]` `app/Filament/Resources/DocumentTypes/Pages/EditDocumentType.php`
- `[NEW]` `app/Filament/Resources/DocumentTypes/Tables/DocumentTypesTable.php`
- `[NEW]` `app/Filament/Resources/DocumentTypes/Schemas/DocumentTypeForm.php`

---

### 3.4. Sidebar Navigation & Dashboard Update

#### Resident Sidebar:
Add "Document Requests" navigation item to [`app-sidebar.tsx`](file:///c:/Users/Paul/Projects/e-gov-lallana/resources/js/app/components/app-sidebar.tsx):

```tsx
{
    title: 'Document Requests',
    href: '/documents',
    icon: FileText,
}
```

#### Resident Dashboard:
Update [`dashboard.tsx`](file:///c:/Users/Paul/Projects/e-gov-lallana/resources/js/pages/dashboard.tsx) to show:
- **For verified households:** Quick stats card showing active request count and most recent request status.
- **For unverified households:** Locked `LockedModuleCard` explaining that document requests require a verified household.

#### Files to Modify:
- `[MODIFY]` [`resources/js/app/components/app-sidebar.tsx`](file:///c:/Users/Paul/Projects/e-gov-lallana/resources/js/app/components/app-sidebar.tsx) — Add Document Requests nav item
- `[MODIFY]` [`resources/js/pages/dashboard.tsx`](file:///c:/Users/Paul/Projects/e-gov-lallana/resources/js/pages/dashboard.tsx) — Add document request stats card
- `[MODIFY]` [`app/Http/Controllers/DashboardController.php`](file:///c:/Users/Paul/Projects/e-gov-lallana/app/Http/Controllers/DashboardController.php) — Pass document request stats to frontend

---

## 4. Verification & Testing Plan

### 4.1. Automated Feature Tests (Pest PHP 5)

Run via: `php artisan test --compact tests/Feature/Document/ tests/Feature/Filament/DocumentRequest/`

| Test File | Key Test Cases Covered |
| :--- | :--- |
| `tests/Feature/Document/DocumentRequestSubmissionTest.php` | • Verified resident can view available document types.&NewLine;• Resident can submit a request with dynamic form data.&NewLine;• Sequential reference code generated (REQ-YYYY-XXXX).&NewLine;• Creates initial status history entry as `pending`.&NewLine;• Associates uploaded government ID via pivot.&NewLine;• Unverified household residents receive 403 Forbidden.&NewLine;• Unauthenticated users receive 302 redirect. |
| `tests/Feature/Document/DocumentRequestTrackingTest.php` | • Resident can view their own request detail with status timeline.&NewLine;• Resident cannot view another resident's request (403).&NewLine;• Status timeline displays all historical transitions. |
| `tests/Feature/Document/DocumentRequestCancellationTest.php` | • Resident can cancel own pending/processing/on_hold request.&NewLine;• Cancellation requires a valid reason.&NewLine;• `Other` reason requires cancellation_notes.&NewLine;• Cannot cancel completed/rejected/ready_for_pickup requests.&NewLine;• Cancellation creates status history entry. |
| `tests/Feature/Document/DocumentRequestCorrectionTest.php` | • Resident can edit and resubmit a returned request.&NewLine;• Resubmission transitions status back to `pending`.&NewLine;• Cannot edit requests in other statuses. |
| `tests/Feature/Filament/DocumentRequestProcessingTest.php` | • Admin/Sub-admin can access DocumentRequestResource.&NewLine;• Residents receive 403 on admin document processing.&NewLine;• Admin can transition: pending → processing → completed → ready_for_pickup.&NewLine;• Return for correction requires mandatory remarks.&NewLine;• Rejection requires mandatory remarks.&NewLine;• On Hold requires mandatory reason note.&NewLine;• Each transition creates status history record. |
| `tests/Feature/Filament/DocumentTypeManagementTest.php` | • Admin can create, edit, and deactivate document types.&NewLine;• Sub-admin cannot create/edit document types (403).&NewLine;• Deactivated document types are not shown to residents. |

### 4.2. Automated End-to-End Browser Tests (Playwright / Pest Browser)

Run via: `php artisan test tests/Browser/`

1. **`tests/Browser/DocumentRequestSubmissionJourneyTest.php`:**
   - Log in as verified resident.
   - Navigate to `/documents`, select "Barangay Clearance".
   - Fill out dynamic form fields (purpose), verify fee display.
   - Submit request, verify redirect to detail page with reference code and `Pending` badge.

2. **`tests/Browser/DocumentRequestProcessingJourneyTest.php`:**
   - Log in as Admin at `/admin`.
   - Open DocumentRequestResource, find pending request.
   - Click "Start Processing", verify status badge changes to `Processing`.
   - Click "Mark Completed", verify status changes to `Completed`.
   - Click "Ready for Pickup", verify final status badge.
   - Log back in as resident, verify request detail shows `Ready for Pickup` with full timeline.

3. **`tests/Browser/DocumentRequestCancellationJourneyTest.php`:**
   - Log in as resident with a pending request.
   - Open request detail, click "Cancel Request".
   - Select "No longer needed" reason, confirm cancellation.
   - Verify status badge changes to `Cancelled`.

---

## 5. Execution Order & Implementation Roadmap

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. Database & Infrastructure Layer                                          │
│    ├── Create document_request_files migration                              │
│    ├── Create cancellation fields migration for document_requests           │
│    ├── Create DocumentRequestFile model                                     │
│    ├── Create Enums: DocumentRequestStatus, CancellationReason, PaymentStatus│
│    ├── Update DocumentRequest model with relationships and state methods    │
│    ├── Create ReferenceCodeGenerator service                                │
│    ├── Create DocumentTypeSeeder with 3 provisional types                   │
│    └── Enable RLS on new tables                                             │
│                                                                             │
│ 2. Resident Document Request Submission                                     │
│    ├── Create EnsureHouseholdIsVerified middleware                           │
│    ├── Build StoreDocumentRequestRequest validation                         │
│    ├── Build CancelDocumentRequestRequest validation                        │
│    ├── Implement DocumentRequestController (index, create, store, show)     │
│    ├── Build React document type selection page (index.tsx)                 │
│    ├── Build dynamic form renderer component (dynamic-form-renderer.tsx)    │
│    ├── Build request creation page (create.tsx)                             │
│    └── Build request detail page with timeline (show.tsx)                   │
│                                                                             │
│ 3. Resident Request Tracking & Cancellation                                 │
│    ├── Implement cancel action in DocumentRequestController                 │
│    ├── Implement edit/update for returned requests                          │
│    ├── Build cancel request dialog component                                │
│    ├── Build status timeline component                                      │
│    └── Build request edit page for corrections (edit.tsx)                   │
│                                                                             │
│ 4. Filament Admin Document Processing                                       │
│    ├── Create DocumentRequestPolicy and DocumentTypePolicy                 │
│    ├── Build DocumentRequestResource with table, view, and status actions  │
│    ├── Build DocumentTypeResource with CRUD and form schema editor          │
│    ├── Implement status transition actions with mandatory notes             │
│    └── Build status history timeline infolist component                     │
│                                                                             │
│ 5. Navigation & Dashboard Integration                                       │
│    ├── Add "Document Requests" to resident sidebar                          │
│    ├── Update DashboardController with request stats                        │
│    └── Update dashboard.tsx with request stats card / locked module          │
│                                                                             │
│ 6. Verification & Code Quality Gate                                         │
│    ├── Run Pest feature test suite (php artisan test --compact)             │
│    ├── Run Playwright browser journey tests                                 │
│    ├── Run type check (npm run types:check && vendor/bin/phpstan analyse)   │
│    └── Format code with Laravel Pint and Prettier                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Dependencies & Prerequisites

### From Phase 2 (Already Completed):
- ✅ Resident profile KYC with government ID upload
- ✅ Household registration and verification workflows
- ✅ Filament Admin Panel at `/admin` with role-based access
- ✅ `FileUploadService` with multi-bucket storage support
- ✅ `EnsureProfileIsComplete` middleware
- ✅ `Verification` polymorphic model and admin review actions
- ✅ `LockedModuleCard` component for unverified households

### From Phase 1 (Already Completed):
- ✅ Authentication (Fortify + Turnstile)
- ✅ SMS service contracts and OTP service
- ✅ Base UI layout, theme, and component library
- ✅ Database schema for `document_types`, `document_requests`, `document_request_status_history`

### External (Client-Dependent — TBD):
- ⏳ Final list of barangay documents and their required fields
- ⏳ Official fee schedule per document type
- ⏳ Document-specific processing requirements or SLAs

> **Note:** Phase 3 uses provisional document types. When the client provides the final document list and fields, an Admin can configure them directly through the Filament DocumentType management panel without code changes.
