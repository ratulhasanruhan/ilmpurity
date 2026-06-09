<?php

namespace Modules\Exam\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExamWishlist extends Model
{
   use HasFactory;

   protected $fillable = [
      'user_id',
      'exam_id',
   ];

   public function user(): BelongsTo
   {
      return $this->belongsTo(User::class);
   }

   public function exam(): BelongsTo
   {
      return $this->belongsTo(Exam::class);
   }
}
