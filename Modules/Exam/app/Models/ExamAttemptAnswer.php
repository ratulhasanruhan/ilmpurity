<?php

namespace Modules\Exam\Models;

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
      'is_correct' => 'boolean',
      'marks_obtained' => 'decimal:2',
   ];

   public function exam_attempt(): BelongsTo
   {
      return $this->belongsTo(ExamAttempt::class);
   }

   public function exam_question(): BelongsTo
   {
      return $this->belongsTo(ExamQuestion::class);
   }
}
