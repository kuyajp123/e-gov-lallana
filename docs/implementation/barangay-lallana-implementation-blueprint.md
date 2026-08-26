# Barangay Lallana E-Government Web-Based Information System
## Implementation Blueprint

**Document status:** Initial implementation documentation  
**Scope basis:** Agreed functional requirements and revisions from the project discussion.

---

## 1. Purpose

This document translates the agreed functional scope into an implementation-oriented blueprint.

It defines the recommended technical organization, application modules, user roles, major workflows, domain boundaries, security requirements, testing strategy, and implementation phases.

Client-dependent requirements that are not yet available are intentionally marked as **TBD** and should not block implementation of already-defined functionality.

---

## 2. Application Architecture

The system consists of three primary application areas:

```text
Public Landing Page
        │
        ├── Public Announcements
        ├── Barangay Information
        ├── Services
        └── Contact

Authenticated Application
        │
        ├── Resident / Household Area
        │
        └── Barangay Administration Area
                ├── Admin
                └── Sub-admin
```

The architecture should separate:

- Public functionality
- Resident functionality
- Administrative functionality
- Authentication and authorization
- Business logic
- Data access
- File management
- Notifications
- PDF generation
- Reporting

---

## 3. Recommended Application Layers

```text
Presentation Layer
        ↓
Application / Use-Case Layer
        ↓
Domain / Business Logic
        ↓
Data Access Layer
        ↓
Database / External Services
```

### Presentation Layer

Responsible for:

- Pages
- Layouts
- Forms
- Tables
- Modals
- Status displays
- Responsive UI
- Accessibility

### Application Layer

Responsible for:

- Registration workflows
- Member activation
- Household verification
- Member verification
- Document request processing
- Announcement management
- Report generation
- Administrative operations

### Domain Layer

Responsible for rules such as:

- One household per user
- Family Head authority
- Member verification
- Household verification
- Document status transitions
- Admin/Sub-admin permissions
- Archive rules

### Data Access Layer

Responsible for:

- Database queries
- Transactions
- Persistence
- Filtering
- Pagination
- Sorting
- File metadata

---

## 4. Feature Modules

The application should be organized around feature/domain modules rather than one large shared feature directory.

Recommended modules:

```text
features/
├── authentication/
├── households/
├── residents/
├── household-members/
├── verification/
├── document-requests/
├── announcements/
├── notifications/
├── qr/
├── reports/
├── files/
├── administration/
└── settings/
```

Shared infrastructure should remain separate:

```text
shared/
├── ui/
├── validation/
├── utilities/
├── constants/
└── types/
```

The exact framework-specific structure can be finalized during implementation.

---

## 5. User Roles

### Resident

A resident is an individual household member with their own account.

Capabilities:

- View own account
- View applicable household information
- Request own documents
- Track own document requests
- Receive notifications
- View announcements

### Family Head

Family Head is a resident with additional household permissions.

Additional capabilities:

- Create household
- Add members
- Edit member information
- Remove members
- Manage household information
- Transfer Family Head authority

### Admin

Admin has full administrative access.

Capabilities include:

- Household verification
- Member verification
- Document processing
- Household restriction
- Archiving
- Permanent deletion of archived records
- Sub-admin management
- Announcement management
- Administrative dashboard
- Reports
- Protected QR scanning

### Sub-admin

Sub-admin is an operational administrative role.

Capabilities include:

- Household verification
- Member verification
- Document processing
- Announcement management
- Administrative dashboard
- Protected QR scanning

Sub-admin cannot manage other sub-admin accounts or perform Admin-only operations.

---

## 6. Authentication and Authorization

Authentication determines whether a user has successfully signed in.

Authorization determines whether the authenticated user may perform an operation.

Authorization must consider:

- User role
- Household membership
- Family Head status
- Account status
- Household verification status
- Administrative permissions

Protected routes and server-side authorization must be implemented. Client-side UI hiding alone is not sufficient.

---

## 7. Household Creation Workflow

```text
Family Head
    ↓
Create Household
    ↓
Enter household and personal information
    ↓
Upload government ID
    ↓
Verify email/SMS
    ↓
Submit
    ↓
Pending Admin/Sub-admin Verification
    ↓
Approve / Return / Reject
```

### Approve

The household becomes verified and protected household services become available.

### Return

The creator sees the reason, edits the requested information, and resubmits.

### Reject

The rejected submission remains available as historical information. The creator may create another household registration.

---

## 8. Household Member Creation Workflow

A Family Head may create a member immediately after household creation or later.

```text
Family Head
    ↓
Create Member
    ↓
Enter member information
    ↓
Provide member email/contact
    ↓
Member activates account
    ↓
Member completes/confirms verification information
    ↓
Admin/Sub-admin Review
    ↓
Approve / Return / Reject
```

The Family Head may provide the member information directly.

The member must still activate their own account and undergo administrative verification.

A member must not become an active verified household member solely because the Family Head created the record.

There is no fixed maximum number of household members.

---

## 9. Household and Member Verification

Verification is an administrative workflow.

```text
Pending
 ├── Approve
 ├── Return for Correction
 └── Reject
```

The same principle applies to:

- Household registration
- Newly added household members

Each decision requires an appropriate reason/note.

---

## 10. Resident Profile Module

Resident profiles should be modeled independently from household records while maintaining their household relationship.

Core profile fields include:

- Full name
- Sex
- Birthdate
- Age
- Civil status
- Address
- Contact number
- Email
- Occupation
- Employment status
- Educational attainment
- Voter status
- Citizenship
- Religion
- Government ID
- Relationship to household head
- Residency status
- Date of residency
- Senior Citizen status
- PWD status
- Solo Parent status

Optional fields should be nullable rather than represented by placeholder values.

---

## 11. Household Relationship Model

Conceptually:

```text
Household
    │
    └── Members
          ├── Family Head
          ├── Member
          ├── Member
          └── Member
```

Each member belongs to one household.

A household must have one active Family Head.

Family Head transfer updates the relationship rather than creating a duplicate household membership.

---

## 12. Account Verification

The system supports:

- SMS verification
- Email verification

The user chooses the preferred verification method.

This verifies account/contact ownership but does not replace barangay verification.

---

## 13. Government ID Handling

A valid government-issued ID is required during:

1. New household registration
2. Document requests
3. Applicable resident/member verification

The system does not automatically determine whether an ID is genuine or identify the ID type.

The system will not implement:

- PhilSys API verification
- eGov API verification
- SheerID
- Automatic ID type recognition
- OCR-based ID identification
- External ID validation libraries

The system performs technical upload validation only.

The authorized Admin/Sub-admin manually determines whether the submitted ID is acceptable.

---

## 14. Unverified Household Access

An unverified household can access:

- Public landing page
- Public announcements
- Account verification status
- Submitted information

Protected modules remain visible but locked.

Examples:

- Document Request
- Household Management
- Other protected services

Locked modules should explain why the feature is unavailable.

---

## 15. Document Request Module

Each resident can request documents for themselves.

A request references:

- Requesting resident
- Household
- Document type
- Required request information
- Government ID upload
- Processing status
- Applicable fee
- Administrative notes

Basic flow:

```text
Resident
   ↓
Select document
   ↓
Complete required information
   ↓
Upload government ID
   ↓
Submit request
   ↓
Admin/Sub-admin processing
   ↓
Status tracking
   ↓
Final outcome
```

---

## 16. Document Type Configuration

The exact documents offered by Barangay Lallana are still **TBD**.

The final implementation should allow each document type to define its required request information.

Conceptually:

```text
Document Type
    ↓
Required Fields
    ↓
Resident Request Form
```

The actual list of documents and fields will follow the barangay's final requirements.

---

## 17. Document Processing Status

The request should support statuses including:

- Pending
- Processing
- On Hold
- Returned for Correction
- Completed
- Ready for Pickup
- Rejected
- Cancelled
- Other Admin-defined processing statuses where necessary

Users can see the status of their own requests.

The system does not require real-time status synchronization.

---

## 18. Document Processing Workflow

```text
Resident submits request
        ↓
Pending
        ↓
Admin/Sub-admin processing
        ↓
Processing / On Hold / other internal status
        ↓
Final outcome
        ├── Rejected
        ├── Returned for Correction
        └── Completed / Ready for Pickup
```

Status changes are stored in the system and displayed to the resident.

---

## 19. Document Notifications

External notifications are event-based rather than sent for every status change.

Notification-triggering outcomes include:

- Rejected
- Returned for Correction
- Completed / Ready for Pickup

The resident chooses:

- SMS
- Email

Relevant final/action-required outcomes also appear as in-app notifications.

Intermediate statuses do not automatically trigger external notifications.

---

## 20. Document Cancellation

Residents can cancel their own document requests.

Cancellation requires a reason.

Possible choices include:

- No longer needed
- Wrong document
- Duplicate request
- Incorrect information
- Other

If `Other` is selected, a manual reason is required.

Cancellation must not destroy the request record.

---

## 21. Document Fees

There is no online payment gateway.

The document may have an optional fee.

```text
Fee defined → Display defined amount
Fee not defined → Display ₱0
```

Payment is handled physically at the barangay.

---

## 22. Document Pickup

The system uses a pickup-only document release process.

```text
Request Completed
       ↓
Ready for Pickup
       ↓
Resident receives notification
       ↓
Resident visits Barangay Hall
```

Residents cannot download completed government documents from the system.

---

## 23. Notification & SMS Architecture

Notifications use a decoupled, provider-agnostic notification architecture.

```text
                        BARANGAY LALLANA
                         Laravel Backend
                                │
             ┌──────────────────┴──────────────────┐
             │                                     │
             ▼                                     ▼
        OtpService                         NotificationService
             │                                     │
             └──────────────────┬──────────────────┘
                                │
                                ▼
                           SmsService
                         << interface >>
                                │
             ┌──────────────────┼──────────────────┐
             │                  │                  │
             ▼                  ▼                  ▼
       FakeSmsService    TextBeeSmsService   SemaphoreSmsService
             │                  │                  │
             ▼                  ▼                  ▼
       Dev SMS Inbox      Android + SIM       Semaphore API
        (/dev/sms)        (TextBee Gateway)   (Scale Adapter)
             │                  │                  │
             ▼                  ▼                  ▼
          💻 Dev             📱 Real SMS         📱 Real SMS
```

And for email:

```text
NotificationService
        ↓
EmailService (Resend via Laravel built-in resend mail driver)
```

### Core Architecture Rules:
1. **`OtpService` owns OTP security:** Generation, cryptographic/hash storage, TTL expiration (e.g. 5 minutes), maximum attempt limits, and resend cooldowns live in `OtpService`. The SMS service only handles message transport.
2. **`SmsService` Interface:**
   - **Local Dev / Pest Tests:** `FakeSmsService` stores SMS in database/cache, renders in Developer SMS Inbox (`/dev/sms`), and supports status simulation (`SUCCESS`, `FAILURE`, `TIMEOUT`, `RATE_LIMITED`).
   - **Production (Primary):** `TextBeeSmsService` sends SMS via the client's Android phone gateway running the TextBee app.
   - **Future / Scale Adapter:** `SemaphoreSmsService` can be activated by changing `SMS_PROVIDER=semaphore` in `.env`.
3. **Queued Dispatches:** All outgoing SMS and email notifications are queued (`QUEUE_CONNECTION=database` on PostgreSQL) so web requests return immediately without waiting on external mobile network or API handshakes.
4. **Audit Logging:** Every SMS dispatch attempt is recorded in an `sms_messages` table for delivery tracking without exposing plaintext OTP secrets in production logs.

Only explicitly configured final/action-required events generate external messages.

---

## 24. Announcement Module

Announcements include:

- Title
- Description
- Rich-text content
- Type (Event, Meeting, Advisory, General)
- Images
- Attachments
- Links
- Publication state
- Publication timestamps

Tiptap (`@tiptap/react` with starter-kit, image, link, and placeholder extensions) is used as the rich-text editor.

Announcements appear on:

- Public landing page
- Resident dashboard

Admin and Sub-admin can create and publish announcements.

---

## 25. QR Code Architecture

The QR code should not contain complete sensitive resident information.

```text
QR Code (Opaque Token)
       ↓
Authenticated Admin/Sub-admin Camera Scanner (@zxing/browser)
       ↓
Server Authorization Check
       ↓
Server-side Lookup (qr_identifiers table)
       ↓
Authorized Resident / Household Information
```

- **Backend Generation:** `simplesoftwareio/simple-qrcode` generates standard SVG/PNG QR tokens representing unique, unguessable identifiers.
- **Frontend Scanner:** `@zxing/browser` provides device camera scanning inside the authenticated Admin/Sub-admin interface.
- Unauthenticated users cannot access the scanner or the lookup endpoint.

---

## 26. File Management

File storage is powered by **Supabase Storage** (S3-compatible object storage via `league/flysystem-aws-s3-v3`).

Supported uploads include:

- Government ID images (stored in private bucket `government-ids`)
- Supporting verification documents (stored in private bucket `verification-documents`)
- Announcement images and attachments (stored in bucket `announcement-attachments`)

The file subsystem handles:

- File type and strict MIME validation
- File size limits
- Automatic image compression and optimization (via `intervention/image-laravel`)
- Time-limited signed URL generation (`Storage::temporaryUrl()`) for secure admin document previewing
- Download authorization checks

Administrators can preview uploaded files safely without permanent local downloads. Malware scanning is outside the current scope.

---

## 27. Search, Filtering, Sorting, and Pagination

Important administrative tables must support:

- Search across indexed columns
- Advanced filter criteria (status, date ranges, residency type)
- Multi-column sorting
- Server-side pagination

Implementation uses **TanStack Table v8** (`@tanstack/react-table`) on the React frontend paired with Laravel Eloquent query scopes on the backend to keep data transfers efficient.

---

## 28. PDF Generation

PDF generation is centralized using **`spatie/laravel-pdf`**:

- **Default Driver:** DOMPDF (`dompdf/dompdf`) — lightweight, PHP-native, zero server binary overhead.
- **Advanced Driver:** Browsershot (Chromium) can be specified per-document when complex CSS Grid or modern Tailwind rendering is strictly needed.

Potential outputs include:

- Individual resident information
- Household information
- Family member information
- RBI (Record of Barangay Inhabitants) reports
- Administrative summary reports

Only PDF export is currently required. Completed official documents are released physically at the Barangay Hall.

---

## 29. RBI Reporting

A reasonable household-oriented RBI structure will be implemented initially.

The final RBI format is not a development blocker.

The report should be designed so its layout and fields can be modified later when Barangay Lallana provides its preferred format.

---

## 30. Administrative Dashboard

Admin and Sub-admin dashboards display:

- Total residents
- Total households
- Pending registrations
- Pending document requests
- Documents ready for release
- Number of processing documents
- Demographic summaries

Admin additionally sees the number of sub-admins.

---

## 31. Archive and Deletion

Important records should normally use logical removal/archive states.

Conceptually:

```text
Active
  ↓
Archived
  ↓
Permanent deletion by Admin
```

Admin-only permanent deletion may be provided for archived records where applicable.

---

## 32. Responsive and Accessible UI

The system supports:

- Desktop
- Laptop
- Tablet
- Mobile

Accessibility should include:

- Semantic HTML
- Keyboard navigation
- Accessible labels
- Visible focus states
- Accessible error messages
- Appropriate contrast
- Screen-reader-friendly structures
- Responsive layouts

---

## 33. Localization

The system supports:

- English
- Filipino (Taglish supported where direct translation of technical/administrative terms would be awkward)

**Architecture:** Laravel PHP localization files (`lang/en/` and `lang/fil/`) serve as the single source of truth. Strings are passed to React components via Inertia shared props (`HandleInertiaRequests::share()`) avoiding extra client-side translation runtime overhead.

---

## 34. UI/UX Direction

Primary brand color:

**Violet**

Design principles:

- Clean
- Intuitive
- Minimal cognitive effort
- Consistent
- Responsive (Desktop, Laptop, Tablet, Mobile)
- Accessible (WCAG-compliant contrast, keyboard navigation, Radix UI primitives)

---

## 35. Data Validation

### Client-side validation

Built with **React Hook Form + Zod**:

- Immediate user feedback
- Required fields
- Format rules (email, Philippine mobile numbers)
- File selection constraints

### Server-side validation

Built with **Laravel Form Requests**:

- Authoritative security boundary
- Business rule enforcement
- Database uniqueness and state checks
- Strict MIME and file payload verification

Client-side validation is never treated as a security boundary.

---

## 36. Security Implementation

The application enforces defense-in-depth protections:

- **Authentication:** Laravel Fortify backend (passwords hashed with bcrypt/Argon2)
- **Authorization:** Laravel Gate & Policy authorization rules checked server-side
- **Bot Protection:** **Cloudflare Turnstile** integrated into public registration and login forms
- **Private File Protection:** Stored in private Supabase Storage buckets with short-lived signed URLs (`Storage::temporaryUrl()`)
- **Rate Limiting:** Throttle middleware applied to auth endpoints, OTP verification, and document requests
- **Safe Database Queries:** Eloquent ORM parameter binding preventing SQL injection
- **Input Sanitization:** Server-side sanitization on all text inputs and rich text HTML

---

## 37. Database Design Direction

The database uses **Supabase PostgreSQL** (`search_path=laravel`, port 5432 session pooler):

- Native JSONB support for dynamic document request payloads (`submitted_data`)
- Strong relational foreign-key constraints
- Versioned Laravel database migrations

Expected core tables:

```text
users
resident_profiles
households
household_members
roles
verifications
document_types
document_requests
document_request_files
document_request_status_history
announcements
announcement_attachments
notifications
notification_preferences
files
qr_identifiers
sms_messages
```

---

## 38. Conceptual Data Relationships

```text
User
  │
  └── Resident Profile
          │
          └── Household Membership
                    │
                    └── Household

Resident
   │
   └── Document Requests

Household
   │
   └── Members

Document Request
   ├── Document Type
   ├── Files (Supabase S3)
   ├── Status History
   ├── Notes
   └── Fee
```

Authentication/account records are separated from resident profile records.

---

## 39. Administrative Permission Matrix

| Capability | Resident | Family Head | Sub-admin | Admin |
|---|---:|---:|---:|---:|
| Manage own account | Yes | Yes | Yes | Yes |
| Create household | No | Yes | No | No |
| Manage household members | No | Yes | No | No |
| Request own document | Yes | Yes | No | No |
| View own request status | Yes | Yes | No | No |
| Verify household | No | No | Yes | Yes |
| Verify member | No | No | Yes | Yes |
| Process documents | No | No | Yes | Yes |
| Create announcements | No | No | Yes | Yes |
| Manage sub-admins | No | No | No | Yes |
| Restrict household | No | No | No | Yes |
| Permanently delete archived records | No | No | No | Yes |
| Use protected QR scanner | No | No | Yes | Yes |
| Access admin dashboard | No | No | Yes | Yes |

The matrix must be enforced by backend authorization rules.

---

## 40. Testing Strategy

The project adopts a dual testing approach:

### 1. Unit & Feature Testing (Pest PHP 5)
Executed via `php artisan test`. All business logic, state transitions, and authorization rules are covered:

- **Business Rules:** One household per resident, one Family Head per household, status transition validation.
- **Service Isolation:** Tests execute with `FakeSmsService` and in-memory or transactional database (`RefreshDatabase`) for sub-second execution speed with zero external API calls.
- **Policy & Auth Tests:** Verified against the permission matrix.
- **Form Request & Validation Tests:** Edge cases, malicious payloads, and boundary conditions.

### 2. End-to-End Testing (Playwright)
Automated browser tests verifying complete cross-browser user journeys on the actual UI:

1. Household registration journey (with Turnstile & OTP challenge)
2. Admin review: Approval workflow
3. Admin review: Return for correction & resident re-submission
4. Admin review: Rejection workflow
5. Household member creation & member activation
6. Document request creation with ID upload
7. Document processing lifecycle (Pending → Processing → Completed/Ready for Pickup)
8. Document cancellation by resident
9. Announcement creation (Tiptap rich text) & public feed verification
10. In-browser QR camera scanner flow (`@zxing/browser`)
11. Unauthorized access & locked-module verification for unverified households

---

## 41. Implementation Phases

### Phase 1 — Foundation
- Project setup (Laravel 13, React 19, Inertia v3, Tailwind v4)
- Database schema setup (Supabase PostgreSQL + migrations)
- Authentication (Laravel Fortify + Cloudflare Turnstile)
- SMS & Email service contracts (`SmsService` + `FakeSmsService` + Resend)
- Base UI layout, theme (Violet), and localization foundation

### Phase 2 — Household and Resident Management
- Household registration with government ID upload
- OTP verification (SMS/Email via `OtpService`)
- Resident profiles & household membership
- Family Head authority and transfer
- Household and member administrative verification workflows

### Phase 3 — Document Requests
- Document type configuration
- Dynamic request forms with ID upload
- Document request lifecycle & status transitions
- Fee display (physical payment)
- Pickup workflow & cancellation flow

### Phase 4 — Notifications & Dev Tools
- In-app notification center
- Transactional email dispatch via Resend
- SMS dispatch via TextBee (production) / Fake SMS & Developer Inbox (`/dev/sms`) (local)
- Audit log (`sms_messages`)

### Phase 5 — Administration
- Admin dashboard with demographic analytics
- Sub-admin account management
- Searchable, sortable, paginated data tables (`@tanstack/react-table`)
- Household restriction & archive management

### Phase 6 — Announcements
- Tiptap rich-text announcement editor
- Attachment & image upload to Supabase Storage
- Public landing page & resident dashboard feeds

### Phase 7 — Reports, QR & PDF
- PDF export engine (`spatie/laravel-pdf` + DOMPDF)
- Initial RBI (Record of Barangay Inhabitants) report
- QR generation (`simple-qrcode`) & protected camera scanner (`@zxing/browser`)

### Phase 8 — Hardening, E2E QA & Deployment
- Automated Playwright E2E test suite execution
- Security review, WCAG accessibility audit
- Render.com deployment setup + cron-job.org keepalive configuration

---

## 42. Deployment & Infrastructure Architecture

```text
┌────────────────────────────────────────────────────────┐
│                      RENDER.COM                        │
│               Web Application Service                  │
│       (Laravel Backend + React/Inertia Frontend)       │
└──────────────────────────┬─────────────────────────────┘
                           │
         ┌─────────────────┼──────────────────┐
         │                 │                  │
         ▼                 ▼                  ▼
┌──────────────────┐ ┌─────────────┐ ┌─────────────────┐
│     SUPABASE     │ │   RESEND    │ │    TEXTBEE      │
│  ─ PostgreSQL DB │ │ ─ Transac-  │ │  ─ Android Phone│
│  ─ S3 File Store │ │   tional    │ │    SMS Gateway  │
│    (3 Buckets)   │ │   Email     │ │    (Client SIM) │
└──────────────────┘ └─────────────┘ └─────────────────┘
         ▲
         │ (Keepalive ping every 3-4 days)
┌────────────────────────────────────────────────────────┐
│                     CRON-JOB.ORG                       │
│    Keepalive ping every 10 min (Render web service)    │
└────────────────────────────────────────────────────────┘
```

- **Web Server:** Render.com free tier (warmed via cron-job.org ping every 10 minutes).
- **Database & Files:** Supabase (PostgreSQL 500 MB + S3 Storage 1 GB).
- **SMS:** TextBee using client's Android phone gateway.
- **Email:** Resend (free 3,000/mo, 100/day).

---

## 43. Repository and Infrastructure Ownership

The following should be confirmed before production deployment:

- Which GitHub account/organization owns the repository
- Who has repository administration access
- Who owns the production domain
- Who controls production service credentials
- Who owns the hosting account

System resources and recurring third-party services should be treated as client-owned expenses unless a separate agreement states otherwise.

Potential recurring services include:

- Domain
- Hosting
- Database hosting
- File storage
- Email provider
- SMS provider
- Other required service providers

Development fees and recurring infrastructure costs should remain separate.

---

## 44. Client-Dependent Requirements

The following remain **TBD** and should not block implementation of already-defined functionality.

### Barangay documents

Still required:

- Exact documents offered by Barangay Lallana
- Required fields for each document
- Document-specific processing requirements

### Newly moved residents

Still required:

- Verification process for newly moved residents
- Supporting requirements
- Residency classifications

### Branding and content

Still required:

- Official logo
- Official images/assets
- Final landing page content
- Barangay information
- Contact details
- Service descriptions

### RBI

Still required:

- Final preferred RBI layout
- Final field ordering
- Final formatting requirements

A provisional RBI structure can be implemented first.

---

## 45. Scope Boundary

The following are outside the current implementation scope unless separately approved and quoted:

- Online payment gateway
- Downloadable completed government documents for residents
- Internal resident-admin chat/messaging
- Automatic government ID authenticity validation
- PhilSys/eGov/third-party ID verification APIs
- Automatic ID type recognition
- Malware scanning
- Real-time document status synchronization
- Permanent deletion by non-Admin users
- Other functionality not included in the agreed requirements

New requirements should be evaluated as scope changes before implementation.

---

## 46. Current Development Baseline

The implementation baseline is:

```text
Public Landing Page
        +
Authentication
        +
Households
        +
Residents
        +
Family Head Management
        +
Household Member Activation
        +
Household Verification
        +
Member Verification
        +
Document Requests
        +
Document Processing
        +
Notifications
        +
Announcements
        +
Admin/Sub-admin Management
        +
PDF Reports
        +
RBI
        +
QR
        +
File Management
        +
Search / Filtering / Pagination
        +
Responsive / Accessible / Bilingual UI
```

Client-dependent details can be added later without changing the overall architecture where possible.
