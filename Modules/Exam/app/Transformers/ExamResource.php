<?php

namespace Modules\Exam\Transformers;

use Illuminate\Http\Resources\Json\JsonResource;

class ExamResource extends JsonResource
{
   /**
    * Transform the resource into an array.
    */
   public function toArray($request): array
   {
      return [
         'id' => $this->id,
         'title' => $this->title,
         'slug' => $this->slug,
         'short_description' => $this->short_description,
         'description' => $this->description,

         // Instructor & Category
         'instructor' => [
            'id' => $this->instructor->id,
            'name' => $this->instructor->user->name ?? 'Unknown',
         ],
         'category' => [
            'id' => $this->exam_category->id,
            'name' => $this->exam_category->name,
            'slug' => $this->exam_category->slug,
         ],

         // Pricing
         'pricing_type' => $this->pricing_type,
         'price' => (float) $this->price,
         'discount' => (float) $this->discount,
         'discount_price' => (float) $this->discount_price,

         // Exam Details
         'duration_hours' => $this->duration_hours,
         'duration_minutes' => $this->duration_minutes,
         'total_duration_minutes' => ($this->duration_hours * 60) + $this->duration_minutes,
         'pass_mark' => (float) $this->pass_mark,
         'total_marks' => (float) $this->total_marks,
         'max_attempts' => $this->max_attempts,
         'total_questions' => $this->total_questions,

         // Status & Level
         'status' => $this->status,
         'level' => $this->level,

         // Media
         'thumbnail' => $this->thumbnail,
         'banner' => $this->banner,

         // Expiry
         'expiry_type' => $this->expiry_type,
         'expiry_duration' => $this->expiry_duration,

         // SEO
         'meta_title' => $this->meta_title,
         'meta_keywords' => $this->meta_keywords,
         'meta_description' => $this->meta_description,
         'og_title' => $this->og_title,
         'og_description' => $this->og_description,

         // Relationships (when loaded)
         'questions' => ExamQuestionResource::collection($this->whenLoaded('questions')),
         'enrollments_count' => $this->when(isset($this->enrollments_count), $this->enrollments_count),
         'reviews_count' => $this->when(isset($this->reviews_count), $this->reviews_count),
         'average_rating' => $this->when(isset($this->average_rating), $this->average_rating),

         // Timestamps
         'created_at' => $this->created_at?->toDateTimeString(),
         'updated_at' => $this->updated_at?->toDateTimeString(),
      ];
   }
}
