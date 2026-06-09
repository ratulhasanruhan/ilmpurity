<?php

namespace Modules\Blog\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BlogRequest extends FormRequest
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
            'user_id' => 'required|exists:users,id',
            'blog_category_id' => 'required|exists:blog_categories,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'thumbnail' => 'nullable|image|mimes:jpg,png,webp|max:1024',
            'banner' => 'nullable|image|mimes:jpg,png,webp|max:1024',
            'keywords' => 'required|string|max:255',
            'status' => 'required|string|in:draft,published,archived',
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
            'blog_category_id.required' => 'Please select a blog category.',
            'blog_category_id.exists' => 'The selected category does not exist.',
            'title.required' => 'The blog title is required.',
            'title.max' => 'The blog title cannot exceed 255 characters.',
            'description.required' => 'The blog description is required.',
            'keywords.max' => 'The keywords cannot exceed 255 characters.',
            'status.required' => 'The blog status is required.',
            'status.in' => 'The status must be one of: draft, published, or archived.',
        ];
    }

    // /**
    //  * Get custom attributes for validator errors.
    //  *
    //  * @return array
    //  */
    // public function attributes(): array
    // {
    //     return [
    //         'category_id' => 'category',
    //         'title' => 'blog title',
    //         'slug' => 'blog slug',
    //         'description' => 'blog description',
    //         'thumbnail' => 'thumbnail image',
    //         'banner' => 'banner image',
    //         'keywords' => 'SEO keywords',
    //         'status' => 'blog status',
    //     ];
    // }

    // /**
    //  * Prepare the data for validation.
    //  */
    // protected function prepareForValidation(): void
    // {
    //     // Convert empty strings to null for nullable fields
    //     $this->merge([
    //         'thumbnail' => $this->input('thumbnail') ?: null,
    //         'banner' => $this->input('banner') ?: null,
    //         'keywords' => $this->input('keywords') ?: null,
    //     ]);

    //     // Convert checkboxes to booleans
    //     $this->merge([
    //         'is_popular' => (bool) $this->input('is_popular'),
    //     ]);

    //     // If slug is empty, it will be auto-generated in the model
    //     if (empty($this->input('slug')) && !empty($this->input('title'))) {
    //         $this->merge([
    //             'slug' => \Illuminate\Support\Str::slug($this->input('title')),
    //         ]);
    //     }

    //     // Clean up keywords - remove extra spaces and convert to lowercase
    //     if ($this->has('keywords') && !empty($this->input('keywords'))) {
    //         $keywords = $this->input('keywords');
    //         $keywords = preg_replace('/\s+/', ' ', trim($keywords)); // Remove extra spaces
    //         $this->merge([
    //             'keywords' => strtolower($keywords),
    //         ]);
    //     }
    // }
}
