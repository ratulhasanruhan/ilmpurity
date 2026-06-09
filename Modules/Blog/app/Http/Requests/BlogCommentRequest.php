<?php

namespace Modules\Blog\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BlogCommentRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'blog_id' => 'required|integer|exists:blogs,id',
            'content' => 'required|string|min:3|max:1000',
            'parent_id' => 'nullable|integer|exists:blog_comments,id',
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
            'content.required' => 'Comment content is required.',
            'content.string' => 'Comment content must be text.',
            'content.min' => 'Comment must be at least 3 characters long.',
            'content.max' => 'Comment cannot exceed 1000 characters.',
            'parent_id.integer' => 'Parent comment ID must be a valid number.',
            'parent_id.exists' => 'The parent comment does not exist.',
            'status.in' => 'Status must be approved, pending, or rejected.',
        ];
    }
}
