<?php

namespace Modules\Exam\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExamAttemptRequest extends FormRequest
{
   public function authorize(): bool
   {
      return true;
   }

   public function rules(): array
   {
      if ($this->isMethod('post') && $this->routeIs('*.start')) {
         // Starting an exam attempt
         return [
            'exam_id' => 'required|exists:exams,id',
         ];
      }

      if ($this->isMethod('post') && $this->routeIs('*.submit')) {
         // Submitting exam answers
         return [
            'exam_attempt_id' => 'required|exists:exam_attempts,id',
            'answers' => 'required|array',
            'answers.*.exam_question_id' => 'required|exists:exam_questions,id',
            'answers.*.answer_data' => 'required',
         ];
      }

      return [];
   }

   public function messages(): array
   {
      return [
         'exam_id.required' => 'The exam ID is required.',
         'exam_id.exists' => 'The selected exam does not exist.',
         'exam_attempt_id.required' => 'The exam attempt ID is required.',
         'exam_attempt_id.exists' => 'The exam attempt does not exist.',
         'answers.required' => 'Please provide answers.',
         'answers.array' => 'Answers must be an array.',
         'answers.*.exam_question_id.required' => 'Question ID is required for each answer.',
         'answers.*.exam_question_id.exists' => 'Invalid question ID provided.',
         'answers.*.answer_data.required' => 'Answer data is required.',
      ];
   }
}
