<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DocumentRequest;
use App\Models\HouseholdMember;
use App\Models\ResidentProfile;
use App\Models\User;
use App\Services\Pdf\PdfGenerationService;
use App\Services\Resident\ResidentDeletionService;
use DomainException;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class AdminResidentProfileController extends Controller
{
    /**
     * Build the filtered Eloquent query based on request parameters.
     *
     * @return Builder<ResidentProfile>
     */
    protected function buildFilteredQuery(Request $request): Builder
    {
        $search = $request->string('search')->trim()->toString();
        $sector = $request->string('sector')->trim()->toString();
        $gender = $request->string('gender')->trim()->toString();
        $civilStatus = $request->string('civil_status')->trim()->toString();
        $residencyStatus = $request->string('residency_status')->trim()->toString();
        $employmentStatus = $request->string('employment_status')->trim()->toString();
        $citizenship = $request->string('citizenship')->trim()->toString();
        $isVoter = $request->string('is_voter')->trim()->toString();
        $seniorStatus = $request->string('senior_citizen_status')->trim()->toString();
        $pwdStatus = $request->string('pwd_status')->trim()->toString();
        $soloParentStatus = $request->string('solo_parent_status')->trim()->toString();
        $isOfw = $request->string('is_ofw')->trim()->toString();
        $isIp = $request->string('is_ip')->trim()->toString();
        $isOutOfSchool = $request->string('is_out_of_school')->trim()->toString();

        $query = ResidentProfile::query()
            ->with(['user.role', 'avatar']);

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

        // Quick Sector Tabs
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

        // Demographics
        if ($gender !== '' && $gender !== 'all') {
            $query->where('gender', $gender);
        }

        if ($civilStatus !== '' && $civilStatus !== 'all') {
            $query->where('civil_status', $civilStatus);
        }

        if ($residencyStatus !== '' && $residencyStatus !== 'all') {
            $query->where('residency_status', $residencyStatus);
        }

        if ($employmentStatus !== '' && $employmentStatus !== 'all') {
            $query->where('employment_status', $employmentStatus);
        }

        if ($citizenship === 'filipino') {
            $query->where(function ($q) {
                $q->whereNull('citizenship')
                    ->orWhere('citizenship', '')
                    ->orWhere('citizenship', 'like', 'Filipino%');
            });
        } elseif ($citizenship === 'foreigner') {
            $query->whereNotNull('citizenship')
                ->where('citizenship', '!=', '')
                ->where('citizenship', 'not like', 'Filipino%');
        }

        // Candidate Toggle Flags
        if ($isVoter === 'yes') {
            $query->where('is_voter', true);
        } elseif ($isVoter === 'no') {
            $query->where('is_voter', false);
        }

        if ($seniorStatus === 'yes') {
            $query->where(function ($q) {
                $q->where('senior_citizen_status', true)
                    ->orWhere('birthdate', '<=', now()->subYears(60));
            });
        } elseif ($seniorStatus === 'no') {
            $query->where(function ($q) {
                $q->where('senior_citizen_status', false)
                    ->where(function ($sub) {
                        $sub->whereNull('birthdate')
                            ->orWhere('birthdate', '>', now()->subYears(60));
                    });
            });
        }

        if ($pwdStatus === 'yes') {
            $query->where('pwd_status', true);
        } elseif ($pwdStatus === 'no') {
            $query->where('pwd_status', false);
        }

        if ($soloParentStatus === 'yes') {
            $query->where('solo_parent_status', true);
        } elseif ($soloParentStatus === 'no') {
            $query->where('solo_parent_status', false);
        }

        if ($isOfw === 'yes') {
            $query->where('is_ofw', true);
        } elseif ($isOfw === 'no') {
            $query->where('is_ofw', false);
        }

        if ($isIp === 'yes') {
            $query->where('is_ip', true);
        } elseif ($isIp === 'no') {
            $query->where('is_ip', false);
        }

        if ($isOutOfSchool === 'yes') {
            $query->where('is_out_of_school', true);
        } elseif ($isOutOfSchool === 'no') {
            $query->where('is_out_of_school', false);
        }

        return $query;
    }

    /**
     * Extract human-readable labels for active query filters.
     *
     * @return array<int, string>
     */
    protected function extractFilterLabels(Request $request): array
    {
        $labels = [];

        $search = $request->string('search')->trim()->toString();
        if ($search !== '') {
            $labels[] = "Search: \"{$search}\"";
        }

        $sector = $request->string('sector')->trim()->toString();
        if ($sector !== '' && $sector !== 'all') {
            $labels[] = 'Sector: '.match ($sector) {
                'voters' => 'Registered Voters',
                'seniors' => 'Senior Citizens',
                'pwd' => 'Persons with Disability',
                'solo_parents' => 'Solo Parents',
                default => ucfirst($sector),
            };
        }

        $gender = $request->string('gender')->trim()->toString();
        if ($gender !== '' && $gender !== 'all') {
            $labels[] = 'Sex: '.ucfirst($gender);
        }

        $civilStatus = $request->string('civil_status')->trim()->toString();
        if ($civilStatus !== '' && $civilStatus !== 'all') {
            $labels[] = 'Civil Status: '.ucfirst($civilStatus);
        }

        $residencyStatus = $request->string('residency_status')->trim()->toString();
        if ($residencyStatus !== '' && $residencyStatus !== 'all') {
            $labels[] = 'Residency: '.match ($residencyStatus) {
                'official' => 'Official Resident',
                'resident' => 'Resident',
                'new_resident' => 'New Resident',
                'tenant' => 'Tenant',
                'student' => 'Student',
                'temporary' => 'Temporary',
                default => ucfirst($residencyStatus),
            };
        }

        $employmentStatus = $request->string('employment_status')->trim()->toString();
        if ($employmentStatus !== '' && $employmentStatus !== 'all') {
            $labels[] = 'Employment: '.ucfirst($employmentStatus);
        }

        $citizenship = $request->string('citizenship')->trim()->toString();
        if ($citizenship !== '' && $citizenship !== 'all') {
            $labels[] = 'Citizenship: '.ucfirst($citizenship);
        }

        $isVoter = $request->string('is_voter')->trim()->toString();
        if ($isVoter === 'yes') {
            $labels[] = 'Voter: Registered';
        } elseif ($isVoter === 'no') {
            $labels[] = 'Voter: Non-Voter';
        }

        $senior = $request->string('senior_citizen_status')->trim()->toString();
        if ($senior === 'yes') {
            $labels[] = 'Senior Citizen: Yes';
        } elseif ($senior === 'no') {
            $labels[] = 'Senior Citizen: No';
        }

        $pwd = $request->string('pwd_status')->trim()->toString();
        if ($pwd === 'yes') {
            $labels[] = 'PWD: Yes';
        } elseif ($pwd === 'no') {
            $labels[] = 'PWD: No';
        }

        $soloParent = $request->string('solo_parent_status')->trim()->toString();
        if ($soloParent === 'yes') {
            $labels[] = 'Solo Parent: Yes';
        } elseif ($soloParent === 'no') {
            $labels[] = 'Solo Parent: No';
        }

        $ofw = $request->string('is_ofw')->trim()->toString();
        if ($ofw === 'yes') {
            $labels[] = 'OFW: Yes';
        } elseif ($ofw === 'no') {
            $labels[] = 'OFW: No';
        }

        $ip = $request->string('is_ip')->trim()->toString();
        if ($ip === 'yes') {
            $labels[] = 'IP: Yes';
        } elseif ($ip === 'no') {
            $labels[] = 'IP: No';
        }

        $outOfSchool = $request->string('is_out_of_school')->trim()->toString();
        if ($outOfSchool === 'yes') {
            $labels[] = 'Out of School (OSC/OSY): Yes';
        } elseif ($outOfSchool === 'no') {
            $labels[] = 'Out of School: No';
        }

        return $labels;
    }

    /**
     * Display a listing of resident profiles in the civil registry.
     */
    public function index(Request $request): Response
    {
        $query = $this->buildFilteredQuery($request)->latest('id');

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
                'citizenship' => $profile->citizenship ?: 'Filipino',
                'residency_status' => match ($profile->residency_status) {
                    'official' => 'Official Resident',
                    'resident' => 'Resident',
                    'new_resident' => 'New Resident',
                    'tenant' => 'Tenant',
                    'student' => 'Student',
                    'temporary' => 'Temporary',
                    default => ucfirst($profile->residency_status ?? 'Official'),
                },
                'occupation' => $profile->occupation ?? '—',
                'employment_status' => ucfirst($profile->employment_status ?? '—'),
                'is_voter' => (bool) $profile->is_voter,
                'voter_id_number' => $profile->voter_id_number,
                'senior_citizen_status' => (bool) ($profile->senior_citizen_status || ($age !== null && $age >= 60)),
                'pwd_status' => (bool) $profile->pwd_status,
                'solo_parent_status' => (bool) $profile->solo_parent_status,
                'is_ofw' => (bool) $profile->is_ofw,
                'is_ip' => (bool) $profile->is_ip,
                'is_out_of_school' => (bool) $profile->is_out_of_school,
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
                'search' => $request->string('search')->trim()->toString(),
                'sector' => $request->string('sector')->trim()->toString() ?: 'all',
                'gender' => $request->string('gender')->trim()->toString() ?: 'all',
                'civil_status' => $request->string('civil_status')->trim()->toString() ?: 'all',
                'residency_status' => $request->string('residency_status')->trim()->toString() ?: 'all',
                'employment_status' => $request->string('employment_status')->trim()->toString() ?: 'all',
                'citizenship' => $request->string('citizenship')->trim()->toString() ?: 'all',
                'is_voter' => $request->string('is_voter')->trim()->toString() ?: 'all',
                'senior_citizen_status' => $request->string('senior_citizen_status')->trim()->toString() ?: 'all',
                'pwd_status' => $request->string('pwd_status')->trim()->toString() ?: 'all',
                'solo_parent_status' => $request->string('solo_parent_status')->trim()->toString() ?: 'all',
                'is_ofw' => $request->string('is_ofw')->trim()->toString() ?: 'all',
                'is_ip' => $request->string('is_ip')->trim()->toString() ?: 'all',
                'is_out_of_school' => $request->string('is_out_of_school')->trim()->toString() ?: 'all',
            ],
        ]);
    }

    /**
     * Export a filtered list of resident profiles as a landscape PDF.
     */
    public function exportPdf(Request $request, PdfGenerationService $pdfService): SymfonyResponse
    {
        $profiles = $this->buildFilteredQuery($request)
            ->with(['user'])
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get();

        $activeFilters = $this->extractFilterLabels($request);

        /** @var User|null $currentUser */
        $currentUser = Auth::user();

        $pdfContent = $pdfService->generateResidentRegistryReport($profiles, $activeFilters, $currentUser);
        $filename = 'Barangay-Lallana-Resident-Registry-'.now()->format('Ymd-His').'.pdf';

        return response($pdfContent, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => "inline; filename=\"{$filename}\"",
        ]);
    }

    /**
     * Display a specific resident profile details.
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
            'birth_place' => $residentProfile->birth_place ?: '—',
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
            'educational_status' => ucfirst($residentProfile->educational_status ?? '—'),
            'employment_status' => ucfirst($residentProfile->employment_status ?? '—'),
            'is_voter' => (bool) $residentProfile->is_voter,
            'voter_id_number' => $residentProfile->voter_id_number,
            'philsys_card_no' => $residentProfile->philsys_card_no,
            'senior_citizen_status' => (bool) ($residentProfile->senior_citizen_status || ($age !== null && $age >= 60)),
            'pwd_status' => (bool) $residentProfile->pwd_status,
            'pwd_id_number' => $residentProfile->pwd_id_number,
            'solo_parent_status' => (bool) $residentProfile->solo_parent_status,
            'solo_parent_id_number' => $residentProfile->solo_parent_id_number,
            'is_ofw' => (bool) $residentProfile->is_ofw,
            'is_ip' => (bool) $residentProfile->is_ip,
            'is_out_of_school' => (bool) $residentProfile->is_out_of_school,
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

    /**
     * Export official DILG RBI Form B (Revised 2024) for an individual resident profile.
     */
    public function exportFormBPdf(ResidentProfile $residentProfile, PdfGenerationService $pdfService): SymfonyResponse
    {
        $pdfContent = $pdfService->generateRbiFormB($residentProfile, Auth::user());
        $filename = "RBI-Form-B-{$residentProfile->last_name}-{$residentProfile->id}-".now()->format('Ymd-His').'.pdf';

        return response($pdfContent, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => "inline; filename=\"{$filename}\"",
        ]);
    }
}
