<?php

namespace App\Filament\Widgets;

use App\Models\ResidentProfile;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;

class DemographicsChartWidget extends ChartWidget
{
    protected static ?int $sort = 2;

    protected int|string|array $columnSpan = 1;

    protected ?string $heading = 'Demographics (Age Cohorts)';

    protected ?string $description = 'Distribution of registered residents by age group';

    protected function getType(): string
    {
        return 'doughnut';
    }

    public function getData(): array
    {
        $today = Carbon::today();

        $cutoff15 = $today->copy()->subYears(15)->toDateString();
        $cutoff25 = $today->copy()->subYears(25)->toDateString();
        $cutoff60 = $today->copy()->subYears(60)->toDateString();

        $children = ResidentProfile::whereNotNull('birthdate')
            ->where('birthdate', '>', $cutoff15)
            ->count();

        $youth = ResidentProfile::whereNotNull('birthdate')
            ->where('birthdate', '<=', $cutoff15)
            ->where('birthdate', '>', $cutoff25)
            ->count();

        $workingAge = ResidentProfile::whereNotNull('birthdate')
            ->where('birthdate', '<=', $cutoff25)
            ->where('birthdate', '>', $cutoff60)
            ->count();

        $seniors = ResidentProfile::whereNotNull('birthdate')
            ->where('birthdate', '<=', $cutoff60)
            ->count();

        return [
            'datasets' => [
                [
                    'label' => 'Residents',
                    'data' => [$children, $youth, $workingAge, $seniors],
                    'backgroundColor' => [
                        '#38bdf8', // Sky blue - Children
                        '#818cf8', // Indigo - Youth
                        '#10b981', // Emerald - Working Age
                        '#f59e0b', // Amber - Senior Citizens
                    ],
                ],
            ],
            'labels' => [
                "Children 0–14 ({$children})",
                "Youth 15–24 ({$youth})",
                "Working Age 25–59 ({$workingAge})",
                "Seniors 60+ ({$seniors})",
            ],
        ];
    }
}
