<?php

use App\Mail\HouseholdRegistrationOtpMail;
use App\Models\Household;
use App\Models\ResidentProfile;
use App\Models\User;
use App\Services\Auth\OtpService;
use Illuminate\Support\Facades\Mail;

function createHouseholdTestUser(): User
{
    $user = User::factory()->create(['email' => 'juan@example.com', 'phone_number' => '09171234567']);
    ResidentProfile::create([
        'user_id' => $user->id,
        'first_name' => 'Juan',
        'last_name' => 'Dela Cruz',
        'birthdate' => '1990-01-01',
        'gender' => 'male',
        'civil_status' => 'married',
        'citizenship' => 'Filipino',
    ]);

    return $user;
}

test('resident with complete profile can view household registration page', function () {
    $user = createHouseholdTestUser();

    $response = $this->actingAs($user)->get('/household/register');

    $response->assertOk();
});

test('resident can request and verify OTP for household registration', function () {
    Mail::fake();
    $user = createHouseholdTestUser();
    $otpService = app(OtpService::class);

    // Send OTP
    $sendResponse = $this->actingAs($user)->postJson('/household/register/otp/send', [
        'channel' => 'email',
    ]);
    $sendResponse->assertOk()->assertJson(['success' => true]);

    Mail::assertSent(HouseholdRegistrationOtpMail::class, function ($mail) {
        return $mail->hasTo('juan@example.com') && ! empty($mail->otpCode);
    });

    // Force known OTP for verification test
    $otp = $otpService->generate('juan@example.com', 'household_registration');

    // Verify OTP
    $verifyResponse = $this->actingAs($user)->postJson('/household/register/otp/verify', [
        'channel' => 'email',
        'otp_code' => $otp,
    ]);
    $verifyResponse->assertOk()->assertJson(['valid' => true]);
});

test('resident can register new household with valid OTP', function () {
    $user = createHouseholdTestUser();
    $otpService = app(OtpService::class);
    $otp = $otpService->generate('juan@example.com', 'household_registration');

    $response = $this->actingAs($user)->post('/household/register', [
        'purok_sitio' => 'Purok 1',
        'address' => 'Block 1 Lot 5, Sampaguita St.',
        'notes' => 'Near chapel',
        'verification_channel' => 'email',
        'otp_code' => $otp,
    ]);

    $response->assertRedirect('/household');

    $this->assertDatabaseHas('households', [
        'family_head_id' => $user->id,
        'purok_sitio' => 'Purok 1',
        'address' => 'Block 1 Lot 5, Sampaguita St.',
        'status' => 'unverified',
    ]);

    $household = Household::where('family_head_id', $user->id)->first();
    expect($household->household_code)->toMatch('/HH-\d{4}-\d{4}/');

    $this->assertDatabaseHas('household_members', [
        'household_id' => $household->id,
        'user_id' => $user->id,
        'is_family_head' => true,
        'first_name' => 'Juan',
    ]);

    $this->assertDatabaseHas('verifications', [
        'verifiable_type' => Household::class,
        'verifiable_id' => $household->id,
        'status' => 'pending',
    ]);
});

test('household registration rejects invalid OTP', function () {
    $user = createHouseholdTestUser();

    $response = $this->actingAs($user)->post('/household/register', [
        'purok_sitio' => 'Purok 1',
        'address' => 'Block 1 Lot 5, Sampaguita St.',
        'verification_channel' => 'email',
        'otp_code' => '000000', // Invalid code
    ]);

    $response->assertSessionHasErrors(['otp_code']);
    $this->assertDatabaseEmpty('households');
});
