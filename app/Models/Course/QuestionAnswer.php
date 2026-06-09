<?php

namespace App\Models\Course;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuestionAnswer extends Model
{
    use HasFactory;

    protected $fillable = [
        'answers',
        'is_correct',
        'user_id',
        'quiz_question_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function quiz_question()
    {
        return $this->belongsTo(QuizQuestion::class);
    }
}
