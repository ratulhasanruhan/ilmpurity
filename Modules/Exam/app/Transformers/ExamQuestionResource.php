<?php

namespace Modules\Exam\Transformers;

use Illuminate\Http\Resources\Json\JsonResource;

class ExamQuestionResource extends JsonResource
{
   /**
    * Transform the resource into an array.
    */
   public function toArray($request): array
   {
      return [
         'id' => $this->id,
         'exam_id' => $this->exam_id,
         'question_type' => $this->question_type,
         'title' => $this->title,
         'description' => $this->description,
         'marks' => (float) $this->marks,
         'sort' => $this->sort,
         'options' => $this->options,

         // Media (audio for listening questions)
         'media' => $this->when($this->hasMedia(), function () {
            return $this->getMedia()->map(function ($media) {
               return [
                  'id' => $media->id,
                  'name' => $media->name,
                  'file_name' => $media->file_name,
                  'mime_type' => $media->mime_type,
                  'size' => $media->size,
                  'url' => $media->getUrl(),
               ];
            });
         }),

         // Question options (for multiple choice/select)
         'question_options' => $this->when(
            $this->relationLoaded('question_options'),
            function () {
               return $this->question_options->map(function ($option) {
                  return [
                     'id' => $option->id,
                     'option_text' => $option->option_text,
                     'is_correct' => $this->when(
                        $request->user() && in_array($request->user()->user_type, ['admin', 'instructor']),
                        $option->is_correct
                     ),
                     'sort' => $option->sort,
                  ];
               });
            }
         ),

         // Timestamps
         'created_at' => $this->created_at?->toDateTimeString(),
         'updated_at' => $this->updated_at?->toDateTimeString(),
      ];
   }
}
