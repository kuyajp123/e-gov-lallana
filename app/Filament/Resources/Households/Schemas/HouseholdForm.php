<?php

namespace App\Filament\Resources\Households\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class HouseholdForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('household_code')
                    ->label('Household Code')
                    ->disabled(),
                Select::make('purok_sitio')
                    ->label('Purok / Sitio')
                    ->options([
                        'Purok 1' => 'Purok 1',
                        'Purok 2' => 'Purok 2',
                        'Purok 3' => 'Purok 3',
                        'Purok 4' => 'Purok 4',
                        'Purok 5' => 'Purok 5',
                        'Purok 6' => 'Purok 6',
                        'Purok 7' => 'Purok 7',
                        'Sitio Pag-Asa' => 'Sitio Pag-Asa',
                        'Sitio Maharlika' => 'Sitio Maharlika',
                    ])
                    ->required(),
                TextInput::make('address')
                    ->label('Street Address')
                    ->required()
                    ->maxLength(255),
                Select::make('status')
                    ->label('Verification Status')
                    ->options([
                        'unverified' => 'Unverified (Pending)',
                        'verified' => 'Verified',
                        'returned' => 'Returned for Correction',
                        'rejected' => 'Rejected',
                        'restricted' => 'Restricted',
                    ])
                    ->required(),
                Textarea::make('notes')
                    ->label('Notes')
                    ->rows(3),
            ]);
    }
}
