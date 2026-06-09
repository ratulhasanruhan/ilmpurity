<?php

namespace App\Models;

use App\Models\Course\Course;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Modules\Exam\Models\Exam;

class PaymentHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'payment_type',
        'tax',
        'coupon',
        'amount',
        'invoice',
        'admin_revenue',
        'instructor_revenue',
        'transaction_id',
        'session_id',
        'purchase_type',
        'purchase_id',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function purchasable(): MorphTo
    {
        return $this->morphTo(null, 'purchase_type', 'purchase_id');
    }

    public function course()
    {
        return $this->belongsTo(Course::class, 'purchase_id')
            ->where('purchase_type', Course::class);
    }

    public function exam()
    {
        return $this->belongsTo(Exam::class, 'purchase_id')
            ->where('purchase_type', Exam::class);
    }
}
