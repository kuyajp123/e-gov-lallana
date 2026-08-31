<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Verification;

class VerificationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isSubAdmin();
    }

    public function view(User $user, Verification $verification): bool
    {
        return $user->isAdmin() || $user->isSubAdmin();
    }

    public function review(User $user, Verification $verification): bool
    {
        return $user->isAdmin() || $user->isSubAdmin();
    }
}
