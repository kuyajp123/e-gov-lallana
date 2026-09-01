<?php

namespace App\Console\Commands;

use App\Models\Role;
use App\Models\User;
use Illuminate\Console\Command;

class MakeAdminCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:make-admin {email : The email address of the user} {--name=Barangay Admin} {--password=password}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Promote an existing user to Admin or create a new Admin user';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $email = (string) $this->argument('email');
        $name = (string) $this->option('name');
        $password = (string) $this->option('password');

        $adminRole = Role::firstOrCreate(
            ['slug' => 'admin'],
            ['name' => 'Barangay Administrator', 'description' => 'Full administrative access']
        );

        /** @var User|null $user */
        $user = User::where('email', $email)->first();

        if ($user) {
            $user->update([
                'role_id' => $adminRole->id,
                'password' => $password,
                'email_verified_at' => $user->email_verified_at ?? now(),
            ]);

            $this->info("Successfully promoted existing user [{$email}] to Barangay Administrator and updated password!");
        } else {
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'role_id' => $adminRole->id,
                'password' => $password,
                'email_verified_at' => now(),
            ]);

            $this->info("Successfully created new Admin user [{$email}] with password: {$password}");
        }

        return self::SUCCESS;
    }
}
