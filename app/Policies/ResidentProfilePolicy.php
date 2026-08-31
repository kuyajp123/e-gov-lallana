<?php

namespace App\Policies;

use App\Models\ResidentProfile;
use App\Models\User;

class ResidentProfilePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isSubAdmin();
    }

    public function view(User $user, ResidentProfile $profile): bool
    {
        if ($user->isAdmin() || $user->isSubAdmin()) {
            return true;
        }

        return $profile->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return ! ResidentProfile::where('user_id', $user->id)->exists();
    }

    public function update(User $user, ResidentProfile $profile): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $profile->user_id === $user->id;
    }

    public function delete(User $user, ResidentProfile $profile): bool
    {
        return $user->isAdmin();
    }
}
