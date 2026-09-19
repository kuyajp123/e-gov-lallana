<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DocumentRequest;
use App\Models\HouseholdMember;
use App\Models\ResidentProfile;
use App\Models\User;
use App\Services\Resident\ResidentDeletionService;
use DomainException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AdminResidentProfileController extends Controller
{
    /**
     * Display a listing of resident profiles in the civil registry.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $sector = $request->string('sector')->trim()->toString();
        $gender = $request->string('gender')->trim()->toString();
        $civilStatus = $request->string('civil_status')->trim()->toString();
        $residencyStatus = $request->string('residency_status')->trim()->toString();

        $query = ResidentProfile::query()
            ->with(['user.role', 'avatar'])
            ->latest('id');

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('middle_name', 'like', "%{$search}%")
                    ->orWhere('voter_id_number', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('email', 'like', "%{$search}%")
                            ->orWhere('name', 'like', "%{$search}%")
                            ->orWhere('phone_number', 'like', "%{$search}%");
                    });
            });
        }

        if ($sector === 'voters') {
            $query->where('is_voter', true);
        } elseif ($sector === 'seniors') {
            $query->where(function ($q) {
                $q->where('senior_citizen_status', true)
                    ->orWhere('birthdate', '<=', now()->subYears(60));
            });
        } elseif ($sector === 'pwd') {
            $query->where('pwd_status', true);
        } elseif ($sector === 'solo_parents') {
            $query->where('solo_parent_status', true);
        }

        if ($gender !== '' && $gender !== 'all') {
            $query->where('gender', $gender);
        }

        if ($civilStatus !== '' && $civilStatus !== 'all') {
            $query->where('civil_status', $civilStatus);
        }

        if ($residencyStatus !== '' && $residencyStatus !== 'all') {
            $query->where('residency_status', $residencyStatus);
        }

        $paginated = $query->paginate(15)->withQueryString();

        $residents = $paginated->through(function (ResidentProfile $profile) {
            $age = $profile->birthdate ? Carbon::parse($profile->birthdate)->age : null;
            /** @var User|null $user */
            $user = $profile->user;

            return [
                'id' => $profile->id,
                'full_name' => $profile->full_name,
                'first_name' => $profile->first_name,
                'last_name' => $profile->last_name,
                'email' => $user?->email,
                'phone_number' => $user?->phone_number,
                'avatar_url' => $profile->avatar?->getUrl(),
                'birthdate' => $profile->birthdate?->format('Y-m-d'),
                'birthdate_formatted' => $profile->birthdate?->format('M d, Y'),
                'age' => $age,
                'gender' => ucfirst($profile->gender ?? '—'),
                'civil_status' => ucfirst($profile->civil_status ?? '—'),
                'citizenship' => $profile->citizenship,
                'residency_status' => ucfirst($profile->residency_status ?? 'Official'),
                'occupation' => $profile->occupation ?? '—',
                'is_voter' => (bool) $profile->is_voter,
                'voter_id_number' => $profile->voter_id_number,
                'senior_citizen_status' => (bool) ($profile->senior_citizen_status || ($age !== null && $age >= 60)),
                'pwd_status' => (bool) $profile->pwd_status,
                'solo_parent_status' => (bool) $profile->solo_parent_status,
                'is_admin' => (bool) $user?->isAdmin(),
                'is_sub_admin' => (bool) $user?->isSubAdmin(),
                'is_super_admin' => (bool) $user?->isSuperAdmin(),
                'role_name' => $user?->role?->name,
                'created_at_formatted' => $profile->created_at?->format('M d, Y') ?? '—',
            ];
        });

        $sectorCounts = [
            'all' => ResidentProfile::count(),
            'voters' => ResidentProfile::where('is_voter', true)->count(),
            'seniors' => ResidentProfile::where(function ($q) {
                $q->where('senior_citizen_status', true)
                    ->orWhere('birthdate', '<=', now()->subYears(60));
            })->count(),
            'pwd' => ResidentProfile::where('pwd_status', true)->count(),
            'solo_parents' => ResidentProfile::where('solo_parent_status', true)->count(),
        ];

        return Inertia::render('admin/resident-profiles/index', [
            'residents' => $residents,
            'sectorCounts' => $sectorCounts,
            'filters' => [
                'search' => $search,
                'sector' => $sector ?: 'all',
                'gender' => $gender ?: 'all',
                'civil_status' => $civilStatus ?: 'all',
                'residency_status' => $residencyStatus ?: 'all',
            ],
        ]);
    }

    /**
     * Display a specific resident profile dossier.
     */
    public function show(ResidentProfile $residentProfile): Response
    {
        $residentProfile->load(['user', 'avatar', 'governmentId']);

        $age = $residentProfile->birthdate ? Carbon::parse($residentProfile->birthdate)->age : null;

        // Find household membership if any
        $householdMembership = HouseholdMember::query()
            ->with('household')
            ->where('user_id', $residentProfile->user_id)
            ->first();

        /** @var User|null $currentUser */
        $currentUser = Auth::user();
        /** @var User|null $residentUser */
        $residentUser = $residentProfile->user;

        $isStaff = (bool) ($residentUser?->isAdmin() || $residentUser?->isSubAdmin());
        $canDelete = (bool) ($currentUser?->isAdmin() && ! $isStaff);

        $details = [
            'id' => $residentProfile->id,
            'full_name' => $residentProfile->full_name,
            'first_name' => $residentProfile->first_name,
            'middle_name' => $residentProfile->middle_name,
            'last_name' => $residentProfile->last_name,
            'suffix' => $residentProfile->suffix,
            'birthdate' => $residentProfile->birthdate?->format('Y-m-d'),
            'birthdate_formatted' => $residentProfile->birthdate?->format('F d, Y'),
            'age' => $age,
            'gender' => ucfirst($residentProfile->gender ?? '—'),
            'civil_status' => ucfirst($residentProfile->civil_status ?? '—'),
            'citizenship' => $residentProfile->citizenship ?: 'Filipino',
            'religion' => $residentProfile->religion ?: '—',
            'residency_status' => match ($residentProfile->residency_status) {
                'official' => 'Official Resident',
                'resident' => 'Resident',
                'new_resident' => 'New Resident',
                'tenant' => 'Tenant',
                'student' => 'Student',
                'temporary' => 'Temporary',
                default => ucfirst($residentProfile->residency_status ?? 'Official'),
            },
            'date_of_residency' => $residentProfile->date_of_residency?->format('F Y'),
            'occupation' => $residentProfile->occupation ?: '—',
            'educational_attainment' => ucfirst($residentProfile->educational_attainment ?? '—'),
            'employment_status' => ucfirst($residentProfile->employment_status ?? '—'),
            'is_voter' => (bool) $residentProfile->is_voter,
            'voter_id_number' => $residentProfile->voter_id_number,
            'senior_citizen_status' => (bool) ($residentProfile->senior_citizen_status || ($age !== null && $age >= 60)),
            'pwd_status' => (bool) $residentProfile->pwd_status,
            'pwd_id_number' => $residentProfile->pwd_id_number,
            'solo_parent_status' => (bool) $residentProfile->solo_parent_status,
            'solo_parent_id_number' => $residentProfile->solo_parent_id_number,
            'avatar_url' => $residentProfile->avatar?->getUrl(),
            'government_id' => $residentProfile->governmentId ? [
                'file_name' => $residentProfile->governmentId->file_name,
                'url' => $residentProfile->governmentId->getUrl(60),
                'mime_type' => $residentProfile->governmentId->mime_type,
            ] : null,
            'user' => [
                'id' => $residentUser?->id,
                'name' => $residentUser?->name,
                'email' => $residentUser?->email,
                'phone_number' => $residentUser?->phone_number,
                'created_at_formatted' => $residentUser?->created_at?->format('M d, Y h:i A'),
            ],
            'household' => $householdMembership ? [
                'id' => $householdMembership->household->id,
                'household_code' => $householdMembership->household->household_code,
                'address' => $householdMembership->household->address,
                'purok_sitio' => $householdMembership->household->purok_sitio,
                'relationship_to_head' => ucfirst($householdMembership->relationship_to_head),
                'is_family_head' => (bool) $householdMembership->is_family_head,
                'members_count' => $householdMembership->household->members()->count(),
            ] : null,
            'active_requests_count' => DocumentRequest::where('user_id', $residentProfile->user_id)
                ->whereIn('current_status', ['pending', 'under_review', 'processing', 'ready_for_pickup'])
                ->count(),
            'is_staff' => $isStaff,
            'can_delete' => $canDelete,
        ];

        return Inertia::render('admin/resident-profiles/show', [
            'residentProfile' => $details,
            'sections' => [
                'personal' => 'Personal Information',
                'account' => 'Account &amp; Contact Information',
            ],
        ]);
    }

    /**
     * Permanently delete a resident profile and purge associated data.
     */
    public function destroy(ResidentProfile $residentProfile, ResidentDeletionService $deletionService): RedirectResponse
    {
        /** @var User|null $currentUser */
        $currentUser = Auth::user();

        if (! $currentUser || ! $currentUser->isAdmin()) {
            abort(403, 'Unauthorized. Only Barangay Administrators can delete residents.');
        }

        $fullName = $residentProfile->full_name;

        try {
            $deletionService->delete($residentProfile);
        } catch (DomainException $e) {
            return back()->withErrors(['deletion' => $e->getMessage()]);
        }

        return redirect()
            ->route('admin.resident-profiles.index')
            ->with('success', "Resident profile for {$fullName} has been permanently deleted.");
    }
}
