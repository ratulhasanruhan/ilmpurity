<?php

namespace App\Models\Course;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuizSubmission extends Model
{
    protected $fillable = [
        'user_id',
        'section_quiz_id',
        'attempts',
        'correct_answers',
        'incorrect_answers',
        'total_marks',
        'is_passed',
    ];

    protected $casts = [
        'is_passed' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function section_quiz(): BelongsTo
    {
        return $this->belongsTo(SectionQuiz::class);
    }
}
