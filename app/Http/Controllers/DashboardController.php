<?php

namespace App\Http\Controllers;

use App\Enums\DocumentRequestStatus;
use App\Models\Announcement;
use App\Models\DocumentRequest;
use App\Models\Household;
use App\Models\ResidentProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();
        /** @var ResidentProfile|null $profile */
        $profile = $user->residentProfile;

        $isProfileComplete = $profile !== null
            && ! empty($profile->first_name)
            && ! empty($profile->last_name)
            && $profile->birthdate !== null
            && ! empty($profile->gender)
            && ! empty($profile->civil_status);

        /** @var Household|null $household */
        $household = Household::with(['verification', 'members'])
            ->where('family_head_id', $user->id)
            ->orWhereHas('members', fn ($query) => $query->where('user_id', $user->id))
            ->first();

        $isHouseholdVerified = $user->belongsToVerifiedHousehold();

        $announcements = Announcement::where('is_published', true)
            ->orderByDesc('published_at')
            ->take(3)
            ->get(['id', 'title', 'slug', 'excerpt', 'category', 'published_at']);

        // Document request statistics for the resident
        $userRequestsQuery = DocumentRequest::where('user_id', $user->id);
        $totalRequests = (clone $userRequestsQuery)->count();
        $activeRequests = (clone $userRequestsQuery)
            ->whereIn('current_status', [
                DocumentRequestStatus::Pending->value,
                DocumentRequestStatus::Processing->value,
                DocumentRequestStatus::OnHold->value,
            ])
            ->count();
        $readyForPickup = (clone $userRequestsQuery)
            ->where('current_status', DocumentRequestStatus::ReadyForPickup->value)
            ->count();

        $latestRequest = (clone $userRequestsQuery)
            ->with('documentType')
            ->orderByDesc('submitted_at')
            ->first();

        return Inertia::render('dashboard', [
            'isProfileComplete' => $isProfileComplete,
            'isHouseholdVerified' => $isHouseholdVerified,
            'household' => $household ? [
                'id' => $household->id,
                'household_code' => $household->household_code,
                'purok_sitio' => $household->purok_sitio,
                'address' => $household->address,
                'status' => $household->status,
                'verification_notes' => $household->verification?->review_notes,
                'members_count' => $household->members->count(),
                'is_family_head' => $household->family_head_id === $user->id,
            ] : null,
            'documentStats' => [
                'total_requests' => $totalRequests,
                'active_requests' => $activeRequests,
                'ready_for_pickup' => $readyForPickup,
                'latest_request' => $latestRequest ? [
                    'id' => $latestRequest->id,
                    'reference_code' => $latestRequest->reference_code,
                    'document_name' => $latestRequest->documentType->name,
                    'status' => $latestRequest->current_status->value,
                    'status_label' => $latestRequest->current_status->label(),
                    'status_color' => $latestRequest->current_status->color(),
                    'submitted_at' => $latestRequest->submitted_at?->toISOString(),
                ] : null,
            ],
            'announcements' => $announcements,
        ]);
    }
}
