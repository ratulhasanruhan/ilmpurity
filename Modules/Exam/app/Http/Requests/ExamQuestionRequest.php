<?php

namespace Modules\Exam\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExamQuestionRequest extends FormRequest
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
     */
    public function rules(): array
    {
        $rules = [
            'exam_id' => 'required|exists:exams,id',
            'question_type' => 'required|string|in:multiple_choice,multiple_select,matching,fill_blank,ordering,short_answer,listening',
            'title' => 'required|string',
            'description' => 'nullable|string',
            'marks' => 'required|numeric|min:0.5',
            'options' => 'nullable|array',
        ];

        // Only validate question_options for multiple choice and multiple select
        $questionType = request('question_type');
        if (in_array($questionType, ['multiple_choice', 'multiple_select'])) {
            $rules['question_options'] = 'required|array|min:2';
            $rules['question_options.*.option_text'] = 'required|string';
            $rules['question_options.*.is_correct'] = 'required|boolean';
        }

        return $rules;
    }

    /**
     * Custom error messages
     */
    public function messages(): array
    {
        return [
            'exam_id.required' => 'Exam ID is required.',
            'exam_id.exists' => 'The selected exam does not exist.',
            'question_type.required' => 'Question type is required.',
            'question_type.in' => 'Invalid question type selected.',
            'title.required' => 'Question title is required.',
            'marks.required' => 'Marks is required.',
            'marks.numeric' => 'Marks must be a number.',
            'marks.min' => 'Marks must be at least 0.5.',
            'question_options.*.option_text.required' => 'Option text is required.',
            'question_options.*.is_correct.required' => 'Correct answer selection is required.',
        ];
    }
}
