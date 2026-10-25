<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use App\Rules\ValidTurnstile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class InquiryController extends Controller
{
    public function __invoke(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:150',
            'subject' => 'required|string|max:150',
            'message' => 'required|string|max:2000',
            'cf-turnstile-response' => ['required', new ValidTurnstile],
        ], [
            'cf-turnstile-response.required' => 'Please complete the security bot verification.',
        ]);

        Inquiry::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'ip_address' => $request->ip(),
            'status' => 'pending',
        ]);

        Log::info('[PublicInquiry] New visitor message received', [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'subject' => $validated['subject'],
            'ip' => $request->ip(),
        ]);

        $locale = app()->getLocale();
        $message = trans('landing.contact.form_success', [], $locale);

        return back()->with('success', $message);
    }
}
