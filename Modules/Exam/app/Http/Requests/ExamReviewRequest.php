<?php

namespace Modules\Exam\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExamReviewRequest extends FormRequest
{
   public function authorize(): bool
   {
      return true;
   }

   public function rules(): array
   {
      return [
         'exam_id' => 'required|exists:exams,id',
         'rating' => 'required|integer|min:1|max:5',
         'review' => 'nullable|string|max:1000',
      ];
   }

   public function messages(): array
   {
      return [
         'exam_id.required' => 'The exam ID is required.',
         'exam_id.exists' => 'The selected exam does not exist.',
         'rating.required' => 'Please provide a rating.',
         'rating.min' => 'Rating must be at least 1.',
         'rating.max' => 'Rating must not exceed 5.',
         'review.max' => 'Review must not exceed 1000 characters.',
      ];
   }
}
