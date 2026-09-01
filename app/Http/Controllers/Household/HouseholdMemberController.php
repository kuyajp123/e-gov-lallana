<?php

namespace App\Http\Controllers\Household;

use App\Http\Controllers\Controller;
use App\Http\Requests\Household\StoreHouseholdMemberRequest;
use App\Http\Requests\Household\UpdateHouseholdMemberRequest;
use App\Models\Household;
use App\Models\HouseholdMember;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HouseholdMemberController extends Controller
{
    public function store(StoreHouseholdMemberRequest $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();
        /** @var Household|null $household */
        $household = Household::where('family_head_id', $user->id)->first();

        if (! $household) {
            return back()->with('error', 'Only the designated Family Head can register new household members.');
        }

        $validated = $request->validated();

        DB::transaction(function () use ($household, $validated) {
            /** @var HouseholdMember $member */
            $member = $household->members()->create([
                ...$validated,
                'is_family_head' => false,
            ]);

            $member->verification()->create([
                'status' => 'pending',
            ]);
        });

        return back()->with('success', "Household member {$validated['first_name']} {$validated['last_name']} added successfully and submitted for barangay verification.");
    }

    public function update(UpdateHouseholdMemberRequest $request, HouseholdMember $member): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();
        /** @var Household|null $household */
        $household = Household::where('family_head_id', $user->id)->first();

        if (! $household || $member->household_id !== $household->id) {
            return back()->with('error', 'Unauthorized action.');
        }

        $validated = $request->validated();
        $member->update($validated);

        return back()->with('success', 'Household member details updated successfully.');
    }

    public function destroy(Request $request, HouseholdMember $member): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();
        /** @var Household|null $household */
        $household = Household::where('family_head_id', $user->id)->first();

        if (! $household || $member->household_id !== $household->id) {
            return back()->with('error', 'Unauthorized action.');
        }

        if ($member->is_family_head) {
            return back()->with('error', 'Cannot remove the active Family Head. Please transfer head authority first.');
        }

        $memberName = $member->full_name;
        $member->delete();

        return back()->with('success', "Member {$memberName} removed from household.");
    }
}
