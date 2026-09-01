<?php

namespace App\Filament\Resources\Households\Tables;

use App\Models\Household;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\Textarea;
use Filament\Notifications\Notification;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Auth;

class HouseholdsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('household_code')
                    ->label('Household Code')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                TextColumn::make('familyHead.name')
                    ->label('Family Head')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('purok_sitio')
                    ->label('Purok / Sitio')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('address')
                    ->label('Address')
                    ->limit(30)
                    ->searchable(),
                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'verified' => 'success',
                        'unverified' => 'warning',
                        'returned' => 'info',
                        'rejected', 'restricted' => 'danger',
                        default => 'gray',
                    }),
                TextColumn::make('submitted_at')
                    ->label('Submitted')
                    ->dateTime('M d, Y h:i A')
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'unverified' => 'Unverified (Pending)',
                        'verified' => 'Verified',
                        'returned' => 'Returned for Correction',
                        'rejected' => 'Rejected',
                        'restricted' => 'Restricted',
                    ]),
                SelectFilter::make('purok_sitio')
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
                    ]),
            ])
            ->recordActions([
                ViewAction::make(),
                Action::make('approve')
                    ->label('Approve')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->visible(fn (Household $record): bool => $record->status !== 'verified')
                    ->action(function (Household $record): void {
                        $record->update([
                            'status' => 'verified',
                            'verified_at' => now(),
                        ]);

                        $record->verification()->updateOrCreate(
                            ['verifiable_type' => Household::class, 'verifiable_id' => $record->id],
                            [
                                'status' => 'approved',
                                'reviewer_id' => Auth::id(),
                                'reviewed_at' => now(),
                            ]
                        );

                        Notification::make()
                            ->title('Household Verified')
                            ->body("Household {$record->household_code} has been approved successfully.")
                            ->success()
                            ->send();
                    }),
                Action::make('return')
                    ->label('Return for Correction')
                    ->icon('heroicon-o-arrow-path')
                    ->color('warning')
                    ->visible(fn (Household $record): bool => in_array($record->status, ['unverified', 'pending']))
                    ->schema([
                        Textarea::make('review_notes')
                            ->label('Correction Remarks')
                            ->placeholder('Specify what information or documents the applicant needs to correct...')
                            ->required()
                            ->rows(3),
                    ])
                    ->action(function (Household $record, array $data): void {
                        $record->update([
                            'status' => 'returned',
                        ]);

                        $record->verification()->updateOrCreate(
                            ['verifiable_type' => Household::class, 'verifiable_id' => $record->id],
                            [
                                'status' => 'returned',
                                'review_notes' => $data['review_notes'],
                                'reviewer_id' => Auth::id(),
                                'reviewed_at' => now(),
                            ]
                        );

                        Notification::make()
                            ->title('Household Returned for Correction')
                            ->body("Household {$record->household_code} returned with review remarks.")
                            ->info()
                            ->send();
                    }),
                Action::make('reject')
                    ->label('Reject')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->visible(fn (Household $record): bool => in_array($record->status, ['unverified', 'pending', 'returned']))
                    ->schema([
                        Textarea::make('review_notes')
                            ->label('Rejection Reason')
                            ->placeholder('State the official reason for rejecting this household registration...')
                            ->required()
                            ->rows(3),
                    ])
                    ->action(function (Household $record, array $data): void {
                        $record->update([
                            'status' => 'rejected',
                        ]);

                        $record->verification()->updateOrCreate(
                            ['verifiable_type' => Household::class, 'verifiable_id' => $record->id],
                            [
                                'status' => 'rejected',
                                'review_notes' => $data['review_notes'],
                                'reviewer_id' => Auth::id(),
                                'reviewed_at' => now(),
                            ]
                        );

                        Notification::make()
                            ->title('Household Rejected')
                            ->body("Household {$record->household_code} has been marked as rejected.")
                            ->warning()
                            ->send();
                    }),
                Action::make('restrict')
                    ->label('Restrict')
                    ->icon('heroicon-o-shield-exclamation')
                    ->color('danger')
                    ->visible(fn (Household $record): bool => Auth::user()?->isAdmin() && $record->status === 'verified')
                    ->schema([
                        Textarea::make('review_notes')
                            ->label('Restriction Reason')
                            ->placeholder('Specify reason for administrative restriction...')
                            ->required()
                            ->rows(3),
                    ])
                    ->action(function (Household $record, array $data): void {
                        $record->update([
                            'status' => 'restricted',
                            'notes' => $data['review_notes'],
                        ]);

                        Notification::make()
                            ->title('Household Restricted')
                            ->body("Household {$record->household_code} is now under restriction.")
                            ->danger()
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
