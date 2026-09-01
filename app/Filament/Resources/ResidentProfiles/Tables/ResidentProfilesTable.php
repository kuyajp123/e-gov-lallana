<?php

namespace App\Filament\Resources\ResidentProfiles\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class ResidentProfilesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('full_name')
                    ->label('Resident Full Name')
                    ->searchable(['first_name', 'last_name', 'middle_name'])
                    ->sortable(['last_name'])
                    ->weight('bold'),
                TextColumn::make('user.email')
                    ->label('Email')
                    ->searchable(),
                TextColumn::make('gender')
                    ->label('Sex')
                    ->formatStateUsing(fn (?string $state): string => ucfirst($state ?? '—')),
                TextColumn::make('civil_status')
                    ->label('Civil Status')
                    ->badge()
                    ->color('gray'),
                TextColumn::make('residency_status')
                    ->label('Residency')
                    ->badge()
                    ->color('info'),
                TextColumn::make('occupation')
                    ->label('Occupation')
                    ->placeholder('—'),
                IconColumn::make('is_voter')
                    ->label('Voter')
                    ->boolean(),
                IconColumn::make('senior_citizen_status')
                    ->label('Senior')
                    ->boolean(),
                IconColumn::make('pwd_status')
                    ->label('PWD')
                    ->boolean(),
                TextColumn::make('created_at')
                    ->label('Registered')
                    ->dateTime('M d, Y')
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('gender')
                    ->options([
                        'male' => 'Male',
                        'female' => 'Female',
                        'other' => 'Other',
                    ]),
                SelectFilter::make('civil_status')
                    ->options([
                        'single' => 'Single',
                        'married' => 'Married',
                        'widowed' => 'Widowed',
                        'separated' => 'Separated',
                    ]),
                SelectFilter::make('residency_status')
                    ->options([
                        'official' => 'Official Resident',
                        'resident' => 'Resident',
                        'new_resident' => 'New Resident',
                        'tenant' => 'Tenant',
                        'student' => 'Student',
                        'temporary' => 'Temporary',
                    ]),
                TernaryFilter::make('is_voter')
                    ->label('Registered Voter'),
                TernaryFilter::make('senior_citizen_status')
                    ->label('Senior Citizen'),
                TernaryFilter::make('pwd_status')
                    ->label('PWD'),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
