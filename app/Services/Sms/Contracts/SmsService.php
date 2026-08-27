<?php

namespace App\Services\Sms\Contracts;

use App\Services\Sms\DTOs\SmsResult;

interface SmsService
{
    /**
     * Send an SMS message to the specified recipient.
     */
    public function send(string $recipient, string $message): SmsResult;
}
