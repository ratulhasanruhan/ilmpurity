<?php

namespace Modules\Exam\Models;

use Illuminate\Database\Eloquent\Model;

class ExamResource extends Model
{
    protected $fillable = [
        'title',
        'type',
        'resource',
        'exam_id',
    ];

    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }
}
