<?php

namespace App\Http\Requests\Document;

use App\Models\DocumentType;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreDocumentRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->belongsToVerifiedHousehold() ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'document_type_id' => ['required', 'integer', 'exists:document_types,id'],
            'purpose' => ['required', 'string', 'max:1000'],
            'submitted_data' => ['nullable', 'array'],
            'use_existing_id' => ['nullable', 'boolean'],
            'government_id_file' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
            'supporting_files' => ['nullable', 'array'],
            'supporting_files.*' => ['file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {
            $user = $this->user();
            $useExistingId = $this->boolean('use_existing_id');
            $hasExistingId = $user?->residentProfile?->government_id_file_id !== null;

            // If not using existing ID and no file uploaded, require upload
            if (! $useExistingId || ! $hasExistingId) {
                if (! $this->hasFile('government_id_file')) {
                    $validator->errors()->add('government_id_file', 'Please upload a valid Government ID.');
                }
            }

            // Dynamic schema validation if document_type_id is provided
            $docType = DocumentType::find($this->input('document_type_id'));
            if ($docType && ! empty($docType->form_schema)) {
                $submitted = $this->input('submitted_data', []);
                foreach ($docType->form_schema as $field) {
                    $fieldName = $field['name'] ?? '';
                    $isRequired = $field['required'] ?? false;
                    $fieldLabel = $field['label'] ?? $fieldName;

                    if ($isRequired && (empty($submitted[$fieldName]) && $submitted[$fieldName] !== 0 && $submitted[$fieldName] !== '0')) {
                        $validator->errors()->add("submitted_data.{$fieldName}", "The {$fieldLabel} field is required.");
                    }
                }
            }
        });
    }
}
