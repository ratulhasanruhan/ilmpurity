<?php

namespace Modules\Exam\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExamEnrollment extends Model
{
   use HasFactory;

   protected $fillable = [
      'user_id',
      'exam_id',
      'enrollment_type',
      'entry_date',
      'expiry_date',
   ];

   protected $casts = [
      'entry_date' => 'datetime',
      'expiry_date' => 'datetime',
   ];

   public function user(): BelongsTo
   {
      return $this->belongsTo(User::class);
   }

   public function exam(): BelongsTo
   {
      return $this->belongsTo(Exam::class);
   }

   public function isActive(): bool
   {
      return $this->enrollment_type === 'lifetime' ||
         ($this->expiry_date && now()->lt($this->expiry_date));
   }
}
