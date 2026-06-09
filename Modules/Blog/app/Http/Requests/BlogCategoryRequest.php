<?php

namespace Modules\Blog\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BlogCategoryRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'icon' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'status' => 'required|string|in:active,inactive',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The category name is required.',
            'name.max' => 'The category name cannot exceed 255 characters.',
            'description.max' => 'The description cannot exceed 1000 characters.',
            'status.required' => 'The category status is required.',
            'status.in' => 'The status must be either active or inactive.',
        ];
    }
}
