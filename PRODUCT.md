# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Barangay Residents & Household Heads**: Citizens residing in Barangay Lallana, Trece Martires City, Cavite. Their primary goals are requesting official barangay documents (Clearances, Certificates of Indigency, Certificates of Residency, Business Endorsements), registering and managing household members, and staying informed on official barangay advisories without visiting the barangay hall in person.
- **Barangay Officials & Administrative Staff**: LGU administrators, barangay secretaries, and staff who manage the document issuance pipeline, verify resident KYC credentials, approve household registrations, issue official QR-coded certificates, and maintain census records through the Filament back-office.
- **Constituents & General Public**: Local community members seeking emergency hotlines, public service details, and submitting general inquiries to the barangay desk.

## Product Purpose

The Barangay Lallana Official E-Government Web Portal modernizes and centralizes civic service delivery for the community of Barangay Lallana in Trece Martires City, Cavite. It eliminates physical queuing, streamlines municipal documentation, and provides a transparent, secure, and accessible digital portal for residents and local administrators alike.

## Positioning

The authoritative, official digital public service gateway and verified civic registry for Barangay Lallana, Trece Martires City, Cavite — producing legally valid, QR-verifiable municipal documents backed by verified household registries.

## Operating Context

- **Environment & Devices**: Mobile-first for residents accessing the portal via smartphones on cellular or community Wi-Fi; desktop-optimized for barangay administrative staff operating the back-office in the barangay hall.
- **Key Workflows**:
  - *Public Portal*: Announcements, directory of officials, active emergency hotlines, and public inquiry submission protected by Cloudflare Turnstile.
  - *Resident Onboarding & Verification*: Resident KYC profile setup, household registration with mobile SMS OTP verification, household member invitations, and head-of-household management.
  - *Document Issuance Pipeline*: Requesting clearances/certificates, tracking live processing stages, cancellation/edits, and downloading tamper-evident PDF certificates with unique QR verification codes.
  - *Administrative Management*: Staff review, approval/rejection workflows, and registry management via Filament.
- **Bilingual Interface**: Dual language support (English and Filipino / Tagalog).

## Capabilities and Constraints

- **Confirmed Capabilities**:
  - Secure authentication with two-factor authentication support (Fortify).
  - Resident KYC profile and residency verification.
  - Household management with SMS OTP verification.
  - Document request lifecycle (Draft, Submitted, Under Review, Approved, Ready for Pickup, Released, Rejected, Cancelled).
  - Automated PDF generation with DomPDF/Spatie Laravel PDF and verification QR codes.
  - Multi-channel alerts: in-app notifications and SMS updates.
  - Filament v5 administrative panel for barangay officials.
  - Turnstile bot protection on public touchpoints.
- **Durable Constraints**:
  - Official Philippine LGU compliance and legal document standards.
  - Mandatory verified household registration prior to official document issuance.
  - SMS OTP requirement for household registration integrity.
  - Tech stack: Laravel 13 with PHP 8.4, Inertia.js v3, React 19, Tailwind CSS v4, Wayfinder, and Filament v5.

## Brand Commitments

- **Official Name**: Barangay Lallana Official E-Government Web Portal
- **Jurisdiction**: Barangay Lallana, Trece Martires City, Province of Cavite, Philippines
- **Official Assets**: Barangay Lallana Official Seal (`public/lallana-icon.png`), official emergency hotlines (Barangay Hall Desk, PNP Trece Martires, BFP Fire, CDRRMO).
- **Tone & Voice**: Dignified, accessible, transparent, responsive, and authoritative public service.

## Evidence on Hand

- Official Seal asset: `public/lallana-icon.png`
- Core application routes and permission middleware: `routes/web.php`
- Resident & Household workflow controllers: `app/Http/Controllers/Household/`, `app/Http/Controllers/Resident/`
- Document request controllers: `app/Http/Controllers/Document/`
- Administrative resource definitions: `app/Filament/Resources/`
- Bilingual dictionary and landing page implementation: `resources/js/pages/welcome.tsx`
- Dev SMS Simulator: `app/Http/Controllers/Dev/DevSmsController.php` (for local and staging testing)

## Product Principles

1. **Civic Trust & Authenticity**: Every citizen record and issued certificate must be authentic, auditable, and verifiable via tamper-resistant QR codes.
2. **Universal Accessibility & Clarity**: Clear, bilingual, high-contrast layouts designed to be effortless for constituents across all age groups, digital proficiencies, and smartphone devices.
3. **Transparent Service Delivery**: Eliminate bureaucratic uncertainty by providing clear requirements, fee schedules, and real-time request tracking at every stage.
4. **Frictionless Citizen Interactions**: Streamline administrative procedures so residents can complete vital civic transactions without taking time off work to queue at the barangay hall.

## Accessibility & Inclusion

- Mobile-first responsiveness catering to residents on entry-level smartphones and variable mobile data connections.
- Bilingual localization (English and Filipino) to ensure inclusivity across the community.
- WCAG AA contrast compliance and accessible Radix UI primitives for readable, keyboard-navigable forms and modals.
