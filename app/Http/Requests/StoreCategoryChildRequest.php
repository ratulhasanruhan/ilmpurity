<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCategoryChildRequest extends FormRequest
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
            'title' => 'required|max:255|unique:course_category_children',
            'icon' => 'string|required',
            'sort' => 'required',
            'status' => 'required',
            'keywords' => 'nullable|string|max:50',
            'description' => 'nullable|string|max:500',
            'logo' => 'nullable|image|mimes:jpg,png,jpeg,svg|max:512',
            'course_category_id' => 'required',
        ];
    }
}
