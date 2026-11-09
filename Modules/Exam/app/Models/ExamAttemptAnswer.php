<?php

namespace Modules\Exam\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExamAttemptAnswer extends Model
{
   use HasFactory;

   protected $fillable = [
      'exam_attempt_id',
      'exam_question_id',
      'answer_data',
      'is_correct',
      'marks_obtained',
   ];

   protected $casts = [
      'answer_data' => 'array',
      'marks_obtained' => 'decimal:2',
   ];

   protected function isCorrect(): Attribute
   {
      return Attribute::make(
         get: function ($value) {
            if ($value === null) {
               return null;
            }

            return (bool) $value;
         },
         set: function ($value) {
            if ($value === null) {
               return null;
            }

            return $value ? 1 : 0;
         },
      );
   }

   public function exam_attempt(): BelongsTo
   {
      return $this->belongsTo(ExamAttempt::class);
   }

   public function exam_question(): BelongsTo
   {
      return $this->belongsTo(ExamQuestion::class);
   }
}
