<?php

namespace App\Filament\Resources\Households\Tables;

use App\Models\Household;
use App\Models\HouseholdMember;
use App\Models\User;
use App\Services\Household\HouseholdSuccessionService;
use App\Services\Notification\NotificationService;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Notifications\Notification;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Auth;

class HouseholdsTable
{
    protected static function getCurrentUser(): ?User
    {
        $user = Auth::user();

        return $user instanceof User ? $user : null;
    }

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
                        'archived' => 'gray',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'unverified' => 'Unverified (Pending)',
                        'verified' => 'Verified',
                        'returned' => 'Returned',
                        'rejected' => 'Rejected',
                        'restricted' => 'Restricted',
                        'archived' => 'Archived',
                        default => ucfirst($state),
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
                        'archived' => 'Archived',
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
                Action::make('transfer_head')
                    ->label('Transfer Head')
                    ->icon('heroicon-o-arrows-right-left')
                    ->color('gray')
                    ->visible(fn (Household $record): bool => $record->members()->where('is_family_head', false)->exists())
                    ->schema([
                        Select::make('new_family_head_member_id')
                            ->label('Select New Family Head')
                            ->helperText('Succession priority: Spouse is prioritized first. If no spouse, select a verified adult member.')
                            ->options(function (Household $record): array {
                                $members = $record->members()->where('is_family_head', false)->with('verification')->get();
                                $sorted = $members->sort(function (HouseholdMember $a, HouseholdMember $b) {
                                    if ($a->isSpouse() && ! $b->isSpouse()) {
                                        return -1;
                                    }
                                    if (! $a->isSpouse() && $b->isSpouse()) {
                                        return 1;
                                    }

                                    $aVerifiedAdult = $a->isVerified() && $a->isAdult();
                                    $bVerifiedAdult = $b->isVerified() && $b->isAdult();
                                    if ($aVerifiedAdult && ! $bVerifiedAdult) {
                                        return -1;
                                    }
                                    if (! $aVerifiedAdult && $bVerifiedAdult) {
                                        return 1;
                                    }

                                    if ($a->isAdult() && ! $b->isAdult()) {
                                        return -1;
                                    }
                                    if (! $a->isAdult() && $b->isAdult()) {
                                        return 1;
                                    }

                                    return 0;
                                });

                                $options = [];
                                foreach ($sorted as $m) {
                                    $tag = '';
                                    if ($m->isSpouse()) {
                                        $tag = ' [Priority: Spouse]';
                                    } elseif ($m->isVerified() && $m->isAdult()) {
                                        $tag = ' [Priority: Verified Adult]';
                                    } elseif ($m->isAdult()) {
                                        $tag = ' [Adult]';
                                    }
                                    $options[$m->id] = "{$m->full_name} ({$m->relationship_to_head}){$tag}";
                                }

                                return $options;
                            })
                            ->default(function (Household $record): ?int {
                                return app(HouseholdSuccessionService::class)->findSuccessor($record)?->id;
                            })
                            ->required(),
                    ])
                    ->action(function (Household $record, array $data): void {
                        $targetMember = HouseholdMember::where('id', $data['new_family_head_member_id'])
                            ->where('household_id', $record->id)
                            ->first();

                        if ($targetMember) {
                            app(HouseholdSuccessionService::class)->transferHead($record, $targetMember);

                            Notification::make()
                                ->title('Family Head Transferred')
                                ->body("Family Head authority transferred to {$targetMember->full_name}.")
                                ->success()
                                ->send();
                        }
                    }),
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

                        app(NotificationService::class)->send(
                            $record->familyHead,
                            'household_verified',
                            'Household Registration Approved',
                            "Your household registration ({$record->household_code}) has been approved and is now officially verified.",
                            '/household',
                            $record
                        );
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

                        app(NotificationService::class)->send(
                            $record->familyHead,
                            'household_returned',
                            'Household Returned for Correction',
                            "Your household registration ({$record->household_code}) was returned for correction: {$data['review_notes']}",
                            '/household/edit',
                            $record
                        );
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

                        app(NotificationService::class)->send(
                            $record->familyHead,
                            'household_rejected',
                            'Household Registration Rejected',
                            "Your household registration ({$record->household_code}) was rejected: {$data['review_notes']}",
                            '/household',
                            $record
                        );
                    }),
                Action::make('restrict')
                    ->label('Restrict')
                    ->icon('heroicon-o-shield-exclamation')
                    ->color('danger')
                    ->visible(fn (Household $record): bool => (static::getCurrentUser()?->isAdmin() ?? false) && $record->status === 'verified')
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

                        $record->verification()->updateOrCreate(
                            ['verifiable_type' => Household::class, 'verifiable_id' => $record->id],
                            [
                                'status' => 'restricted',
                                'review_notes' => $data['review_notes'],
                                'reviewer_id' => Auth::id(),
                                'reviewed_at' => now(),
                            ]
                        );

                        Notification::make()
                            ->title('Household Restricted')
                            ->body("Household {$record->household_code} is now under restriction.")
                            ->danger()
                            ->send();

                        if ($record->familyHead) {
                            app(NotificationService::class)->send(
                                $record->familyHead,
                                'household_restricted',
                                'Household Placed Under Administrative Restriction',
                                "Your household registration ({$record->household_code}) has been placed under administrative restriction: {$data['review_notes']}",
                                '/household',
                                $record
                            );
                        }
                    }),

                Action::make('unrestrict')
                    ->label('Lift Restriction')
                    ->icon('heroicon-o-shield-check')
                    ->color('success')
                    ->visible(fn (Household $record): bool => (static::getCurrentUser()?->isAdmin() ?? false) && $record->status === 'restricted')
                    ->schema([
                        Textarea::make('review_notes')
                            ->label('Remarks for Lifting Restriction')
                            ->placeholder('Specify reason or settlement details for lifting restriction...')
                            ->rows(3),
                    ])
                    ->action(function (Household $record, array $data): void {
                        $notes = ! empty($data['review_notes']) ? $data['review_notes'] : 'Restriction lifted by administrator.';

                        $record->update([
                            'status' => 'verified',
                            'verified_at' => now(),
                            'notes' => $notes,
                        ]);

                        $record->verification()->updateOrCreate(
                            ['verifiable_type' => Household::class, 'verifiable_id' => $record->id],
                            [
                                'status' => 'approved',
                                'review_notes' => $notes,
                                'reviewer_id' => Auth::id(),
                                'reviewed_at' => now(),
                            ]
                        );

                        Notification::make()
                            ->title('Household Restriction Lifted')
                            ->body("Household {$record->household_code} has been restored to verified status.")
                            ->success()
                            ->send();

                        if ($record->familyHead) {
                            app(NotificationService::class)->send(
                                $record->familyHead,
                                'household_unrestricted',
                                'Administrative Restriction Lifted',
                                "The administrative restriction on your household registration ({$record->household_code}) has been lifted. Full services are now restored.",
                                '/household',
                                $record
                            );
                        }
                    }),

                Action::make('archive')
                    ->label('Archive')
                    ->icon('heroicon-o-archive-box')
                    ->color('gray')
                    ->requiresConfirmation()
                    ->modalHeading('Archive Household Record')
                    ->modalDescription(fn (Household $record): string => "Are you sure you want to archive household {$record->household_code}? Archived records are inactive and removed from active processing.")
                    ->visible(fn (Household $record): bool => (static::getCurrentUser()?->isAdmin() ?? false) && in_array($record->status, ['restricted', 'rejected']))
                    ->action(function (Household $record): void {
                        $record->update([
                            'status' => 'archived',
                        ]);

                        Notification::make()
                            ->title('Household Archived')
                            ->body("Household {$record->household_code} has been archived.")
                            ->info()
                            ->send();
                    }),

                Action::make('restore')
                    ->label('Restore')
                    ->icon('heroicon-o-arrow-uturn-left')
                    ->color('info')
                    ->requiresConfirmation()
                    ->modalHeading('Restore Archived Household')
                    ->modalDescription(fn (Household $record): string => "Restore household {$record->household_code} back to verified status?")
                    ->visible(fn (Household $record): bool => (static::getCurrentUser()?->isAdmin() ?? false) && $record->status === 'archived')
                    ->action(function (Household $record): void {
                        $record->update([
                            'status' => 'verified',
                            'verified_at' => now(),
                        ]);

                        Notification::make()
                            ->title('Household Restored')
                            ->body("Household {$record->household_code} has been restored to verified status.")
                            ->success()
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
