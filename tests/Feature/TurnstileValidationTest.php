<?php

use App\Rules\ValidTurnstile;
use Illuminate\Support\Facades\Validator;

test('turnstile validator passes in test environment with test token', function () {
    $validator = Validator::make([
        'cf-turnstile-response' => '1x00000000000000000000AA',
    ], [
        'cf-turnstile-response' => ['required', new ValidTurnstile],
    ]);

    expect($validator->passes())->toBeTrue();
});

test('turnstile validator fails when token is empty', function () {
    $validator = Validator::make([
        'cf-turnstile-response' => '',
    ], [
        'cf-turnstile-response' => ['required', new ValidTurnstile],
    ]);

    expect($validator->fails())->toBeTrue();
});
