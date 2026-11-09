<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWhatsappPreferenceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'phone' => ['required', 'regex:/^\+?[0-9]{10,15}$/'],
            'preferred_time' => ['required', 'regex:/^\d{2}:\d{2}(:\d{2})?$/'],
            'enabled' => ['required', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'phone.regex' => 'Enter the WhatsApp number with country code, using digits only.',
            'preferred_time.regex' => 'Choose a valid time.',
        ];
    }
}
