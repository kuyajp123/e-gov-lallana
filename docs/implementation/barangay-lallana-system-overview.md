# Barangay Lallana E-Government Web-Based Information System
## System Overview and Agreed Functional Scope

**Document status:** Initial implementation specification  
**Purpose:** Establish the current agreed scope and functional direction for development.

---

## 1. System Overview

The Barangay Lallana E-Government Web-Based Information System is a responsive web application intended to digitize barangay household and resident information, household registration and verification, document requests and processing, public announcements, reporting, and related administrative operations.

The system is divided into three primary areas:

1. Public Landing Page
2. Resident/Household Application
3. Barangay Admin/Sub-admin Application

The system is designed to be clean, intuitive, responsive, accessible, and available in English and Filipino.

---

## 2. Public Landing Page

The public landing page is a single page containing multiple sections:

- Home
- About Barangay
- Services
- Announcements
- Contact

Announcements are publicly accessible without authentication.

The same announcements are also displayed inside authenticated resident dashboards.

For the initial implementation, dummy content may be used where official barangay content has not yet been provided.

---

## 3. Household and Account Structure

A household is the primary family grouping in the system.

Each household has multiple individual members, and each member has an individual account.

Example:

```text
Household: Santos Family

├── Juan Santos
│   └── Individual account + unique password
├── Maria Santos
│   └── Individual account + unique password
└── Pedro Santos
    └── Individual account + unique password
```

Household members are associated with the same household while maintaining their own individual credentials.

Each user may belong to only one household at a time.

Each individual account has:

- Individual profile
- Unique password
- Email
- Contact number
- Individual government ID
- Individual document requests

---

## 4. Family Head

The person who establishes a household and creates its account becomes the Family Head.

The Family Head has the highest authority within the household.

### Family Head permissions

The Family Head can:

- Add household members
- Edit household member information
- Remove household members
- Manage household information
- Transfer Family Head authority to another household member

### Other household members

Other members can:

- Access their own account
- View applicable household information
- Manage their own account information
- Request their own documents

Other members cannot manage other household members.

### Family Head transfer

The Family Head may transfer the Family Head role to another household member.

The system must maintain one active Family Head for each active household.

---

## 5. Household Registration

Creating a new household requires barangay verification.

### Registration flow

```text
Create Household
      ↓
Enter household and personal information
      ↓
Upload valid government ID
      ↓
Provide email and contact number
      ↓
Choose SMS or Email verification
      ↓
Submit registration
      ↓
Pending Barangay Verification
      ↓
Admin/Sub-admin Review
      ↓
Approve / Return for Correction / Reject
```

A household that has not been verified cannot access protected household services.

---

## 6. Account Verification

The system supports two external account verification methods:

- SMS (powered by TextBee in production via the barangay's gateway device, with an in-memory/simulated SMS service for local development, and an adapter for Semaphore when scaling)
- Email (powered by Resend transactional email)

The user can choose which method to use during registration and profile updates.

SMS/email verification is used for account activation and contact verification (OTP code verification).

This is separate from the barangay's manual verification of household and resident information.

---

## 7. Adding Household Members

The Family Head can create a new member profile.

Example:

```text
Family Head
    ↓
Add new member
    ↓
Member profile created
    ↓
Member verifies and activates account
```

The newly added member must provide or confirm:

- Personal information
- Email
- Contact number
- Government ID
- Other required information

The member can access the household account and select their newly created member profile to complete their own verification information.

The Family Head may also complete the member information directly after obtaining the member's email and contact number.

The newly added member still requires account/identity verification before the account becomes active.

There is no fixed maximum number of household members. The verification requirement acts as the control for adding new members.

Duplicate household members must be prevented.

---

## 8. Resident Information

Each resident profile may contain:

- Full name
- Sex
- Birthdate
- Age
- Civil status
- Address
- Contact number
- Email
- Occupation (optional)
- Employment status (optional)
- Educational attainment
- Voter status
- Citizenship
- Religion
- Government valid ID
- Relationship to household head
- Residency status
- Date of residency
- Senior Citizen status (optional)
- PWD status (optional)
- Solo Parent status (optional)

The system may add new fields in the future as requirements evolve.

### Shared information options

The following information may provide a "same as Family Head" option:

- Address
- Citizenship
- Religion
- Date of residency

These options are convenience features and should not prevent the system from maintaining each resident's individual profile.

---

## 9. Residency Status

Residency status is separate from household/account verification status.

Residency status may represent different residency circumstances, including:

- Official resident
- New resident
- Tenant
- Boarder
- Student
- Temporary resident
- Other applicable classifications

The final classifications should follow Barangay Lallana's actual requirements.

### Newly moved residents

The exact process for residents who have recently moved into Barangay Lallana but are not yet present in existing barangay records remains to be confirmed by the client.

The system should not automatically assume that a resident is invalid merely because the resident cannot be found in an existing record.

The barangay must define the additional verification process and acceptable supporting requirements for this scenario before this workflow is finalized.

---

## 10. Household Verification Status

Household registration may use the following statuses:

- Pending
- Approved
- Returned for Correction
- Rejected
- Restricted
- Inactive
- Archived

Every verification decision must contain a reason/note.

### Approve

A verification note is required.

### Return for Correction

A correction note is required and must be visible to the household creator.

### Reject

A rejection reason is required and must be visible to the household creator.

---

## 11. Unverified Household Access

An unverified household may access:

- Public landing page
- Public announcements
- Account verification status
- Submitted information

Protected modules remain visible but locked.

Examples:

- Document Request
- Household Management
- Other protected services

Locked modules must provide an appropriate unauthorized/locked state explaining why the feature is currently unavailable.

The household cannot perform CRUD operations on locked modules.

---

## 12. Editing Submitted Household Information

After a household creator submits the household registration for review:

- The submitted information cannot be edited while under review.
- The creator can view the submitted information.
- If the administrator returns the registration for correction, the creator may edit the requested information.
- The corrected information can then be resubmitted for verification.

If a household registration is rejected, the household creator may create another household registration.

The previous rejected submission must remain available to authorized administrators as historical information so repeated rejected household creation can be identified.

---

## 13. New Household From an Existing Member

An existing resident may establish a new household, such as after marriage.

The new household must undergo the normal barangay verification process.

The previous household relationship is retained as historical information.

The Family Head of the previous household does not need to approve the transfer.

The new household is reviewed by authorized barangay personnel.

The administrator can review the user's previous household/account history during verification.

Example:

```text
Existing Household
       ↓
Existing Member establishes new household
       ↓
New Household Registration
       ↓
Pending Verification
       ↓
Admin/Sub-admin Review
       ↓
Approve / Return / Reject
```

---

## 14. Government ID Requirement

A valid government-issued ID is required during:

1. New household registration
2. Document requests
3. Applicable resident/member verification

The system does not automatically determine whether an uploaded ID is genuine or identify the ID type.

The system will not implement:

- PhilSys API verification
- eGov API verification
- SheerID
- Automatic ID type recognition
- OCR-based ID identification
- External ID validation libraries

The system only handles the technical upload requirements.

The actual validity and acceptability of the submitted ID are determined manually by the authorized Admin/Sub-admin.

### Upload workflow

```text
Resident uploads ID
       ↓
System validates technical file requirements
       ↓
Admin/Sub-admin views uploaded ID
       ↓
Admin/Sub-admin determines acceptability
```

---

## 15. Document Request Module

Residents can request barangay documents for themselves.

Each request is associated with:

- Household
- Individual resident
- Document type
- Required request information
- Uploaded government ID
- Processing status
- Applicable fee
- Administrative notes

### Basic flow

```text
Resident
   ↓
Select document
   ↓
Complete required information
   ↓
Upload valid government ID
   ↓
Submit request
   ↓
Admin/Sub-admin processing
   ↓
Status tracking
   ↓
Completed / Ready for Pickup
```

The exact documents offered by Barangay Lallana are still being collected from the client.

For every available document, the client must provide the required information/fields. These requirements will determine the corresponding document request form.

---

## 16. Document Processing Status

Residents can see the processing status of their own document requests.

Possible statuses include:

- Pending
- Processing
- Admin-defined processing status
- On Hold
- Returned for Correction
- Completed
- Ready for Pickup
- Rejected
- Cancelled

The exact status workflow may be refined based on the barangay's actual processing procedure.

Status tracking does not require real-time synchronization.

The application can retrieve the latest stored status when the resident accesses the request.

---

## 17. Document Request Notifications

The system does not send external notifications for every status transition.

SMS/email notifications are only sent when the request reaches an important final or action-required outcome.

Examples:

- Rejected
- Returned for Correction
- Completed / Ready for Pickup

The resident chooses their preferred external notification method:

- SMS
- Email

Relevant final/action-required outcomes are also shown as in-app notifications.

Intermediate statuses such as Pending or Processing do not trigger external notifications.

---

## 18. Document Request Cancellation

Residents can cancel their own document requests.

Cancellation requires a reason.

Possible reasons may include:

- No longer needed
- Wrong document
- Duplicate request
- Incorrect information
- Other

If "Other" is selected, the resident must provide a manual reason.

The cancellation information remains associated with the request.

---

## 19. Document Pickup

The system uses a pickup-only document release process.

Completed documents are not downloadable by residents through the system.

The system only notifies the resident that the document is ready for pickup.

The resident must obtain the physical document from the barangay.

This supports documents requiring:

- Physical signatures
- Official stamps
- Face-to-face requirements
- Physical release

---

## 20. Document Fees

The system does not include an online payment gateway.

The system only displays the amount that the resident needs to pay.

Administrators may define a document fee.

If no fee is defined:

```text
Fee: ₱0
```

Payment is handled physically at the barangay.

The system does not require payment transaction records or online payment processing.

---

## 21. Admin and Sub-admin Roles

The barangay side has two roles:

- Admin
- Sub-admin

### Admin

Admin has full administrative access and can:

- Add sub-admins
- Edit sub-admins
- Delete sub-admins
- Verify household registrations
- Process document requests
- Restrict households
- Archive records
- Permanently delete archived records
- Create/manage announcements
- Access administrative dashboards
- Access authorized system operations

### Sub-admin

Sub-admin is responsible for operational processing and can:

- Verify household registrations
- Process document requests
- View required household/resident information
- Create/manage announcements

Sub-admin cannot:

- Add sub-admins
- Edit sub-admins
- Delete sub-admins
- Create households on behalf of residents
- Edit resident information
- Perform Admin-only restriction operations
- Permanently delete records

---

## 22. Resident Information Ownership

Admin and Sub-admin users do not directly edit resident information.

Residents submit their own information.

Authorized barangay personnel review the submitted information and can:

- Approve
- Return for Correction
- Reject
- Restrict where applicable

This maintains a separation between resident data submission and barangay verification.

---

## 23. Data Archiving and Deletion

Important records should not normally be permanently deleted.

Important data includes:

- Accounts
- Households
- Documents
- Document requests
- Other important historical records

When records are removed from active use, they should be moved to an archive/inactive state.

Archived data can only be permanently deleted by an Admin.

Permanent deletion is reserved for data where permanent removal is appropriate.

---

## 24. Announcements

All Admin and Sub-admin users can create announcements.

Announcement features include:

- Title
- Description
- Rich-text content
- Images
- Attachments
- Links
- Announcement type

Announcement types may include:

- Events
- Meetings
- Advisory
- Other applicable categories

The announcement editor will use Tiptap.

Announcements are displayed on:

- Public landing page
- Authenticated resident dashboard

---

## 25. Messaging

The system does not include an internal resident-to-admin messaging or chat feature.

Communication related to document and verification outcomes is handled through the defined notification mechanisms and system information.

---

## 26. Admin Dashboard

The Admin/Sub-admin dashboard displays administrative summaries including:

- Total residents
- Total households
- Pending registrations
- Pending document requests
- Documents ready for release
- Number of processing documents
- Demographic summaries

The Admin dashboard additionally displays:

- Number of active sub-admins

---

## 27. Tables and Data Management

System tables must support:

- Search
- Advanced search/filtering
- Sorting
- Pagination

Tables should display only important information.

Detailed records can be accessed through appropriate detail views.

---

## 28. PDF Export

The system supports server-side PDF export powered by `spatie/laravel-pdf` (using the lightweight, PHP-native DOMPDF driver initially, with per-document capability to use Chromium/Browsershot if advanced CSS rendering is required).

Exportable information may include:

- Household information
- Family member information
- Individual resident information
- RBI reports
- Other applicable administrative reports

Only PDF export is currently required.

### RBI

A reasonable household-based RBI structure will be implemented initially.

The RBI format can be revised later when Barangay Lallana provides its preferred or official structure.

The provisional structure is not a development blocker.

---

## 29. QR Code

The system provides QR codes associated with resident/household records.

Only authenticated Admin and Sub-admin users can use the application's QR scanner for protected resident information.

### QR security model

The QR code should contain an opaque identifier/token rather than directly embedding complete sensitive resident information.

```text
QR Code
   ↓
Opaque Identifier
   ↓
Authenticated Admin/Sub-admin Scanner
   ↓
Authorization Check
   ↓
Retrieve Record
   ↓
Display Authorized Information
```

Authorized information may include:

- Household information
- Family member information
- Individual information
- Document request records
- Other authorized information

Unauthenticated users must not be able to use the protected QR scanner.

---

## 30. File Uploads

The system supports file uploads stored in **Supabase Storage** (S3-compatible object storage):

- Government ID images (stored in private bucket `government-ids`)
- Supporting verification documents (stored in private bucket `verification-documents`)
- Announcement images and attachments (stored in `announcement-attachments`)
- Other approved file types

Uploads must have reasonable limits and security controls.

The system provides:

- File type validation (MIME validation)
- File size validation
- Safe file handling
- Storage abuse protection
- Automatic image compression (via Intervention Image)
- Secure, time-limited signed URL access for private/sensitive files
- Automatic file preview for administrators without requiring full downloads

Malware scanning is not part of the current implementation scope.

---

## 31. Application Security

The application should provide practical security protections including:

- Authentication and authorization (Laravel Fortify + role policies)
- Protected routes and backend authorization checks
- Input sanitization and strict validation schemas (Zod + Form Requests)
- Rate limiting on sensitive endpoints
- Bot protection via **Cloudflare Turnstile** on registration and login forms
- File upload validation and MIME spoofing protection
- Secure private file storage with time-limited signed URLs
- Storage abuse protection
- Request validation
- Protection against direct unauthorized resource access

Security mechanisms should be effective without introducing unnecessarily expensive computation.

---

## 32. Responsive Design

The entire application should support different screen sizes:

- Desktop
- Laptop
- Tablet
- Mobile

The resident and admin dashboards should both be responsive.

---

## 33. Accessibility

The application should support diverse users and provide reasonable accessibility features for users with impairments.

Examples include:

- Keyboard navigation
- Accessible form labels
- Screen-reader-friendly structures
- Appropriate contrast
- Visible focus states
- Accessible errors
- Semantic HTML
- Responsive layouts

---

## 34. Language Support

The system supports:

- English
- Filipino

The Filipino version may use Taglish when literal Filipino translations of technical/system terms would be awkward or difficult to understand.

Language switching should cover the application's user-facing interface and system messages.

---

## 35. UI/UX Direction

Main brand color:

> **Violet**

Design goal:

> **Clean, intuitive, minimal-effort interface**

The system should be understandable without requiring users to learn complicated workflows.

---

## 36. Current System Structure

At a high level:

```text
                    BARANGAY LALLANA SYSTEM
                            │
             ┌──────────────┴──────────────┐
             │                             │
      PUBLIC LANDING                  AUTHENTICATED
             │                         APPLICATION
             │                             │
      ┌──────┴──────┐             ┌───────┴────────┐
      │             │             │                │
    Public      Announcements   Resident       Admin Area
    Sections                     Area              │
                                                ┌───┴────┐
                                                │        │
                                             Admin   Sub-admin
```

### Resident application

```text
Household
Members
Profile
Document Requests
Request Status
Notifications
Announcements
PDF Information
QR
Account/Settings
```

### Administrative application

```text
Dashboard
Households
Residents
Verification
Document Requests
Announcements
Reports
RBI
QR Scanner
Sub-admin Management
Archives
Settings
```

---

## 37. Current Major Workflows

### Household creation

```text
Create household
→ Submit information + ID
→ Verify SMS/email
→ Admin review
→ Approve / Return / Reject
→ Household activated
```

### Member creation

```text
Family Head adds member
→ Member information created
→ Member completes account verification
→ SMS/email verification
→ Admin/Sub-admin review
→ Approve / Return / Reject
→ Member account activated
```

A newly added household member must complete their own account activation and identity/contact verification before the account can become active. The verified member record is then reviewed by authorized barangay personnel to confirm that the new member is legitimate and appropriately associated with the household.

The Family Head may complete the member's information on the member's behalf, but the member's account still follows the same verification and administrative approval workflow.

### Document request

```text
Resident selects document
→ Fill required fields
→ Upload valid government ID
→ Submit
→ Admin/Sub-admin processing
→ Status tracking
→ Rejected / Returned / Completed
→ Notify user
→ Pickup at barangay
```

### New household from existing member

```text
Existing member
→ Creates new household
→ Previous household history retained
→ New household verification
→ Admin/Sub-admin review
→ Approve / Return / Reject
```

---

## 38. Remaining Client-Side Information

The system itself is largely defined. The remaining client-specific information includes:

### Documents

Barangay Lallana must provide:

- The documents currently offered by the barangay
- The required information/fields for each document
- Any applicable document-specific requirements

These requirements will determine the document request forms and processing rules.

### Newly moved residents

Barangay Lallana must define:

- How legitimate newly moved residents are verified when they are not yet present in existing barangay records
- What supporting information or documents may be required
- How such residents are classified

### Branding and content

The client will eventually provide, where applicable:

- Official barangay logo
- Official images/assets
- Barangay information
- Contact details
- Officials
- Announcement content
- Other branding preferences

Dummy content may be used during initial implementation until official content is provided.

---

## 39. Scope Notes

The following are intentionally outside the current baseline implementation scope unless separately approved and quoted:

- Online payment gateway
- Downloadable finished government documents for residents
- Resident-to-admin chat or messaging
- Automatic government ID type identification or authenticity validation
- PhilSys/eGov/third-party ID validation APIs
- Malware scanning service
- Native mobile application
- Offline synchronization
- External notification for every internal status transition

Any new feature or requirement introduced after scope approval should be evaluated separately and may require an additional quotation.

---

## 40. Implementation Principle

The implementation should prioritize:

1. Correct business workflows
2. Clear role permissions
3. Secure handling of uploaded documents
4. Accurate household and resident relationships
5. Simple and intuitive user experience
6. Maintainable application architecture
7. Responsive and accessible interfaces
8. Scope control for the November delivery target

This document represents the current agreed functional direction and should be updated whenever a requirement is formally changed or clarified by the client.
