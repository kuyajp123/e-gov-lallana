<?php

namespace App\Filament\Resources\Staff\Pages;

use App\Filament\Resources\Staff\StaffResource;
use App\Models\Role;
use App\Models\User;
use Filament\Actions\Action;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;
use Filament\Support\Icons\Heroicon;
use Illuminate\Validation\ValidationException;

class ListStaff extends ListRecords
{
    protected static string $resource = StaffResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('designate_sub_admin')
                ->label('Designate Sub-Admin')
                ->icon(Heroicon::OutlinedUserPlus)
                ->modalHeading('Designate Existing Resident as Sub-Admin')
                ->modalDescription('Enter the email address of a resident who is already registered in the system. Unregistered emails cannot be designated.')
                ->modalSubmitActionLabel('Grant Staff Privileges')
                ->schema([
                    TextInput::make('email')
                        ->label('Registered Resident Email')
                        ->email()
                        ->required()
                        ->placeholder('e.g. resident@example.com')
                        ->helperText('The resident must already have created an account in the system.'),
                ])
                ->action(function (array $data): void {
                    $email = trim((string) $data['email']);

                    /** @var User|null $user */
                    $user = User::where('email', $email)->first();

                    if (! $user) {
                        throw ValidationException::withMessages([
                            'email' => 'No registered resident found with this email. The user must register first before they can be designated as a Sub-Admin.',
                        ]);
                    }

                    if ($user->isAdmin()) {
                        Notification::make()
                            ->title('User is already a Super Administrator')
                            ->warning()
                            ->send();

                        return;
                    }

                    $subAdminRole = Role::firstOrCreate(
                        ['slug' => 'sub_admin'],
                        ['name' => 'Barangay Sub-admin / Staff', 'description' => 'Staff level administrative access']
                    );

                    $user->update([
                        'role_id' => $subAdminRole->id,
                    ]);

                    Notification::make()
                        ->title('Sub-Admin Designated Successfully')
                        ->body("{$user->name} ({$user->email}) now has Sub-Admin staff access.")
                        ->success()
                        ->send();
                }),
        ];
    }
}
