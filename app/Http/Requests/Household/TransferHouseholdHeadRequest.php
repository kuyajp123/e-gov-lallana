<?php

namespace App\Http\Requests\Household;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class TransferHouseholdHeadRequest extends FormRequest
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
            'new_family_head_member_id' => ['required', 'integer', 'exists:household_members,id'],
        ];
    }
}
