<?php

namespace App\Services\QrCode;

use App\Enums\QrStatus;
use App\Models\DocumentRequest;
use App\Models\QrIdentifier;
use App\Models\User;
use F9WebLtd\QrCode\Facades\QrCode;
use Illuminate\Support\Str;

class QrCodeService
{
    /**
     * Generate or reuse an active QR identifier for an issued document request.
     */
    public function generateForDocument(DocumentRequest $request, ?User $issuer = null): QrIdentifier
    {
        // Reuse existing active, unexpired token if already present
        $existing = QrIdentifier::where('document_request_id', $request->id)
            ->where('status', QrStatus::Active->value)
            ->where(function ($q) {
                $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
            })
            ->latest()
            ->first();

        if ($existing) {
            return $existing;
        }

        $token = Str::random(32);
        $securityHash = $this->computeSecurityHash($token, $request->reference_code, $request->user_id);

        return QrIdentifier::create([
            'token' => $token,
            'document_request_id' => $request->id,
            'resident_id' => $request->user_id,
            'household_id' => $request->user->household()?->id,
            'document_type' => $request->documentType->slug,
            'reference_code' => $request->reference_code,
            'status' => QrStatus::Active,
            'security_hash' => $securityHash,
            'metadata' => [
                'issued_by' => $issuer->name ?? 'Barangay Staff',
                'issued_by_id' => $issuer?->id,
                'issued_at' => now()->toIso8601String(),
                'resident_name' => $request->user->name,
                'purpose' => $request->purpose,
            ],
            'expires_at' => now()->addMonths(6),
        ]);
    }

    /**
     * Generate base64 Data URI SVG string for embedding in PDF or web views.
     */
    public function getQrSvgDataUri(string $token, int $size = 110): string
    {
        $verificationUrl = url("/verify/qr/{$token}");
        $svg = (string) QrCode::format('svg')
            ->size($size)
            ->errorCorrection('H')
            ->margin(1)
            ->generate($verificationUrl);

        return 'data:image/svg+xml;base64,'.base64_encode($svg);
    }

    /**
     * Validate an opaque QR token against security rules.
     *
     * @return array{valid: bool, status: string, message: string, qr: QrIdentifier|null}
     */
    public function validateToken(string $token): array
    {
        $cleanToken = trim($token);

        /** @var QrIdentifier|null $qr */
        $qr = QrIdentifier::with([
            'documentRequest.documentType',
            'resident.residentProfile',
            'household',
        ])
            ->where(function ($query) use ($cleanToken) {
                $query->where('token', $cleanToken)
                    ->orWhere('reference_code', $cleanToken);
            })
            ->first();

        if (! $qr) {
            return [
                'valid' => false,
                'status' => 'not_found',
                'message' => 'Document verification code not found. The certificate may be invalid or forged.',
                'qr' => null,
            ];
        }

        if ($qr->status === QrStatus::Revoked) {
            return [
                'valid' => false,
                'status' => 'revoked',
                'message' => 'This document has been officially revoked or cancelled by Barangay Lallana.',
                'qr' => $qr,
            ];
        }

        if ($qr->isExpired()) {
            return [
                'valid' => false,
                'status' => 'expired',
                'message' => 'This document has expired. Official barangay clearances are valid for 6 months from issue date.',
                'qr' => $qr,
            ];
        }

        // Verify cryptographic signature integrity
        $expectedHash = $this->computeSecurityHash($qr->token, $qr->reference_code, (int) $qr->resident_id);
        if (! hash_equals($qr->security_hash, $expectedHash)) {
            return [
                'valid' => false,
                'status' => 'tampered',
                'message' => 'Document failed security signature verification. Suspected forgery.',
                'qr' => $qr,
            ];
        }

        return [
            'valid' => true,
            'status' => 'authentic',
            'message' => 'Official Document Verified. Issued by Barangay Lallana, Trece Martires City, Cavite.',
            'qr' => $qr,
        ];
    }

    /**
     * Record a scan event for audit tracking.
     */
    public function recordScan(QrIdentifier $qr, ?User $scanner = null): void
    {
        $qr->increment('scanned_count');
        $qr->update(['last_scanned_at' => now()]);
    }

    /**
     * Compute HMAC-SHA256 signature for tamper-proofing.
     */
    protected function computeSecurityHash(string $token, string $referenceCode, int $userId): string
    {
        $appKey = (string) config('app.key');
        $payload = "{$token}|{$referenceCode}|{$userId}|barangay-lallana";

        return hash_hmac('sha256', $payload, $appKey);
    }
}
