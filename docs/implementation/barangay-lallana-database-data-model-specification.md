# Barangay Lallana E-Government Web-Based Information System
## Database & Data Model Specification

**Document status:** Initial database design specification  
**Purpose:** Define the core data model, entity relationships, constraints, lifecycle rules, and database direction before implementation.

---

# 1. Database Design Goals

The database must support:

- Individual user accounts
- Household-based organization
- Family Head authority
- Individual household member accounts
- Household and member verification
- Resident profiles
- Document requests
- Document processing and status history
- File uploads
- Notifications
- Announcements
- QR identifiers
- PDF/report generation
- Archiving
- Future addition of fields and document types

The database should prioritize:

1. Data integrity
2. Clear relationships
3. Maintainability
4. Secure access
5. Query performance
6. Future extensibility
7. Preservation of important historical records

---

# 2. Core Domain Model

The major relationships are:

```text
User Account
     │
     └── Resident Profile
              │
              └── Household Membership
                       │
                       └── Household
                              │
                              ├── Family Head
                              └── Members
```

Document-related data:

```text
Resident
   │
   └── Document Requests
          │
          ├── Document Type
          ├── Status History
          ├── Files
          ├── Fee
          └── Notifications
```

Administrative/public data:

```text
Admin/Sub-admin
      │
      ├── Verification
      ├── Document Processing
      └── Announcements

QR Identifier
      ↓
Authenticated Admin/Sub-admin
      ↓
Authorized Resident/Household Data
```

---

# 3. User Account

The account entity represents authentication credentials and account-level state.

Conceptual fields:

```text
users
├── id
├── email
├── contact_number
├── password_hash
├── role
├── account_status
├── preferred_verification_channel
├── email_verified_at
├── contact_verified_at
├── created_at
└── updated_at
```

Important rules:

- Passwords must only be stored as secure password hashes.
- A user's password must never be stored in plaintext.
- Email/contact uniqueness rules should be defined according to the final authentication design.
- Account status must be separate from household verification status.
- A user has one household relationship at a time.
- A household member has an individual account and individual password.
- Family members may belong to the same household while maintaining separate account credentials.

---

# 4. Resident Profile

Resident profile contains the person's demographic and personal information.

Conceptual fields:

```text
resident_profiles
├── id
├── user_id
├── full_name
├── sex
├── birthdate
├── civil_status
├── address
├── contact_number
├── email
├── occupation
├── employment_status
├── educational_attainment
├── voter_status
├── citizenship
├── religion
├── government_id_reference
├── residency_status
├── date_of_residency
├── senior_citizen_status
├── pwd_status
├── solo_parent_status
├── created_at
└── updated_at
```

Optional fields should allow null values.

The schema should remain extensible because additional resident fields may be introduced later.

---

# 5. Household

A household is the primary grouping entity for family members.

Conceptual fields:

```text
households
├── id
├── household_reference
├── address
├── citizenship
├── religion
├── date_of_residency
├── status
├── verification_status
├── verification_note
├── verified_at
├── created_by
├── created_at
└── updated_at
```

The final household fields will depend on the confirmed RBI and barangay requirements.

The household should have a stable internal identifier separate from user-facing identifiers.

---

# 6. Household Membership

Household membership connects a resident to a household.

Conceptual fields:

```text
household_members
├── id
├── household_id
├── resident_id
├── relationship_to_household_head
├── is_family_head
├── membership_status
├── verification_status
├── verification_note
├── joined_at
├── created_at
└── updated_at
```

Important rules:

- A resident can belong to only one household at a time.
- A household has one active Family Head.
- A member's relationship to the Family Head is stored here.
- Membership verification is separate from account activation.
- A newly added member must undergo administrative verification.

---

# 7. Family Head

Family Head should be represented as a household membership relationship rather than a completely separate resident type.

Conceptually:

```text
household_members.is_family_head = true
```

Only one active membership in a household may have Family Head authority.

Family Head permissions include:

- Household creation
- Household member creation
- Household member management
- Family Head transfer

The database should support transferring Family Head authority without creating duplicate resident records.

---

# 8. Household Creation and Verification Data

Household registration requires verification by the barangay administration.

A verification record should contain:

```text
verifications
├── id
├── target_type
├── target_id
├── verification_type
├── status
├── note
├── reviewed_by
├── reviewed_at
├── created_at
└── updated_at
```

Possible statuses:

```text
Pending
Approved
Returned
Rejected
```

The same verification mechanism may support:

- Household registration
- Household member verification

Every administrative decision requires a note/reason according to the agreed workflow.

---

# 9. Verification History

Verification decisions should not overwrite the meaning of previous submissions unnecessarily.

Where appropriate, the system should preserve:

- Previous submission state
- Current verification state
- Reviewer
- Decision
- Reason/note
- Timestamp

This is especially important for:

- Rejected household registrations
- Returned household registrations
- Member verification
- Repeated household creation attempts

---

# 10. Resident and Household State

Resident account state and household state must not be treated as the same value.

Example:

```text
Account:
Active

Household:
Pending Verification
```

A resident may have a valid account but still be unable to use protected household services because the household is not verified.

This separation supports the agreed locked-module behavior.

---

# 11. Document Types

Document types represent the government documents that Barangay Lallana provides.

Conceptual fields:

```text
document_types
├── id
├── name
├── description
├── requirements
├── fee
├── is_active
├── created_at
└── updated_at
```

The exact document list and exact request fields are still **TBD**.

The implementation should avoid hardcoding every document into unrelated application logic.

The preferred direction is a configurable document-type model.

---

# 12. Document Request

A document request belongs to an individual resident.

Conceptual fields:

```text
document_requests
├── id
├── request_reference
├── resident_id
├── household_id
├── document_type_id
├── submitted_data
├── current_status
├── fee_amount
├── cancellation_reason
├── created_at
├── updated_at
├── completed_at
└── pickup_ready_at
```

Important rules:

- Residents request documents for themselves.
- A request is associated with the resident's household at the time of request.
- The request must contain the information required by the selected document type.
- Fee amount may be zero.
- No online payment transaction is required.
- Completed documents are released through physical pickup.

---

# 13. Document Request Data

Because exact document templates are still pending, the request uses structured dynamic JSON storage.

```text
Document Type
      ↓
Required Fields
      ↓
Request Form
      ↓
submitted_data (PostgreSQL JSONB)
```

In Supabase PostgreSQL, `submitted_data` is stored as a native `JSONB` column and cast to an array in Eloquent (`'submitted_data' => 'array'`). This provides:

- Document-specific form schemas without creating a new table for every document
- Fast indexed querying inside JSON payloads
- Schema evolution without destructive database migrations

---

# 14. Document Status History

The current request status is accompanied by historical transitions.

Conceptual fields:

```text
document_request_status_history
├── id
├── document_request_id
├── status
├── note
├── changed_by
├── created_at
└── updated_at
```

Possible statuses include:

- Pending
- Processing
- On Hold
- Returned for Correction
- Completed
- Ready for Pickup
- Rejected
- Cancelled

Status history allows residents and administrators to trace how a request progressed over time.

---

# 15. Document Request Notes

Administrative notes are attached to the corresponding status event:

```text
Returned:
"Additional supporting valid ID page required."

On Hold:
"Processing paused awaiting applicant clarification."

Rejected:
"Applicant does not meet the jurisdictional requirement."
```

---

# 16. Document Request Files

A request may have associated uploaded files.

```text
document_request_files
├── id
├── document_request_id
├── file_id
├── file_type
├── purpose
├── created_at
└── updated_at
```

---

# 17. File Entity (Supabase Storage)

Files are stored in **Supabase Storage** (S3-compatible). Database records store file metadata and storage references:

```text
files
├── id
├── original_name
├── storage_key
├── bucket (government-ids / verification-documents / announcement-attachments)
├── mime_type
├── size_bytes
├── checksum
├── is_private
├── uploaded_by
├── created_at
└── updated_at
```

Rules:
- Sensitive files (e.g. government IDs) are stored in private buckets.
- Protected files are accessed only via short-lived signed URLs generated on-demand (`Storage::temporaryUrl()`).
- File uploads are validated strictly for size and real MIME type on the server.

---

# 18. Government ID Data

Government ID is required for household registration and document requests.

The database stores the minimum information required to associate the uploaded ID with the relevant process. Manual verification by administrators is required; no third-party ID scraping or PhilSys OCR is used.

---

# 19. Notifications

Notifications have their own entity:

```text
notifications
├── id
├── user_id
├── type
├── title
├── message
├── channel (in_app / email / sms)
├── related_entity_type
├── related_entity_id
├── read_at
├── sent_at
├── created_at
└── updated_at
```

---

# 19.1. SMS Dispatch Audit Log (`sms_messages`)

All outbound SMS attempts are logged for auditing, delivery tracking, and debugging:

```text
sms_messages
├── id
├── recipient (phone number)
├── message_type (otp / document_ready / document_returned / document_rejected)
├── provider (fake / textbee / semaphore)
├── status (pending / sent / failed / rate_limited / timeout)
├── provider_message_id
├── error_code
├── error_message
├── sent_at
├── created_at
└── updated_at
```

*Note: Raw OTP secrets are never stored in plaintext in the audit table.*

---

# 20. Notification Preferences

Users may select their preferred external notification channel.

Conceptually:

```text
notification_preferences
├── id
├── user_id
├── preferred_channel
├── created_at
└── updated_at
```

Possible external preference:

```text
SMS
Email
```

In-app notifications remain applicable where defined by the system.

---

# 21. Announcements

Announcements are public/admin-managed content.

Conceptual fields:

```text
announcements
├── id
├── title
├── description
├── content
├── type
├── status
├── published_at
├── created_by
├── created_at
└── updated_at
```

Announcement types may include:

- Event
- Meeting
- Advisory
- Other applicable categories

---

# 22. Announcement Attachments

Announcements may contain:

- Images
- Files
- Links

Attachments should use the shared file system where possible.

Conceptual relationship:

```text
Announcement
    │
    └── Announcement Attachments
             │
             └── File
```

---

# 23. QR Identifiers

QR codes should use an opaque identifier rather than embedding the full resident database record.

Conceptual fields:

```text
qr_identifiers
├── id
├── token
├── resident_id
├── household_id
├── status
├── created_at
└── updated_at
```

The token should be sufficiently unpredictable.

The server performs the actual lookup after authorization.

---

# 24. QR Access Model

The QR workflow is:

```text
Admin/Sub-admin Authentication
            ↓
Scan QR
            ↓
Validate Token
            ↓
Check Authorization
            ↓
Find Resident/Household
            ↓
Display Authorized Information
```

Scanning the QR code does not itself grant access.

---

# 25. Archive Model

Important records should support archival instead of immediate permanent deletion.

Conceptual approaches include:

```text
status = archived
```

or a dedicated archive representation where appropriate.

Important records include:

- Accounts
- Households
- Document-related records

Permanent deletion is an Admin-only operation for archived records where applicable.

---

# 26. Record Lifecycle

A general lifecycle is:

```text
Active
  ↓
Inactive / Restricted / Archived
  ↓
Permanent Deletion
```

The exact lifecycle depends on the entity.

For example:

```text
Household:
Active → Restricted → Archived

Document Request:
Active → Completed/Rejected/Cancelled → Historical

Account:
Active → Inactive → Archived
```

The implementation must preserve records needed for operational continuity and historical context.

---

# 27. Administrative Roles

Roles should be represented independently from resident data.

Conceptually:

```text
roles
├── id
├── name
└── description
```

Expected roles:

- Resident
- Admin
- Sub-admin

Family Head is a household membership authority rather than a global administrative role.

---

# 28. Permission Model

Permissions should be enforced at the application/backend level.

Examples:

```text
Admin
├── Manage Sub-admins
├── Verify Households
├── Verify Members
├── Process Documents
├── Manage Announcements
├── Restrict Households
└── Permanently Delete Archived Records

Sub-admin
├── Verify Households
├── Verify Members
├── Process Documents
└── Manage Announcements

Family Head
├── Create Household
├── Manage Members
└── Transfer Family Head

Resident
├── Manage Own Account
└── Request Own Documents
```

The exact permission implementation may use role-based authorization.

---

# 29. Important Database Constraints

The database should enforce important integrity rules where possible.

Expected constraints include:

### User

- Unique account identifier
- Secure password storage
- Valid role

### Household

- Unique household identifier
- Valid household state

### Household Membership

- A resident cannot have multiple active household memberships
- A household cannot have multiple active Family Heads

### Document Request

- Valid resident
- Valid household
- Valid document type
- Valid status

### Files

- Valid owner/reference
- Controlled storage metadata

### QR

- Unique QR token

---

# 30. Referential Integrity

Foreign keys should be used for important relationships.

Examples:

```text
resident_profiles.user_id
        ↓
users.id
```

```text
household_members.household_id
        ↓
households.id
```

```text
household_members.resident_id
        ↓
resident_profiles.id
```

```text
document_requests.resident_id
        ↓
resident_profiles.id
```

```text
document_requests.document_type_id
        ↓
document_types.id
```

Foreign-key behavior should be chosen carefully so important historical records are not accidentally removed through cascading deletes.

---

# 31. Indexing Strategy

Indexes should be added to fields frequently used for:

- Authentication
- Search
- Filtering
- Sorting
- Foreign-key joins
- Status filtering
- Date filtering
- Administrative dashboards

Likely indexed fields include:

```text
users.email
users.contact_number

households.household_reference
households.status
households.verification_status

resident_profiles.full_name

household_members.household_id
household_members.resident_id

document_requests.request_reference
document_requests.resident_id
document_requests.household_id
document_requests.document_type_id
document_requests.current_status
document_requests.created_at

notifications.user_id
notifications.read_at

qr_identifiers.token
```

Indexes should be based on actual query patterns and measured performance rather than added indiscriminately.

---

# 32. Searchable Fields

Administrative search should prioritize meaningful fields.

Potential resident search:

- Full name
- Household reference
- Contact number
- Email
- Residency status
- Verification status

Potential household search:

- Household reference
- Address
- Family Head
- Verification status
- Household status

Potential document request search:

- Request reference
- Resident
- Document type
- Status
- Date

---

# 33. Transaction Boundaries

Database transactions should be used when multiple related records must change together.

Examples:

### Household creation

```text
Create User
   +
Create Resident
   +
Create Household
   +
Create Membership
   +
Create Verification
```

### Member creation

```text
Create/prepare Member
   +
Create Account
   +
Create Household Membership
   +
Create Verification
```

### Family Head transfer

```text
Remove current Family Head authority
        +
Assign new Family Head authority
```

These operations should not leave the database in a partially updated state.

---

# 34. Household Transfer / Marriage Scenario

When a resident establishes a new household, the existing household relationship may need to be transferred.

Conceptually:

```text
Existing Household
       ↓
Resident establishes new household
       ↓
New household registration
       ↓
Admin verification
       ↓
Resident becomes member of new household
```

The old relationship should not simply be destroyed.

Historical membership information may need to be retained according to the final implementation.

---

# 35. Household Member Addition

Member creation should preserve the distinction between:

```text
Created by Family Head
```

and:

```text
Verified by Admin/Sub-admin
```

Creating a member does not automatically mean the member is verified.

The database should therefore maintain separate:

- Membership status
- Account status
- Verification status

---

# 36. Resident Information Updates

Resident information has different editing authorities.

### Resident

Can manage their permitted personal account information according to the final UI rules.

### Family Head

Can manage household member information according to the agreed Family Head permissions.

### Admin/Sub-admin

Cannot directly edit resident information as a normal administrative CRUD operation.

Their responsibility is verification and processing.

### Admin

May perform Admin-only restriction/archive/deletion operations where authorized.

---

# 37. Data Required for PDF Export

PDF generation should be based on structured database records.

Potential export scopes:

```text
Individual
   ├── Personal information
   ├── Household information
   └── Relevant records

Household
   ├── Household information
   └── Members

Resident
   └── Individual information

RBI
   └── Household/resident report data
```

The final PDF layout can be modified without changing the underlying database.

---

# 38. Data Required for QR Display

The QR lookup may expose information such as:

```text
Household
├── Household information
├── Family Head
└── Members

Resident
├── Individual information
├── Residency information
└── Relevant status

Documents
└── Request records/statuses
```

The exact visible fields should be controlled by the authorized QR view rather than by the QR token itself.

---

# 39. Demographic Reporting

The database should retain normalized resident information so the administrative dashboard can calculate summaries such as:

- Sex distribution
- Age groups
- Civil status
- Educational attainment
- Employment status
- Voter status
- Residency status
- Senior Citizen count
- PWD count
- Solo Parent count

Reports should query the source resident data rather than maintaining unnecessary duplicated demographic counters.

---

# 40. Future Extensibility

The schema should support future additions such as:

- New resident fields
- New document types
- New document request fields
- Additional notification channels
- Additional administrative statuses
- Additional report formats
- Additional household classifications

The implementation should avoid tightly coupling the database to the current temporary client requirements.

---

# 41. Client-Dependent Database Items

The following remain **TBD**:

### Resident fields

Additional fields may be requested later.

### Household fields

Final household/RBI fields are still subject to client confirmation.

### Document types

Exact barangay documents are still pending.

### Document request fields

Each document's required information is still pending.

### Newly moved resident data

The final verification/classification requirements are still pending.

These should be added through controlled migrations rather than destructive schema changes.

---

# 42. Migration Strategy

All database schema changes should use versioned migrations.

Example:

```text
Migration 001
Initial schema

Migration 002
Add verification fields

Migration 003
Add document request status history

Migration 004
Add announcement attachments
```

Migrations should be:

- Versioned
- Reproducible
- Reviewed
- Tested before production deployment

Production migrations should not be manually changed without a corresponding migration record.

---

# 43. Data Integrity Principles

The implementation should follow these principles:

1. Do not duplicate authoritative data unnecessarily.
2. Use foreign keys for important relationships.
3. Use database constraints where possible.
4. Use transactions for multi-record operations.
5. Preserve important historical records.
6. Avoid destructive cascading deletes for important entities.
7. Separate authentication data from resident profile data.
8. Separate household membership from account status.
9. Separate verification state from account activation.
10. Keep document status history separate from current status.

---

# 44. Database Design Completion Criteria

The database design can be considered ready for implementation when:

- Core entities are finalized
- Relationships are defined
- Primary keys are defined
- Foreign keys are defined
- Important uniqueness constraints are defined
- Status values are defined
- Archive behavior is defined
- Document request structure is defined sufficiently for implementation
- Client-dependent fields are identified as configurable/TBD
- Migration strategy is established

The exact final document templates and some RBI fields may remain TBD without blocking the initial database implementation.

---

# 45. Implementation Readiness

Once this database specification and the workflow/state-machine specification are stable, implementation can begin.

The next technical documentation should define the exact state transitions and business workflows before implementing the corresponding backend services.

