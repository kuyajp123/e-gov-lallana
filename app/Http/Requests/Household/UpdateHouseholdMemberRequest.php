<?php

namespace App\Http\Requests\Household;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateHouseholdMemberRequest extends FormRequest
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
            'relationship_to_head' => ['required', 'string', 'in:head,spouse,son,daughter,parent,relative,other'],
            'birthdate' => ['nullable', 'date', 'before:today'],
            'gender' => ['nullable', 'string', 'in:male,female,other'],
            'civil_status' => ['nullable', 'string', 'in:single,married,widowed,separated,divorced'],
            'occupation' => ['nullable', 'string', 'max:150'],
            'residency_status' => ['nullable', 'string', 'in:resident,non_resident,temporary'],
        ];
    }
}
