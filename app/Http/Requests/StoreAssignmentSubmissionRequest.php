<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAssignmentSubmissionRequest extends FormRequest
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
            'course_assignment_id' => 'required|exists:course_assignments,id',
            'attachment_type' => 'required|in:url,file',
            'attachment_path' => 'required_if:attachment_type,url|nullable|string',
            'comment' => 'nullable|string',
        ];
    }
}
