<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Services\QrCode\QrCodeService;
use Inertia\Inertia;
use Inertia\Response;

class PublicDocumentVerificationController extends Controller
{
    public function show(string $token, QrCodeService $qrCodeService): Response
    {
        $result = $qrCodeService->validateToken($token);

        $verificationData = null;

        if ($result['qr']) {
            $qr = $result['qr'];
            $req = $qr->documentRequest;
            $resident = $qr->resident;

            // Mask resident name for public privacy (e.g. "Juan Dela Cruz" -> "J*** D*** C***")
            $rawName = $qr->metadata['resident_name'] ?? $resident->name ?? 'Resident';
            $maskedName = $this->maskName($rawName);

            $verificationData = [
                'token' => $qr->token,
                'reference_code' => $qr->reference_code,
                'document_type' => $req?->documentType->name ?? ucwords(str_replace(['-', '_'], ' ', $qr->document_type)),
                'issued_at' => $qr->metadata['issued_at'] ?? $qr->created_at?->toIso8601String(),
                'issued_at_formatted' => $qr->created_at?->format('F d, Y h:i A'),
                'expires_at_formatted' => $qr->expires_at?->format('F d, Y'),
                'is_expired' => $qr->isExpired(),
                'status' => $qr->status->value,
                'masked_name' => $maskedName,
                'purpose' => $qr->metadata['purpose'] ?? $req->purpose ?? 'Official Barangay Purpose',
                'purok' => $resident?->household()->purok_sitio ?? $qr->household->purok_sitio ?? null,
                'issuing_authority' => 'Barangay Lallana, Trece Martires City, Cavite',
            ];
        }

        return Inertia::render('public/verify-document', [
            'valid' => $result['valid'],
            'status' => $result['status'],
            'message' => $result['message'],
            'document' => $verificationData,
        ]);
    }

    /**
     * Mask a full name for public privacy compliance.
     */
    protected function maskName(string $name): string
    {
        $words = explode(' ', trim($name));
        $maskedWords = array_map(function ($word) {
            $len = mb_strlen($word);
            if ($len <= 2) {
                return $word;
            }

            return mb_substr($word, 0, 1).str_repeat('*', min(4, $len - 1));
        }, $words);

        return implode(' ', $maskedWords);
    }
}
