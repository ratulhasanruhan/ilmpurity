<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FooterItemRequest extends FormRequest
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
         'type' => 'required|string|in:list,social_media,payment_methods,copyright',
         'slug' => 'required|string|max:255',
         'title' => 'required|string|max:255',
         'active' => 'required|boolean',
         'items' => 'nullable|array',
         'items.*.title' => $this->type === 'payment_methods'
            ? 'nullable|string|max:255'
            : 'required_with:items|string|max:255',
         'items.*.url' => 'nullable|string|max:500',
         'items.*.icon' => 'nullable|string|max:100',
         'items.*.image' => $this->type === 'payment_methods'
            ? 'required|string|max:500'
            : 'nullable|string|max:500',
         'sort' => 'required|integer|min:0',
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
         'type.required' => 'The item type is required.',
         'type.in' => 'The item type must be one of: list, social_media, payment_methods, copyright.',
         'slug.required' => 'The slug is required.',
         'title.required' => 'The title is required.',
         'items.array' => 'The items must be an array.',
         'items.*.title.required_with' => 'Each item must have a title.',
         'items.*.url.max' => 'URL cannot exceed 500 characters.',
         'items.*.icon.max' => 'Icon name cannot exceed 100 characters.',
         'items.*.image.max' => 'Image path cannot exceed 500 characters.',
         'sort.required' => 'The sort order is required.',
         'sort.integer' => 'The sort order must be a number.',
         'sort.min' => 'The sort order must be at least 0.',
      ];
   }
}
