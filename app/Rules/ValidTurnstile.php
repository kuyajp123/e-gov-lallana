<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Translation\PotentiallyTranslatedString;
use Throwable;

class ValidTurnstile implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  Closure(string, ?string=): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (empty($value) || ! is_string($value)) {
            $fail('Please complete the security bot verification.');

            return;
        }

        $secretKey = config('services.turnstile.secret_key');

        // If in local/testing and using Cloudflare dummy test keys or no secret set
        if (app()->environment('local', 'testing') && (empty($secretKey) || $value === '1x00000000000000000000AA' || str_starts_with($value, '1x00000000000000000000AA'))) {
            return;
        }

        if (empty($secretKey)) {
            Log::warning('[ValidTurnstile] TURNSTILE_SECRET_KEY is not configured.');

            return;
        }

        try {
            $response = Http::asForm()
                ->timeout(5)
                ->post('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
                    'secret' => $secretKey,
                    'response' => $value,
                    'remoteip' => request()->ip(),
                ]);

            $result = $response->json();

            if (! $response->successful() || ! ($result['success'] ?? false)) {
                Log::warning('[ValidTurnstile] Verification failed', ['result' => $result]);
                $fail('Security verification failed. Please try again.');
            }
        } catch (Throwable $e) {
            Log::error('[ValidTurnstile] Connection error: '.$e->getMessage());

            // In production, fail closed; in local, fail open
            if (app()->isProduction()) {
                $fail('Unable to verify security challenge at this time. Please try again.');
            }
        }
    }
}
