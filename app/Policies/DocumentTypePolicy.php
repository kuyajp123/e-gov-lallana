<?php

namespace App\Policies;

use App\Models\DocumentType;
use App\Models\User;

class DocumentTypePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isSubAdmin();
    }

    public function view(User $user, DocumentType $documentType): bool
    {
        return $user->isAdmin() || $user->isSubAdmin();
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, DocumentType $documentType): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, DocumentType $documentType): bool
    {
        return $user->isAdmin();
    }
}
