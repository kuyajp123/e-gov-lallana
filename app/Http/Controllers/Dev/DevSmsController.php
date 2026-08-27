<?php

namespace App\Http\Controllers\Dev;

use App\Http\Controllers\Controller;
use App\Services\Sms\Contracts\SmsService;
use App\Services\Sms\Providers\FakeSmsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DevSmsController extends Controller
{
    public function __construct(
        protected SmsService $smsService
    ) {}

    public function index(): Response
    {
        abort_unless(app()->isLocal(), 404);

        $fakeService = app(FakeSmsService::class);

        return Inertia::render('dev/sms-inbox', [
            'messages' => $fakeService->getMessages(),
            'currentMode' => $fakeService->getMode(),
            'configuredProvider' => config('sms.default'),
        ]);
    }

    public function setMode(Request $request): RedirectResponse
    {
        abort_unless(app()->isLocal(), 404);

        $request->validate([
            'mode' => 'required|in:SUCCESS,FAILURE,TIMEOUT,RATE_LIMITED',
        ]);

        $fakeService = app(FakeSmsService::class);
        $fakeService->setMode((string) $request->input('mode'));

        return back()->with('success', "Simulation mode set to {$request->input('mode')}");
    }

    public function sendTest(Request $request): RedirectResponse
    {
        abort_unless(app()->isLocal(), 404);

        $validated = $request->validate([
            'recipient' => 'required|string',
            'message' => 'required|string',
        ]);

        $result = $this->smsService->send($validated['recipient'], $validated['message']);

        if ($result->success) {
            return back()->with('success', 'Test message sent successfully.');
        }

        return back()->with('error', "Failed: [{$result->errorCode}] {$result->errorMessage}");
    }

    public function clear(): RedirectResponse
    {
        abort_unless(app()->isLocal(), 404);

        $fakeService = app(FakeSmsService::class);
        $fakeService->clearMessages();

        return back()->with('success', 'SMS Inbox cleared.');
    }
}
