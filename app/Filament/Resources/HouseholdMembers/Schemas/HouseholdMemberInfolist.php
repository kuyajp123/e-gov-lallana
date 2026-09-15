<?php

namespace App\Filament\Resources\HouseholdMembers\Schemas;

use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class HouseholdMemberInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Member Information')
                    ->schema([
                        Grid::make(3)->schema([
                            TextEntry::make('full_name')
                                ->label('Full Name')
                                ->weight('bold'),
                            TextEntry::make('relationship_to_head')
                                ->label('Relationship to Head')
                                ->badge()
                                ->color('gray')
                                ->formatStateUsing(fn (?string $state): string => ucfirst($state ?? '—')),
                            IconEntry::make('is_family_head')
                                ->label('Family Head')
                                ->boolean(),
                        ]),
                        Grid::make(3)->schema([
                            TextEntry::make('birthdate')
                                ->label('Date of Birth')
                                ->date('F d, Y')
                                ->placeholder('—'),
                            TextEntry::make('gender')
                                ->label('Sex')
                                ->formatStateUsing(fn (?string $state): string => ucfirst($state ?? '—')),
                            TextEntry::make('civil_status')
                                ->label('Civil Status')
                                ->formatStateUsing(fn (?string $state): string => ucfirst($state ?? '—')),
                        ]),
                        Grid::make(2)->schema([
                            TextEntry::make('occupation')
                                ->label('Occupation')
                                ->placeholder('—'),
                            TextEntry::make('residency_status')
                                ->label('Residency Status')
                                ->badge()
                                ->color('info')
                                ->formatStateUsing(fn (?string $state): string => ucfirst(str_replace('_', ' ', $state ?? '—'))),
                        ]),
                    ]),

                Section::make('Household Details')
                    ->schema([
                        Grid::make(3)->schema([
                            TextEntry::make('household.household_code')
                                ->label('Household Code')
                                ->weight('bold'),
                            TextEntry::make('household.purok_sitio')
                                ->label('Purok / Sitio'),
                            TextEntry::make('household.address')
                                ->label('Address'),
                        ]),
                    ]),

                Section::make('Verification Status')
                    ->schema([
                        Grid::make(3)->schema([
                            TextEntry::make('verification.status')
                                ->label('Verification Status')
                                ->badge()
                                ->color(fn (?string $state): string => match ($state) {
                                    'approved' => 'success',
                                    'pending' => 'warning',
                                    'returned' => 'info',
                                    'rejected' => 'danger',
                                    default => 'gray',
                                })
                                ->formatStateUsing(fn (?string $state): string => ucfirst($state ?? 'Unverified')),
                            TextEntry::make('verification.reviewer.name')
                                ->label('Reviewed By')
                                ->placeholder('Not reviewed'),
                            TextEntry::make('verification.reviewed_at')
                                ->label('Reviewed At')
                                ->dateTime('M d, Y h:i A')
                                ->placeholder('—'),
                        ]),
                        TextEntry::make('verification.review_notes')
                            ->label('Correction Remarks')
                            ->placeholder('No remarks recorded'),
                    ]),
            ]);
    }
}
