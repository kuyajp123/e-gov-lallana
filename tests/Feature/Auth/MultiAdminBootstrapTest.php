<?php

use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Config;

test('bootstrap admins command provisions all super admins from config and removes unlisted ones', function () {
    $adminRole = Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Barangay Administrator']);

    // Create an unlisted old admin that should be deleted upon sync
    $oldAdmin = User::factory()->create([
        'email' => 'old.admin@lallana.gov.ph',
        'role_id' => $adminRole->id,
    ]);

    Config::set('auth.super_admins', [
        [
            'name' => 'First Super Admin',
            'email' => 'first.admin@lallana.gov.ph',
            'password' => 'super-secret-1',
        ],
        [
            'name' => 'Second Super Admin',
            'email' => 'second.admin@lallana.gov.ph',
            'password' => 'super-secret-2',
        ],
    ]);

    Artisan::call('app:bootstrap-admins');

    $admin1 = User::where('email', 'first.admin@lallana.gov.ph')->first();
    $admin2 = User::where('email', 'second.admin@lallana.gov.ph')->first();
    $deletedOldAdmin = User::where('email', 'old.admin@lallana.gov.ph')->first();

    expect($admin1)->not->toBeNull()
        ->and($admin1->isAdmin())->toBeTrue()
        ->and($admin1->name)->toBe('First Super Admin')
        ->and($admin1->email_verified_at)->not->toBeNull();

    expect($admin2)->not->toBeNull()
        ->and($admin2->isAdmin())->toBeTrue()
        ->and($admin2->name)->toBe('Second Super Admin')
        ->and($admin2->email_verified_at)->not->toBeNull();

    // The unlisted admin is authoritatively deleted
    expect($deletedOldAdmin)->toBeNull();
});

test('unregistered admin in config can log in directly on the fly without running any command', function () {
    Config::set('auth.super_admins', [
        [
            'name' => 'Instant Admin',
            'email' => 'instant.admin@lallana.gov.ph',
            'password' => 'instant-pass-123',
        ],
    ]);

    // Ensure user does not exist in DB yet
    expect(User::where('email', 'instant.admin@lallana.gov.ph')->exists())->toBeFalse();

    // Attempt login directly
    $response = $this->post('/login', [
        'email' => 'instant.admin@lallana.gov.ph',
        'password' => 'instant-pass-123',
    ]);

    $response->assertRedirect('/admin');

    $createdAdmin = User::where('email', 'instant.admin@lallana.gov.ph')->first();
    expect($createdAdmin)->not->toBeNull()
        ->and($createdAdmin->isAdmin())->toBeTrue();

    $this->assertAuthenticatedAs($createdAdmin);
});
