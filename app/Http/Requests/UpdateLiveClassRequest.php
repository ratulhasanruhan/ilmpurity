<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLiveClassRequest extends FormRequest
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
            // 'provider' => 'required|string|in:google',
            'class_topic' => 'required|string|max:255',
            'class_date_and_time' => 'required|date',
            'class_note' => 'nullable|string|max:1000',
            'course_id' => 'required|exists:courses,id',
        ];
    }
}
