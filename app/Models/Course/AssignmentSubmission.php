<?php

namespace App\Models\Course;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssignmentSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'attachment_type',
        'attachment_path',
        'comment',
        'submitted_at',
        'marks_obtained',
        'instructor_feedback',
        'status',
        'attempt_number',
        'is_late',
        'course_assignment_id',
        'user_id',
        'grader_id',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'is_late' => 'boolean',
        'marks_obtained' => 'decimal:2',
    ];

    // Relationships
    public function assignment()
    {
        return $this->belongsTo(CourseAssignment::class, 'course_assignment_id');
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function grader()
    {
        return $this->belongsTo(User::class, 'grader_id');
    }
}
