<?php

namespace Modules\Exam\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExamCoupon extends Model
{
   use HasFactory;

   protected $fillable = [
      'exam_id',
      'code',
      'discount_type',
      'discount',
      'valid_from',
      'valid_to',
      'usage_type',
      'usage_limit',
      'used_count',
      'is_active',
   ];

   protected $casts = [
      'discount' => 'decimal:2',
      'valid_from' => 'datetime',
      'valid_to' => 'datetime',
      'usage_limit' => 'integer',
      'used_count' => 'integer',
      'is_active' => 'boolean',
   ];

   public function exam(): BelongsTo
   {
      return $this->belongsTo(Exam::class);
   }

   /**
    * Query scope to filter only valid coupons
    * This is used in queries: ExamCoupon::isValid()->get()
    */
   public function scopeIsValid($query)
   {
      $now = now();

      return $query->where('is_active', true)
         ->where(function ($q) use ($now) {
            $q->whereNull('valid_from')
               ->orWhere('valid_from', '<=', $now);
         })
         ->where(function ($q) use ($now) {
            $q->whereNull('valid_to')
               ->orWhere('valid_to', '>=', $now);
         })
         ->where(function ($q) {
            $q->whereNull('usage_limit')
               ->orWhereRaw('used_count < usage_limit');
         });
   }

   /**
    * Check if this specific coupon instance is valid
    * This is used on model instances: $coupon->isValid()
    */
   public function isValid(): bool
   {
      if (!$this->is_active) {
         return false;
      }

      $now = now();

      if ($this->valid_from && $now->lt($this->valid_from)) {
         return false;
      }

      if ($this->valid_to && $now->gt($this->valid_to)) {
         return false;
      }

      if ($this->usage_limit && $this->used_count >= $this->usage_limit) {
         return false;
      }

      return true;
   }
}
