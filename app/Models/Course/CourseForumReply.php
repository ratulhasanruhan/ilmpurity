<?php

namespace App\Models\Course;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseForumReply extends Model
{
    protected $fillable = [
        'description',
        'user_id',
        'course_forum_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function course_forum(): BelongsTo
    {
        return $this->belongsTo(CourseForum::class);
    }
}
