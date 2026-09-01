<?php

namespace App\Services\Auth;

use App\Models\Role;
use App\Models\User;

class SuperAdminSyncService
{
    /**
     * Authoritatively synchronize Super Administrators from environment configuration.
     * Any configured admin is created/updated.
     * Any existing Super Admin in the database not present in the configuration is deleted.
     */
    public function sync(): int
    {
        $superAdmins = config('auth.super_admins', []);

        $adminRole = Role::firstOrCreate(
            ['slug' => 'admin'],
            ['name' => 'Barangay Administrator', 'description' => 'Full administrative access']
        );

        $configuredEmails = [];

        if (is_array($superAdmins) && ! empty($superAdmins)) {
            foreach ($superAdmins as $adminData) {
                $email = is_array($adminData) ? ($adminData['email'] ?? null) : (is_string($adminData) ? $adminData : null);

                if (! $email) {
                    continue;
                }

                $email = trim(strtolower((string) $email));
                $configuredEmails[] = $email;

                $name = is_array($adminData) ? ($adminData['name'] ?? 'Barangay Administrator') : 'Barangay Administrator';
                $password = is_array($adminData) ? ($adminData['password'] ?? 'password') : 'password';

                /** @var User|null $user */
                $user = User::where('email', $email)->first();

                if ($user) {
                    $user->update([
                        'role_id' => $adminRole->id,
                        'name' => $name,
                        'password' => $password,
                        'email_verified_at' => $user->email_verified_at ?? now(),
                    ]);
                } else {
                    User::create([
                        'name' => $name,
                        'email' => $email,
                        'role_id' => $adminRole->id,
                        'password' => $password,
                        'email_verified_at' => now(),
                    ]);
                }
            }
        }

        if (empty($configuredEmails)) {
            return 0;
        }

        // Authoritatively delete any Super Admin in the database who is no longer in config
        User::where('role_id', $adminRole->id)
            ->whereNotIn('email', $configuredEmails)
            ->delete();

        return count($configuredEmails);
    }
}
