<?php

namespace App\Services\Sms\DTOs;

final class SmsResult
{
    public function __construct(
        public bool $success,
        public string $provider,
        public ?string $messageId = null,
        public ?string $errorCode = null,
        public ?string $errorMessage = null,
        public ?array $rawResponse = null,
    ) {}

    public static function success(string $provider, ?string $messageId = null, ?array $rawResponse = null): self
    {
        return new self(
            success: true,
            provider: $provider,
            messageId: $messageId,
            rawResponse: $rawResponse,
        );
    }

    public static function failure(string $provider, string $errorCode, string $errorMessage, ?array $rawResponse = null): self
    {
        return new self(
            success: false,
            provider: $provider,
            errorCode: $errorCode,
            errorMessage: $errorMessage,
            rawResponse: $rawResponse,
        );
    }
}
