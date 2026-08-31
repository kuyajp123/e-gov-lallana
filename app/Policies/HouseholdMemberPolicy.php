<?php

namespace App\Policies;

use App\Models\HouseholdMember;
use App\Models\User;

class HouseholdMemberPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isSubAdmin();
    }

    public function view(User $user, HouseholdMember $member): bool
    {
        if ($user->isAdmin() || $user->isSubAdmin()) {
            return true;
        }

        return $member->household->family_head_id === $user->id
            || $member->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        // Family Head can create members
        return $user->households()->exists() || $user->isAdmin() || $user->isSubAdmin();
    }

    public function update(User $user, HouseholdMember $member): bool
    {
        if ($user->isAdmin() || $user->isSubAdmin()) {
            return true;
        }

        return $member->household->family_head_id === $user->id;
    }

    public function delete(User $user, HouseholdMember $member): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $member->household->family_head_id === $user->id && ! $member->is_family_head;
    }

    public function verify(User $user, HouseholdMember $member): bool
    {
        return $user->isAdmin() || $user->isSubAdmin();
    }
}
