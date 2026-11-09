<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateWhatsappSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $active = $this->boolean('active');

        return [
            'active' => ['required', 'boolean'],
            'provider' => ['required', Rule::in(['meta', 'webhook'])],
            'send_mode' => ['required', Rule::in(['text', 'template'])],
            'phone_number_id' => [Rule::requiredIf($active && $this->input('provider') === 'meta'), 'nullable', 'string', 'max:100'],
            'access_token' => [Rule::requiredIf($active && $this->input('provider') === 'meta'), 'nullable', 'string', 'max:4000'],
            'api_url' => [Rule::requiredIf($active && $this->input('provider') === 'webhook'), 'nullable', 'url', 'max:500'],
            'template_name' => [Rule::requiredIf($active && $this->input('provider') === 'meta' && $this->input('send_mode') === 'template'), 'nullable', 'string', 'max:100'],
            'template_language' => ['nullable', 'string', 'max:10'],
            'message_template' => [Rule::requiredIf($active && $this->input('send_mode') === 'text'), 'nullable', 'string', 'max:1000'],
        ];
    }
}
