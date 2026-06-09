<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomPageRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:pages,slug,' . request()->route('id'),
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'meta_description' => 'nullable|string|max:1000',
            'meta_keywords' => 'nullable|string|max:255',
            'active' => 'boolean',
        ];
    }
}
