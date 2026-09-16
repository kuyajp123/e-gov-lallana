<?php

namespace App\Http\Requests\Household;

use App\Models\Household;
use App\Models\HouseholdMember;
use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreHouseholdMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:100'],
            'middle_name' => ['nullable', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'suffix' => ['nullable', 'string', 'max:20'],
            'relationship_to_head' => ['required', 'string', 'in:spouse,son,daughter,parent,relative,other'],
            'birthdate' => ['nullable', 'date', 'before:today'],
            'gender' => ['nullable', 'string', 'in:male,female,other'],
            'civil_status' => ['nullable', 'string', 'in:single,married,widowed,separated,divorced'],
            'occupation' => ['nullable', 'string', 'max:150'],
            'residency_status' => ['nullable', 'string', 'in:resident,non_resident,temporary'],
            'email' => [
                'nullable',
                'string',
                'email',
                'max:255',
                function (string $attribute, mixed $value, \Closure $fail) {
                    if (! $value) {
                        return;
                    }

                    $user = $this->user();
                    if ($user && strtolower((string) $value) === strtolower($user->email)) {
                        $fail('You cannot invite your own email address.');

                        return;
                    }

                    $existingUser = User::where('email', $value)->first();
                    if ($existingUser) {
                        if (Household::where('family_head_id', $existingUser->id)->exists()) {
                            $fail('The user with this email is already the Family Head of a household.');

                            return;
                        }

                        if (HouseholdMember::where('user_id', $existingUser->id)
                            ->where('invitation_status', 'accepted')
                            ->exists()) {
                            $fail('The user with this email is already an active member of a household.');

                            return;
                        }
                    }

                    $household = Household::where('family_head_id', $user?->id)->first();
                    if ($household) {
                        $alreadyInvited = HouseholdMember::where('household_id', $household->id)
                            ->where('email', $value)
                            ->where(function ($q) {
                                $q->whereNull('invitation_status')
                                    ->orWhereIn('invitation_status', ['pending', 'accepted']);
                            })
                            ->exists();

                        if ($alreadyInvited) {
                            $fail('A member with this email has already been invited or added to your household.');
                        }
                    }
                },
            ],
        ];
    }
}
