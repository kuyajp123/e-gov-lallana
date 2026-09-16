<?php

namespace App\Http\Controllers\Household;

use App\Http\Controllers\Controller;
use App\Http\Requests\Household\UpdateHouseholdRequest;
use App\Models\Household;
use App\Models\HouseholdMember;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HouseholdController extends Controller
{
    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();

        /** @var Household|null $household */
        $household = Household::with([
            'familyHead.residentProfile.avatar',
            'members' => fn ($query) => $query->with('verification')->orderByDesc('is_family_head')->orderBy('last_name'),
            'verification.reviewer',
        ])
            ->where('family_head_id', $user->id)
            ->orWhereHas('members', fn ($query) => $query->where('user_id', $user->id)->where(function ($q) {
                $q->whereNull('invitation_status')->orWhere('invitation_status', 'accepted');
            }))
            ->first();

        $isFamilyHead = $household && (
            $household->family_head_id === $user->id ||
            $household->members()->where('user_id', $user->id)->where('is_family_head', true)->exists()
        );

        $pendingInvitation = null;
        if (! $household) {
            $pendingInvitation = HouseholdMember::with(['household.familyHead.residentProfile.avatar'])
                ->where(function ($query) use ($user) {
                    $query->where('user_id', $user->id)
                        ->orWhere('email', $user->email);
                })
                ->where('invitation_status', 'pending')
                ->first();
        }

        $headMember = $household ? $household->members->firstWhere('is_family_head', true) : null;

        $invitingHousehold = $pendingInvitation?->household;
        $invitingHead = $invitingHousehold?->familyHead;

        return Inertia::render('household/index', [
            'household' => $household ? [
                'id' => $household->id,
                'household_code' => $household->household_code,
                'address' => $household->address,
                'purok_sitio' => $household->purok_sitio,
                'status' => $household->status,
                'notes' => $household->notes,
                'submitted_at' => $household->submitted_at?->toISOString(),
                'verified_at' => $household->verified_at?->toISOString(),
                'family_head' => $household->familyHead ? [
                    'id' => $household->familyHead->id,
                    'name' => $household->familyHead->name,
                    'email' => $household->familyHead->email,
                    'phone_number' => $household->familyHead->phone_number,
                    'avatar_url' => $household->familyHead->residentProfile?->avatar?->getUrl(60),
                ] : [
                    'id' => 0,
                    'name' => $headMember ? $headMember->full_name : 'Family Head',
                    'email' => '',
                    'phone_number' => null,
                    'avatar_url' => null,
                ],
                'verification' => $household->verification ? [
                    'status' => $household->verification->status,
                    'review_notes' => $household->verification->review_notes,
                    'reviewed_at' => $household->verification->reviewed_at?->toISOString(),
                    'reviewer_name' => $household->verification->reviewer?->name,
                ] : null,
                'members' => $household->members->map(fn (HouseholdMember $member): array => [
                    'id' => $member->id,
                    'user_id' => $member->user_id,
                    'full_name' => $member->full_name,
                    'first_name' => $member->first_name,
                    'middle_name' => $member->middle_name,
                    'last_name' => $member->last_name,
                    'suffix' => $member->suffix,
                    'email' => $member->email,
                    'invitation_status' => $member->invitation_status,
                    'invited_at' => $member->invited_at?->toISOString(),
                    'relationship_to_head' => $member->relationship_to_head,
                    'is_family_head' => $member->is_family_head,
                    'is_spouse' => $member->isSpouse(),
                    'is_verified' => $member->isVerified(),
                    'is_adult' => $member->isAdult(),
                    'birthdate' => $member->birthdate?->toISOString(),
                    'gender' => $member->gender,
                    'civil_status' => $member->civil_status,
                    'occupation' => $member->occupation,
                    'residency_status' => $member->residency_status,
                ])->all(),
            ] : null,
            'pending_invitation' => $pendingInvitation ? [
                'id' => $pendingInvitation->id,
                'relationship_to_head' => $pendingInvitation->relationship_to_head,
                'invited_at' => $pendingInvitation->invited_at?->toISOString(),
                'household' => [
                    'id' => $invitingHousehold?->id,
                    'household_code' => $invitingHousehold?->household_code,
                    'address' => $invitingHousehold?->address,
                    'purok_sitio' => $invitingHousehold?->purok_sitio,
                    'family_head_name' => $invitingHead ? $invitingHead->name : 'Family Head',
                    'family_head_avatar' => $invitingHead?->residentProfile?->avatar?->getUrl(60),
                ],
            ] : null,
            'isFamilyHead' => $isFamilyHead,
        ]);
    }

    public function edit(Request $request): Response|RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();
        /** @var Household|null $household */
        $household = Household::with('verification')->where('family_head_id', $user->id)->first();

        if (! $household || $household->status !== 'returned') {
            return redirect()->route('household.index')
                ->with('error', 'Only returned household registrations can be edited.');
        }

        return Inertia::render('household/edit', [
            'household' => [
                'id' => $household->id,
                'household_code' => $household->household_code,
                'address' => $household->address,
                'purok_sitio' => $household->purok_sitio,
                'notes' => $household->notes,
                'status' => $household->status,
                'verification_notes' => $household->verification?->review_notes,
            ],
            'purokOptions' => [
                'Purok 1',
                'Purok 2',
                'Purok 3',
                'Purok 4',
                'Purok 5',
                'Purok 6',
                'Purok 7',
                'Sitio Pag-Asa',
                'Sitio Maharlika',
            ],
        ]);
    }

    public function update(UpdateHouseholdRequest $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();
        /** @var Household|null $household */
        $household = Household::where('family_head_id', $user->id)->first();

        if (! $household || $household->status !== 'returned') {
            return redirect()->route('household.index')
                ->with('error', 'Only returned household registrations can be updated.');
        }

        $validated = $request->validated();

        $household->update([
            'address' => $validated['address'],
            'purok_sitio' => $validated['purok_sitio'],
            'notes' => $validated['notes'] ?? null,
            'status' => 'unverified',
            'submitted_at' => now(),
        ]);

        $household->verification()->updateOrCreate(
            ['verifiable_type' => Household::class, 'verifiable_id' => $household->id],
            [
                'status' => 'pending',
                'review_notes' => null,
                'reviewed_at' => null,
            ]
        );

        return redirect()->route('household.index')
            ->with('success', 'Household details updated and resubmitted for barangay verification.');
    }
}
