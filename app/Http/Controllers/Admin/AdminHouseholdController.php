<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RestrictHouseholdRequest;
use App\Http\Requests\Admin\TransferHouseholdHeadRequest;
use App\Http\Requests\Admin\VerifyHouseholdRequest;
use App\Models\Household;
use App\Models\HouseholdMember;
use App\Services\Household\HouseholdSuccessionService;
use App\Services\Notification\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AdminHouseholdController extends Controller
{
    public const PUROK_OPTIONS = [
        'Purok 1',
        'Purok 2',
        'Purok 3',
        'Purok 4',
        'Purok 5',
        'Purok 6',
        'Purok 7',
        'Sitio Pag-Asa',
        'Sitio Maharlika',
    ];

    /**
     * Display a listing of households in the admin registry.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $status = $request->string('status')->trim()->toString();
        $purok = $request->string('purok_sitio')->trim()->toString();

        $query = Household::query()
            ->with(['familyHead.residentProfile.avatar', 'members'])
            ->latest('submitted_at')
            ->latest('id');

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('household_code', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%")
                    ->orWhereHas('familyHead', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%")
                            ->orWhere('phone_number', 'like', "%{$search}%");
                    });
            });
        }

        if ($status !== '' && $status !== 'all') {
            if ($status === 'unverified') {
                $query->whereIn('status', ['unverified', 'pending']);
            } else {
                $query->where('status', $status);
            }
        }

        if ($purok !== '' && $purok !== 'all') {
            $query->where('purok_sitio', $purok);
        }

        $paginated = $query->paginate(15)->withQueryString();

        $households = $paginated->through(function (Household $hh) {
            $adultsCount = $hh->members->filter(fn ($m) => $m->birthdate && Carbon::parse($m->birthdate)->age >= 18)->count();

            return [
                'id' => $hh->id,
                'household_code' => $hh->household_code,
                'status' => $hh->status,
                'status_label' => match ($hh->status) {
                    'unverified' => 'Unverified (Pending)',
                    'verified' => 'Verified',
                    'returned' => 'Returned for Correction',
                    'rejected' => 'Rejected',
                    'restricted' => 'Restricted',
                    'archived' => 'Archived',
                    default => ucfirst($hh->status),
                },
                'status_color' => match ($hh->status) {
                    'verified' => 'success',
                    'unverified', 'pending' => 'warning',
                    'returned' => 'info',
                    'rejected', 'restricted' => 'danger',
                    'archived' => 'gray',
                    default => 'gray',
                },
                'purok_sitio' => $hh->purok_sitio,
                'address' => $hh->address,
                'notes' => $hh->notes,
                'submitted_at' => $hh->submitted_at?->toISOString(),
                'submitted_at_formatted' => $hh->submitted_at?->format('M d, Y h:i A') ?? '—',
                'verified_at_formatted' => $hh->verified_at?->format('M d, Y h:i A'),
                'members_count' => $hh->members->count(),
                'adults_count' => $adultsCount,
                'family_head' => $hh->familyHead ? [
                    'id' => $hh->familyHead->id,
                    'name' => $hh->familyHead->name,
                    'email' => $hh->familyHead->email,
                    'phone_number' => $hh->familyHead->phone_number,
                    'avatar_url' => $hh->familyHead->residentProfile?->avatar?->getUrl(),
                ] : null,
            ];
        });

        $statusCounts = [
            'all' => Household::count(),
            'unverified' => Household::whereIn('status', ['unverified', 'pending'])->count(),
            'verified' => Household::where('status', 'verified')->count(),
            'returned' => Household::where('status', 'returned')->count(),
            'restricted' => Household::where('status', 'restricted')->count(),
            'rejected' => Household::where('status', 'rejected')->count(),
            'archived' => Household::where('status', 'archived')->count(),
        ];

        return Inertia::render('admin/households/index', [
            'households' => $households,
            'statusCounts' => $statusCounts,
            'purokOptions' => self::PUROK_OPTIONS,
            'filters' => [
                'search' => $search,
                'status' => $status ?: 'all',
                'purok_sitio' => $purok ?: 'all',
            ],
            'canManageRestrictions' => (bool) Auth::user()?->isAdmin(),
        ]);
    }

    /**
     * Display a specific household dossier with full members directory and verification trail.
     */
    public function show(Household $household): Response
    {
        $household->load([
            'familyHead.residentProfile.avatar',
            'members.user.residentProfile.avatar',
            'members.verification',
            'verification.reviewer',
        ]);

        $members = $household->members->map(function (HouseholdMember $member) {
            $age = $member->birthdate ? Carbon::parse($member->birthdate)->age : null;
            $profile = $member->user?->residentProfile;

            return [
                'id' => $member->id,
                'user_id' => $member->user_id,
                'first_name' => $member->first_name,
                'last_name' => $member->last_name,
                'full_name' => $member->full_name,
                'relationship_to_head' => match ($member->relationship_to_head) {
                    'head' => 'Head',
                    'spouse' => 'Spouse',
                    'child' => 'Child',
                    'parent' => 'Parent',
                    'sibling' => 'Sibling',
                    'grandparent' => 'Grandparent',
                    'grandchild' => 'Grandchild',
                    default => ucfirst($member->relationship_to_head),
                },
                'is_family_head' => (bool) $member->is_family_head,
                'birthdate' => $member->birthdate?->format('Y-m-d'),
                'birthdate_formatted' => $member->birthdate?->format('M d, Y'),
                'age' => $age,
                'gender' => ucfirst($member->gender ?? '—'),
                'civil_status' => ucfirst($member->civil_status ?? '—'),
                'residency_status' => ucfirst($member->residency_status ?? 'Resident'),
                'occupation' => $member->occupation ?: ($profile?->occupation ?: '—'),
                'is_voter' => (bool) ($profile->is_voter ?? false),
                'senior_citizen_status' => (bool) ($profile->senior_citizen_status ?? ($age !== null && $age >= 60)),
                'pwd_status' => (bool) ($profile->pwd_status ?? false),
                'solo_parent_status' => (bool) ($profile->solo_parent_status ?? false),
                'avatar_url' => $profile?->avatar?->getUrl(),
                'is_eligible_successor' => ! $member->is_family_head,
            ];
        });

        // Compute eligible successors for family head transfer
        $successors = $household->members()
            ->where('is_family_head', false)
            ->get()
            ->map(function (HouseholdMember $m) {
                return [
                    'id' => $m->id,
                    'name' => "{$m->full_name} ({$m->relationship_to_head})",
                    'is_spouse' => $m->isSpouse(),
                    'is_adult' => $m->isAdult(),
                ];
            });

        $details = [
            'id' => $household->id,
            'household_code' => $household->household_code,
            'status' => $household->status,
            'status_label' => match ($household->status) {
                'unverified' => 'Unverified (Pending)',
                'verified' => 'Verified',
                'returned' => 'Returned for Correction',
                'rejected' => 'Rejected',
                'restricted' => 'Restricted',
                'archived' => 'Archived',
                default => ucfirst($household->status),
            },
            'status_color' => match ($household->status) {
                'verified' => 'success',
                'unverified', 'pending' => 'warning',
                'returned' => 'info',
                'rejected', 'restricted' => 'danger',
                'archived' => 'gray',
                default => 'gray',
            },
            'purok_sitio' => $household->purok_sitio,
            'address' => $household->address,
            'notes' => $household->notes,
            'submitted_at' => $household->submitted_at?->toISOString(),
            'submitted_at_formatted' => $household->submitted_at?->format('M d, Y h:i A') ?? '—',
            'verified_at' => $household->verified_at?->toISOString(),
            'verified_at_formatted' => $household->verified_at?->format('M d, Y h:i A') ?? '—',
            'family_head' => $household->familyHead ? [
                'id' => $household->familyHead->id,
                'name' => $household->familyHead->name,
                'email' => $household->familyHead->email,
                'phone_number' => $household->familyHead->phone_number,
                'avatar_url' => $household->familyHead->residentProfile?->avatar?->getUrl(),
                'civil_status' => $household->familyHead->residentProfile?->civil_status,
                'occupation' => $household->familyHead->residentProfile?->occupation,
                'voter_id' => $household->familyHead->residentProfile?->voter_id_number,
            ] : null,
            'verification' => [
                'status' => $household->verification->status ?? 'pending',
                'reviewer_name' => $household->verification->reviewer->name ?? 'Pending assignment',
                'reviewed_at_formatted' => $household->verification?->reviewed_at?->format('M d, Y h:i A') ?? 'Not yet reviewed',
                'review_notes' => $household->verification?->review_notes,
            ],
            'members' => $members,
            'successors' => $successors,
        ];

        return Inertia::render('admin/households/show', [
            'household' => $details,
            'membersTitle' => 'Household Members',
            'canManageRestrictions' => (bool) Auth::user()?->isAdmin(),
        ]);
    }

    /**
     * Verify, return, or reject a household registration.
     */
    public function verify(VerifyHouseholdRequest $request, Household $household, NotificationService $notifications): RedirectResponse
    {
        $action = $request->validated('action');
        $notes = $request->validated('review_notes');
        $reviewerId = Auth::id();

        if ($action === 'approve') {
            $household->update([
                'status' => 'verified',
                'verified_at' => now(),
            ]);

            $household->verification()->updateOrCreate(
                ['verifiable_type' => Household::class, 'verifiable_id' => $household->id],
                [
                    'status' => 'approved',
                    'review_notes' => $notes,
                    'reviewer_id' => $reviewerId,
                    'reviewed_at' => now(),
                ]
            );

            if ($household->familyHead) {
                $notifications->send(
                    $household->familyHead,
                    'household_verified',
                    'Household Registration Approved',
                    "Your household registration ({$household->household_code}) has been approved and is now officially verified.",
                    '/household',
                    $household
                );
            }

            return back()->with('success', "Household {$household->household_code} officially approved and verified.");
        }

        if ($action === 'return') {
            $household->update(['status' => 'returned']);

            $household->verification()->updateOrCreate(
                ['verifiable_type' => Household::class, 'verifiable_id' => $household->id],
                [
                    'status' => 'returned',
                    'review_notes' => $notes,
                    'reviewer_id' => $reviewerId,
                    'reviewed_at' => now(),
                ]
            );

            if ($household->familyHead) {
                $notifications->send(
                    $household->familyHead,
                    'household_returned',
                    'Household Returned for Correction',
                    "Your household registration ({$household->household_code}) was returned for correction: {$notes}",
                    '/household/edit',
                    $household
                );
            }

            return back()->with('success', "Household {$household->household_code} returned to applicant for corrections.");
        }

        if ($action === 'reject') {
            $household->update(['status' => 'rejected']);

            $household->verification()->updateOrCreate(
                ['verifiable_type' => Household::class, 'verifiable_id' => $household->id],
                [
                    'status' => 'rejected',
                    'review_notes' => $notes,
                    'reviewer_id' => $reviewerId,
                    'reviewed_at' => now(),
                ]
            );

            if ($household->familyHead) {
                $notifications->send(
                    $household->familyHead,
                    'household_rejected',
                    'Household Registration Rejected',
                    "Your household registration ({$household->household_code}) was rejected: {$notes}",
                    '/household',
                    $household
                );
            }

            return back()->with('success', "Household {$household->household_code} has been rejected.");
        }

        return back();
    }

    /**
     * Place under administrative restriction or lift restriction.
     */
    public function restrict(RestrictHouseholdRequest $request, Household $household, NotificationService $notifications): RedirectResponse
    {
        $action = $request->validated('action');
        $reason = $request->validated('reason');
        $reviewerId = Auth::id();

        if ($action === 'restrict') {
            $household->update([
                'status' => 'restricted',
                'notes' => $reason,
            ]);

            $household->verification()->updateOrCreate(
                ['verifiable_type' => Household::class, 'verifiable_id' => $household->id],
                [
                    'status' => 'restricted',
                    'review_notes' => $reason,
                    'reviewer_id' => $reviewerId,
                    'reviewed_at' => now(),
                ]
            );

            if ($household->familyHead) {
                $notifications->send(
                    $household->familyHead,
                    'household_restricted',
                    'Household Placed Under Administrative Restriction',
                    "Your household registration ({$household->household_code}) has been placed under administrative restriction: {$reason}",
                    '/household',
                    $household
                );
            }

            return back()->with('success', "Household {$household->household_code} placed under administrative restriction.");
        }

        if ($action === 'unrestrict') {
            $liftingNotes = $reason ?: 'Administrative restriction lifted by administrator.';

            $household->update([
                'status' => 'verified',
                'verified_at' => now(),
                'notes' => $liftingNotes,
            ]);

            $household->verification()->updateOrCreate(
                ['verifiable_type' => Household::class, 'verifiable_id' => $household->id],
                [
                    'status' => 'approved',
                    'review_notes' => $liftingNotes,
                    'reviewer_id' => $reviewerId,
                    'reviewed_at' => now(),
                ]
            );

            if ($household->familyHead) {
                $notifications->send(
                    $household->familyHead,
                    'household_unrestricted',
                    'Administrative Restriction Lifted',
                    "The administrative restriction on your household registration ({$household->household_code}) has been lifted. Full services are now restored.",
                    '/household',
                    $household
                );
            }

            return back()->with('success', "Restriction lifted for household {$household->household_code}.");
        }

        return back();
    }

    /**
     * Archive or restore a household record.
     */
    public function archive(Request $request, Household $household): RedirectResponse
    {
        if (! Auth::user()?->isAdmin()) {
            abort(403);
        }

        if ($household->isArchived()) {
            $household->update([
                'status' => 'verified',
                'verified_at' => now(),
            ]);

            return back()->with('success', "Household {$household->household_code} restored to verified status.");
        }

        $household->update(['status' => 'archived']);

        return back()->with('success', "Household {$household->household_code} archived.");
    }

    /**
     * Transfer family head authority to another household member.
     */
    public function transferHead(TransferHouseholdHeadRequest $request, Household $household, HouseholdSuccessionService $successionService): RedirectResponse
    {
        $targetMember = HouseholdMember::where('id', $request->validated('new_family_head_member_id'))
            ->where('household_id', $household->id)
            ->firstOrFail();

        $successionService->transferHead($household, $targetMember);

        return back()->with('success', "Family Head authority transferred to {$targetMember->full_name}.");
    }
}
