<?php

namespace Modules\Exam\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExamResourceRequest extends FormRequest
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
        $rules = [
            'title' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'resource' => 'nullable|string|max:255',
            'resource_url' => 'nullable|string|max:255',
        ];
        if ($this->isMethod('post')) {
            $rules['exam_id'] = 'required|exists:exams,id';
        }

        return $rules;
    }
}
