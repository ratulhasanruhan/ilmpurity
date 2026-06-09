<?php

namespace Modules\Exam\Models;

use App\Models\BaseModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExamQuestionOption extends BaseModel
{
   use HasFactory;

   protected $fillable = [
      'exam_question_id',
      'option_text',
      'is_correct',
      'sort',
   ];

   protected $casts = [
      'is_correct' => 'boolean',
      'sort' => 'integer',
   ];

   /**
    * The "booted" method of the model.
    */
   protected static function booted(): void
   {
      static::creating(function (ExamQuestionOption $option) {
         // Handle sort
         if (is_null($option->sort)) {
            $option->sort = static::getNextSortValue();
         }
      });
   }

   public function exam_question(): BelongsTo
   {
      return $this->belongsTo(ExamQuestion::class);
   }
}
