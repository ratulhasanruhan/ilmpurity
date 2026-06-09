<?php

namespace Modules\Exam\Transformers;

use Illuminate\Http\Resources\Json\JsonResource;

class ExamEnrollmentResource extends JsonResource
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
         'enrollment_type' => $this->enrollment_type,
         'entry_date' => $this->entry_date?->toDateTimeString(),
         'expiry_date' => $this->expiry_date?->toDateTimeString(),
         'is_active' => $this->isActive(),

         // Relationships
         'user' => $this->when($this->relationLoaded('user'), function () {
            return [
               'id' => $this->user->id,
               'name' => $this->user->name,
               'email' => $this->user->email,
            ];
         }),

         'exam' => $this->when($this->relationLoaded('exam'), function () {
            return new ExamResource($this->exam);
         }),

         // Timestamps
         'created_at' => $this->created_at?->toDateTimeString(),
         'updated_at' => $this->updated_at?->toDateTimeString(),
      ];
   }
}
