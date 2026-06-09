<?php

namespace Modules\Exam\Models;

use App\Models\BaseModel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExamRequirement extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'exam_id',
        'requirement',
        'sort'
    ];

    protected $casts = [
        'sort' => 'integer',
    ];

    protected static function booted(): void
    {
        static::creating(function (ExamRequirement $requirement) {
            // Handle sort
            if (is_null($requirement->sort)) {
                $requirement->sort = static::getNextSortValue();
            }
        });
    }

    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }
}
