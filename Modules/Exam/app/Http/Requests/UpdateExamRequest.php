<?php

namespace Modules\Exam\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateExamRequest extends FormRequest
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
      // Common rules for all tabs
      $rules = ['tab' => 'required|string'];

      // Merge with tab-specific rules
      return array_merge($rules, $this->getTabSpecificRules());
   }

   /**
    * Get validation rules specific to the current tab
    */
   private function getTabSpecificRules(): array
   {
      $tab = request('tab');
      return match ($tab) {
         'basic' => $this->basicTabRules(),
         'pricing' => $this->pricingTabRules(),
         'settings' => $this->settingsTabRules(),
         'media' => $this->mediaTabRules(),
         'seo' => $this->seoTabRules(),
         'status' => $this->statusTabRules(),
         default => [],
      };
   }

   /**
    * Validation rules for the basic tab
    */
   private function basicTabRules(): array
   {
      return [
         'title' => 'required|string|max:255',
         'short_description' => 'nullable|string|max:500',
         'description' => 'nullable|string',
         'status' => 'nullable|string|in:draft,published,archived',
         'level' => 'nullable|string|in:beginner,intermediate,advanced',
         'exam_category_id' => 'required|exists:exam_categories,id',
         'instructor_id' => 'required|exists:instructors,id',
      ];
   }

   /**
    * Validation rules for the pricing tab
    */
   private function pricingTabRules(): array
   {
      return [
         'pricing_type' => 'required|string|in:free,paid',
         'price' => 'nullable|numeric|min:0|required_if:pricing_type,paid',
         'discount' => 'boolean',
         'discount_price' => 'nullable|numeric|min:0|lt:price|required_if:discount,true',
         'expiry_type' => 'required|string|in:lifetime,limited_time',
         'expiry_duration' => 'nullable|string|required_if:expiry_type,limited_time',
      ];
   }

   /**
    * Validation rules for the settings tab
    */
   private function settingsTabRules(): array
   {
      return [
         'duration_hours' => 'required|integer|min:0',
         'duration_minutes' => 'required|integer|min:0|max:59',
         'pass_mark' => 'required|numeric|min:0|max:100',
         'total_marks' => 'required|numeric|min:1',
         'max_attempts' => 'required|integer|min:1',
      ];
   }

   /**
    * Validation rules for the media tab
    */
   private function mediaTabRules(): array
   {
      return [
         'thumbnail' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
      ];
   }

   /**
    * Validation rules for the SEO tab
    */
   private function seoTabRules(): array
   {
      return [
         'meta_title' => 'nullable|string|max:255',
         'meta_keywords' => 'nullable|string|max:500',
         'meta_description' => 'nullable|string|max:500',
         'og_title' => 'nullable|string|max:255',
         'og_description' => 'nullable|string|max:500',
      ];
   }

   private function statusTabRules(): array
   {
      return [
         'status' => 'required|string|in:draft,published,archived',
         'feedback' => 'nullable|string',
      ];
   }
}
