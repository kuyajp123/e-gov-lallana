<?php

namespace App\Http\Requests\Admin;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStaffRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        /** @var User|null $currentUser */
        $currentUser = $this->user();

        if (! $currentUser instanceof User || ! $currentUser->isAdmin()) {
            return false;
        }

        /** @var User|null $targetUser */
        $targetUser = $this->route('user');

        if (! $targetUser instanceof User) {
            return false;
        }

        // Target cannot be super admin unless currentUser is super admin
        if ($targetUser->isSuperAdmin() && ! $currentUser->isSuperAdmin()) {
            return false;
        }

        // Regular admin cannot modify another admin
        if ($targetUser->isAdmin() && $targetUser->id !== $currentUser->id && ! $currentUser->isSuperAdmin()) {
            return false;
        }

        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $targetUser = $this->route('user');
        $targetUserId = $targetUser instanceof User
            ? $targetUser->getKey()
            : $targetUser;

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($targetUserId)],
            'phone_number' => ['nullable', 'string', 'max:30'],
            'role_slug' => ['nullable', 'string', Rule::in(['admin', 'sub_admin'])],
            'password' => ['nullable', 'string', 'min:8'],
            'status' => ['nullable', 'string', Rule::in(['active', 'inactive'])],
        ];
    }
}
