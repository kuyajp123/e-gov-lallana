<?php

namespace App\Filament\Resources\Households\Schemas;

use Filament\Infolists\Components\RepeatableEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class HouseholdInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Household Overview')
                    ->schema([
                        Grid::make(3)->schema([
                            TextEntry::make('household_code')
                                ->label('Household Code')
                                ->weight('bold'),
                            TextEntry::make('status')
                                ->label('Status')
                                ->badge()
                                ->color(fn (string $state): string => match ($state) {
                                    'verified' => 'success',
                                    'unverified' => 'warning',
                                    'returned' => 'info',
                                    'rejected', 'restricted' => 'danger',
                                    default => 'gray',
                                }),
                            TextEntry::make('submitted_at')
                                ->label('Submitted At')
                                ->dateTime('M d, Y h:i A'),
                        ]),
                        Grid::make(2)->schema([
                            TextEntry::make('purok_sitio')
                                ->label('Purok / Sitio'),
                            TextEntry::make('address')
                                ->label('Street Address'),
                        ]),
                        TextEntry::make('notes')
                            ->label('Applicant Notes')
                            ->placeholder('None provided'),
                    ]),

                Section::make('Family Head Details')
                    ->schema([
                        Grid::make(3)->schema([
                            TextEntry::make('familyHead.name')
                                ->label('Full Name'),
                            TextEntry::make('familyHead.email')
                                ->label('Email Address'),
                            TextEntry::make('familyHead.phone_number')
                                ->label('Contact Number')
                                ->placeholder('None provided'),
                        ]),
                        Grid::make(3)->schema([
                            TextEntry::make('familyHead.residentProfile.civil_status')
                                ->label('Civil Status')
                                ->placeholder('—'),
                            TextEntry::make('familyHead.residentProfile.occupation')
                                ->label('Occupation')
                                ->placeholder('—'),
                            TextEntry::make('familyHead.residentProfile.voter_id_number')
                                ->label('Voter ID')
                                ->placeholder('Non-voter / Unspecified'),
                        ]),
                    ]),

                Section::make('Verification & Audit Trail')
                    ->schema([
                        Grid::make(3)->schema([
                            TextEntry::make('verification.status')
                                ->label('Verification Status')
                                ->badge(),
                            TextEntry::make('verification.reviewer.name')
                                ->label('Reviewed By')
                                ->placeholder('Pending assignment'),
                            TextEntry::make('verification.reviewed_at')
                                ->label('Reviewed At')
                                ->dateTime('M d, Y h:i A')
                                ->placeholder('Not yet reviewed'),
                        ]),
                        TextEntry::make('verification.review_notes')
                            ->label('Official Review Remarks')
                            ->placeholder('No remarks recorded'),
                    ]),

                Section::make('Registered Household Members')
                    ->schema([
                        RepeatableEntry::make('members')
                            ->schema([
                                Grid::make(4)->schema([
                                    TextEntry::make('full_name')->label('Name')->weight('bold'),
                                    TextEntry::make('relationship_to_head')->label('Relationship'),
                                    TextEntry::make('gender')->label('Sex'),
                                    TextEntry::make('occupation')->label('Occupation')->placeholder('—'),
                                ]),
                            ]),
                    ]),
            ]);
    }
}
