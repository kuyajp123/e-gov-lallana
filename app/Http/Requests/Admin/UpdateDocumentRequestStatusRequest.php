<?php

namespace App\Http\Requests\Admin;

use App\Enums\DocumentRequestStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class UpdateDocumentRequestStatusRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return (bool) $this->user()?->can_access_admin;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'status' => ['required', new Enum(DocumentRequestStatus::class)],
            'remarks' => [
                Rule::requiredIf(fn () => in_array($this->input('status'), [
                    DocumentRequestStatus::Returned->value,
                    DocumentRequestStatus::Rejected->value,
                    DocumentRequestStatus::OnHold->value,
                ], true)),
                'nullable',
                'string',
                'max:1000',
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'remarks.required' => 'Please provide remarks or an explanation for this status update.',
        ];
    }
}
