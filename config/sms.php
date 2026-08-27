<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default SMS Provider
    |--------------------------------------------------------------------------
    |
    | Supported: "fake", "textbee", "semaphore"
    |
    */

    'default' => env('SMS_PROVIDER', 'fake'),

    /*
    |--------------------------------------------------------------------------
    | SMS Providers Configuration
    |--------------------------------------------------------------------------
    */

    'providers' => [

        'fake' => [
            'storage_key' => 'dev_sms_messages',
            'simulated_mode' => env('FAKE_SMS_MODE', 'SUCCESS'), // SUCCESS, FAILURE, TIMEOUT, RATE_LIMITED
        ],

        'textbee' => [
            'api_key' => env('TEXTBEE_API_KEY', ''),
            'device_id' => env('TEXTBEE_DEVICE_ID', ''),
            'base_url' => env('TEXTBEE_BASE_URL', 'https://api.textbee.dev/api/v1'),
            'timeout' => (int) env('TEXTBEE_TIMEOUT', 10),
        ],

        'semaphore' => [
            'api_key' => env('SEMAPHORE_API_KEY', ''),
            'sender_name' => env('SEMAPHORE_SENDER_NAME', 'SEMAPHORE'),
            'base_url' => env('SEMAPHORE_BASE_URL', 'https://api.semaphore.co/api/v4'),
            'timeout' => (int) env('SEMAPHORE_TIMEOUT', 10),
        ],

    ],

];
