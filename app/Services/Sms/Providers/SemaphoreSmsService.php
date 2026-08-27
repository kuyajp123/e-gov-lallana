<?php

namespace App\Services\Sms\Providers;

use App\Services\Sms\Contracts\SmsService;
use App\Services\Sms\DTOs\SmsResult;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class SemaphoreSmsService implements SmsService
{
    public function __construct(
        protected string $apiKey,
        protected string $senderName = 'SEMAPHORE',
        protected string $baseUrl = 'https://api.semaphore.co/api/v4',
        protected int $timeout = 10,
    ) {}

    public function send(string $recipient, string $message): SmsResult
    {
        if (empty($this->apiKey)) {
            Log::warning('[SemaphoreSmsService] Missing API key.');

            return SmsResult::failure(
                provider: 'semaphore',
                errorCode: 'CONFIG_MISSING',
                errorMessage: 'Semaphore API key is not configured.',
            );
        }

        $url = rtrim($this->baseUrl, '/').'/messages';

        try {
            $response = Http::timeout($this->timeout)->post($url, [
                'apikey' => $this->apiKey,
                'number' => $this->formatPhoneNumber($recipient),
                'message' => $message,
                'sendername' => $this->senderName,
            ]);

            $data = $response->json();

            if ($response->successful()) {
                $first = is_array($data) && isset($data[0]) ? $data[0] : $data;
                $messageId = $first['message_id'] ?? null;

                return SmsResult::success(
                    provider: 'semaphore',
                    messageId: (string) $messageId,
                    rawResponse: is_array($data) ? $data : [],
                );
            }

            return SmsResult::failure(
                provider: 'semaphore',
                errorCode: 'HTTP_'.$response->status(),
                errorMessage: 'Semaphore request returned HTTP status '.$response->status(),
                rawResponse: is_array($data) ? $data : [],
            );
        } catch (Throwable $e) {
            Log::error('[SemaphoreSmsService] Connection error: '.$e->getMessage());

            return SmsResult::failure(
                provider: 'semaphore',
                errorCode: 'CONNECTION_EXCEPTION',
                errorMessage: $e->getMessage(),
            );
        }
    }

    protected function formatPhoneNumber(string $number): string
    {
        $cleaned = preg_replace('/[^0-9]/', '', $number);

        if (str_starts_with($cleaned, '63')) {
            return '0'.substr($cleaned, 2);
        }

        return $cleaned;
    }
}
