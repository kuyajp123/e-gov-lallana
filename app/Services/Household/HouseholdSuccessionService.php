<?php

namespace App\Services\Household;

use App\Models\Household;
use App\Models\HouseholdMember;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class HouseholdSuccessionService
{
    /**
     * Find the best successor to become the new family head according to business rules:
     * 1. Spouse priority (relationship_to_head = 'spouse')
     * 2. Verified adult member (verification status = 'approved' and age >= 18)
     * 3. Any adult member (age >= 18)
     * 4. Any remaining member (fallback)
     */
    public function findSuccessor(Household $household, ?int $excludeMemberId = null): ?HouseholdMember
    {
        $members = $household->members()
            ->with('verification')
            ->when($excludeMemberId, fn ($q) => $q->where('id', '!=', $excludeMemberId))
            ->get();

        if ($members->isEmpty()) {
            return null;
        }

        // 1. Priority 1: Spouse
        $spouse = $members->first(fn (HouseholdMember $m) => $m->isSpouse());
        if ($spouse) {
            return $spouse;
        }

        // 2. Priority 2: Verified adult member (oldest first)
        $verifiedAdult = $members
            ->filter(fn (HouseholdMember $m) => $m->isAdult() && $m->isVerified())
            ->sortBy(fn (HouseholdMember $m) => $m->birthdate)
            ->first();
        if ($verifiedAdult) {
            return $verifiedAdult;
        }

        // 3. Priority 3: Any adult member (oldest first)
        $adult = $members
            ->filter(fn (HouseholdMember $m) => $m->isAdult())
            ->sortBy(fn (HouseholdMember $m) => $m->birthdate)
            ->first();
        if ($adult) {
            return $adult;
        }

        // 4. Priority 4: Fallback to first remaining member
        return $members->first();
    }

    /**
     * Transfer family head authority to the designated member.
     */
    public function transferHead(Household $household, HouseholdMember $newHead): void
    {
        DB::transaction(function () use ($household, $newHead) {
            // Demote previous head member
            $household->members()
                ->where('is_family_head', true)
                ->where('id', '!=', $newHead->id)
                ->update([
                    'is_family_head' => false,
                ]);

            // Promote new head
            $newHead->update([
                'is_family_head' => true,
                'relationship_to_head' => 'head',
            ]);

            // If new head has a linked user account, re-link family_head_id
            $updateData = [];
            if ($newHead->user_id) {
                $updateData['family_head_id'] = $newHead->user_id;
            } elseif ($household->family_head_id && ! User::where('id', $household->family_head_id)->exists()) {
                $updateData['family_head_id'] = null;
            }

            if (! empty($updateData)) {
                $household->update($updateData);
            }
        });
    }

    /**
     * Handle succession when a family head user or member is being deleted/removed.
     */
    public function handleHeadDeletion(Household $household, ?int $deletedHeadUserId = null, ?int $deletedHeadMemberId = null): ?HouseholdMember
    {
        // Identify head member to exclude if not explicitly provided
        if (! $deletedHeadMemberId && $deletedHeadUserId) {
            $headMember = $household->members()->where('user_id', $deletedHeadUserId)->first();
            $deletedHeadMemberId = $headMember?->id;
        }

        $successor = $this->findSuccessor($household, $deletedHeadMemberId);

        if ($successor) {
            $this->transferHead($household, $successor);

            // Delete the old head member record if specified
            if ($deletedHeadMemberId) {
                $household->members()->where('id', $deletedHeadMemberId)->delete();
            }

            return $successor;
        }

        // If no members remain, the household has no occupants
        if ($household->members()->where('id', '!=', $deletedHeadMemberId)->count() === 0) {
            if ($deletedHeadMemberId) {
                $household->members()->where('id', $deletedHeadMemberId)->delete();
            }
            $household->delete();
        }

        return null;
    }
}
