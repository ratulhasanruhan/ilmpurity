<?php

namespace Modules\Exam\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * @method mixed route(string|null $param = null, mixed $default = null)
 */
class ExamCategoryRequest extends FormRequest
{
   public function authorize(): bool
   {
      return true;
   }

   public function rules(): array
   {
      // Get category ID from route parameter if updating, null if creating
      $category = $this->route('category');
      $categoryId = $category?->id ?? null;

      return [
         'title' => [
            'required',
            'string',
            'max:255',
            Rule::unique('exam_categories', 'title')->ignore($categoryId),
         ],
         'icon' => 'required|string',
         'description' => 'nullable|string|max:500',
         'status' => 'required|boolean',
         'thumbnail' => 'nullable|image|mimes:jpg,png,jpeg,svg|max:1024',
      ];
   }

   public function messages(): array
   {
      return [
         'title.required' => 'The category title is required.',
         'title.unique' => 'This title is already taken.',
         'icon.required' => 'The category icon is required.',
         'slug.unique' => 'This slug is already taken.',
      ];
   }
}
