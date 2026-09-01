<?php

namespace App\Http\Requests\Document;

use App\Enums\CancellationReason;
use App\Models\DocumentRequest;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class CancelDocumentRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var DocumentRequest|null $documentRequest */
        $documentRequest = $this->route('documentRequest');

        return $documentRequest !== null
            && $documentRequest->user_id === $this->user()?->id
            && $documentRequest->canBeCancelled();
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'cancellation_reason' => ['required', new Enum(CancellationReason::class)],
            'cancellation_notes' => ['nullable', 'string', 'max:500', 'required_if:cancellation_reason,other'],
        ];
    }
}
