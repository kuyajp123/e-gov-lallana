<?php

namespace App\Services\Sms;

use App\Services\Sms\Contracts\SmsService;
use App\Services\Sms\Providers\FakeSmsService;
use App\Services\Sms\Providers\SemaphoreSmsService;
use App\Services\Sms\Providers\TextBeeSmsService;
use InvalidArgumentException;

class SmsManager
{
    /**
     * Create the appropriate SMS driver instance based on configuration.
     */
    public static function createDriver(?string $provider = null): SmsService
    {
        $provider = $provider ?? config('sms.default', 'fake');

        return match (strtolower($provider)) {
            'fake' => new FakeSmsService(
                simulatedMode: config('sms.providers.fake.simulated_mode', 'SUCCESS')
            ),
            'textbee' => new TextBeeSmsService(
                apiKey: (string) config('sms.providers.textbee.api_key'),
                deviceId: (string) config('sms.providers.textbee.device_id'),
                baseUrl: (string) config('sms.providers.textbee.base_url', 'https://api.textbee.dev/api/v1'),
                timeout: (int) config('sms.providers.textbee.timeout', 10),
            ),
            'semaphore' => new SemaphoreSmsService(
                apiKey: (string) config('sms.providers.semaphore.api_key'),
                senderName: (string) config('sms.providers.semaphore.sender_name', 'SEMAPHORE'),
                baseUrl: (string) config('sms.providers.semaphore.base_url', 'https://api.semaphore.co/api/v4'),
                timeout: (int) config('sms.providers.semaphore.timeout', 10),
            ),
            default => throw new InvalidArgumentException("Unsupported SMS driver: [{$provider}]"),
        };
    }
}
