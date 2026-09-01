<?php

namespace App\Filament\Resources\HouseholdMembers\Pages;

use App\Filament\Resources\HouseholdMembers\HouseholdMemberResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditHouseholdMember extends EditRecord
{
    protected static string $resource = HouseholdMemberResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
