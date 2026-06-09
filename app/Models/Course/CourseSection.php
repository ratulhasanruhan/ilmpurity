<?php

namespace App\Models\Course;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class CourseSection extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'sort',
        'title',
        'course_id',
    ];

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($section) {
            $section->section_lessons->each(function ($lesson) {
                $lesson->delete();
            });
        });
    }

    // Relationships
    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function section_lessons()
    {
        return $this->hasMany(SectionLesson::class)->orderBy('sort', 'asc');
    }

    public function section_quizzes()
    {
        return $this->hasMany(SectionQuiz::class)->orderBy('created_at', 'desc');
    }
}
