<?php

namespace App\Filament\Resources\HouseholdMembers\Pages;

use App\Filament\Resources\HouseholdMembers\HouseholdMemberResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListHouseholdMembers extends ListRecords
{
    protected static string $resource = HouseholdMemberResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
