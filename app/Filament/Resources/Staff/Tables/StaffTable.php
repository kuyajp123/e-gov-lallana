<?php

namespace App\Filament\Resources\Staff\Tables;

use App\Models\Role;
use App\Models\User;
use Filament\Actions\Action;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Support\Enums\FontWeight;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class StaffTable
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
                TextColumn::make('name')
                    ->label('Full Name')
                    ->searchable()
                    ->sortable()
                    ->weight(FontWeight::Bold),

                TextColumn::make('email')
                    ->label('Email Address')
                    ->searchable()
                    ->copyable()
                    ->icon(Heroicon::OutlinedEnvelope),

                TextColumn::make('phone_number')
                    ->label('Phone Number')
                    ->searchable()
                    ->placeholder('—')
                    ->icon(Heroicon::OutlinedPhone),

                TextColumn::make('role.name')
                    ->label('System Role')
                    ->badge()
                    ->color(fn (User $record): string => $record->isAdmin() ? 'primary' : 'info'),

                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'active' => 'success',
                        'inactive' => 'danger',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => ucfirst($state)),

                TextColumn::make('created_at')
                    ->label('Account Created')
                    ->dateTime('M d, Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('role_id')
                    ->label('System Role')
                    ->relationship('role', 'name'),

                SelectFilter::make('status')
                    ->label('Account Status')
                    ->options([
                        'active' => 'Active',
                        'inactive' => 'Inactive',
                    ]),
            ])
            ->recordActions([
                Action::make('edit_staff')
                    ->label('Edit')
                    ->icon(Heroicon::OutlinedPencilSquare)
                    ->color('gray')
                    ->visible(function (User $record): bool {
                        $currentUser = static::getCurrentUser();
                        if (! $currentUser || ! $currentUser->isAdmin()) {
                            return false;
                        }

                        // Users can edit their own profile details
                        if ($record->id === $currentUser->id) {
                            return true;
                        }

                        // Cannot edit a super admin
                        if ($record->isSuperAdmin()) {
                            return false;
                        }

                        // Co-admin protection: A regular admin cannot edit another admin
                        if ($record->isAdmin() && ! $currentUser->isSuperAdmin()) {
                            return false;
                        }

                        return true;
                    })
                    ->fillForm(fn (User $record): array => [
                        'name' => $record->name,
                        'email' => $record->email,
                        'phone_number' => $record->phone_number,
                        'role_id' => $record->role_id,
                        'status' => $record->status,
                    ])
                    ->schema([
                        TextInput::make('name')
                            ->label('Full Name')
                            ->required()
                            ->maxLength(255),

                        TextInput::make('email')
                            ->label('Email Address')
                            ->email()
                            ->required()
                            ->maxLength(255),

                        TextInput::make('phone_number')
                            ->label('Phone / Mobile Number')
                            ->tel()
                            ->placeholder('+639123456789'),

                        Select::make('role_id')
                            ->label('System Role')
                            ->options(fn (): array => Role::whereIn('slug', ['admin', 'sub_admin'])->pluck('name', 'id')->toArray())
                            ->required()
                            ->disabled(fn (User $record): bool => $record->id === Auth::id()),

                        TextInput::make('password')
                            ->label('New Password (Optional)')
                            ->password()
                            ->revealable()
                            ->placeholder('Leave blank to keep existing password')
                            ->minLength(8),

                        Select::make('status')
                            ->label('Account Status')
                            ->options([
                                'active' => 'Active',
                                'inactive' => 'Inactive',
                            ])
                            ->required()
                            ->disabled(fn (User $record): bool => $record->id === Auth::id()),
                    ])
                    ->action(function (User $record, array $data): void {
                        $updateData = [
                            'name' => $data['name'],
                            'email' => strtolower(trim((string) $data['email'])),
                            'phone_number' => $data['phone_number'] ?? null,
                        ];

                        if ($record->id !== Auth::id()) {
                            $updateData['role_id'] = $data['role_id'];
                            $updateData['status'] = $data['status'];
                        }

                        if (! empty($data['password'])) {
                            $updateData['password'] = Hash::make((string) $data['password']);
                        }

                        $record->update($updateData);

                        Notification::make()
                            ->title('Staff Member Updated')
                            ->body("Account details for {$record->name} have been updated.")
                            ->success()
                            ->send();
                    }),

                Action::make('toggle_status')
                    ->label(fn (User $record): string => $record->status === 'active' ? 'Deactivate' : 'Activate')
                    ->icon(fn (User $record): string => $record->status === 'active' ? 'heroicon-o-no-symbol' : 'heroicon-o-check-circle')
                    ->color(fn (User $record): string => $record->status === 'active' ? 'danger' : 'success')
                    ->requiresConfirmation()
                    ->modalHeading(fn (User $record): string => $record->status === 'active' ? 'Deactivate Staff Account' : 'Reactivate Staff Account')
                    ->modalDescription(fn (User $record): string => $record->status === 'active'
                        ? "Deactivating {$record->name} will immediately prevent them from accessing the administrative panel."
                        : "Reactivating {$record->name} will restore their access to the administrative panel.")
                    ->visible(function (User $record): bool {
                        $currentUser = static::getCurrentUser();
                        if (! $currentUser || ! $currentUser->isAdmin()) {
                            return false;
                        }

                        // Cannot deactivate self
                        if ($record->id === $currentUser->id) {
                            return false;
                        }

                        // Cannot deactivate super admin
                        if ($record->isSuperAdmin()) {
                            return false;
                        }

                        // Co-admin protection: A regular admin cannot deactivate another admin
                        if ($record->isAdmin() && ! $currentUser->isSuperAdmin()) {
                            return false;
                        }

                        return true;
                    })
                    ->action(function (User $record): void {
                        $newStatus = $record->status === 'active' ? 'inactive' : 'active';
                        $record->update(['status' => $newStatus]);

                        Notification::make()
                            ->title($newStatus === 'active' ? 'Account Activated' : 'Account Deactivated')
                            ->body("{$record->name}'s account status is now ".ucfirst($newStatus).'.')
                            ->color($newStatus === 'active' ? 'success' : 'warning')
                            ->send();
                    }),

                Action::make('revoke_sub_admin')
                    ->label('Revoke Access')
                    ->color('warning')
                    ->icon(Heroicon::OutlinedUserMinus)
                    ->requiresConfirmation()
                    ->modalHeading('Revoke Staff Access')
                    ->modalDescription(fn (User $record): string => "Are you sure you want to revoke staff access for {$record->name} ({$record->email})? They will be reverted to a standard resident.")
                    ->visible(function (User $record): bool {
                        $currentUser = static::getCurrentUser();

                        return $record->isSubAdmin() && ($currentUser !== null && $currentUser->isAdmin());
                    })
                    ->action(function (User $record): void {
                        $residentRole = Role::firstOrCreate(
                            ['slug' => 'resident'],
                            ['name' => 'Resident / Family Head']
                        );

                        $record->update([
                            'role_id' => $residentRole->id,
                        ]);

                        Notification::make()
                            ->title('Staff Privileges Revoked')
                            ->body("{$record->name} has been reverted to a standard resident.")
                            ->info()
                            ->send();
                    }),

                Action::make('delete_staff')
                    ->label('Delete')
                    ->color('danger')
                    ->icon(Heroicon::OutlinedTrash)
                    ->requiresConfirmation()
                    ->modalHeading('Delete Staff Account')
                    ->modalDescription(fn (User $record): string => "Permanently delete {$record->name} ({$record->email})? This action cannot be undone.")
                    ->visible(function (User $record): bool {
                        $currentUser = static::getCurrentUser();
                        if (! $currentUser || ! $currentUser->isAdmin()) {
                            return false;
                        }

                        if ($record->id === $currentUser->id || $record->isSuperAdmin()) {
                            return false;
                        }

                        if ($record->isAdmin() && ! $currentUser->isSuperAdmin()) {
                            return false;
                        }

                        return true;
                    })
                    ->action(function (User $record): void {
                        $name = $record->name;
                        $record->delete();

                        Notification::make()
                            ->title('Staff Account Deleted')
                            ->body("{$name} has been deleted.")
                            ->danger()
                            ->send();
                    }),
            ]);
    }
}
