<?php

namespace App\Http\Requests\Resident;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreResidentProfileRequest extends FormRequest
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
            'birthdate' => ['required', 'date', 'before:today'],
            'gender' => ['required', 'string', 'in:male,female,other'],
            'civil_status' => ['required', 'string', 'in:single,married,widowed,separated,divorced'],
            'citizenship' => ['required', 'string', 'max:100'],
            'religion' => ['nullable', 'string', 'max:100'],
            'residency_status' => ['nullable', 'string', 'in:official,resident,new_resident,tenant,boarder,student,temporary'],
            'date_of_residency' => ['nullable', 'date'],
            'occupation' => ['nullable', 'string', 'max:150'],
            'educational_attainment' => ['nullable', 'string', 'in:elementary,high_school,vocational,college,post_graduate,none'],
            'employment_status' => ['nullable', 'string', 'in:employed,unemployed,self_employed,student,retired'],
            'is_voter' => ['boolean'],
            'voter_id_number' => ['nullable', 'string', 'max:50'],
            'senior_citizen_status' => ['boolean'],
            'pwd_status' => ['boolean'],
            'pwd_id_number' => ['nullable', 'string', 'max:50'],
            'solo_parent_status' => ['boolean'],
            'solo_parent_id_number' => ['nullable', 'string', 'max:50'],
            'government_id' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,pdf', 'max:5120'],
        ];
    }
}
