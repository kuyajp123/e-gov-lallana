<?php

namespace App\Services\System;

use App\Models\SystemSetting;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class KeepAliveService
{
    public const JOB_NAME = 'render-keep-alive';

    /**
     * Get comprehensive status of the keep-alive service.
     *
     * @return array{
     *     is_pgsql: bool,
     *     enabled: bool,
     *     interval: int,
     *     target_url: string,
     *     cron_available: bool,
     *     net_available: bool,
     *     job: array<string, mixed>|null,
     *     last_ping: array<string, mixed>|null
     * }
     */
    public function getStatus(): array
    {
        $isPgsql = DB::getDriverName() === 'pgsql';
        $enabled = (bool) SystemSetting::get('render_keep_alive_enabled', false);
        $interval = (int) SystemSetting::get('render_keep_alive_interval_minutes', 11);
        $targetUrl = (string) (SystemSetting::get('render_keep_alive_target_url') ?: $this->getDefaultTargetUrl());

        $cronAvailable = false;
        $netAvailable = false;
        $job = null;
        $lastPing = null;

        if ($isPgsql) {
            try {
                $cronCheck = DB::selectOne("
                    SELECT EXISTS (
                        SELECT 1 FROM pg_extension WHERE extname = 'pg_cron'
                    ) AS available
                ");
                $cronAvailable = (bool) ($cronCheck->available ?? false);

                $netCheck = DB::selectOne("
                    SELECT EXISTS (
                        SELECT 1 FROM pg_extension WHERE extname = 'pg_net'
                    ) AS available
                ");
                $netAvailable = (bool) ($netCheck->available ?? false);

                if ($cronAvailable) {
                    $jobRow = DB::selectOne('
                        SELECT jobid, schedule, command, active 
                        FROM cron.job 
                        WHERE jobname = ?
                        LIMIT 1
                    ', [self::JOB_NAME]);

                    if ($jobRow) {
                        $job = (array) $jobRow;
                    }
                }

                if ($netAvailable) {
                    $responseRow = DB::selectOne('
                        SELECT id, status_code, error_msg, created
                        FROM net._http_response
                        ORDER BY created DESC
                        LIMIT 1
                    ');

                    if ($responseRow) {
                        $lastPing = (array) $responseRow;
                    }
                }
            } catch (Throwable $e) {
                Log::warning('Error querying pg_cron / pg_net status: '.$e->getMessage());
            }
        }

        return [
            'is_pgsql' => $isPgsql,
            'enabled' => $enabled,
            'interval' => $interval > 0 ? $interval : 11,
            'target_url' => $targetUrl,
            'cron_available' => $cronAvailable,
            'net_available' => $netAvailable,
            'job' => $job,
            'last_ping' => $lastPing,
        ];
    }

    /**
     * Update configuration and synchronize the pg_cron schedule.
     *
     * @return array{success: bool, message: string}
     */
    public function updateSchedule(bool $enabled, int $interval = 11, ?string $targetUrl = null): array
    {
        $resolvedUrl = ! empty($targetUrl) ? trim($targetUrl) : $this->getDefaultTargetUrl();
        $safeInterval = max(1, min(60, $interval));

        SystemSetting::set('render_keep_alive_enabled', $enabled);
        SystemSetting::set('render_keep_alive_interval_minutes', $safeInterval);
        SystemSetting::set('render_keep_alive_target_url', $resolvedUrl);

        if (DB::getDriverName() !== 'pgsql') {
            return [
                'success' => true,
                'message' => 'Keep-alive configuration saved (Active on PostgreSQL / Supabase deployments).',
            ];
        }

        try {
            // First, remove existing job if it was already scheduled
            DB::statement("
                DO \$\$
                BEGIN
                    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
                        IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = '".self::JOB_NAME."') THEN
                            PERFORM cron.unschedule('".self::JOB_NAME."');
                        END IF;
                    END IF;
                END \$\$;
            ");

            if ($enabled) {
                // Check if pg_cron and pg_net are installed
                $hasCron = DB::selectOne("SELECT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') AS has")->has;
                $hasNet = DB::selectOne("SELECT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_net') AS has")->has;

                if (! $hasCron || ! $hasNet) {
                    return [
                        'success' => false,
                        'message' => 'Settings saved, but pg_cron or pg_net extension is not enabled in your Supabase database. Please enable them in Database -> Extensions.',
                    ];
                }

                $cronExpression = "*/{$safeInterval} * * * *";
                $cronCommand = "SELECT net.http_get(url := '{$resolvedUrl}');";

                DB::statement('SELECT cron.schedule(?, ?, ?)', [
                    self::JOB_NAME,
                    $cronExpression,
                    $cronCommand,
                ]);

                return [
                    'success' => true,
                    'message' => "Render keep-alive successfully scheduled to ping {$resolvedUrl} every {$safeInterval} minutes via Supabase pg_cron + pg_net.",
                ];
            }

            return [
                'success' => true,
                'message' => 'Render keep-alive scheduled job successfully deactivated.',
            ];
        } catch (Throwable $e) {
            Log::error('Failed to configure pg_cron for keep-alive: '.$e->getMessage());

            return [
                'success' => false,
                'message' => 'Settings saved in database, but scheduling pg_cron failed: '.$e->getMessage(),
            ];
        }
    }

    /**
     * Get default target URL for /healthz.
     */
    public function getDefaultTargetUrl(): string
    {
        $appUrl = rtrim((string) config('app.url', 'http://localhost:8000'), '/');

        return "{$appUrl}/healthz";
    }
}
