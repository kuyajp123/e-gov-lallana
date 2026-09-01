<?php

namespace App\Http\Requests\Document;

use App\Enums\DocumentRequestStatus;
use App\Models\DocumentRequest;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateDocumentRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var DocumentRequest|null $documentRequest */
        $documentRequest = $this->route('documentRequest');

        return $documentRequest !== null
            && $documentRequest->user_id === $this->user()?->id
            && $documentRequest->current_status === DocumentRequestStatus::Returned;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'purpose' => ['required', 'string', 'max:1000'],
            'submitted_data' => ['nullable', 'array'],
            'government_id_file' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
            'supporting_files' => ['nullable', 'array'],
            'supporting_files.*' => ['file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
        ];
    }
}
