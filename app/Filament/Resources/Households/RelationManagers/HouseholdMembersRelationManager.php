<?php

namespace App\Filament\Resources\Households\RelationManagers;

use App\Filament\Resources\Households\Schemas\HouseholdMemberInfolist;
use Filament\Actions\ViewAction;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class HouseholdMembersRelationManager extends RelationManager
{
    protected static string $relationship = 'members';

    protected static ?string $title = 'Household Members';

    protected static bool $isLazy = false;

    public function infolist(Schema $schema): Schema
    {
        return HouseholdMemberInfolist::configure($schema);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('full_name')
            ->columns([
                TextColumn::make('full_name')
                    ->label('Member Full Name')
                    ->searchable(['first_name', 'last_name', 'middle_name'])
                    ->sortable(['last_name'])
                    ->weight('bold'),
                TextColumn::make('relationship_to_head')
                    ->label('Relationship')
                    ->badge()
                    ->color('gray')
                    ->formatStateUsing(fn (?string $state): string => ucfirst($state ?? '—')),
                IconColumn::make('is_family_head')
                    ->label('Head')
                    ->boolean(),
                TextColumn::make('email')
                    ->label('Account Email')
                    ->searchable()
                    ->placeholder('No account linked'),
                TextColumn::make('invitation_status')
                    ->label('Invitation')
                    ->badge()
                    ->color(fn (?string $state): string => match ($state) {
                        'accepted' => 'success',
                        'pending' => 'warning',
                        'rejected' => 'danger',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (?string $state): string => ucfirst($state ?? '—')),
                TextColumn::make('gender')
                    ->label('Sex')
                    ->formatStateUsing(fn (?string $state): string => ucfirst($state ?? '—')),
                TextColumn::make('civil_status')
                    ->label('Civil Status')
                    ->formatStateUsing(fn (?string $state): string => ucfirst($state ?? '—'))
                    ->placeholder('—'),
                TextColumn::make('residency_status')
                    ->label('Residency')
                    ->badge()
                    ->color('info')
                    ->formatStateUsing(fn (?string $state): string => ucfirst(str_replace('_', ' ', $state ?? '—'))),
            ])
            ->filters([
                SelectFilter::make('relationship_to_head')
                    ->options([
                        'head' => 'Head',
                        'spouse' => 'Spouse',
                        'son' => 'Son',
                        'daughter' => 'Daughter',
                        'parent' => 'Parent',
                        'relative' => 'Relative',
                        'other' => 'Other',
                    ]),
                SelectFilter::make('residency_status')
                    ->options([
                        'resident' => 'Resident',
                        'non_resident' => 'Non-Resident',
                        'temporary' => 'Temporary',
                    ]),
            ])
            ->headerActions([
                //
            ])
            ->recordActions([
                ViewAction::make(),
            ])
            ->toolbarActions([
                //
            ]);
    }
}
