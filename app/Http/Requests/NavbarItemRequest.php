<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class NavbarItemRequest extends FormRequest
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
         'type' => 'required|string|in:url,dropdown,action',
         'slug' => 'required|string|max:255',
         'title' => 'required|string|max:255',
         'value' => 'nullable|string|max:500',
         'active' => 'required|boolean',
         'items' => 'nullable|array',
         'items.*.title' => 'required_with:items|string|max:255',
         'items.*.url' => 'required_with:items|string|max:500',
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
         'type.required' => 'The navbar item type is required.',
         'type.in' => 'The navbar item type must be one of: url, dropdown, or action.',
         'slug.required' => 'The slug is required.',
         'slug.max' => 'The slug may not be greater than 255 characters.',
         'title.required' => 'The title is required.',
         'title.max' => 'The title may not be greater than 255 characters.',
         'value.max' => 'The value may not be greater than 500 characters.',
         'items.array' => 'The dropdown items must be an array.',
         'items.*.title.required_with' => 'Each dropdown item must have a title.',
         'items.*.title.max' => 'Each dropdown item title may not be greater than 255 characters.',
         'items.*.url.required_with' => 'Each dropdown item must have a URL.',
         'items.*.url.max' => 'Each dropdown item URL may not be greater than 500 characters.',
         'sort.required' => 'The sort order is required.',
         'sort.integer' => 'The sort order must be a number.',
         'sort.min' => 'The sort order must be at least 0.',
      ];
   }
}
