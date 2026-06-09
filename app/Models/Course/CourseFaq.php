<?php

namespace App\Models\Course;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseFaq extends Model
{
    protected $fillable = [
        'course_id',
        'question',
        'answer',
        'sort'
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
