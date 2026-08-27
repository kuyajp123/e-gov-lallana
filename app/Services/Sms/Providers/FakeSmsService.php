<?php

namespace App\Services\Sms\Providers;

use App\Services\Sms\Contracts\SmsService;
use App\Services\Sms\DTOs\SmsResult;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class FakeSmsService implements SmsService
{
    protected string $storageKey = 'dev_sms_messages';

    protected string $modeKey = 'dev_sms_simulation_mode';

    public function __construct(
        protected ?string $simulatedMode = null
    ) {
        $this->simulatedMode = $simulatedMode ?? config('sms.providers.fake.simulated_mode', 'SUCCESS');
    }

    public function send(string $recipient, string $message): SmsResult
    {
        $currentMode = $this->getMode();

        $messageId = 'fake_'.Str::random(16);
        $timestamp = now()->toDateTimeString();

        $entry = [
            'id' => $messageId,
            'recipient' => $recipient,
            'message' => $message,
            'mode' => $currentMode,
            'sent_at' => $timestamp,
        ];

        switch (strtoupper($currentMode)) {
            case 'FAILURE':
                $entry['status'] = 'FAILED';
                $entry['error'] = 'Simulated provider gateway rejection.';
                $this->storeMessage($entry);

                return SmsResult::failure('fake', 'SIMULATED_FAILURE', 'Simulated provider gateway rejection.', $entry);

            case 'TIMEOUT':
                $entry['status'] = 'TIMEOUT';
                $entry['error'] = 'Simulated network connection timeout.';
                $this->storeMessage($entry);

                return SmsResult::failure('fake', 'SIMULATED_TIMEOUT', 'Simulated network connection timeout.', $entry);

            case 'RATE_LIMITED':
                $entry['status'] = 'RATE_LIMITED';
                $entry['error'] = 'Simulated quota/rate-limit exceeded.';
                $this->storeMessage($entry);

                return SmsResult::failure('fake', 'SIMULATED_RATE_LIMITED', 'Simulated quota/rate-limit exceeded.', $entry);

            case 'SUCCESS':
            default:
                $entry['status'] = 'SENT';
                $this->storeMessage($entry);

                return SmsResult::success('fake', $messageId, $entry);
        }
    }

    /**
     * Store simulated message in Cache.
     *
     * @param  array<string, mixed>  $entry
     */
    protected function storeMessage(array $entry): void
    {
        $messages = $this->getMessages();
        array_unshift($messages, $entry);

        // Keep last 100 messages
        $messages = array_slice($messages, 0, 100);

        Cache::put($this->storageKey, $messages, now()->addDays(7));
    }

    /**
     * Retrieve all simulated messages.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getMessages(): array
    {
        return Cache::get($this->storageKey, []);
    }

    /**
     * Clear all simulated messages.
     */
    public function clearMessages(): void
    {
        Cache::forget($this->storageKey);
    }

    /**
     * Set simulation mode (SUCCESS, FAILURE, TIMEOUT, RATE_LIMITED).
     */
    public function setMode(string $mode): void
    {
        Cache::put($this->modeKey, strtoupper($mode), now()->addDays(7));
    }

    /**
     * Get active simulation mode.
     */
    public function getMode(): string
    {
        return Cache::get($this->modeKey, $this->simulatedMode ?? 'SUCCESS');
    }
}
