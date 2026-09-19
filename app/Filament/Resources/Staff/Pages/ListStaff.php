<?php

namespace App\Filament\Resources\Staff\Pages;

use App\Filament\Resources\Staff\StaffResource;
use App\Models\Role;
use App\Models\User;
use Filament\Actions\Action;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class ListStaff extends ListRecords
{
    protected static string $resource = StaffResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('create_staff')
                ->label('New Staff Account')
                ->icon(Heroicon::OutlinedUserPlus)
                ->modalHeading('Provision New Administrative Staff')
                ->modalDescription('Directly create a new staff account with system credentials.')
                ->modalSubmitActionLabel('Create Staff Account')
                ->schema([
                    TextInput::make('name')
                        ->label('Full Name')
                        ->required()
                        ->maxLength(255),
                    TextInput::make('email')
                        ->label('Email Address')
                        ->email()
                        ->required()
                        ->maxLength(255)
                        ->unique('users', 'email'),
                    TextInput::make('phone_number')
                        ->label('Phone / Mobile Number')
                        ->tel()
                        ->placeholder('+639123456789'),
                    Select::make('role_slug')
                        ->label('System Role')
                        ->options([
                            'sub_admin' => 'Barangay Sub-admin / Staff',
                            'admin' => 'Barangay Administrator',
                        ])
                        ->default('sub_admin')
                        ->required(),
                    TextInput::make('password')
                        ->label('Password')
                        ->password()
                        ->revealable()
                        ->required()
                        ->minLength(8),
                    Select::make('status')
                        ->label('Account Status')
                        ->options([
                            'active' => 'Active',
                            'inactive' => 'Inactive',
                        ])
                        ->default('active')
                        ->required(),
                ])
                ->action(function (array $data): void {
                    $role = Role::where('slug', $data['role_slug'])->first();

                    if (! $role) {
                        $role = Role::create([
                            'name' => $data['role_slug'] === 'admin' ? 'Barangay Administrator' : 'Barangay Sub-admin / Staff',
                            'slug' => $data['role_slug'],
                            'description' => 'Staff level access',
                        ]);
                    }

                    $user = User::create([
                        'name' => $data['name'],
                        'email' => strtolower(trim((string) $data['email'])),
                        'phone_number' => $data['phone_number'] ?? null,
                        'role_id' => $role->id,
                        'password' => Hash::make((string) $data['password']),
                        'status' => $data['status'] ?? 'active',
                        'email_verified_at' => now(),
                    ]);

                    Notification::make()
                        ->title('Staff Account Created')
                        ->body("{$user->name} ({$user->email}) has been provisioned as {$role->name}.")
                        ->success()
                        ->send();
                }),

            Action::make('designate_sub_admin')
                ->label('Designate Existing Resident')
                ->icon(Heroicon::OutlinedUsers)
                ->color('gray')
                ->modalHeading('Designate Existing Resident as Staff')
                ->modalDescription('Enter the email address of a registered resident to grant administrative access.')
                ->modalSubmitActionLabel('Grant Staff Privileges')
                ->schema([
                    TextInput::make('email')
                        ->label('Registered Resident Email')
                        ->email()
                        ->required()
                        ->placeholder('e.g. resident@example.com')
                        ->helperText('The resident must already have created an account in the system.'),
                    Select::make('role_slug')
                        ->label('System Role')
                        ->options([
                            'sub_admin' => 'Barangay Sub-admin / Staff',
                            'admin' => 'Barangay Administrator',
                        ])
                        ->default('sub_admin')
                        ->required(),
                ])
                ->action(function (array $data): void {
                    $email = strtolower(trim((string) $data['email']));

                    /** @var User|null $user */
                    $user = User::where('email', $email)->first();

                    if (! $user) {
                        throw ValidationException::withMessages([
                            'email' => 'No registered resident found with this email. The user must register first before they can be designated as staff.',
                        ]);
                    }

                    if ($user->isSuperAdmin()) {
                        Notification::make()
                            ->title('User is already a Super Administrator')
                            ->warning()
                            ->send();

                        return;
                    }

                    $targetSlug = $data['role_slug'] ?? 'sub_admin';
                    $role = Role::firstOrCreate(
                        ['slug' => $targetSlug],
                        ['name' => $targetSlug === 'admin' ? 'Barangay Administrator' : 'Barangay Sub-admin / Staff']
                    );

                    $user->update([
                        'role_id' => $role->id,
                        'status' => 'active',
                    ]);

                    Notification::make()
                        ->title('Staff Privileges Granted')
                        ->body("{$user->name} ({$user->email}) is now assigned as {$role->name}.")
                        ->success()
                        ->send();
                }),
        ];
    }
}
