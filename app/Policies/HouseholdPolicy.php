<?php

namespace App\Policies;

use App\Models\Household;
use App\Models\User;

class HouseholdPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isSubAdmin();
    }

    public function view(User $user, Household $household): bool
    {
        if ($user->isAdmin() || $user->isSubAdmin()) {
            return true;
        }

        return $household->family_head_id === $user->id
            || $household->members()->where('user_id', $user->id)->exists();
    }

    public function create(User $user): bool
    {
        // Any resident who doesn't head a household can create one
        return ! Household::where('family_head_id', $user->id)->exists();
    }

    public function update(User $user, Household $household): bool
    {
        if ($user->isAdmin() || $user->isSubAdmin()) {
            return true;
        }

        return $household->family_head_id === $user->id && $household->status === 'returned';
    }

    public function delete(User $user, Household $household): bool
    {
        return $user->isAdmin();
    }

    public function verify(User $user, Household $household): bool
    {
        return $user->isAdmin() || $user->isSubAdmin();
    }

    public function restrict(User $user, Household $household): bool
    {
        return $user->isAdmin();
    }

    public function transferHead(User $user, Household $household): bool
    {
        return $household->family_head_id === $user->id;
    }
}
