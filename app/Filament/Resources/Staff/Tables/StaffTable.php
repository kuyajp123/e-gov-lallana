<?php

namespace App\Filament\Resources\Staff\Tables;

use App\Models\Role;
use App\Models\User;
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Filament\Support\Enums\FontWeight;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class StaffTable
{
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

                TextColumn::make('role.name')
                    ->label('System Role')
                    ->badge()
                    ->color(fn (User $record): string => $record->isAdmin() ? 'primary' : 'info'),

                TextColumn::make('created_at')
                    ->label('Account Created')
                    ->dateTime('M d, Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->recordActions([
                Action::make('revoke_sub_admin')
                    ->label('Revoke Access')
                    ->color('danger')
                    ->icon(Heroicon::OutlinedUserMinus)
                    ->requiresConfirmation()
                    ->modalHeading('Revoke Sub-Admin Access')
                    ->modalDescription(fn (User $record): string => "Are you sure you want to revoke Sub-Admin access for {$record->name} ({$record->email})? They will be reverted to a standard resident.")
                    ->visible(fn (User $record): bool => $record->isSubAdmin())
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
            ]);
    }
}
