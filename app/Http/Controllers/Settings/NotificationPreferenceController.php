<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class NotificationPreferenceController extends Controller
{
    /**
     * Show the user's notification settings page.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $preference = $user->getNotificationPreference();

        return Inertia::render('settings/notifications', [
            'preference' => $preference,
            'hasPhoneNumber' => ! empty($user->phone_number),
            'phoneNumber' => $user->phone_number,
        ]);
    }

    /**
     * Update the user's notification preferences.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'preferred_channel' => ['required', 'string', Rule::in(['in_app_only', 'email', 'sms', 'both'])],
            'notify_document_updates' => ['required', 'boolean'],
            'notify_household_updates' => ['required', 'boolean'],
            'notify_announcements' => ['required', 'boolean'],
        ]);

        if (in_array($validated['preferred_channel'], ['sms', 'both'], true) && empty($user->phone_number)) {
            return back()->withErrors([
                'preferred_channel' => 'Please add a mobile number in your profile before activating SMS notifications.',
            ]);
        }

        $preference = $user->getNotificationPreference();
        $preference->update($validated);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Notification preferences updated successfully.',
        ]);

        return to_route('notifications.preferences.edit');
    }
}
