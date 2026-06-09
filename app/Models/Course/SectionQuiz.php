<?php

namespace App\Models\Course;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SectionQuiz extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'duration',
        'hours',
        'minutes',
        'seconds',
        'total_mark',
        'pass_mark',
        'retake',
        'drip_rule',
        'summary',
        'num_questions',
        'course_id',
        'course_section_id',
    ];

    // Relationships
    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function course_section()
    {
        return $this->belongsTo(CourseSection::class);
    }

    public function quiz_questions()
    {
        return $this->hasMany(QuizQuestion::class)->orderBy('sort', 'asc');
    }

    public function quiz_submissions()
    {
        return $this->hasMany(QuizSubmission::class);
    }
}
