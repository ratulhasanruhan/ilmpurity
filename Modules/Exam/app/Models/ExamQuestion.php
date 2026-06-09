<?php

namespace Modules\Exam\Models;

use App\Models\BaseModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class ExamQuestion extends BaseModel implements HasMedia
{
   use HasFactory, InteractsWithMedia;

   protected $fillable = [
      'exam_id',
      'question_type',
      'title',
      'description',
      'marks',
      'sort',
      'options',
   ];

   protected $casts = [
      'marks' => 'decimal:2',
      'sort' => 'integer',
      'options' => 'array',
   ];

   /**
    * The "booted" method of the model.
    */
   protected static function booted(): void
   {
      static::creating(function (ExamQuestion $question) {
         // Handle sort
         if (is_null($question->sort)) {
            $question->sort = static::getNextSortValue();
         }
      });
   }

   public function exam(): BelongsTo
   {
      return $this->belongsTo(Exam::class);
   }

   public function question_options(): HasMany
   {
      return $this->hasMany(ExamQuestionOption::class)->orderBy('sort', 'asc');
   }

   public function attempt_answers(): HasMany
   {
      return $this->hasMany(ExamAttemptAnswer::class);
   }
}
