<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WhatsappPreference extends Model
{
    protected $fillable = [
        'user_id',
        'phone',
        'preferred_time',
        'enabled',
        'last_sent_on',
    ];

    protected $casts = [
        'enabled' => 'boolean',
        'last_sent_on' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
