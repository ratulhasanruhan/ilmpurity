<?php

namespace Modules\Blog\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BlogLikeDislikeRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'blog_id' => ['required', 'integer', 'exists:blogs,id'],
            'type' => ['required', 'string', Rule::in(['like', 'dislike'])],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'blog_id.required' => 'Blog ID is required.',
            'blog_id.integer' => 'Blog ID must be a valid number.',
            'blog_id.exists' => 'The selected blog does not exist.',
            'type.required' => 'Reaction type is required.',
            'type.in' => 'Reaction type must be either like or dislike.',
        ];
    }
}
