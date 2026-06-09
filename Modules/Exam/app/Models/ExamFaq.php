<?php

namespace Modules\Exam\Models;

use App\Models\BaseModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExamFaq extends BaseModel
{
   use HasFactory;

   protected $fillable = [
      'exam_id',
      'question',
      'answer',
      'sort'
   ];

   protected $casts = [
      'sort' => 'integer',
   ];

   /**
    * The "booted" method of the model.
    */
   protected static function booted(): void
   {
      static::creating(function (ExamFaq $faq) {
         // Handle sort
         if (is_null($faq->sort)) {
            $faq->sort = static::getNextSortValue();
         }
      });
   }

   public function exam(): BelongsTo
   {
      return $this->belongsTo(Exam::class);
   }
}
