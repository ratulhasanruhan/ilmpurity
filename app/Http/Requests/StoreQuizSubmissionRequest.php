<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreQuizSubmissionRequest extends FormRequest
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
            'submission_id' => 'nullable|exists:quiz_submissions,id',
            'section_quiz_id' => 'required|exists:section_quizzes,id',
            'user_id' => 'required|exists:users,id',
            'answers' => 'required|array',
            'answers.*' => 'required|array',
            'answers.*.question_id' => 'required|exists:quiz_questions,id',
            'answers.*.answer' => 'required|array',
            'answers.*.answer.*' => 'required|string',
        ];
    }
}
