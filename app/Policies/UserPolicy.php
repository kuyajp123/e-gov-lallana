<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, User $model): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, User $model): bool
    {
        if (! $user->isAdmin()) {
            return false;
        }

        // Users can always update their own account
        if ($model->id === $user->id) {
            return true;
        }

        // Cannot update a super admin unless the user is a super admin
        if ($model->isSuperAdmin() && ! $user->isSuperAdmin()) {
            return false;
        }

        // Co-super-admin protection: If both are super admins, neither can edit the other
        if ($model->isSuperAdmin() && $user->isSuperAdmin()) {
            return false;
        }

        // Co-admin protection: A regular admin cannot edit another admin
        if ($model->isAdmin() && ! $user->isSuperAdmin()) {
            return false;
        }

        return true;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, User $model): bool
    {
        if (! $user->isAdmin()) {
            return false;
        }

        if ($model->id === $user->id) {
            return false;
        }

        if ($model->isSuperAdmin()) {
            return false;
        }

        if ($model->isAdmin() && ! $user->isSuperAdmin()) {
            return false;
        }

        return true;
    }
}
