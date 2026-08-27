<?php

namespace App\Services\Sms\Providers;

use App\Services\Sms\Contracts\SmsService;
use App\Services\Sms\DTOs\SmsResult;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class TextBeeSmsService implements SmsService
{
    public function __construct(
        protected string $apiKey,
        protected string $deviceId,
        protected string $baseUrl = 'https://api.textbee.dev/api/v1',
        protected int $timeout = 10,
    ) {}

    public function send(string $recipient, string $message): SmsResult
    {
        if (empty($this->apiKey) || empty($this->deviceId)) {
            Log::warning('[TextBeeSmsService] Missing API Key or Device ID configuration.');

            return SmsResult::failure(
                provider: 'textbee',
                errorCode: 'CONFIG_MISSING',
                errorMessage: 'TextBee API key or Device ID is not configured.',
            );
        }

        $url = rtrim($this->baseUrl, '/')."/gateway/devices/{$this->deviceId}/send-sms";

        try {
            $response = Http::withHeaders([
                'x-api-key' => $this->apiKey,
                'Content-Type' => 'application/json',
            ])
                ->timeout($this->timeout)
                ->post($url, [
                    'recipients' => [$this->formatPhoneNumber($recipient)],
                    'message' => $message,
                ]);

            $data = $response->json();

            if ($response->successful()) {
                $messageId = $data['data']['messageId'] ?? $data['messageId'] ?? null;

                return SmsResult::success(
                    provider: 'textbee',
                    messageId: (string) $messageId,
                    rawResponse: $data ?? [],
                );
            }

            $errorMessage = $data['message'] ?? $data['error'] ?? 'HTTP request failed with status '.$response->status();

            Log::error('[TextBeeSmsService] API dispatch error', [
                'status' => $response->status(),
                'response' => $data,
            ]);

            return SmsResult::failure(
                provider: 'textbee',
                errorCode: 'HTTP_'.$response->status(),
                errorMessage: $errorMessage,
                rawResponse: $data,
            );
        } catch (Throwable $e) {
            Log::error('[TextBeeSmsService] Connection exception: '.$e->getMessage());

            return SmsResult::failure(
                provider: 'textbee',
                errorCode: 'CONNECTION_EXCEPTION',
                errorMessage: $e->getMessage(),
            );
        }
    }

    /**
     * Normalize Philippine phone numbers to international or standard format.
     */
    protected function formatPhoneNumber(string $number): string
    {
        $cleaned = preg_replace('/[^0-9]/', '', $number);

        if (str_starts_with($cleaned, '09')) {
            return '+63'.substr($cleaned, 1);
        }

        if (str_starts_with($cleaned, '639')) {
            return '+'.$cleaned;
        }

        return $cleaned;
    }
}
