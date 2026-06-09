<?php

namespace App\Models\Course;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'type',
        'answer',
        'options',
        'sort',
        'section_quiz_id',
    ];

    /**
     * Get the quiz that owns the question.
     */
    public function lesson_quiz()
    {
        return $this->belongsTo(SectionQuiz::class);
    }

    public function answers()
    {
        return $this->hasMany(QuestionAnswer::class);
    }
}
