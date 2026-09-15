<?php

namespace App\Filament\Resources\ResidentProfiles;

use App\Filament\Resources\ResidentProfiles\Pages\ListResidentProfiles;
use App\Filament\Resources\ResidentProfiles\Pages\ViewResidentProfile;
use App\Filament\Resources\ResidentProfiles\Schemas\ResidentProfileForm;
use App\Filament\Resources\ResidentProfiles\Schemas\ResidentProfileInfolist;
use App\Filament\Resources\ResidentProfiles\Tables\ResidentProfilesTable;
use App\Models\ResidentProfile;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;

class ResidentProfileResource extends Resource
{
    protected static ?string $model = ResidentProfile::class;

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
        return ResidentProfileForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return ResidentProfileInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ResidentProfilesTable::configure($table);
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
            'index' => ListResidentProfiles::route('/'),
            'view' => ViewResidentProfile::route('/{record}'),
        ];
    }
}
