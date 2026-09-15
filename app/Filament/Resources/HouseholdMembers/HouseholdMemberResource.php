<?php

namespace App\Filament\Resources\HouseholdMembers;

use App\Filament\Resources\HouseholdMembers\Pages\ListHouseholdMembers;
use App\Filament\Resources\HouseholdMembers\Schemas\HouseholdMemberForm;
use App\Filament\Resources\HouseholdMembers\Schemas\HouseholdMemberInfolist;
use App\Filament\Resources\HouseholdMembers\Tables\HouseholdMembersTable;
use App\Models\HouseholdMember;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;

class HouseholdMemberResource extends Resource
{
    protected static ?string $model = HouseholdMember::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function canCreate(): bool
    {
        return false;
    }

    public static function canEdit(Model $record): bool
    {
        return false;
    }

    public static function form(Schema $schema): Schema
    {
        return HouseholdMemberForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return HouseholdMemberInfolist::configure($schema);
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
        ];
    }
}
