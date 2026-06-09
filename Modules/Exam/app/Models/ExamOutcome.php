<?php

namespace Modules\Exam\Models;

use App\Models\BaseModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExamOutcome extends BaseModel
{
   use HasFactory;

   protected $fillable = [
      'exam_id',
      'outcome',
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
      static::creating(function (ExamOutcome $outcome) {
         // Handle sort
         if (is_null($outcome->sort)) {
            $outcome->sort = static::getNextSortValue();
         }
      });
   }

   public function exam(): BelongsTo
   {
      return $this->belongsTo(Exam::class);
   }
}
