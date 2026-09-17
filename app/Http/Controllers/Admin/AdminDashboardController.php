<?php

namespace App\Http\Controllers\Admin;

use App\Enums\DocumentRequestStatus;
use App\Http\Controllers\Controller;
use App\Models\DocumentRequest;
use App\Models\Household;
use App\Models\ResidentProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $today = Carbon::today();

        // Resident metrics
        $totalResidents = ResidentProfile::count();
        $thisMonthResidents = ResidentProfile::where('created_at', '>=', now()->startOfMonth())->count();

        // Household metrics
        $totalHouseholds = Household::count();
        $verifiedHouseholds = Household::where('status', 'verified')->count();
        $verifiedPct = $totalHouseholds > 0 ? round(($verifiedHouseholds / $totalHouseholds) * 100, 1) : 0;
        $pendingHouseholds = Household::whereIn('status', ['unverified', 'pending', 'returned'])->count();

        // Document request metrics
        $totalDocRequests = DocumentRequest::count();
        $activeDocRequests = DocumentRequest::whereIn('current_status', [
            DocumentRequestStatus::Pending,
            DocumentRequestStatus::Processing,
        ])->count();
        $readyForPickup = DocumentRequest::where('current_status', DocumentRequestStatus::ReadyForPickup)->count();
        $completedDocRequests = DocumentRequest::where('current_status', DocumentRequestStatus::Completed)->count();

        // Staff metrics
        $activeStaff = User::whereHas('role', fn ($q) => $q->whereIn('slug', ['admin', 'sub_admin']))
            ->where('status', 'active')
            ->count();

        // Demographics breakdown (Age cohorts)
        $cutoff15 = $today->copy()->subYears(15)->toDateString();
        $cutoff25 = $today->copy()->subYears(25)->toDateString();
        $cutoff60 = $today->copy()->subYears(60)->toDateString();

        $children = ResidentProfile::whereNotNull('birthdate')->where('birthdate', '>', $cutoff15)->count();
        $youth = ResidentProfile::whereNotNull('birthdate')->where('birthdate', '<=', $cutoff15)->where('birthdate', '>', $cutoff25)->count();
        $workingAge = ResidentProfile::whereNotNull('birthdate')->where('birthdate', '<=', $cutoff25)->where('birthdate', '>', $cutoff60)->count();
        $seniors = ResidentProfile::whereNotNull('birthdate')->where('birthdate', '<=', $cutoff60)->count();

        $demographics = [
            ['label' => 'Children (0–14)', 'count' => $children, 'color' => 'bg-sky-500', 'textColor' => 'text-sky-600 dark:text-sky-400'],
            ['label' => 'Youth (15–24)', 'count' => $youth, 'color' => 'bg-indigo-500', 'textColor' => 'text-indigo-600 dark:text-indigo-400'],
            ['label' => 'Working Age (25–59)', 'count' => $workingAge, 'color' => 'bg-emerald-500', 'textColor' => 'text-emerald-600 dark:text-emerald-400'],
            ['label' => 'Seniors (60+)', 'count' => $seniors, 'color' => 'bg-amber-500', 'textColor' => 'text-amber-600 dark:text-amber-400'],
        ];

        // Special sectors
        $specialSectors = [
            'seniors' => ResidentProfile::where('senior_citizen_status', true)->count(),
            'pwds' => ResidentProfile::where('pwd_status', true)->count(),
            'soloParents' => ResidentProfile::where('solo_parent_status', true)->count(),
            'voters' => ResidentProfile::where('is_voter', true)->count(),
        ];

        // 6-Month Monthly Trends
        $monthlyTrends = [];
        for ($i = 5; $i >= 0; $i--) {
            $startOfMonth = Carbon::now()->subMonths($i)->startOfMonth();
            $endOfMonth = Carbon::now()->subMonths($i)->endOfMonth();

            $submitted = DocumentRequest::whereBetween('created_at', [$startOfMonth, $endOfMonth])->count();
            $completed = DocumentRequest::whereBetween('created_at', [$startOfMonth, $endOfMonth])
                ->whereIn('current_status', [
                    DocumentRequestStatus::Completed,
                    DocumentRequestStatus::ReadyForPickup,
                ])
                ->count();

            $monthlyTrends[] = [
                'month' => $startOfMonth->format('M'),
                'year' => $startOfMonth->format('Y'),
                'submitted' => $submitted,
                'completed' => $completed,
            ];
        }

        // Recent Document Requests needing action
        $recentDocRequests = DocumentRequest::with(['user', 'documentType'])
            ->orderByDesc('created_at')
            ->take(6)
            ->get()
            ->map(fn (DocumentRequest $req) => [
                'id' => $req->id,
                'reference_code' => $req->reference_code,
                'applicant_name' => $req->user->name,
                'document_name' => $req->documentType->name,
                'document_slug' => $req->documentType->slug,
                'status' => $req->current_status->value,
                'status_label' => $req->current_status->label(),
                'status_color' => $req->current_status->color(),
                'fee_cents' => $req->fee_cents,
                'submitted_at' => $req->submitted_at?->format('M d, Y h:i A') ?? $req->created_at->format('M d, Y'),
            ]);

        // Recent Pending Households
        $recentHouseholds = Household::with('familyHead')
            ->whereIn('status', ['unverified', 'pending', 'returned'])
            ->orderByDesc('created_at')
            ->take(4)
            ->get()
            ->map(fn (Household $hh) => [
                'id' => $hh->id,
                'household_code' => $hh->household_code,
                'head_name' => $hh->familyHead->name ?? 'Unknown',
                'purok_sitio' => $hh->purok_sitio,
                'address' => $hh->address,
                'status' => $hh->status,
                'created_at' => $hh->created_at->format('M d, Y'),
            ]);

        return Inertia::render('admin/dashboard', [
            'metrics' => [
                'totalResidents' => $totalResidents,
                'thisMonthResidents' => $thisMonthResidents,
                'totalHouseholds' => $totalHouseholds,
                'verifiedHouseholds' => $verifiedHouseholds,
                'verifiedPct' => $verifiedPct,
                'pendingHouseholds' => $pendingHouseholds,
                'totalDocRequests' => $totalDocRequests,
                'activeDocRequests' => $activeDocRequests,
                'readyForPickup' => $readyForPickup,
                'completedDocRequests' => $completedDocRequests,
                'activeStaff' => $activeStaff,
            ],
            'demographics' => $demographics,
            'specialSectors' => $specialSectors,
            'monthlyTrends' => $monthlyTrends,
            'recentDocRequests' => $recentDocRequests,
            'recentHouseholds' => $recentHouseholds,
        ]);
    }
}
