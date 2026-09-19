<?php

namespace App\Filament\Widgets;

use App\Models\ResidentProfile;
use Filament\Widgets\ChartWidget;

class SpecialSectorsChartWidget extends ChartWidget
{
    protected static ?int $sort = 3;

    protected int|string|array $columnSpan = 1;

    protected ?string $heading = 'Special Sectors & Voter Registry';

    protected ?string $description = 'Vulnerable sectors and voter registration counts';

    protected function getType(): string
    {
        return 'bar';
    }

    public function getData(): array
    {
        $seniors = ResidentProfile::where('senior_citizen_status', true)->count();
        $pwds = ResidentProfile::where('pwd_status', true)->count();
        $soloParents = ResidentProfile::where('solo_parent_status', true)->count();
        $voters = ResidentProfile::where('is_voter', true)->count();

        return [
            'datasets' => [
                [
                    'label' => 'Total Headcount',
                    'data' => [$seniors, $pwds, $soloParents, $voters],
                    'backgroundColor' => [
                        'rgba(245, 158, 11, 0.8)', // Amber - Seniors
                        'rgba(168, 85, 247, 0.8)', // Purple - PWDs
                        'rgba(236, 72, 153, 0.8)', // Pink - Solo Parents
                        'rgba(59, 130, 246, 0.8)', // Blue - Voters
                    ],
                    'borderColor' => [
                        '#d97706',
                        '#9333ea',
                        '#db2777',
                        '#2563eb',
                    ],
                    'borderWidth' => 1,
                ],
            ],
            'labels' => [
                'Senior Citizens',
                'PWDs',
                'Solo Parents',
                'Registered Voters',
            ],
        ];
    }
}
