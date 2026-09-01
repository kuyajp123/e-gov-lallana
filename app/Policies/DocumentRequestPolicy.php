<?php

namespace App\Policies;

use App\Models\DocumentRequest;
use App\Models\User;

class DocumentRequestPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isSubAdmin();
    }

    public function view(User $user, DocumentRequest $documentRequest): bool
    {
        if ($user->isAdmin() || $user->isSubAdmin()) {
            return true;
        }

        return $documentRequest->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->belongsToVerifiedHousehold();
    }

    public function update(User $user, DocumentRequest $documentRequest): bool
    {
        if ($user->isAdmin() || $user->isSubAdmin()) {
            return true;
        }

        return $documentRequest->user_id === $user->id && $documentRequest->canBeEdited();
    }

    public function cancel(User $user, DocumentRequest $documentRequest): bool
    {
        return $documentRequest->user_id === $user->id && $documentRequest->canBeCancelled();
    }

    public function process(User $user, DocumentRequest $documentRequest): bool
    {
        return $user->isAdmin() || $user->isSubAdmin();
    }

    public function delete(User $user, DocumentRequest $documentRequest): bool
    {
        return $user->isAdmin();
    }
}
