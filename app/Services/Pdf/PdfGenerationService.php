<?php

namespace App\Services\Pdf;

use App\Models\DocumentRequest;
use App\Models\FileRecord;
use App\Models\Household;
use App\Models\User;
use App\Services\Files\FileUploadService;
use App\Services\QrCode\QrCodeService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Carbon;
use Spatie\LaravelPdf\Facades\Pdf;

class PdfGenerationService
{
    public function __construct(
        protected QrCodeService $qrCodeService,
        protected FileUploadService $fileUploadService
    ) {
        @ini_set('memory_limit', '512M');
    }

    /**
     * Generate an official PDF for a document request and store it as a FileRecord.
     */
    public function generateDocumentPdf(DocumentRequest $request, ?User $issuer = null): FileRecord
    {
        @ini_set('memory_limit', '512M');

        $request->loadMissing(['user.residentProfile', 'documentType']);

        // 1. Generate or retrieve QR identifier and vector SVG
        $qr = $this->qrCodeService->generateForDocument($request, $issuer);
        $qrCodeSvg = $this->qrCodeService->getQrSvgDataUri($qr->token, size: 100);

        // 2. Prepare resident view data
        $user = $request->user;
        $profile = $user->residentProfile;
        $household = $user->household();

        $age = null;
        if ($profile && $profile->birthdate) {
            $age = Carbon::parse($profile->birthdate)->age;
        }

        $residentData = [
            'name' => $user->name,
            'age' => $age,
            'civil_status' => $profile?->civil_status ? ucfirst($profile->civil_status) : 'Single',
            'purok' => $household ? $household->purok_sitio : '',
            'household_code' => $household?->household_code,
        ];

        // 3. Official seals (Base64 for reliable Dompdf rendering)
        $sealPath = file_exists(public_path('lallana-seal.png'))
            ? public_path('lallana-seal.png')
            : public_path('lallana-icon.png');

        $barangaySealBase64 = null;
        if (file_exists($sealPath)) {
            $contents = file_get_contents($sealPath);
            if ($contents !== false) {
                $barangaySealBase64 = 'data:image/png;base64,'.base64_encode($contents);
            }
        }

        $viewData = [
            'request' => $request,
            'resident' => $residentData,
            'purpose' => $request->purpose,
            'submittedData' => $request->submitted_data ?? [],
            'qr' => $qr,
            'qrCodeSvg' => $qrCodeSvg,
            'barangaySealBase64' => $barangaySealBase64,
            'citySealBase64' => $barangaySealBase64,
            'officials' => $this->getDefaultOfficials(),
        ];

        // 4. Select matching template
        $template = $this->resolveTemplate($request->documentType->slug);

        // 5. Generate PDF binary via Spatie PDF
        $tempPath = tempnam(sys_get_temp_dir(), 'pdf_doc_').'.pdf';

        Pdf::view($template, $viewData)
            ->format('A4')
            ->name("{$request->reference_code}.pdf")
            ->save($tempPath);

        $uploadedFile = new UploadedFile(
            $tempPath,
            "{$request->reference_code}.pdf",
            'application/pdf',
            null,
            true
        );

        $fileRecord = $this->fileUploadService->uploadVerificationDocument(
            $uploadedFile,
            userId: $request->user_id
        );

        @unlink($tempPath);

        // 7. Associate with document request
        $request->update([
            'generated_pdf_file_id' => $fileRecord->id,
        ]);

        return $fileRecord;
    }

    /**
     * Generate the official Record of Barangay Inhabitants (RBI) summary report.
     */
    public function generateRbiReport(?string $purok = null, ?User $issuer = null): string
    {
        @ini_set('memory_limit', '512M');

        $query = Household::with(['familyHead.residentProfile', 'members.user.residentProfile'])
            ->orderBy('household_code');

        if (! empty($purok)) {
            $query->where('purok_sitio', 'like', "%{$purok}%");
        }

        $householdsCollection = $query->get();

        $stats = [
            'total_households' => $householdsCollection->count(),
            'total_inhabitants' => 0,
            'total_seniors' => 0,
            'total_pwds' => 0,
            'total_solo_parents' => 0,
            'total_minors' => 0,
            'total_voters' => 0,
        ];

        $households = [];

        foreach ($householdsCollection as $hh) {
            $allProfiles = collect();
            if ($hh->familyHead?->residentProfile) {
                $allProfiles->push($hh->familyHead->residentProfile);
            }
            foreach ($hh->members as $member) {
                if ($member->user?->residentProfile) {
                    $allProfiles->push($member->user->residentProfile);
                }
            }
            $allProfiles = $allProfiles->unique('id');

            $inhabitantsCount = max($allProfiles->count(), $hh->members->count() + ($hh->family_head_id ? 1 : 0));
            $seniorsCount = $allProfiles->filter(fn ($p) => $p->senior_citizen_status || ($p->birthdate && Carbon::parse($p->birthdate)->age >= 60))->count();
            $pwdsCount = $allProfiles->filter(fn ($p) => (bool) $p->pwd_status)->count();
            $soloParentsCount = $allProfiles->filter(fn ($p) => (bool) $p->solo_parent_status)->count();
            $minorsCount = $allProfiles->filter(fn ($p) => $p->birthdate && Carbon::parse($p->birthdate)->age < 18)->count();
            $votersCount = $allProfiles->filter(fn ($p) => (bool) $p->is_voter)->count();

            $stats['total_inhabitants'] += $inhabitantsCount;
            $stats['total_seniors'] += $seniorsCount;
            $stats['total_pwds'] += $pwdsCount;
            $stats['total_solo_parents'] += $soloParentsCount;
            $stats['total_minors'] += $minorsCount;
            $stats['total_voters'] += $votersCount;

            $households[] = [
                'household_number' => $hh->household_code,
                'family_head_name' => $hh->familyHead->name ?? 'Unassigned Head',
                'purok' => $hh->purok_sitio,
                'members_count' => $inhabitantsCount,
                'seniors_count' => $seniorsCount,
                'pwds_count' => $pwdsCount,
                'solo_parents_count' => $soloParentsCount,
                'minors_count' => $minorsCount,
                'voters_count' => $votersCount,
                'status' => $hh->status,
            ];
        }

        $viewData = [
            'households' => $households,
            'stats' => $stats,
            'purok' => $purok,
            'officials' => $this->getDefaultOfficials(),
            'generated_at' => now(),
            'generated_by' => $issuer->name ?? 'Barangay Staff',
        ];

        $pdfBuilder = Pdf::view('pdf.reports.rbi-summary', $viewData)
            ->landscape()
            ->format('A4')
            ->name('RBI-Summary-'.now()->format('Ymd').'.pdf');

        return $pdfBuilder->generatePdfContent();
    }

    /**
     * Resolve the corresponding Blade view for a document slug.
     */
    protected function resolveTemplate(string $slug): string
    {
        return match ($slug) {
            'certificate-of-indigency', 'indigency' => 'pdf.documents.certificate-of-indigency',
            'certificate-of-residency', 'residency', 'barangay-certificate' => 'pdf.documents.certificate-of-residency',
            default => 'pdf.documents.barangay-clearance',
        };
    }

    /**
     * Default roster of Barangay Lallana officials.
     *
     * @return array<string, mixed>
     */
    protected function getDefaultOfficials(): array
    {
        return [
            'punong_barangay' => 'HON. CRISANTO V. LALLANA',
            'kagawads' => [
                'Hon. Maria Santos',
                'Hon. Danilo Reyes',
                'Hon. Elena Garcia',
                'Hon. Roberto Cruz',
                'Hon. Arlene Bautista',
                'Hon. Fernando Ocampo',
                'Hon. Grace Villanueva',
            ],
            'sk_chairperson' => 'Hon. Justin Ramos',
            'secretary' => 'Ana Patricia Diaz',
            'treasurer' => 'Ramonito Mendoza',
        ];
    }
}
