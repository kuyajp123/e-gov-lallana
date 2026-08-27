<?php

use App\Services\Auth\OtpService;
use Illuminate\Support\Facades\Cache;

beforeEach(function () {
    Cache::flush();
});

test('generates 6-digit numeric otp and sets cooldown', function () {
    $otpService = new OtpService;
    $phone = '09171234567';

    $otp = $otpService->generate($phone, 'login');

    expect($otp)->toBeDigits()
        ->and(strlen($otp))->toBe(6)
        ->and($otpService->canResend($phone, 'login'))->toBeFalse()
        ->and($otpService->getRemainingCooldown($phone, 'login'))->toBeGreaterThan(0);
});

test('verifies correct otp and invalidates code upon success', function () {
    $otpService = new OtpService;
    $phone = '09171234567';

    $otp = $otpService->generate($phone, 'registration');

    expect($otpService->verify($phone, $otp, 'registration'))->toBeTrue();

    // Secondary verification should fail (one-time use)
    expect($otpService->verify($phone, $otp, 'registration'))->toBeFalse();
});

test('fails on invalid otp and locks out after max attempts', function () {
    $otpService = new OtpService;
    $phone = '09171234567';

    $correctOtp = $otpService->generate($phone, 'test');

    // 4 wrong attempts
    for ($i = 0; $i < 4; $i++) {
        expect($otpService->verify($phone, '000000', 'test'))->toBeFalse();
    }

    // 5th wrong attempt triggers lockout / invalidation
    expect($otpService->verify($phone, '000000', 'test'))->toBeFalse();

    // Now even correct OTP fails
    expect($otpService->verify($phone, $correctOtp, 'test'))->toBeFalse();
});
