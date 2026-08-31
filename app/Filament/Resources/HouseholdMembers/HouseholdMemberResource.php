<?php

namespace App\Filament\Resources\HouseholdMembers;

use App\Filament\Resources\HouseholdMembers\Pages\CreateHouseholdMember;
use App\Filament\Resources\HouseholdMembers\Pages\EditHouseholdMember;
use App\Filament\Resources\HouseholdMembers\Pages\ListHouseholdMembers;
use App\Filament\Resources\HouseholdMembers\Schemas\HouseholdMemberForm;
use App\Filament\Resources\HouseholdMembers\Tables\HouseholdMembersTable;
use App\Models\HouseholdMember;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class HouseholdMemberResource extends Resource
{
    protected static ?string $model = HouseholdMember::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return HouseholdMemberForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return HouseholdMembersTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListHouseholdMembers::route('/'),
            'create' => CreateHouseholdMember::route('/create'),
            'edit' => EditHouseholdMember::route('/{record}/edit'),
        ];
    }
}
