<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateInstructorProfileRequest extends FormRequest
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
        // Base validation rules for all users
        $rules = [
            'name' => 'required|string|max:255',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:1024',
            'social_links' => 'nullable',
        ];

        // Determine if the user is an instructor
        $user = request()->user();
        $isInstructor = $user && $user->role === 'instructor';

        // Add instructor-specific validation rules conditionally
        $rules['skills'] = $isInstructor ? 'required' : 'nullable';
        $rules['designation'] = $isInstructor ? 'required|string|max:255' : 'nullable|string';
        $rules['biography'] = $isInstructor ? 'required|string|min:50|max:5000' : 'nullable|string';
        $rules['resume'] = 'nullable|file|mimes:pdf,doc,docx|max:2048';

        return $rules;
    }
}
