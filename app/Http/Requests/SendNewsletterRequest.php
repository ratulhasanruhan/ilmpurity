<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SendNewsletterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_type' => 'required|string|in:all,student,instructor',
            'newsletter_id' => 'required|exists:newsletters,id',
        ];
    }
}
