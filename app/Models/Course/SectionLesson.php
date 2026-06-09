<?php

namespace App\Models\Course;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class SectionLesson extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'title',
        'sort',
        'status',
        'lesson_type',
        'lesson_provider',
        'lesson_src',
        'embed_source',
        'thumbnail',
        'duration',
        'is_free',
        'description',
        'summary',
        'course_id',
        'lesson_number',
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

    public function forums(): HasMany
    {
        return $this->hasMany(CourseForum::class)->orderBy('created_at', 'desc');
    }

    public function resources(): HasMany
    {
        return $this->hasMany(LessonResource::class)->orderBy('created_at', 'desc');
    }

    protected static function booted()
    {
        static::creating(function ($lesson) {
            $lastLesson = self::orderBy('lesson_number', 'desc')->first();

            $lesson->lesson_number = $lastLesson ? $lastLesson->lesson_number + 1 : 1;
        });
    }
}
