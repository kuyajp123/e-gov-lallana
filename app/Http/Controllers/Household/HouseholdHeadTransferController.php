<?php

namespace App\Http\Controllers\Household;

use App\Http\Controllers\Controller;
use App\Http\Requests\Household\TransferHouseholdHeadRequest;
use App\Models\Household;
use App\Models\HouseholdMember;
use App\Services\Household\HouseholdSuccessionService;
use Illuminate\Http\RedirectResponse;

class HouseholdHeadTransferController extends Controller
{
    public function store(
        TransferHouseholdHeadRequest $request,
        HouseholdSuccessionService $successionService
    ): RedirectResponse {
        $user = $request->user();
        $household = Household::where('family_head_id', $user->id)->first();

        if (! $household) {
            return back()->with('error', 'Only the current Family Head can transfer authority.');
        }

        $validated = $request->validated();
        $targetMember = HouseholdMember::where('id', $validated['new_family_head_member_id'])
            ->where('household_id', $household->id)
            ->first();

        if (! $targetMember) {
            return back()->with('error', 'The selected member does not belong to this household.');
        }

        if ($targetMember->is_family_head) {
            return back()->with('error', 'The selected member is already the active Family Head.');
        }

        $successionService->transferHead($household, $targetMember);

        return redirect()->route('household.index')
            ->with('success', "Family Head authority successfully transferred to {$targetMember->full_name}.");
    }
}
