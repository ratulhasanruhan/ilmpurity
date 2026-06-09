<?php

namespace App\Models\Course;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WatchHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'course_id',
        'current_section_id',
        'current_watching_id',
        'current_watching_type',
        'next_watching_id',
        'next_watching_type',
        'completed_watching',
        'completion_date',
    ];

    protected $casts = [
        'completed_watching' => 'array'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
