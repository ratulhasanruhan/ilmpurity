<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateInstructorRequest extends FormRequest
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
            'skills' => 'required',
            'biography' => 'required|string|min:50|max:5000',
            'resume' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'skills.required' => 'Please specify your skills',
            'skills.json' => 'Skills must be in a valid format',
            'biography.required' => 'Biography is required',
            'biography.min' => 'Biography must be at least 50 characters',
            'biography.max' => 'Biography cannot exceed 5000 characters',
            'resume.file' => 'The resume must be a file',
            'resume.mimes' => 'Resume must be a PDF, DOC, or DOCX file',
            'resume.max' => 'Resume size cannot exceed 2MB',
        ];
    }
}
