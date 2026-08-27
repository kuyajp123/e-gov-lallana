# Barangay Lallana E-Government Web-Based Information System

## Landing Page Functional & Content Specification

**Document Type:** Functional / Content Gap Documentation
**Scope:** Public Landing Page
**Status:** Updated Initial Specification
**Project:** E-Government Web-Based Information System for Barangay Lallana

---

## 1. Purpose

This document defines the functional requirements, content requirements, data sources, and outstanding information needed for the public landing page of the Barangay Lallana E-Government Web-Based Information System.

The purpose of this documentation is to serve as a **gap solution and implementation reference** for the landing page.

This document does **not** prescribe:

* Visual layout
* Color palette
* Typography
* Spacing
* Animations
* Component styling
* Specific UI libraries
* Exact responsive breakpoints

The implementation should focus on ensuring that the landing page contains the correct information, connects to the appropriate system data, and provides clear access to the system's public and resident-facing functions.

The landing page is part of the system's public-facing area and can be accessed without authentication. The overall system specification identifies the landing page as one of the three primary areas of the application, alongside the Resident/Household Application and the Barangay Admin/Sub-admin Application.

---

# 2. Landing Page Scope

The landing page consists of the following major sections:

1. Home / Hero
2. About
3. About Barangay
4. Services
5. System Statistics
6. Announcements
7. Contact
8. Contact / Email Inquiry Form

The page should primarily communicate:

* What Barangay Lallana is
* What services the system provides
* What residents can do through the platform
* Current barangay announcements
* Basic barangay information
* How residents can contact the barangay
* How residents can begin using the system

The landing page should remain publicly accessible without requiring authentication.

---

# 3. Home / Hero Section

## 3.1 Purpose

The Hero section serves as the primary introduction to the system and should immediately communicate the purpose of the Barangay Lallana e-government platform.

The section should contain:

* A background image
* A smooth visual backdrop treatment
* A primary headline
* A supporting subtitle
* A primary action
* A secondary action

The exact visual treatment is an implementation concern and is intentionally not defined by this document.

---

## 3.2 Hero Content

### Headline

The headline should communicate the primary purpose of the platform.

Recommended concept:

> **Barangay Lallana E-Government Services**

The final headline may be adjusted during content implementation.

### Subtitle

The subtitle should briefly explain that the platform provides residents with convenient digital access to barangay information and services.

It should communicate the transition from traditional/manual transactions toward a more accessible digital service.

This is consistent with the project's objective of improving efficiency, accessibility, and convenience in barangay service delivery.

---

## 3.3 Hero Actions

Two primary actions are required:

### Primary Action — Request

The primary action should direct users toward the document-request workflow.

Expected behavior:

```text
Hero
  ↓
Request
  ↓
Resident authentication / registration
  ↓
Document Request
```

Because document requests are protected functionality, unauthenticated visitors should be directed through the appropriate authentication or registration workflow before accessing the request module.

The system specification identifies document requesting as a protected resident feature available after the required verification process.

### Secondary Action — Create Household

The secondary action should allow a new resident/family head to begin household registration.

Expected behavior:

```text
Create Household
      ↓
Household Registration
      ↓
Information + Government ID
      ↓
SMS / Email Verification
      ↓
Barangay Verification
```

Creating a household requires barangay verification before protected household services become available.

---

# 4. About Section

## 4.1 Purpose

The About section provides visitors with background information about the barangay and its relationship to Trece Martires City.

The section is primarily informational and does not require authenticated access.

---

## 4.2 Barangay Historical Information

The provided client content identifies Barangay Aguado as one of the thirteen barangays of Trece Martires City and describes its historical background, including the naming of the barangay in honor of Luis Aguado.

The supplied content also states that Aguado received its name following the approval of Republic Act 981 on May 24, 1954 and was formerly known as "Fiscal Mundo."

The content describes the barangay as consisting of:

* Barangay Proper
* Southville 2
* Sitio Pag-Asa I
* Sitio Pag-Asa II
* South Summit Ridge Residence (SSRR)

It also states that the barangay consists of six purok in Barangay Proper and has a total land area of 298 hectares.

The supplied content identifies the following boundaries:

| Direction | Boundary           |
| --------- | ------------------ |
| North     | Barangay Lapidario |
| South     | Indang             |
| East      | Barangay Inocencio |
| West      | Barangay Cabuco    |

### Content Verification Requirement

There is an important content discrepancy that must be resolved before production.

The current project is explicitly for:

> **Barangay Lallana**

The newly supplied landing-page content begins with:

> **Barangay Aguado**

Therefore, the historical/profile information must **not automatically be published as Barangay Lallana information**.

The client/project team must confirm whether:

1. The content was accidentally copied from Barangay Aguado,
2. Barangay Aguado is the correct barangay for this particular deployment, or
3. The content needs to be replaced with official Barangay Lallana information.

This is a **content gap**, not a UI implementation issue.

The project documentation consistently identifies the target system as Barangay Lallana in Trece Martires City, Cavite.

---

## 4.3 Trece Martires City Information

The supplied content also includes general information about Trece Martires City, including:

* Its role as the de facto capital of Cavite
* Presence of provincial government offices
* Its function as a growth center
* Urban and socioeconomic development
* Infrastructure
* Peace and order
* Industrial development
* Community hospitality
* Historical and cultural identity

This content may be used as supporting information if confirmed by the client.

It should not be presented as official Barangay Lallana-specific information unless the relationship between the city-level content and barangay-level content is made clear.

---

# 5. About Barangay Section

## 5.1 Purpose

This section provides the official leadership and governance message of the barangay.

It should contain:

* Barangay Captain
* Barangay Captain's message
* Barangay officials

---

## 5.2 Barangay Captain

The currently supplied content identifies:

**Barangay Captain:**
**HON. CECILIA M. DECILLO**

The accompanying message emphasizes:

* Public service
* Leadership responsibility
* Being a role model to the community
* Good governance
* Integrity
* Service to the people
* Community benefit

The supplied statement includes the quotation:

> "GOOD GOVERNANCE NEEDS SELF-DISCIPLINE. ONLY DISCIPLINE WITHIN CAN ENSURE DISCIPLINE WITHOUT."

The exact official wording should be preserved or confirmed by the barangay before final publication.

---

## 5.3 Barangay Officials

The official list of barangay officials has not yet been provided.

For the current implementation, temporary placeholder records may be used.

Example:

```text
Barangay Captain
[Placeholder]

Barangay Official
[Placeholder]

Barangay Official
[Placeholder]

Barangay Official
[Placeholder]
```

The placeholders should be treated as temporary development content and must be replaced once the client provides the official list.

### Required Client Data

The barangay should eventually provide:

* Full name
* Position
* Optional photograph
* Optional short profile
* Any other official designation required by the barangay

The final official list should be treated as the authoritative source for the landing page.

---

# 6. Services Section

## 6.1 Purpose

The Services section communicates the barangay services that residents can access through the e-government platform.

The current confirmed service list contains three services.

### Current Services

1. Barangay Certificate
2. Barangay Clearance
3. Certificate of Indigency

These correspond with the project's primary purpose of providing residents with online access to barangay document requests. The research documentation identifies barangay clearances and certificates as core digital outputs of the system.

---

## 6.2 Service Information

Each service entry should contain sufficient information to allow residents to understand what the service represents.

At minimum:

* Service name
* Short description
* Request action

The request action should lead to the appropriate authentication/request workflow.

Example:

```text
Service
   ↓
Request
   ↓
Login / Register
   ↓
Document Request
```

---

## 6.3 Future Service Expansion

The existing system specification allows document types to evolve based on the barangay's actual requirements.

The client still needs to provide:

* Complete list of documents offered
* Required information for each document
* Document-specific requirements
* Applicable fees
* Processing rules

These requirements will determine the final document-request forms.

The landing page should therefore be implemented in a way that allows additional services to be added later without requiring structural changes to the entire page.

---

# 7. System Statistics Section

## 7.1 Purpose

The landing page may display administrative statistics to provide visitors with a general overview of the community and system.

The proposed statistics are:

* Total Users
* Total Households
* Total Barangay Officials

These values should represent administrative/system data rather than manually entered static numbers.

---

## 7.2 Data Sources

### Total Users

Represents the number of registered/appropriate resident accounts according to the system's defined account status.

The exact counting rule should be finalized to determine whether this includes:

* All registered users
* Only verified users
* Only active users

**Recommended:** count only active/verified resident accounts.

### Total Households

Represents the number of active/verified household records.

**Recommended:** exclude rejected, archived, and inactive household records from the public count.

### Total Barangay Officials

Represents the number of active official/admin personnel represented in the system.

The system specification distinguishes Admin and Sub-admin roles and provides administrative management of sub-admins.

The exact counting rule should be confirmed with the client.

---

## 7.3 Privacy Consideration

The statistics should expose only aggregate numbers.

The landing page must not expose:

* Resident names
* Household names
* Contact information
* Individual profiles
* Government IDs
* Private administrative records

Only aggregate counts should be publicly accessible.

---

# 8. Announcements Section

## 8.1 Purpose

The Announcements section displays current public information published by barangay administrators.

Announcements are dynamic data and must not be hardcoded into the landing page.

The existing system specification explicitly identifies the Announcement Module as the source for public advisories, community programs, emergency rules, and official memoranda.

---

## 8.2 Data Source

The landing page must retrieve announcements from the system's Announcement Module.

Expected flow:

```text
Admin / Sub-admin
        ↓
Announcement Module
        ↓
Create / Update Announcement
        ↓
Database
        ↓
Public Landing Page
```

The landing page therefore acts as a public presentation layer for announcement data.

---

## 8.3 Announcement Data

An announcement may contain:

* Title
* Description
* Rich-text content
* Image
* Attachment
* Link
* Announcement type
* Publication information
* Status

The system specification identifies announcement types such as:

* Events
* Meetings
* Advisory
* Other applicable categories

---

## 8.4 Public Announcement Rules

Only announcements intended for public visibility should appear on the landing page.

The page should not expose:

* Draft announcements
* Archived announcements
* Internal administrative content
* Private information

Announcements may also be displayed inside authenticated resident dashboards, ensuring consistency between the public portal and resident application.

---

## 8.5 Empty State

If there are currently no published announcements, the section should provide an appropriate empty state rather than displaying fabricated announcements.

Example:

> No announcements available at this time.

---

# 9. Contact Section

## 9.1 Purpose

The Contact section provides visitors with official barangay contact and location information.

The section should contain:

* Location/map image
* Barangay address
* Telephone/contact number
* Official email address

---

## 9.2 Map Representation

The landing page should use a **static image representing the barangay location/map**.

It should not embed a live Google Maps interface as the landing-page map.

Expected structure:

```text
Map Image
+
Barangay Address
+
Telephone / Contact Number
+
Email Address
```

The actual map image and location information must be supplied or approved by the client.

---

## 9.3 Contact Information

The following values are currently required but have not yet been provided:

```text
Address:
[To be provided]

Telephone / Contact Number:
[To be provided]

Email:
[To be provided]
```

These should be treated as client-content gaps.

The application must not invent official contact information.

---

# 10. Email Inquiry Form

## 10.1 Purpose

The Contact section will also provide a form that allows visitors to send an inquiry to the barangay.

The visitor should be able to provide the required contact/message information and submit the inquiry through the system.

---

## 10.2 Basic Workflow

```text
Visitor
   ↓
Complete Contact Form
   ↓
Validation
   ↓
Bot Protection / Abuse Prevention
   ↓
Submit
   ↓
Email Delivery
   ↓
Barangay Official Email
```

---

## 10.3 Form Requirements

The final form fields should be confirmed before implementation.

A reasonable initial structure is:

* Name
* Email
* Subject
* Message

Additional fields may be introduced if required by the barangay.

---

## 10.4 Security and Abuse Prevention

Because the form is publicly accessible, it should include appropriate protection against automated abuse.

The system's broader security requirements include practical protections such as:

* Input validation
* Input sanitization
* Rate limiting
* Bot protection
* Protected backend processing

The form must not allow visitors to directly control arbitrary email headers or recipient addresses.

The destination email should be configured by the system and should not be supplied by the visitor.

---

# 11. Landing Page Data Classification

The landing page should distinguish between static content and dynamic system data.

| Section            | Data Type             | Source                         |
| ------------------ | --------------------- | ------------------------------ |
| Hero               | Static                | Application content            |
| About              | Static                | Official barangay content      |
| About Barangay     | Static                | Official barangay content      |
| Barangay Captain   | Static/client-managed | Official barangay content      |
| Barangay Officials | Static/client-managed | Official barangay list         |
| Services           | System-defined        | Document/service configuration |
| Total Users        | Dynamic               | Database                       |
| Total Households   | Dynamic               | Database                       |
| Total Officials    | Dynamic               | Database                       |
| Announcements      | Dynamic               | Announcement Module            |
| Map                | Static asset          | Client-provided/approved       |
| Address            | Static/client data    | Official barangay information  |
| Contact Number     | Static/client data    | Official barangay information  |
| Email              | Static/client data    | Official barangay information  |
| Contact Form       | Dynamic transaction   | Email service/backend          |

---

# 12. Authentication Boundary

The landing page itself is public.

Visitors should be able to:

* View barangay information
* View services
* View announcements
* View aggregate statistics
* View contact information
* Submit a contact inquiry

Visitors should not be able to access protected resident or administrative information without authentication and authorization.

The project's system design separates the public interface from restricted resident and administrative functionality.

---

# 13. Landing Page to Resident Application Navigation

The landing page serves as an entry point to the resident application.

Primary conversion paths include:

```text
Landing Page
    │
    ├── Request Service
    │       ↓
    │   Login / Registration
    │       ↓
    │   Resident Application
    │
    └── Create Household
            ↓
        Household Registration
            ↓
        Verification
            ↓
        Resident Application
```

The system requires household/resident verification before protected features become available.

---

# 14. Announcement Integration

The Announcement Module is an important dependency of the landing page.

The implementation should not create a separate announcement dataset specifically for the landing page.

Instead:

```text
Announcement Module
        ↓
Central Announcement Data
        ↓
Public Landing Page
        ↓
Resident Dashboard
```

This prevents inconsistencies between what administrators publish and what residents/visitors see.

---

# 15. Administrative Statistics Integration

The landing-page statistics should use the same authoritative database records used by the administrative system.

Example:

```text
Resident Records
      ↓
Verified/Active Count
      ↓
Landing Page

Household Records
      ↓
Verified/Active Count
      ↓
Landing Page

Official Records
      ↓
Active Count
      ↓
Landing Page
```

The public landing page should not maintain independent copies of these values.

---

# 16. Content Management Boundary

The landing page contains two categories of content.

## 16.1 Client-Provided Static Content

Examples:

* Barangay history
* Barangay description
* Barangay Captain information
* Official officials
* Address
* Contact numbers
* Official email
* Map image
* Official photographs
* Other official information

These should be updated when the barangay provides revised official information.

---

## 16.2 System-Generated Dynamic Content

Examples:

* Announcements
* Total users
* Total households
* Total officials

These should be retrieved from the system database/modules.

---

# 17. Current Content Gaps

The following information is still required from the client.

## 17.1 Barangay Identity Confirmation

The supplied landing-page content references **Barangay Aguado**, while the project documentation identifies the target system as **Barangay Lallana**.

**Priority: Critical**

The client must confirm the correct barangay identity before the historical/about content is published.

---

## 17.2 Official Barangay Officials

Required:

* Complete official list
* Position/designation
* Optional photographs
* Optional profiles

**Priority: High**

Temporary placeholders may be used during development.

---

## 17.3 Official Barangay Description

Required:

* Correct historical background
* Official barangay description
* Barangay boundaries
* Land area
* Purok information
* Relevant sitios/subdivisions

**Priority: High**

---

## 17.4 Official Contact Information

Required:

* Complete address
* Telephone/contact number
* Official email address

**Priority: High**

---

## 17.5 Map Asset

Required:

* Approved map/location image

**Priority: Medium**

---

## 17.6 Official Barangay Assets

Potentially required:

* Barangay photographs
* Barangay logo
* Official seal
* Leadership photographs
* Other approved images

The system currently has the application logo asset:

```text
public/lallana-icon.png
```

This asset is available for use as the system's logo/branding asset.

---

## 17.7 Complete Service List

Currently confirmed:

* Barangay Certificate
* Barangay Clearance
* Certificate of Indigency

The client must confirm whether additional services/documents should appear.

The research scope also mentions business permits in the broader resident request workflow, so this should be reconciled with the current client-approved service list before exposing it on the public landing page.

---

## 17.8 Service Requirements

For each service, the client should provide:

* Required fields
* Required documents
* Eligibility requirements
* Processing rules
* Applicable fee
* Expected processing procedure

These requirements will primarily affect the Document Request Module but should also inform service descriptions on the landing page.

---

# 18. Placeholder Policy

Where official information is not yet available, temporary placeholder content may be used during development.

However:

* Placeholder content must be clearly identifiable to developers.
* Placeholder content must not be presented as verified official information.
* Placeholder data must be easy to replace.
* Developers must not invent official barangay information.

Examples of appropriate temporary values:

```text
[Official Barangay Address — To Be Provided]

[Official Telephone Number — To Be Provided]

[Official Email — To Be Provided]

[Barangay Official Name — To Be Provided]
```

---

# 19. Landing Page Functional Requirements

The implementation should satisfy the following requirements.

### LP-001 — Public Accessibility

The landing page must be accessible without authentication.

### LP-002 — Hero Actions

The Hero section must provide:

* Request action
* Create Household action

### LP-003 — Request Navigation

The Request action must lead users toward the document-request workflow while respecting authentication and authorization requirements.

### LP-004 — Household Registration Navigation

The Create Household action must lead users toward household registration.

### LP-005 — Barangay Information

The page must provide official barangay information.

### LP-006 — Officials

The page must provide the current barangay leadership/official information once supplied by the client.

### LP-007 — Services

The page must display the currently supported public services.

### LP-008 — Dynamic Announcements

The page must retrieve published announcements from the Announcement Module.

### LP-009 — Dynamic Statistics

The page must retrieve applicable aggregate system statistics from the database.

### LP-010 — Contact Information

The page must display official location and contact information.

### LP-011 — Map Image

The page must use an approved map image rather than a live embedded map interface.

### LP-012 — Email Inquiry

The page must provide a contact form that allows visitors to submit inquiries.

### LP-013 — Input Validation

The contact form must validate submitted information.

### LP-014 — Public Data Protection

The landing page must expose only information intended for public consumption.

### LP-015 — Empty Announcement State

The page must gracefully handle situations where no announcements are currently published.

### LP-016 — Content Maintainability

Static client content should be structured so that it can be replaced when official information is provided.

---

# 20. Recommended Data Ownership

The landing page should follow a single-source-of-truth principle.

```text
                     DATABASE
                         │
       ┌─────────────────┼─────────────────┐
       │                 │                 │
   Announcements     Residents         Households
       │                 │                 │
       │                 │                 │
       └────────────┬────┴───────┬─────────┘
                    │            │
             Landing Page    Admin Dashboard
                    │
              Public Visitors
```

This prevents duplicated and inconsistent information.

For example, an administrator publishing a new announcement should not need to manually update the landing page.

---

# 21. Out-of-Scope for Landing Page

The following should not be implemented as part of the public landing page unless separately approved:

* Resident profile viewing
* Household profile viewing
* Private resident records
* Government ID viewing
* Administrative dashboard functionality
* Administrative record management
* Document processing
* Request approval
* RBI report generation
* Internal resident/admin messaging
* Online payment processing
* Resident document downloads

These belong to the authenticated resident or administrative application.

---

# 22. Relationship to Overall System

The landing page is the public entry point of the larger e-government platform.

The overall system is intended to digitize:

* Household registration
* Resident profiling
* Document requests
* Verification
* Announcements
* Administrative record management
* RBI reporting

The landing page should therefore function primarily as the **public information and service-entry layer**, rather than duplicating functionality belonging to authenticated modules.

---

# 23. Final Landing Page Information Architecture

The functional content structure is:

```text
PUBLIC LANDING PAGE
│
├── HOME / HERO
│   ├── Background Image
│   ├── Headline
│   ├── Subtitle
│   ├── Request
│   └── Create Household
│
├── ABOUT
│   ├── Barangay History
│   ├── Barangay Description
│   └── City Context
│
├── ABOUT BARANGAY
│   ├── Barangay Captain
│   ├── Captain's Message
│   └── Barangay Officials
│
├── SERVICES
│   ├── Barangay Certificate
│   ├── Barangay Clearance
│   └── Certificate of Indigency
│
├── STATISTICS
│   ├── Total Users
│   ├── Total Households
│   └── Total Barangay Officials
│
├── ANNOUNCEMENTS
│   └── Announcement Module Data
│
└── CONTACT
    ├── Map Image
    ├── Address
    ├── Telephone / Contact
    ├── Email
    └── Email Inquiry Form
```

---

# 24. Implementation Readiness

The landing page can proceed with development using temporary content for information that has not yet been supplied.

### Ready for Implementation

* Public landing-page structure
* Hero actions
* Services section
* Dynamic announcements integration
* Aggregate statistics concept
* Contact form concept
* Public/private data boundary
* `public/lallana-icon.png` branding asset

### Requires Client Confirmation

* Barangay Aguado vs. Barangay Lallana content
* Official barangay history
* Complete officials list
* Official address
* Contact number
* Official email
* Approved map image
* Complete service list
* Service-specific requirements
* Final official photographs/assets

---

# 25. Important Content Decision

Before the landing page is considered production-ready, the **Barangay Aguado / Barangay Lallana discrepancy must be resolved**.

The existing research and system specification consistently describe the project as the:

> **E-Government Web-Based Information System for Barangay Lallana**

while the newly supplied historical content identifies:

> **Barangay Aguado**

This should be treated as an unresolved client-content issue rather than silently changing one to the other.

The correct official information should be obtained from the client before publication.
