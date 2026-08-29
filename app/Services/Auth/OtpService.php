<?php

namespace App\Services\Auth;

use Illuminate\Support\Facades\Cache;
use InvalidArgumentException;

class OtpService
{
    /**
     * Default OTP time-to-live in seconds (5 minutes).
     */
    public const TTL_SECONDS = 300;

    /**
     * Cooldown period between OTP generation/resend requests in seconds (60 seconds).
     */
    public const COOLDOWN_SECONDS = 60;

    /**
     * Maximum allowed incorrect verification attempts before invalidation.
     */
    public const MAX_ATTEMPTS = 5;

    /**
     * Generate a new 6-digit OTP code and store its hash in Cache.
     */
    public function generate(string $identifier, string $purpose = 'verification'): string
    {
        $cleanIdentifier = $this->sanitizeIdentifier($identifier);

        // Generate 6-digit numeric OTP code
        $otp = (string) random_int(100000, 999999);

        $payload = [
            'hash' => hash('sha256', $otp),
            'attempts' => 0,
            'expires_at' => now()->addSeconds(self::TTL_SECONDS)->timestamp,
            'created_at' => now()->timestamp,
        ];

        // Store OTP payload
        Cache::put(
            $this->getOtpKey($cleanIdentifier, $purpose),
            $payload,
            now()->addSeconds(self::TTL_SECONDS)
        );

        // Set cooldown lock
        Cache::put(
            $this->getCooldownKey($cleanIdentifier, $purpose),
            now()->addSeconds(self::COOLDOWN_SECONDS)->timestamp,
            now()->addSeconds(self::COOLDOWN_SECONDS)
        );

        return $otp;
    }

    /**
     * Verify an inputted OTP code against the stored hash.
     */
    public function verify(string $identifier, string $inputOtp, string $purpose = 'verification'): bool
    {
        $cleanIdentifier = $this->sanitizeIdentifier($identifier);
        $key = $this->getOtpKey($cleanIdentifier, $purpose);

        $payload = Cache::get($key);

        if (! $payload || ! is_array($payload)) {
            return false;
        }

        // Check if maximum attempts exceeded
        if (($payload['attempts'] ?? 0) >= self::MAX_ATTEMPTS) {
            $this->invalidate($cleanIdentifier, $purpose);

            return false;
        }

        // Compare SHA-256 hash safely using hash_equals
        $inputHash = hash('sha256', trim($inputOtp));

        if (hash_equals($payload['hash'], $inputHash)) {
            // Success: clear OTP immediately so it cannot be re-used
            $this->invalidate($cleanIdentifier, $purpose);

            return true;
        }

        // Increment attempt count
        $payload['attempts'] = ($payload['attempts'] ?? 0) + 1;

        if ($payload['attempts'] >= self::MAX_ATTEMPTS) {
            $this->invalidate($cleanIdentifier, $purpose);
        } else {
            $remainingTtl = max(1, ($payload['expires_at'] ?? now()->timestamp) - now()->timestamp);
            Cache::put($key, $payload, now()->addSeconds($remainingTtl));
        }

        return false;
    }

    /**
     * Check if a new OTP can be requested (respecting 60s cooldown).
     */
    public function canResend(string $identifier, string $purpose = 'verification'): bool
    {
        $cleanIdentifier = $this->sanitizeIdentifier($identifier);

        return ! Cache::has($this->getCooldownKey($cleanIdentifier, $purpose));
    }

    /**
     * Get remaining cooldown seconds.
     */
    public function getRemainingCooldown(string $identifier, string $purpose = 'verification'): int
    {
        $cleanIdentifier = $this->sanitizeIdentifier($identifier);
        $cooldownTimestamp = Cache::get($this->getCooldownKey($cleanIdentifier, $purpose));

        if (! $cooldownTimestamp) {
            return 0;
        }

        return max(0, ((int) $cooldownTimestamp) - ((int) now()->timestamp));
    }

    /**
     * Invalidate and remove active OTP.
     */
    public function invalidate(string $identifier, string $purpose = 'verification'): void
    {
        $cleanIdentifier = $this->sanitizeIdentifier($identifier);
        Cache::forget($this->getOtpKey($cleanIdentifier, $purpose));
    }

    protected function sanitizeIdentifier(string $identifier): string
    {
        $clean = strtolower(trim($identifier));

        if (empty($clean)) {
            throw new InvalidArgumentException('OTP identifier cannot be empty.');
        }

        return $clean;
    }

    protected function getOtpKey(string $identifier, string $purpose): string
    {
        return "otp_{$purpose}_{$identifier}";
    }

    protected function getCooldownKey(string $identifier, string $purpose): string
    {
        return "otp_cooldown_{$purpose}_{$identifier}";
    }
}
