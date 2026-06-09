<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCourseReviewRequest extends FormRequest
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
            'rating' => 'required|numeric|min:1|max:5',
            'review' => 'required|string',
            'user_id' => 'required|exists:users,id|unique:course_reviews,user_id,NULL,id,course_id,' . request('course_id'),
            'course_id' => 'required|exists:courses,id',
        ];
    }

    public function messages()
    {
        return [
            'user_id.unique' => 'You have already submitted a review for this course.',
        ];
    }
}
