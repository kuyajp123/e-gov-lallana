<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
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

        $announcements = Announcement::where('is_published', true)
            ->orderByDesc('published_at')
            ->take(3)
            ->get(['id', 'title', 'slug', 'excerpt', 'category', 'published_at']);

        return Inertia::render('dashboard', [
            'isProfileComplete' => $isProfileComplete,
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
            'announcements' => $announcements,
        ]);
    }
}
