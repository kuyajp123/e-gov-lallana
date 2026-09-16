<?php

namespace App\Http\Controllers\Household;

use App\Http\Controllers\Controller;
use App\Models\Household;
use App\Models\HouseholdMember;
use App\Models\User;
use App\Services\Notification\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HouseholdInvitationController extends Controller
{
    public function accept(Request $request, HouseholdMember $member): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        // Check if the member invitation belongs to this user
        $isRecipient = ($member->user_id === $user->id) ||
            (! empty($member->email) && strtolower($member->email) === strtolower($user->email));

        if (! $isRecipient) {
            abort(403, 'Unauthorized to respond to this invitation.');
        }

        if ($member->invitation_status !== 'pending') {
            return back()->with('error', 'This invitation is no longer pending.');
        }

        // Verify user doesn't head an existing household
        if (Household::where('family_head_id', $user->id)->exists()) {
            return back()->with('error', 'You cannot join another household because you are already a registered Family Head.');
        }

        // Verify user is not already an accepted member of another household
        $alreadyMember = HouseholdMember::where('user_id', $user->id)
            ->where('id', '!=', $member->id)
            ->where('invitation_status', 'accepted')
            ->exists();

        if ($alreadyMember) {
            return back()->with('error', 'You are already an active member of another household.');
        }

        DB::transaction(function () use ($member, $user) {
            $member->update([
                'user_id' => $user->id,
                'invitation_status' => 'accepted',
            ]);

            if ($member->household?->familyHead) {
                app(NotificationService::class)->send(
                    $member->household->familyHead,
                    'household_invitation_accepted',
                    'Invitation Accepted',
                    "{$user->name} has accepted your invitation to join Household {$member->household->household_code}.",
                    '/household',
                    $member->household
                );
            }
        });

        return redirect()->route('household.index')
            ->with('success', "You have successfully joined Household {$member->household?->household_code} as ".ucfirst((string) $member->relationship_to_head).'.');
    }

    public function reject(Request $request, HouseholdMember $member): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        // Check if the member invitation belongs to this user
        $isRecipient = ($member->user_id === $user->id) ||
            (! empty($member->email) && strtolower($member->email) === strtolower($user->email));

        if (! $isRecipient) {
            abort(403, 'Unauthorized to respond to this invitation.');
        }

        if ($member->invitation_status !== 'pending') {
            return back()->with('error', 'This invitation is no longer pending.');
        }

        DB::transaction(function () use ($member, $user) {
            $member->update([
                'invitation_status' => 'rejected',
            ]);

            if ($member->household?->familyHead) {
                app(NotificationService::class)->send(
                    $member->household->familyHead,
                    'household_invitation_declined',
                    'Invitation Declined',
                    "{$user->name} has declined your invitation to join Household {$member->household->household_code}.",
                    '/household',
                    $member->household
                );
            }
        });

        return redirect()->route('household.index')
            ->with('info', "You have declined the invitation to join Household {$member->household?->household_code}.");
    }
}
