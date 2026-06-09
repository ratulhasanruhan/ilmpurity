<?php

namespace Modules\Exam\Models;

use App\Models\BaseModel;
use App\Models\Instructor;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Exam extends BaseModel implements HasMedia
{
   use HasFactory, InteractsWithMedia;

   protected $fillable = [
      'title',
      'slug',
      'short_description',
      'description',
      'instructor_id',
      'exam_category_id',
      'pricing_type',
      'price',
      'discount',
      'discount_price',
      'duration_hours',
      'duration_minutes',
      'pass_mark',
      'total_marks',
      'max_attempts',
      'total_questions',
      'status',
      'level',
      'thumbnail',
      'banner',
      'expiry_type',
      'expiry_duration',
      'meta_title',
      'meta_keywords',
      'meta_description',
      'og_title',
      'og_description',
   ];

   protected $casts = [
      'price' => 'decimal:2',
      'discount' => 'decimal:2',
      'discount_price' => 'decimal:2',
      'pass_mark' => 'decimal:2',
      'total_marks' => 'decimal:2',
      'duration_hours' => 'integer',
      'duration_minutes' => 'integer',
      'max_attempts' => 'integer',
      'total_questions' => 'integer',
      'expiry_duration' => 'integer',
   ];

   /**
    * The "booted" method of the model.
    */
   protected static function booted(): void
   {
      static::creating(function (Exam $exam) {
         // Handle slug
         if (empty($exam->slug)) {
            $exam->slug = static::generateUniqueSlug($exam->title);
         }
      });

      static::updating(function (Exam $exam) {
         // Handle slug
         if ($exam->isDirty('title')) {
            $exam->slug = static::generateUniqueSlug($exam->title);
         }
      });
   }

   public function instructor(): BelongsTo
   {
      return $this->belongsTo(Instructor::class);
   }

   public function exam_category(): BelongsTo
   {
      return $this->belongsTo(ExamCategory::class);
   }

   public function questions(): HasMany
   {
      return $this->hasMany(ExamQuestion::class)->orderBy('sort', 'asc');
   }

   public function enrollments(): HasMany
   {
      return $this->hasMany(ExamEnrollment::class)->orderBy('created_at', 'desc');
   }

   public function attempts(): HasMany
   {
      return $this->hasMany(ExamAttempt::class)->orderBy('created_at', 'desc');
   }

   public function reviews(): HasMany
   {
      return $this->hasMany(ExamReview::class)->orderBy('created_at', 'desc');
   }

   public function coupons(): HasMany
   {
      return $this->hasMany(ExamCoupon::class)->orderBy('created_at', 'desc');
   }

   public function resources(): HasMany
   {
      return $this->hasMany(ExamResource::class)->orderBy('created_at', 'desc');
   }

   public function wishlists(): HasMany
   {
      return $this->hasMany(ExamWishlist::class)->orderBy('created_at', 'desc');
   }

   public function faqs(): HasMany
   {
      return $this->hasMany(ExamFaq::class)->orderBy('sort', 'asc');
   }

   public function requirements(): HasMany
   {
      return $this->hasMany(ExamRequirement::class)->orderBy('sort', 'asc');
   }

   public function outcomes(): HasMany
   {
      return $this->hasMany(ExamOutcome::class)->orderBy('sort', 'asc');
   }
}
