<?php

namespace App\Models\Course;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseReview extends Model
{
    use HasFactory;

    protected $fillable = [
        'review',
        'rating',
        'likes',
        'dislikes',
        'user_id',
        'course_id',
    ];

    protected $casts = [
        'likes' => 'array',
        'dislikes' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
