<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInstructorRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Allow authenticated users to create instructor profiles
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => 'required|exists:users,id',
            'skills' => 'required',
            'designation' => 'required|string|max:255',
            'biography' => 'required|string|min:50|max:5000',
            'resume' => 'required|file|mimes:pdf,doc,docx|max:2048',
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
            'resume.required' => 'Please upload your resume',
            'resume.file' => 'The resume must be a file',
            'resume.mimes' => 'Resume must be a PDF, DOC, or DOCX file',
            'resume.max' => 'Resume size cannot exceed 10MB',
        ];
    }
}
