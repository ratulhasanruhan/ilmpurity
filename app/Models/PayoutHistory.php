<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PayoutHistory extends Model
{
    protected $fillable = [
        'amount',
        'status',
        'payout_method',
        'transaction_id',
        'session_id',
        'user_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
