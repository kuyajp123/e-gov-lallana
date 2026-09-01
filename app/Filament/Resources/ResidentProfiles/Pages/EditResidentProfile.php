<?php

namespace App\Filament\Resources\ResidentProfiles\Pages;

use App\Filament\Resources\ResidentProfiles\ResidentProfileResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditResidentProfile extends EditRecord
{
    protected static string $resource = ResidentProfileResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
