<?php

namespace App\Models\Course;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseAssignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'total_mark',
        'pass_mark',
        'retake',
        'summary',
        'deadline',
        'late_submission',
        'late_total_mark',
        'late_deadline',
        'course_id',
    ];

    protected $casts = [
        'deadline' => 'datetime',
        'late_submission' => 'boolean',
        'late_deadline' => 'datetime',
    ];

    // Relationships
    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function submissions()
    {
        return $this->hasMany(AssignmentSubmission::class);
    }
}
