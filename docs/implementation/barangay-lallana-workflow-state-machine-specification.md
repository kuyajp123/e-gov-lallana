# Barangay Lallana E-Government Web-Based Information System
## Workflow & State Machine Specification

**Document status:** Initial workflow specification  
**Purpose:** Define the agreed business workflows, states, transitions, actors, and decision points before implementation.

---

## 1. Workflow Principles

The system follows these rules:

- Account activation and barangay verification are separate.
- Creating a household does not automatically verify it.
- Creating a member does not automatically verify the member.
- New households and newly added members require administrative verification.
- Residents request their own documents.
- Residents can see the status of their own document requests.
- External notifications are only sent for agreed final/action-required events.
- Document processing does not need real-time synchronization.
- Payment is handled face-to-face.
- Completed documents are pickup-only.
- Important records are retained rather than immediately destroyed.
- Admin/Sub-admin verify and process records but do not directly edit resident information as ordinary CRUD.
- Family Head authority can be transferred.
- A resident can belong to only one household at a time.

---

## 2. Actors

### Resident

Can:

- Activate their account
- Manage permitted account information
- Request their own documents
- View their document request statuses
- Cancel their own requests
- Receive notifications
- View announcements

### Family Head

Has resident capabilities plus:

- Create a household
- Add household members
- Manage household members
- Transfer Family Head authority

### Sub-admin

Can:

- Verify households
- Verify household members
- Process document requests
- Create/manage announcements
- Use protected QR scanning
- Access the administrative dashboard

Cannot:

- Manage Sub-admin accounts
- Restrict households
- Permanently delete archived records

### Admin

Has all Sub-admin capabilities plus:

- Manage Sub-admins
- Restrict households
- Permanently delete eligible archived records
- Perform Admin-only operations

---

## 3. Household Creation

```text
Start
  ↓
Create Household
  ↓
Enter Required Information
  ↓
Upload Valid Government ID
  ↓
Verify Email/SMS
  ↓
Submit Registration
  ↓
Pending Verification
```

While pending, the creator can view the submitted information and verification status but cannot freely modify the submission.

---

## 4. Household Verification State Machine

```text
                 ┌───────────────┐
                 │    Pending    │
                 └───────┬───────┘
                         │
            ┌────────────┼────────────┐
            ↓            ↓            ↓
       ┌─────────┐  ┌─────────┐  ┌─────────┐
       │ Approved│  │ Returned│  │ Rejected│
       └─────────┘  └────┬────┘  └────┬────┘
                         │             │
                         ↓             ↓
                  Edit & Resubmit   Create New
                         │          Household
                         ↓
                      Pending
```

### Approved

The household becomes verified and protected household services become available.

### Returned

A reason/note is required. The creator corrects the requested information and resubmits.

### Rejected

A reason/note is required. The rejected submission remains available as historical information. The creator may create a new household registration.

Administrators should be able to identify that a new submission follows a previous rejected submission.

---

## 5. Unverified Household Access

```text
Unverified Household
       │
       ├── Landing Page → Accessible
       ├── Announcements → Accessible
       ├── Account Status → Accessible
       ├── Submitted Information → Accessible
       │
       └── Protected Modules → Locked
                ├── Document Request
                ├── Household Management
                └── Other Protected Services
```

Locked modules should explain why access is currently unavailable.

---

## 6. Household Member Creation

A Family Head can create a member immediately after household creation or later.

```text
Family Head
     ↓
Create Member
     ↓
Enter Member Information
     ↓
Provide Email + Contact Number
     ↓
Member Account Prepared
     ↓
Member Activation
     ↓
Verification Information
     ↓
Pending Admin Verification
```

The Family Head may enter the member's information directly.

The member must still activate their own account and undergo administrative verification.

There is no fixed household-member limit.

---

## 7. Member Activation

```text
Member Created
      ↓
Member accesses household account
      ↓
Selects their member profile
      ↓
Completes/confirms information
      ↓
Verifies contact
      ↓
Activates account
      ↓
Pending Admin Verification
```

Each household member has an individual account and individual password even though the members belong to the same household.

---

## 8. Member Verification State Machine

```text
                 ┌───────────────┐
                 │    Pending    │
                 └───────┬───────┘
                         │
            ┌────────────┼────────────┐
            ↓            ↓            ↓
       ┌─────────┐  ┌─────────┐  ┌─────────┐
       │ Approved│  │ Returned│  │ Rejected│
       └─────────┘  └────┬────┘  └────┬────┘
                         │             │
                         ↓             ↓
                  Correct &       Follow applicable
                  Resubmit        re-registration flow
                         │
                         ↓
                      Pending
```

The exact re-registration behavior after member rejection remains client-dependent.

---

## 9. Family Head Management

Family Head can:

- Add members
- Edit member information
- Remove members
- Transfer Family Head authority

Family Head cannot bypass member verification.

A member belongs to a household only after the appropriate workflow has been completed.

---

## 10. Family Head Transfer

```text
Current Family Head
       ↓
Select New Family Head
       ↓
Confirm Transfer
       ↓
Validate Household Membership
       ↓
Transfer Authority
```

The database must ensure that only one active Family Head exists per household.

The transfer does not create a new household.

---

## 11. New Household From Existing Household

For situations such as marriage:

```text
Existing Household
       ↓
Resident Creates New Household
       ↓
System identifies existing household origin
       ↓
Admin can review relevant history
       ↓
Pending Verification
       ↓
Approve / Return / Reject
```

The new household still requires administrative verification.

The previous household relationship should be retained as historical information where applicable.

---

## 12. Account Verification (OTP Lifecycle)

The system supports two contact verification channels:

- **SMS OTP:** Dispatched via `SmsService` (TextBee in production, `FakeSmsService` with `/dev/sms` in development, Semaphore as scaling adapter)
- **Email OTP:** Dispatched via `EmailService` (Resend transactional email)

```text
Provide Email / Mobile Number
              ↓
    Generate 6-Digit OTP (OtpService)
              ↓
  Queue Transport Notification Job
        ┌─────┴─────┐
        ▼           ▼
    SMS Service   Email Service
        │           │
        ▼           ▼
   Resident Receives OTP Code
              ↓
  Enter Code in Verification UI
              ↓
Validate Expiration & Rate Limit (OtpService)
              ↓
   Contact Ownership Verified
```

### OTP Security Rules:
- **Lifetime (TTL):** OTP expires after 5 minutes.
- **Attempt Throttling:** Maximum 5 failed attempts before the OTP is invalidated and requires a new request.
- **Resend Cooldown:** 60-second cooldown period enforced between OTP resend requests.
- **Isolation:** `OtpService` owns OTP generation and validation; the SMS/Email transport services never alter verification state.
- **Contact verification does not replace administrative barangay verification.**

---

## 13. Government ID Review

A government ID is required for household registration and document requests.

```text
Upload ID
   ↓
Technical File Validation
   ↓
Secure Storage
   ↓
Admin/Sub-admin Review
   ↓
Administrative Decision
```

The system does not automatically determine:

- Whether the ID is genuine
- Which ID type was uploaded
- Whether the ID belongs to a government ID library

The system does not implement PhilSys, eGov, SheerID, or other external ID verification services.

---

## 14. Document Request

A verified resident can request a document for themselves.

```text
Select Document
   ↓
Complete Required Information
   ↓
Upload Valid Government ID
   ↓
Review
   ↓
Submit
   ↓
Pending
```

The request belongs to the authenticated resident.

The backend must validate ownership rather than trusting a resident identifier supplied by the client.

---

## 15. Document Request State Machine

```text
                    ┌───────────┐
                    │  Pending  │
                    └─────┬─────┘
                          │
                          ↓
                    ┌────────────┐
                    │ Processing │
                    └─────┬──────┘
                          │
             ┌────────────┼──────────────┐
             ↓            ↓              ↓
         ┌────────┐  ┌──────────┐  ┌──────────┐
         │On Hold │  │ Returned │  │ Rejected │
         └────┬───┘  └────┬─────┘  └──────────┘
              │           │
              │           ↓
              │      Correct / Resubmit
              │           │
              └───────────┘
                          │
                          ↓
                    ┌──────────────┐
                    │   Completed  │
                    └──────┬───────┘
                           │
                           ↓
                    Ready for Pickup
```

Additional Admin-defined processing statuses may be supported where necessary.

---

## 16. Document Processing States

### Pending

Request has been submitted and awaits processing.

### Processing

Admin/Sub-admin is actively processing the request.

### On Hold

Processing is temporarily paused. A reason/note should explain the hold where applicable.

### Returned for Correction

The resident must correct or provide required information. A reason/note is required.

### Rejected

The request cannot proceed. A reason/note is required.

### Completed

Processing is finished and the document is prepared for physical release.

### Ready for Pickup

The resident can collect the document from the barangay.

### Cancelled

The resident cancelled the request. A cancellation reason is required.

---

## 17. Document Correction

```text
Processing
    ↓
Returned for Correction
    ↓
Resident sees reason
    ↓
Resident corrects information
    ↓
Resubmits
    ↓
Pending / Processing
```

The final transition after correction follows the configured document workflow.

---

## 18. Document Rejection

```text
Pending / Processing
        ↓
Admin/Sub-admin Rejects
        ↓
Required Reason
        ↓
Rejected
        ↓
Resident Notification
```

The request remains stored as a historical record.

---

## 19. Document Completion and Pickup

```text
Processing
     ↓
Complete Document
     ↓
Ready for Pickup
     ↓
Resident Notification
     ↓
Physical Pickup
```

Completed government documents are not downloadable by residents.

Payment, if applicable, is handled face-to-face.

---

## 20. Document Cancellation

```text
Active Request
      ↓
Resident selects Cancel
      ↓
Select cancellation reason
      ↓
Confirm
      ↓
Cancelled
```

Possible reasons:

- No longer needed
- Wrong document
- Duplicate request
- Incorrect information
- Other

If `Other` is selected, a custom reason is required.

Cancellation does not delete the request.

---

## 21. Document Fees

```text
Admin defines fee
       ↓
Display defined amount

Admin does not define fee
       ↓
Display ₱0
```

There is no online payment gateway.

---

## 22. Document Status Visibility

Residents can view all applicable statuses of their own requests.

Example:

```text
Pending
   ↓
Processing
   ↓
On Hold
   ↓
Processing
   ↓
Ready for Pickup
```

Status tracking is not real-time.

---

## 23. Notification Workflow

External notifications are not sent for every status transition.

```text
Business Event
      ↓
Is it an agreed notification event?
      │
      ├── No → No external notification
      │
      └── Yes
            ↓
       Preferred Channel
          ├── SMS
          └── Email
```

Important notification events include:

- Rejected
- Returned for Correction
- Completed / Ready for Pickup

In-app notifications remain applicable where specified.

---

## 24. File Upload Workflow

```text
Select File
   ↓
Validate File Type
   ↓
Validate File Size
   ↓
Compress/process where applicable
   ↓
Store File
   ↓
Create File Metadata
   ↓
Associate With Request/Verification
```

Uploaded files containing sensitive information must be protected from unauthorized access.

Administrators can preview supported uploaded documents without downloading them.

Malware scanning is outside the current scope.

---

## 25. Announcement Workflow

```text
Admin/Sub-admin
      ↓
Create Announcement
      ↓
Enter Content
      ↓
Add Images / Attachments / Links
      ↓
Select Type
      ↓
Publish
      ↓
Public Landing Page
      +
Resident Dashboard
```

Announcements are publicly available after publication.

---

## 26. QR Scanning Workflow

```text
Admin/Sub-admin Login
       ↓
Open QR Scanner
       ↓
Scan QR
       ↓
Validate QR Token
       ↓
Check Authorization
       ↓
Retrieve Authorized Data
       ↓
Display Information
```

The QR code should contain an opaque identifier rather than the complete sensitive record.

An unauthenticated user cannot access the protected QR scanner.

---

## 27. QR Error States

```text
Valid + Authorized
      ↓
Display Information

Invalid QR
      ↓
Invalid QR State

Valid QR + Unauthorized
      ↓
Access Denied

Inactive QR
      ↓
Inactive QR State
```

---

## 28. Administrative Household Restriction

Only Admin can restrict a household.

```text
Admin
  ↓
Select Household
  ↓
Restrict Household
  ↓
Provide Reason
  ↓
Confirm
  ↓
Household Restricted
```

The affected users should be informed of the applicable restriction reason.

Sub-admin cannot perform this operation.

---

## 29. Archive Workflow

Important records should normally follow:

```text
Active
  ↓
Archived
  ↓
Admin Review
  ↓
Permanent Deletion if Authorized
```

Permanent deletion of eligible archived records is Admin-only.

---

## 30. Authorization Rules

### Resident

The server must validate:

- Authenticated identity
- Own resident record
- Own document requests
- Household membership

### Family Head

The server must validate:

- Authenticated identity
- Active Family Head authority
- Target household
- Target household member

### Admin/Sub-admin

The server must validate:

- Administrative role
- Specific operation permission
- Target resource
- Valid state transition

UI controls alone must never be treated as authorization.

---

## 31. State Transition Validation

The backend must enforce valid transitions.

Examples:

```text
Pending → Processing        Allowed
Pending → Rejected          Allowed
Processing → On Hold       Allowed
Processing → Returned      Allowed
Processing → Completed     Allowed

Cancelled → Processing      Not allowed
Rejected → Processing       Not directly allowed
```

The final transition matrix should be implemented as centralized business logic.

---

## 32. Transactional Workflows

Operations involving multiple related records should use database transactions where appropriate.

### Household creation

```text
Create Account
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
Create Member Account
    +
Create Resident
    +
Create Household Membership
    +
Create Verification
```

### Family Head transfer

```text
Remove old Family Head authority
    +
Assign new Family Head authority
```

The system should avoid partially completed critical operations.

---

## 33. Concurrent Administrative Operations

The system should protect against conflicting updates.

Examples:

- Two administrators attempting to verify the same registration
- Two administrators changing the same document status
- Two requests attempting to assign Family Head authority
- Multiple users attempting conflicting household changes

Database constraints, transactions, and appropriate concurrency handling should be used where necessary.

---

## 34. Error States

Major workflows should support clear failure states.

Examples:

```text
Validation Error
Unauthorized
Forbidden
Session Expired
Invalid State Transition
Upload Failed
Verification Failed
Database Error
Notification Delivery Failure
```

Errors should be understandable without exposing sensitive implementation details.

---

## 35. Workflow Notification Matrix

| Event | In-app | Email/SMS |
|---|---:|---:|
| Household submitted | As applicable | No default external notification |
| Household approved | As applicable | No default external notification |
| Household returned | Yes | Yes |
| Household rejected | Yes | Yes |
| Member approved | As applicable | No default external notification |
| Member returned | Yes | Yes |
| Member rejected | Yes | Yes |
| Document submitted | As applicable | No |
| Document processing | Yes/status visible | No |
| Document on Hold | Yes/status visible | No |
| Document returned | Yes | Yes |
| Document rejected | Yes | Yes |
| Document completed/ready | Yes | Yes |
| Document cancelled | As applicable | No default external notification |

The final notification matrix may be adjusted if the client defines additional requirements.

---

## 36. Workflow Testing Matrix

### Automated Test Architecture
- **Unit & Feature Suite (Pest PHP 5):** Fast, in-memory/transactional tests (`RefreshDatabase`) using `FakeSmsService` to test business logic, validation rules, state transitions, and authorization policies without network calls.
- **End-to-End Suite (Playwright):** Automated cross-browser journeys exercising the real frontend React UI, forms, Turnstile integration, file upload flows, and authenticated state.

### 1. Household Lifecycle (Pest + Playwright)
- Create household registration with government ID upload
- Turnstile bot challenge validation
- OTP verification challenge (SMS/Email via `OtpService`)
- Verify locked-module unauthorized state for unverified households
- Admin approval → unlock household services
- Admin return for correction → creator edits and resubmits
- Admin rejection → view reason and create new registration
- Prevent multiple active households per resident

### 2. Member Lifecycle (Pest + Playwright)
- Family Head creates member profile
- Member receives activation invitation
- Member completes account setup and verifies contact
- Admin approval of new member
- Admin return for correction and re-submission
- Admin rejection handling
- Prevent non-Family-Head members from adding/removing other members

### 3. Family Head Authority (Pest)
- Transfer Family Head authority to another member
- Enforce single active Family Head constraint per household
- Prevent cross-household management attempts

### 4. Document Request Lifecycle (Pest + Playwright)
- Resident creates document request with dynamic form fields & ID upload
- Admin status updates: Pending → Processing → On Hold
- Admin status updates: Processing → Returned for Correction → Resident resubmission
- Admin status updates: Processing → Completed / Ready for Pickup
- Admin rejection with required administrative note
- Resident cancellation with required reason
- Enforce valid state transition matrix (reject illegal transitions)
- Verify event-driven external notification dispatches (Resend / TextBee)

### 5. QR Code Security & Scanning (Pest + Playwright)
- Generate opaque QR identifier on record creation
- Authorized Admin/Sub-admin scan via `@zxing/browser` camera component
- Reject unauthenticated scanner access
- Handle invalid, expired, or inactive QR tokens gracefully

---

## 37. Client-Dependent Workflow Items

The following remain TBD:

- Exact Barangay Lallana document list
- Required fields for each document
- Final workflow for newly moved residents
- Final RBI structure

These should not block implementation of already-defined workflows.

---

## 38. Implementation Readiness

The workflow layer is sufficiently defined to begin implementation after the database design is stable.

Client-dependent document fields, RBI details, and newly moved resident policy can be added through controlled changes later.

---

## 39. Next Documentation

The next recommended document is:

**API & Backend Specification**

It should define:

- API/module boundaries
- Authentication endpoints
- Household endpoints
- Resident endpoints
- Member endpoints
- Verification endpoints
- Document request endpoints
- Notification endpoints
- Announcement endpoints
- QR endpoints
- PDF endpoints
- File endpoints
- Authorization middleware
- Validation strategy
- Error response structure
- Pagination, filtering, and sorting conventions
