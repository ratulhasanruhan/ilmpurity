<?php

namespace App\Models;

use App\Models\Course\Course;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Modules\Exam\Models\Exam;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Instructor extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = [
        'skills',
        'biography',
        'resume',
        'status',
        'designation',
        'payout_methods',
        'user_id',
    ];

    protected $casts = [
        'skills' => 'array',
        'payout_methods' => 'array',
    ];

    protected $attributes = [
        'payout_methods' => '[
            {
                "type": "payout",
                "sub_type": "paypal",
                "title": "Paypal Settings",
                "fields": {
                    "active": true,
                    "test_mode": false,
                    "currency": "USD",
                    "sandbox_client_id": "",
                    "sandbox_secret_key": "",
                    "production_client_id": "",
                    "production_secret_key": ""
                }
            },
            {
                "type": "payout",
                "sub_type": "stripe",
                "title": "Stripe Settings",
                "fields": {
                    "active": true,
                    "test_mode": false,
                    "currency": "USD",
                    "test_public_key": "",
                    "test_secret_key": "",
                    "live_public_key": "",
                    "live_secret_key": "",
                    "webhook_secret": ""
                }
            },
            {
                "type": "payout",
                "sub_type": "mollie",
                "title": "Mollie Settings",
                "fields": {
                    "active": true,
                    "test_mode": false,
                    "currency": "USD",
                    "test_api_key": "",
                    "live_api_key": ""
                }
            },
            {
                "type": "payout",
                "sub_type": "paystack",
                "title": "Paystack Settings",
                "fields": {
                    "active": true,
                    "test_mode": false,
                    "currency": "USD",
                    "test_public_key": "",
                    "test_secret_key": "",
                    "live_public_key": "",
                    "live_secret_key": ""
                }
            }
        ]'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function courses(): HasMany
    {
        return $this->hasMany(Course::class)->orderBy('created_at', 'desc');
    }

    public function exams(): HasMany
    {
        return $this->hasMany(Exam::class)->orderBy('created_at', 'desc');
    }
}
