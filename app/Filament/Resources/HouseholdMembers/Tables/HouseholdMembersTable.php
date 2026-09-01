<?php

namespace App\Filament\Resources\HouseholdMembers\Tables;

use App\Models\HouseholdMember;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Textarea;
use Filament\Notifications\Notification;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Auth;

class HouseholdMembersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('full_name')
                    ->label('Member Full Name')
                    ->searchable(['first_name', 'last_name', 'middle_name'])
                    ->sortable(['last_name'])
                    ->weight('bold'),
                TextColumn::make('household.household_code')
                    ->label('Household Code')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('relationship_to_head')
                    ->label('Relationship')
                    ->badge()
                    ->color('gray'),
                IconColumn::make('is_family_head')
                    ->label('Head')
                    ->boolean(),
                TextColumn::make('gender')
                    ->label('Sex')
                    ->formatStateUsing(fn (?string $state): string => ucfirst($state ?? '—')),
                TextColumn::make('residency_status')
                    ->label('Residency')
                    ->badge()
                    ->color('info'),
                TextColumn::make('verification.status')
                    ->label('Verification Status')
                    ->badge()
                    ->color(fn (?string $state): string => match ($state) {
                        'approved' => 'success',
                        'pending' => 'warning',
                        'returned' => 'info',
                        'rejected' => 'danger',
                        default => 'gray',
                    }),
                TextColumn::make('created_at')
                    ->label('Added On')
                    ->dateTime('M d, Y')
                    ->sortable(),
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
            ->recordActions([
                EditAction::make(),
                Action::make('approve_member')
                    ->label('Approve')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->action(function (HouseholdMember $record): void {
                        $record->verification()->updateOrCreate(
                            ['verifiable_type' => HouseholdMember::class, 'verifiable_id' => $record->id],
                            [
                                'status' => 'approved',
                                'reviewer_id' => Auth::id(),
                                'reviewed_at' => now(),
                            ]
                        );

                        Notification::make()
                            ->title('Member Approved')
                            ->body("Household member {$record->full_name} has been verified.")
                            ->success()
                            ->send();
                    }),
                Action::make('return_member')
                    ->label('Return')
                    ->icon('heroicon-o-arrow-path')
                    ->color('warning')
                    ->schema([
                        Textarea::make('review_notes')
                            ->label('Correction Remarks')
                            ->required()
                            ->rows(3),
                    ])
                    ->action(function (HouseholdMember $record, array $data): void {
                        $record->verification()->updateOrCreate(
                            ['verifiable_type' => HouseholdMember::class, 'verifiable_id' => $record->id],
                            [
                                'status' => 'returned',
                                'review_notes' => $data['review_notes'],
                                'reviewer_id' => Auth::id(),
                                'reviewed_at' => now(),
                            ]
                        );

                        Notification::make()
                            ->title('Member Verification Returned')
                            ->body("Household member {$record->full_name} returned for correction.")
                            ->info()
                            ->send();
                    }),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
