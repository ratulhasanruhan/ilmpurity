<?php

namespace Modules\Exam\Http\Requests;

use App\Enums\ExpiryLimitType;
use App\Enums\CoursePricingType;
use Illuminate\Foundation\Http\FormRequest;

/**
 * @method mixed route(string|null $param = null, mixed $default = null)
 */
class ExamRequest extends FormRequest
{
   protected function prepareForValidation()
   {
      // Convert numeric fields
      $this->merge([
         'price' => request('price') ? (float) request('price') : null,
         'discount' => filter_var(request('discount'), FILTER_VALIDATE_BOOLEAN),
         'discount_price' => request('discount_price') ? (float) request('discount_price') : null,
         'exam_category_id' => request('exam_category_id') ? (int) request('exam_category_id') : null,
         'instructor_id' => request('instructor_id') ? (int) request('instructor_id') : null,
         'duration_hours' => request('duration_hours') ? (int) request('duration_hours') : 0,
         'duration_minutes' => request('duration_minutes') ? (int) request('duration_minutes') : 0,
         'pass_mark' => request('pass_mark') ? (float) request('pass_mark') : null,
         'total_marks' => request('total_marks') ? (float) request('total_marks') : null,
         'max_attempts' => request('max_attempts') ? (int) request('max_attempts') : null,
      ]);
   }

   public function authorize(): bool
   {
      return true;
   }

   public function rules(): array
   {
      $free = CoursePricingType::FREE->value;
      $paid = CoursePricingType::PAID->value;
      $lifetime = ExpiryLimitType::LIFETIME->value;
      $limited = ExpiryLimitType::LIMITED_TIME->value;

      return [
         // Basic Information
         'title' => 'required|string|max:255',
         'short_description' => 'nullable|string|max:500',
         'description' => 'nullable|string',

         // Pricing
         'pricing_type' => "required|string|in:$free,$paid",
         'price' => "nullable|numeric|min:0|required_if:pricing_type,$paid",
         'discount' => 'boolean',
         'discount_price' => 'nullable|numeric|min:0|lt:price|required_if:discount,true',
         'expiry_type' => "required|string|in:$lifetime,$limited",
         'expiry_duration' => "nullable|string|required_if:expiry_type,$limited",

         // Exam Settings
         'duration_hours' => 'required|integer|min:0',
         'duration_minutes' => 'required|integer|min:0|max:59',
         'pass_mark' => 'required|numeric|min:0|max:100',
         'total_marks' => 'required|numeric|min:1',
         'max_attempts' => 'required|integer|min:1',

         // Status & Level
         'status' => 'nullable|string|in:draft,published,archived',
         'level' => 'nullable|string|in:beginner,intermediate,advanced',

         // Media
         'thumbnail' => 'nullable|file|image|mimes:jpeg,jpg,png,webp|max:2048',

         // SEO
         'meta_title' => 'nullable|string|max:255',
         'meta_keywords' => 'nullable|string|max:500',
         'meta_description' => 'nullable|string|max:500',
         'og_title' => 'nullable|string|max:255',
         'og_description' => 'nullable|string|max:500',

         // Relationships
         'instructor_id' => 'required|exists:instructors,id',
         'exam_category_id' => 'required|exists:exam_categories,id',
      ];
   }
}
