<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Services\System\KeepAliveService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SystemSettingController extends Controller
{
    public function __construct(
        protected KeepAliveService $keepAliveService
    ) {}

    /**
     * Render the system & server settings page.
     */
    public function edit(Request $request): Response
    {
        $status = $this->keepAliveService->getStatus();

        return Inertia::render('settings/system', [
            'keepAlive' => $status,
        ]);
    }

    /**
     * Update the Render keep-alive schedule (pg_cron + pg_net).
     */
    public function updateKeepAlive(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'enabled' => ['required', 'boolean'],
            'interval' => ['nullable', 'integer', 'min:2', 'max:59'],
            'target_url' => ['nullable', 'url'],
        ]);

        $enabled = (bool) $validated['enabled'];
        $interval = (int) ($validated['interval'] ?? 11);
        $targetUrl = ! empty($validated['target_url']) ? (string) $validated['target_url'] : null;

        $result = $this->keepAliveService->updateSchedule(
            enabled: $enabled,
            interval: $interval,
            targetUrl: $targetUrl
        );

        if ($result['success']) {
            return back()->with('success', $result['message']);
        }

        return back()->with('error', $result['message']);
    }
}
