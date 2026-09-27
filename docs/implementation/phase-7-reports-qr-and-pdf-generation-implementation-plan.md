# Phase 7: Reports, QR Code & PDF Generation Implementation Plan

Implement official **PDF Generation, Document Verification QR Codes, Protected Mobile Camera Scanner, and Record of Barangay Inhabitants (RBI) Reporting** for Barangay Lallana according to [Progress Summary § Phase 7](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/progress-summary.md#L118-L127) and [Blueprint §25, §28, §29](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-implementation-blueprint.md#L690-L774).

---

## 1. System Architecture & Lifecycle

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        PHASE 7 DOCUMENT GENERATION & QR VERIFICATION                   │
└────────────────────────────────────────────────────────────────────────────────────────┘
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    ▼                                             ▼
       ┌─────────────────────────┐                   ┌─────────────────────────┐
       │   DOCUMENT REQUEST      │                   │   DEMOGRAPHIC DATA      │
       │   (Approved / Ready)    │                   │   (Households/Residents)│
       └────────────┬────────────┘                   └────────────┬────────────┘
                    │                                             │
                    ▼                                             ▼
       ┌─────────────────────────┐                   ┌─────────────────────────┐
       │ QrCodeService           │                   │ RBI Summary Aggregator  │
       │ • Generate opaque token │                   │ • Filter by Purok       │
       │ • HMAC-SHA256 security  │                   │ • Demographic groups    │
       │ • Base64 SVG embedding  │                   │   (PWD, Seniors, Solo)  │
       └────────────┬────────────┘                   └────────────┬────────────┘
                    │                                             │
                    └──────────────────────┬──────────────────────┘
                                           │
                                           ▼
       ┌───────────────────────────────────────────────────────────────────────┐
       │ PdfGenerationService (spatie/laravel-pdf + DomPdfDriver)              │
       │ • Official Letterhead (Barangay Lallana, Trece Martires City, Cavite) │
       │ • Official Barangay Seal & Cavite City Seal                           │
       │ • Punong Barangay Signature line & Dry Seal Marker                    │
       │ • Embedded QR Verification Token                                      │
       └───────────────────────────────────┬───────────────────────────────────┘
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    ▼                                             ▼
       ┌─────────────────────────┐                   ┌─────────────────────────┐
       │ Printed Physical Paper  │                   │ Saved in Storage Disk   │
       │ • Handed to resident    │                   │ • `verification-docs`   │
       │ • Contains embedded QR  │                   │ • `FileRecord` attached │
       └────────────┬────────────┘                   └─────────────────────────┘
                    │
                    ▼
       ┌───────────────────────────────────────────────────────────────────────┐
       │ QR Verification Subsystem                                             │
       ├───────────────────────────────────┬───────────────────────────────────┤
       │ Protected Staff Scanner           │ Public Anti-Fraud Portal          │
       │ • Route: `/admin/qr-scanner`      │ • Route: `/verify/qr/{token}`     │
       │ • In-browser `@zxing/browser`     │ • Validates token & HMAC seal     │
       │ • Full resident details + actions │ • Masked privacy view (DPA 2012)  │
       └───────────────────────────────────┴───────────────────────────────────┘
```

---

## 2. Deliverables & Technical Specifications

### A. Database Layer: `qr_identifiers` Table
Create dedicated table storing cryptographic QR tokens per [Data Model §23](file:///c:/Users/Paul/Projects/e-gov-lallana/docs/implementation/barangay-lallana-database-data-model-specification.md#L630-L650):
- `id`: bigIncrements
- `token`: string (unique indexed, 32-character high-entropy alphanumeric string)
- `document_request_id`: foreignId constrained to `document_requests` (cascadeOnDelete)
- `resident_id`: foreignId constrained to `users` (nullOnDelete)
- `household_id`: foreignId constrained to `households` (nullOnDelete)
- `document_type`: string (e.g., `barangay_clearance`, `certificate_of_indigency`, `certificate_of_residency`)
- `reference_code`: string (e.g., `REQ-2026-0001`)
- `status`: string default `'active'` (`active`, `revoked`, `expired`)
- `security_hash`: string (HMAC-SHA256 signature guaranteeing document authenticity)
- `metadata`: jsonb nullable (issuer name, purpose, resident name, issue date)
- `scanned_count`: integer default 0
- `last_scanned_at`: timestamp nullable
- `expires_at`: timestamp nullable (e.g. 6 months validity for clearances)
- `timestamps`

### B. Core Service: `QrCodeService`
File: `app/Services/QrCode/QrCodeService.php`
- `generateForDocument(DocumentRequest $request, User $issuer): QrIdentifier`:
  - Creates unique opaque token.
  - Computes HMAC-SHA256 security hash using `config('app.key')`.
  - Generates vector SVG QR code with `SimpleSoftwareIO\QrCode\Facades\QrCode` pointing to the canonical verification URL (`route('public.verify.qr', ['token' => $token])`).
  - Returns `QrIdentifier` model with base64 encoded SVG.
- `validateToken(string $token): array`:
  - Looks up token in `qr_identifiers`.
  - Checks expiration and revocation status.
  - Verifies HMAC signature integrity against stored metadata.
- `recordScan(QrIdentifier $qr, ?User $scanner = null): void`:
  - Increments scan counter and updates `last_scanned_at`.

### C. Core Service: `PdfGenerationService`
File: `app/Services/Pdf/PdfGenerationService.php`
- Integrates `spatie/laravel-pdf` using PHP-native `DomPdfDriver` (zero binary overhead on Render free tier).
- `generateDocumentPdf(DocumentRequest $request, User $issuer): FileRecord`:
  - Resolves resident profile, household, submitted dynamic data, and barangay officials roster.
  - Obtains or generates `QrIdentifier` token and base64 SVG QR code.
  - Selects appropriate Blade template:
    - `barangay-clearance` -> `pdf.documents.barangay-clearance`
    - `certificate-of-indigency` -> `pdf.documents.certificate-of-indigency`
    - `certificate-of-residency` -> `pdf.documents.certificate-of-residency`
  - Generates A4 PDF output.
  - Stores output in `verification-documents` disk via `FileUploadService`.
  - Updates `document_requests.generated_pdf_file_id`.
- `generateRbiReport(?string $purok = null, ?User $issuer = null): string`:
  - Gathers households, members, and demographic summaries grouped by Purok.
  - Generates Landscape A4 PDF report (`pdf.reports.rbi-summary`).

### D. Official Blade PDF Templates
Create high-resolution, print-ready templates in `resources/views/pdf/`:
1. `resources/views/pdf/layouts/official-document.blade.php`:
   - Common styling, letterhead, official seals, watermark, typography, dry seal layout, and signature blocks.
2. `resources/views/pdf/documents/barangay-clearance.blade.php`:
   - Official Barangay Clearance with thumbmark frames, resident photo/avatar placeholder, signature box, and QR verification stamp.
3. `resources/views/pdf/documents/certificate-of-indigency.blade.php`:
   - Official Certificate of Indigency with legal certification statements, specified assistance purpose, and QR code.
4. `resources/views/pdf/documents/certificate-of-residency.blade.php`:
   - Official Residency Certificate with length of residency and purok verification.
5. `resources/views/pdf/reports/rbi-summary.blade.php`:
   - Landscape A4 format, tabular summary of households, family heads, dependents, senior citizens, PWDs, solo parents, and registered voters.

### E. Staff Document Management & Actions
Files:
- `app/Filament/Resources/DocumentRequests/Pages/ViewDocumentRequest.php`
- `app/Filament/Resources/DocumentRequests/Tables/DocumentRequestsTable.php`
Actions:
- **"Generate / Download PDF"**:
  - Automatically invokes `PdfGenerationService`, attaches `generated_pdf_file_id`, and initiates file download.
- **"Preview PDF"**:
  - Opens temporary signed URL in new browser tab for immediate on-screen inspection before physical printing.
- **"Regenerate PDF"**:
  - Re-compiles template if request corrections were applied.

### F. Protected Mobile Camera QR Scanner
Files:
- `resources/js/pages/admin/qr-scanner.tsx`
- `app/Http/Controllers/Admin/AdminQrScannerController.php`
Features:
- Access restricted to `admin` and `sub_admin` roles.
- Interactive camera scanner using `@zxing/browser`.
- Front / rear camera toggle for mobile staff patrolling or at the front desk.
- Camera targeting reticle and visual/audio feedback on successful scan.
- Manual token entry field for damaged or smudged physical documents.
- Detailed modal display:
  - Document Authenticity Badge: **VALID** / **REVOKED** / **EXPIRED** / **INVALID**
  - Reference Code, Document Type, Issued Date, Expiration Date
  - Resident Name, Photo, Purok Address, Household Code
  - Issuing Official Name
  - Direct link to admin record in Filament

### G. Public Anti-Fraud Verification Page
Files:
- `resources/js/pages/public/verify-document.tsx`
- `app/Http/Controllers/Public/PublicDocumentVerificationController.php`
Features:
- Accessible at `/verify/qr/{token}` when any standard phone camera scans the printed QR.
- Tamper-proof validation: verifies token and checks HMAC-SHA256 signature.
- Privacy compliance (Philippine Data Privacy Act of 2012):
  - Displays document validity, type, reference number, and issue date.
  - Resident name is partially masked (e.g. `J*** D**`) to prevent public snooping.

---

## 3. Verification & Testing Plan

### Automated Feature & Unit Tests
1. `tests/Feature/Pdf/DocumentPdfGenerationTest.php`:
   - Verify PDF generation for Barangay Clearance, Indigency, and Residency.
   - Verify storage persistence on `verification-documents` disk and link to `document_requests`.
   - Verify RBI summary export generation with mock households.
2. `tests/Feature/Qr/QrVerificationTest.php`:
   - Verify opaque token generation and HMAC-SHA256 signature.
   - Verify protected scanner API grants access to Admin/Sub-admin and rejects unauthorized users.
   - Verify scan count and timestamp tracking.
   - Verify public verification endpoint renders valid status for legitimate tokens and 404/invalid for forged tokens.
3. Code Quality Gates:
   - `vendor/bin/phpstan analyse --memory-limit=2G` (Zero errors at Level 5+)
   - `npm run types:check` (Zero TypeScript errors)
   - `vendor/bin/pint --dirty --format agent` (Style compliance)
