<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAssignmentRequest extends FormRequest
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
            'title' => 'required|string|max:255',
            'total_mark' => 'required|numeric|min:1',
            'pass_mark' => [
                'required',
                'numeric',
                'min:0',
                function ($attribute, $value, $fail) {
                    if ($value > $this->total_mark) {
                        $fail('The pass mark must be less than or equal to the total mark.');
                    }
                }
            ],
            'retake' => 'required|integer|min:1',
            'summary' => 'nullable|string',
            'deadline' => 'nullable|date',
            'late_submission' => 'nullable|boolean',
            'late_total_mark' => 'nullable|numeric|min:0',
            'late_deadline' => [
                'required_if:late_submission,true',
                function ($attribute, $value, $fail) {
                    if ($this->late_submission) {
                        // Only validate date if late_submission is true
                        if (!strtotime($value)) {
                            $fail('The late deadline must be a valid date.');
                            return;
                        }

                        // Then check if it's after the main deadline
                        if ($this->deadline && strtotime($value) <= strtotime($this->deadline)) {
                            $fail('The late deadline must be after the main deadline.');
                        }
                    }
                }
            ],
        ];
    }
}
