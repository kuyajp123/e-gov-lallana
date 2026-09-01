<?php

namespace App\Filament\Resources\ResidentProfiles\Pages;

use App\Filament\Resources\ResidentProfiles\ResidentProfileResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListResidentProfiles extends ListRecords
{
    protected static string $resource = ResidentProfileResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
