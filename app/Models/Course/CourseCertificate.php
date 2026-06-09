<?php

namespace App\Models\Course;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseCertificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'course_id',
        'identifier',
    ];

    public function user()
    {
        return $this->belongsTo(User::class)->withDefault();
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
