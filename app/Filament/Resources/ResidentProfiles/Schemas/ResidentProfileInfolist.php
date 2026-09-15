<?php

namespace App\Filament\Resources\ResidentProfiles\Schemas;

use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ResidentProfileInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Personal Information')
                    ->schema([
                        Grid::make(3)->schema([
                            TextEntry::make('full_name')
                                ->label('Full Name')
                                ->weight('bold'),
                            TextEntry::make('birthdate')
                                ->label('Date of Birth')
                                ->date('F d, Y'),
                            TextEntry::make('gender')
                                ->label('Sex')
                                ->formatStateUsing(fn (?string $state): string => ucfirst($state ?? '—')),
                        ]),
                        Grid::make(3)->schema([
                            TextEntry::make('civil_status')
                                ->label('Civil Status')
                                ->badge()
                                ->color('gray')
                                ->formatStateUsing(fn (?string $state): string => ucfirst($state ?? '—')),
                            TextEntry::make('citizenship')
                                ->label('Citizenship')
                                ->placeholder('—'),
                            TextEntry::make('religion')
                                ->label('Religion')
                                ->placeholder('—'),
                        ]),
                    ]),

                Section::make('Account & Contact Information')
                    ->schema([
                        Grid::make(3)->schema([
                            TextEntry::make('user.name')
                                ->label('User Account Name')
                                ->weight('medium'),
                            TextEntry::make('user.email')
                                ->label('Email Address'),
                            TextEntry::make('user.phone_number')
                                ->label('Phone Number')
                                ->placeholder('—'),
                        ]),
                    ]),

                Section::make('Community & Residency Details')
                    ->schema([
                        Grid::make(3)->schema([
                            TextEntry::make('residency_status')
                                ->label('Residency Status')
                                ->badge()
                                ->color('info')
                                ->formatStateUsing(fn (?string $state): string => match ($state) {
                                    'official' => 'Official Resident',
                                    'resident' => 'Resident',
                                    'new_resident' => 'New Resident',
                                    'tenant' => 'Tenant',
                                    'student' => 'Student',
                                    'temporary' => 'Temporary',
                                    default => ucfirst($state ?? '—'),
                                }),
                            TextEntry::make('date_of_residency')
                                ->label('Resident Since')
                                ->date('F Y')
                                ->placeholder('—'),
                            TextEntry::make('educational_attainment')
                                ->label('Education')
                                ->formatStateUsing(fn (?string $state): string => ucfirst($state ?? '—')),
                        ]),
                        Grid::make(2)->schema([
                            TextEntry::make('occupation')
                                ->label('Occupation')
                                ->placeholder('—'),
                            TextEntry::make('employment_status')
                                ->label('Employment Status')
                                ->formatStateUsing(fn (?string $state): string => ucfirst($state ?? '—')),
                        ]),
                    ]),

                Section::make('Special Statuses & IDs')
                    ->schema([
                        Grid::make(3)->schema([
                            IconEntry::make('is_voter')
                                ->label('Registered Voter')
                                ->boolean(),
                            TextEntry::make('voter_id_number')
                                ->label('Voter ID Number')
                                ->placeholder('None provided'),
                            IconEntry::make('senior_citizen_status')
                                ->label('Senior Citizen')
                                ->boolean(),
                        ]),
                        Grid::make(3)->schema([
                            IconEntry::make('pwd_status')
                                ->label('Person with Disability (PWD)')
                                ->boolean(),
                            TextEntry::make('pwd_id_number')
                                ->label('PWD ID Number')
                                ->placeholder('—'),
                            IconEntry::make('solo_parent_status')
                                ->label('Solo Parent')
                                ->boolean(),
                        ]),
                    ]),

                Section::make('Government ID Document')
                    ->schema([
                        Grid::make(2)->schema([
                            TextEntry::make('governmentId.file_name')
                                ->label('ID File Name')
                                ->placeholder('No government ID uploaded'),
                            TextEntry::make('governmentId.mime_type')
                                ->label('File Type')
                                ->placeholder('—'),
                        ]),
                    ]),
            ]);
    }
}
