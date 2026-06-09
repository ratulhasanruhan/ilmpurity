<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCourseForumReplyRequest extends FormRequest
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
            'url' => 'required|string',
            'description' => 'required|string',
            'user_id' => 'required|exists:users,id',
            'course_id' => 'required|exists:courses,id',
            'course_forum_id' => 'required|exists:course_forums,id',
            'course_forum_user_id' => 'required|exists:users,id',
        ];
    }
}
