<?php

namespace App\Http\Requests\Admin;

use App\Models\Announcement;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAnnouncementRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return (bool) $this->user()?->can_access_admin;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('category') && is_string($this->category)) {
            $this->merge([
                'category' => ucfirst(strtolower($this->category)),
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Announcement|null $announcement */
        $announcement = $this->route('announcement');
        $announcementId = $announcement instanceof Announcement ? $announcement->id : $announcement;

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                'alpha_dash',
                Rule::unique('announcements', 'slug')->ignore($announcementId),
            ],
            'category' => ['required', 'string', Rule::in(['Advisory', 'Event', 'Meeting', 'Emergency'])],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['required', 'string'],
            'is_published' => ['boolean'],
            'published_at' => ['nullable', 'date'],
            'banner' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
            'remove_banner' => ['nullable', 'boolean'],
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
            'title.required' => 'Announcement title is required.',
            'category.required' => 'Please select a valid category (Advisory, Event, Meeting, Emergency).',
            'content.required' => 'Announcement content is required.',
            'banner.max' => 'Banner image may not be greater than 5MB.',
            'banner.image' => 'The uploaded file must be an image (JPEG, PNG, WebP).',
        ];
    }
}
