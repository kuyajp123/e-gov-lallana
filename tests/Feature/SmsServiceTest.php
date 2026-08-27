<?php

use App\Services\Sms\Contracts\SmsService;
use App\Services\Sms\Providers\FakeSmsService;
use Illuminate\Support\Facades\Cache;

beforeEach(function () {
    Cache::flush();
});

test('fake sms service dispatches successfully and records in cache', function () {
    $service = new FakeSmsService(simulatedMode: 'SUCCESS');

    $result = $service->send('09171234567', 'Test OTP 123456');

    expect($result->success)->toBeTrue()
        ->and($result->provider)->toBe('fake')
        ->and($result->messageId)->not->toBeNull();

    $messages = $service->getMessages();
    expect($messages)->toHaveCount(1)
        ->and($messages[0]['recipient'])->toBe('09171234567')
        ->and($messages[0]['status'])->toBe('SENT');
});

test('fake sms service simulates failure mode', function () {
    $service = new FakeSmsService(simulatedMode: 'FAILURE');

    $result = $service->send('09171234567', 'Test failure');

    expect($result->success)->toBeFalse()
        ->and($result->errorCode)->toBe('SIMULATED_FAILURE');

    $messages = $service->getMessages();
    expect($messages)->toHaveCount(1)
        ->and($messages[0]['status'])->toBe('FAILED');
});

test('fake sms service simulates timeout and rate limited modes', function () {
    $service = new FakeSmsService;

    $service->setMode('TIMEOUT');
    $timeoutResult = $service->send('09171234567', 'Timeout test');
    expect($timeoutResult->success)->toBeFalse()
        ->and($timeoutResult->errorCode)->toBe('SIMULATED_TIMEOUT');

    $service->setMode('RATE_LIMITED');
    $rateLimitResult = $service->send('09171234567', 'Rate limit test');
    expect($rateLimitResult->success)->toBeFalse()
        ->and($rateLimitResult->errorCode)->toBe('SIMULATED_RATE_LIMITED');
});

test('container resolves SmsService contract via SmsManager', function () {
    $resolved = app(SmsService::class);

    expect($resolved)->toBeInstanceOf(SmsService::class);
});
