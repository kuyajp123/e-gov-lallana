<?php

namespace App\Http\Requests\Admin;

use App\Models\DocumentType;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDocumentTypeRequest extends FormRequest
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
        $documentType = $this->route('documentType');
        $documentTypeId = $documentType instanceof DocumentType
            ? $documentType->getKey()
            : $this->route('document_type');

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                'alpha_dash',
                Rule::unique('document_types', 'slug')->ignore($documentTypeId),
            ],
            'fee_cents' => ['required', 'integer', 'min:0'],
            'is_active' => ['boolean'],
            'description' => ['nullable', 'string', 'max:1000'],
            'requirements' => ['nullable', 'array'],
            'requirements.*' => ['string', 'max:255'],
            'form_schema' => ['nullable', 'array'],
            'form_schema.*.name' => ['required_with:form_schema', 'string', 'regex:/^[a-z0-9_]+$/', 'max:100'],
            'form_schema.*.label' => ['required_with:form_schema', 'string', 'max:255'],
            'form_schema.*.type' => ['required_with:form_schema', 'string', Rule::in(['text', 'number', 'textarea'])],
            'form_schema.*.placeholder' => ['nullable', 'string', 'max:255'],
            'form_schema.*.required' => ['boolean'],
        ];
    }

    /**
     * Custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'form_schema.*.name.regex' => 'Field key must use lowercase letters, numbers, and underscores (snake_case).',
            'slug.alpha_dash' => 'URL slug may only contain letters, numbers, dashes, and underscores.',
        ];
    }
}
