<?php

namespace App\Filament\Widgets;

use App\Enums\DocumentRequestStatus;
use App\Models\DocumentRequest;
use App\Models\Household;
use App\Models\ResidentProfile;
use App\Models\User;
use Filament\Support\Icons\Heroicon;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Facades\Auth;

class AdminStatsOverviewWidget extends BaseWidget
{
    protected static ?int $sort = 1;

    protected ?string $pollingInterval = '30s';

    public function getStats(): array
    {
        $totalResidents = ResidentProfile::count();
        $thisMonthResidents = ResidentProfile::where('created_at', '>=', now()->startOfMonth())->count();

        $totalHouseholds = Household::count();
        $verifiedHouseholds = Household::where('status', 'verified')->count();
        $verifiedPct = $totalHouseholds > 0 ? round(($verifiedHouseholds / $totalHouseholds) * 100, 1) : 0;

        $pendingRegistrations = Household::whereIn('status', ['unverified', 'pending', 'returned'])->count();

        $activeDocRequests = DocumentRequest::whereIn('current_status', [
            DocumentRequestStatus::Pending,
            DocumentRequestStatus::Processing,
        ])->count();

        $readyForPickup = DocumentRequest::where('current_status', DocumentRequestStatus::ReadyForPickup)->count();

        $stats = [
            Stat::make('Total Residents', number_format($totalResidents))
                ->description("+{$thisMonthResidents} registered this month")
                ->descriptionIcon(Heroicon::OutlinedUsers)
                ->color('primary'),

            Stat::make('Verified Households', "{$verifiedHouseholds} / {$totalHouseholds}")
                ->description("{$verifiedPct}% verified coverage")
                ->descriptionIcon(Heroicon::OutlinedHomeModern)
                ->color('success'),

            Stat::make('Pending Verifications', number_format($pendingRegistrations))
                ->description('Awaiting staff review or correction')
                ->descriptionIcon(Heroicon::OutlinedClock)
                ->color($pendingRegistrations > 0 ? 'warning' : 'gray'),

            Stat::make('Active Document Requests', number_format($activeDocRequests))
                ->description('Pending review & in-flight processing')
                ->descriptionIcon(Heroicon::OutlinedDocumentText)
                ->color($activeDocRequests > 0 ? 'info' : 'gray'),

            Stat::make('Ready for Release', number_format($readyForPickup))
                ->description('Awaiting pickup at Barangay Hall')
                ->descriptionIcon(Heroicon::OutlinedCheckBadge)
                ->color($readyForPickup > 0 ? 'success' : 'gray'),
        ];

        $user = Auth::user();
        if ($user instanceof User && $user->isAdmin()) {
            $activeStaff = User::whereHas('role', fn ($q) => $q->where('slug', 'sub_admin'))
                ->where('status', 'active')
                ->count();

            $stats[] = Stat::make('Active Sub-Admins', number_format($activeStaff))
                ->description('Operational staff accounts')
                ->descriptionIcon(Heroicon::OutlinedShieldCheck)
                ->color('gray');
        }

        return $stats;
    }
}
