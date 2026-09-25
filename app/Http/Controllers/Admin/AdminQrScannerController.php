<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\QrIdentifier;
use App\Services\QrCode\QrCodeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AdminQrScannerController extends Controller
{
    public function index(): Response
    {
        $recentScans = QrIdentifier::with(['resident', 'documentRequest.documentType'])
            ->whereNotNull('last_scanned_at')
            ->orderByDesc('last_scanned_at')
            ->limit(10)
            ->get()
            ->map(fn (QrIdentifier $qr) => [
                'token' => $qr->token,
                'reference_code' => $qr->reference_code,
                'document_type' => $qr->documentRequest?->documentType->name ?? $qr->document_type,
                'resident_name' => $qr->resident->name ?? 'Unknown',
                'status' => $qr->status->value,
                'last_scanned_formatted' => $qr->last_scanned_at?->diffForHumans(),
            ]);

        return Inertia::render('admin/qr-scanner', [
            'recentScans' => $recentScans,
        ]);
    }

    public function verify(Request $request, QrCodeService $qrCodeService): JsonResponse
    {
        $validated = $request->validate([
            'token' => 'required|string|max:255',
        ]);

        $rawToken = trim($validated['token']);

        // Support full URLs if scanner decodes e.g. "https://domain.com/verify/qr/{token}"
        if (str_contains($rawToken, '/verify/qr/')) {
            $rawToken = last(explode('/verify/qr/', $rawToken));
        }

        $result = $qrCodeService->validateToken($rawToken);

        if (! $result['valid'] || ! $result['qr']) {
            return response()->json([
                'success' => false,
                'status' => $result['status'],
                'message' => $result['message'],
            ], 422);
        }

        $qr = $result['qr'];
        $qrCodeService->recordScan($qr, Auth::user());

        $req = $qr->documentRequest;
        $resident = $qr->resident;
        $profile = $resident?->residentProfile;
        $household = $resident?->household() ?? $qr->household;

        $age = null;
        if ($profile && $profile->birthdate) {
            $age = Carbon::parse($profile->birthdate)->age;
        }

        return response()->json([
            'success' => true,
            'status' => $result['status'],
            'message' => $result['message'],
            'payload' => [
                'token' => $qr->token,
                'reference_code' => $qr->reference_code,
                'document_type' => $req?->documentType->name ?? $qr->document_type,
                'request_id' => $req?->id,
                'current_status' => $req?->current_status->value ?? 'completed',
                'payment_status' => $req?->payment_status->value ?? 'paid',
                'purpose' => $req->purpose ?? $qr->metadata['purpose'] ?? 'Barangay Requirement',
                'issued_at' => $qr->created_at?->format('M d, Y h:i A'),
                'expires_at' => $qr->expires_at?->format('M d, Y'),
                'is_expired' => $qr->isExpired(),
                'scanned_count' => $qr->scanned_count,
                'resident' => [
                    'id' => $resident?->id,
                    'name' => $resident?->name,
                    'email' => $resident?->email,
                    'contact_number' => $resident?->phone_number,
                    'purok' => $household?->purok_sitio,
                    'civil_status' => $profile?->civil_status ? ucfirst($profile->civil_status) : null,
                    'age' => $age,
                    'is_voter' => (bool) $profile?->is_voter,
                    'is_pwd' => (bool) $profile?->pwd_status,
                    'is_senior' => (bool) $profile?->senior_citizen_status,
                    'avatar_url' => $profile?->avatar?->getUrl(),
                ],
                'household' => $household ? [
                    'id' => $household->id,
                    'household_number' => $household->household_code,
                    'purok' => $household->purok_sitio,
                    'status' => $household->status,
                ] : null,
                'admin_view_url' => $req ? "/admin/document-requests/{$req->id}" : null,
            ],
        ]);
    }
}
