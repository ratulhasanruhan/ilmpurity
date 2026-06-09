<?php

namespace Modules\Exam\Transformers;

use Illuminate\Http\Resources\Json\JsonResource;

class ExamCategoryResource extends JsonResource
{
   /**
    * Transform the resource into an array.
    */
   public function toArray($request): array
   {
      return [
         'id' => $this->id,
         'name' => $this->name,
         'slug' => $this->slug,
         'description' => $this->description,
         'sort' => $this->sort,
         'is_active' => $this->is_active,

         // Relationships
         'exams_count' => $this->when(isset($this->exams_count), $this->exams_count),
         'exams' => ExamResource::collection($this->whenLoaded('exams')),

         // Timestamps
         'created_at' => $this->created_at?->toDateTimeString(),
         'updated_at' => $this->updated_at?->toDateTimeString(),
      ];
   }
}
