<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Fortify\Features;

beforeEach(function () {
    $this->skipUnlessFortifyHas(Features::registration());
});

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertOk();
});

test('new users can register with first and last name', function () {
    $response = $this->post(route('register.store'), [
        'first_name' => 'Juan',
        'middle_name' => 'Santos',
        'last_name' => 'Dela Cruz',
        'suffix' => 'Jr.',
        'email' => 'juan@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));

    $this->assertDatabaseHas('users', [
        'name' => 'Juan Santos Dela Cruz Jr.',
        'email' => 'juan@example.com',
    ]);
});

test('new users can register with legacy name field for backwards compatibility', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('new users can optionally complete KYC and upload government ID during registration', function () {
    Storage::fake('local');
    $idFile = UploadedFile::fake()->create('valid_id.png', 500, 'image/png');

    $response = $this->post(route('register.store'), [
        'first_name' => 'Maria',
        'last_name' => 'Santos',
        'email' => 'maria@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'birthdate' => '1995-05-15',
        'gender' => 'female',
        'civil_status' => 'single',
        'citizenship' => 'Filipino',
        'government_id' => $idFile,
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));

    $user = User::where('email', 'maria@example.com')->first();
    expect($user)->not->toBeNull();
    expect($user->residentProfile)->not->toBeNull();
    expect($user->residentProfile->first_name)->toBe('Maria');
    expect($user->residentProfile->government_id_file_id)->not->toBeNull();
});
