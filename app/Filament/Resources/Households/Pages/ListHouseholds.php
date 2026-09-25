<?php

namespace App\Filament\Resources\Households\Pages;

use App\Filament\Resources\Households\HouseholdResource;
use App\Services\Pdf\PdfGenerationService;
use Filament\Actions\Action;
use Filament\Forms\Components\Select;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Support\Facades\Auth;

class ListHouseholds extends ListRecords
{
    protected static string $resource = HouseholdResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('export_rbi_pdf')
                ->label('Export RBI Report (PDF)')
                ->icon('heroicon-o-document-arrow-down')
                ->color('success')
                ->schema([
                    Select::make('purok')
                        ->label('Select Purok')
                        ->placeholder('All Puroks (1 to 6)')
                        ->options([
                            '1' => 'Purok 1',
                            '2' => 'Purok 2',
                            '3' => 'Purok 3',
                            '4' => 'Purok 4',
                            '5' => 'Purok 5',
                            '6' => 'Purok 6',
                        ])
                        ->nullable(),
                ])
                ->action(function (array $data) {
                    $pdfService = app(PdfGenerationService::class);
                    $pdfContent = $pdfService->generateRbiReport($data['purok'] ?? null, Auth::user());

                    $filename = 'RBI-Summary-'.(! empty($data['purok']) ? 'Purok-'.$data['purok'].'-' : '').now()->format('Ymd-His').'.pdf';

                    return response()->streamDownload(function () use ($pdfContent) {
                        echo $pdfContent;
                    }, $filename, [
                        'Content-Type' => 'application/pdf',
                    ]);
                }),
        ];
    }
}
