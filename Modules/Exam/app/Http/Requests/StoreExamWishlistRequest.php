<?php

namespace Modules\Exam\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreExamWishlistRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'exam_id' => 'required|exists:exams,id',
        ];
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
}
