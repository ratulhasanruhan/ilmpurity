<?php

namespace App\Models\Course;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseForum extends Model
{
    protected $fillable = [
        'title',
        'description',
        'likes',
        'dislikes',
        'user_id',
        'course_id',
        'section_lesson_id',
    ];

    protected $casts = [
        'likes' => 'array',
        'dislikes' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function section_lesson(): BelongsTo
    {
        return $this->belongsTo(SectionLesson::class);
    }

    public function replies()
    {
        return $this->hasMany(CourseForumReply::class);
    }
}
