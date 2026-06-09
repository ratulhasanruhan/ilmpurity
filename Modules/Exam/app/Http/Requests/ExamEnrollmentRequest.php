<?php

namespace Modules\Exam\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Modules\Exam\Models\ExamEnrollment;

class ExamEnrollmentRequest extends FormRequest
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
            'user_id' => 'required|exists:users,id',
            'exam_id' => [
                'required',
                'exists:exams,id',
                function ($attribute, $value, $fail) {
                    if (ExamEnrollment::where('user_id', $this->user_id)
                        ->where('exam_id', $value)
                        ->exists()
                    ) {
                        $fail('This user is already enrolled in this exam.');
                    }
                },
            ],
            'enrollment_type' => 'required|string|in:free,paid',
        ];
    }
}
