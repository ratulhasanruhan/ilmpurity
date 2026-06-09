<?php

namespace Modules\Exam\Models;

use App\Models\BaseModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class ExamCategory extends BaseModel implements HasMedia
{
   use HasFactory, InteractsWithMedia;

   protected $fillable = [
      'title',
      'slug',
      'icon',
      'description',
      'sort',
      'status',
      'thumbnail',
   ];

   protected $casts = [
      'status' => 'boolean',
   ];

   /**
    * The "booted" method of the model.
    */
   protected static function booted(): void
   {
      static::creating(function (ExamCategory $category) {
         // Handle sort
         if (is_null($category->sort)) {
            $category->sort = static::getNextSortValue();
         }

         // Handle slug
         if (empty($category->slug)) {
            $category->slug = static::generateUniqueSlug($category->title);
         }
      });

      static::updating(function (ExamCategory $category) {
         // Handle slug
         if ($category->isDirty('title')) {
            $category->slug = static::generateUniqueSlug($category->title);
         }
      });
   }

   public function exams(): HasMany
   {
      return $this->hasMany(Exam::class)->orderBy('created_at', 'desc');
   }
}
