<?php

namespace App\Filament\Widgets;

use App\Enums\DocumentRequestStatus;
use App\Models\DocumentRequest;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;

class DocumentRequestVolumeChartWidget extends ChartWidget
{
    protected static ?int $sort = 4;

    protected int|string|array $columnSpan = 'full';

    protected ?string $heading = 'Document Request Trends (Last 6 Months)';

    protected ?string $description = 'Monthly submission volume and fulfillment outcomes';

    protected function getType(): string
    {
        return 'line';
    }

    public function getData(): array
    {
        $labels = [];
        $submittedData = [];
        $completedData = [];

        for ($i = 5; $i >= 0; $i--) {
            $startOfMonth = Carbon::now()->subMonths($i)->startOfMonth();
            $endOfMonth = Carbon::now()->subMonths($i)->endOfMonth();

            $monthLabel = $startOfMonth->format('M Y');
            $labels[] = $monthLabel;

            $submitted = DocumentRequest::whereBetween('created_at', [$startOfMonth, $endOfMonth])->count();
            $submittedData[] = $submitted;

            $completed = DocumentRequest::whereBetween('created_at', [$startOfMonth, $endOfMonth])
                ->whereIn('current_status', [
                    DocumentRequestStatus::Completed,
                    DocumentRequestStatus::ReadyForPickup,
                ])
                ->count();
            $completedData[] = $completed;
        }

        return [
            'datasets' => [
                [
                    'label' => 'Total Requests Submitted',
                    'data' => $submittedData,
                    'borderColor' => '#6366f1',
                    'backgroundColor' => 'rgba(99, 102, 241, 0.1)',
                    'fill' => 'start',
                    'tension' => 0.3,
                ],
                [
                    'label' => 'Fulfilled / Ready for Pickup',
                    'data' => $completedData,
                    'borderColor' => '#10b981',
                    'backgroundColor' => 'rgba(16, 185, 129, 0.1)',
                    'fill' => 'start',
                    'tension' => 0.3,
                ],
            ],
            'labels' => $labels,
        ];
    }
}
