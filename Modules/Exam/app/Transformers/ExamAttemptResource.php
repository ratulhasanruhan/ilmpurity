<?php

namespace Modules\Exam\Transformers;

use Illuminate\Http\Resources\Json\JsonResource;

class ExamAttemptResource extends JsonResource
{
   /**
    * Transform the resource into an array.
    */
   public function toArray($request): array
   {
      return [
         'id' => $this->id,
         'user_id' => $this->user_id,
         'exam_id' => $this->exam_id,
         'attempt_number' => $this->attempt_number,

         // Timing
         'start_time' => $this->start_time?->toDateTimeString(),
         'end_time' => $this->end_time?->toDateTimeString(),
         'duration_minutes' => $this->duration,

         // Scoring
         'total_marks' => (float) $this->total_marks,
         'obtained_marks' => (float) $this->obtained_marks,
         'percentage' => round($this->percentage, 2),
         'correct_answers' => $this->correct_answers,
         'incorrect_answers' => $this->incorrect_answers,
         'is_passed' => $this->is_passed,
         'status' => $this->status,

         // Relationships
         'user' => $this->when($this->relationLoaded('user'), function () {
            return [
               'id' => $this->user->id,
               'name' => $this->user->name,
               'email' => $this->user->email,
            ];
         }),

         'exam' => $this->when($this->relationLoaded('exam'), function () {
            return [
               'id' => $this->exam->id,
               'title' => $this->exam->title,
               'slug' => $this->exam->slug,
               'pass_mark' => $this->exam->pass_mark,
            ];
         }),

         'attempt_answers' => $this->when($this->relationLoaded('attempt_answers'), function () {
            return $this->attempt_answers->map(function ($answer) {
               return [
                  'id' => $answer->id,
                  'exam_question_id' => $answer->exam_question_id,
                  'answer_data' => $answer->answer_data,
                  'is_correct' => $answer->is_correct,
                  'marks_obtained' => (float) $answer->marks_obtained,
                  'question' => $this->when($answer->relationLoaded('exam_question'), [
                     'title' => $answer->exam_question->title,
                     'type' => $answer->exam_question->question_type,
                     'marks' => $answer->exam_question->marks,
                  ]),
               ];
            });
         }),

         // Timestamps
         'created_at' => $this->created_at?->toDateTimeString(),
         'updated_at' => $this->updated_at?->toDateTimeString(),
      ];
   }
}
