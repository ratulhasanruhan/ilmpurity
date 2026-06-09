<?php

namespace App\Models\Course;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseLiveClass extends Model
{
    use HasFactory;

    protected $fillable = [
        'provider',
        'class_topic',
        'class_date_and_time',
        'class_note',
        'additional_info',
        'course_id',
    ];

    protected $casts = [
        'class_date_and_time' => 'datetime',
        'additional_info' => 'array',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Get additional_info as array regardless of storage format
     */
    public function getAdditionalInfoArray()
    {
        if (is_string($this->additional_info)) {
            return json_decode($this->additional_info, true) ?: [];
        } elseif (is_array($this->additional_info)) {
            return $this->additional_info;
        }
        return [];
    }

    /**
     * Check if the class is upcoming
     */
    public function isUpcoming()
    {
        return $this->class_date_and_time > now();
    }

    /**
     * Check if the class has started but not ended (assuming 1 hour duration)
     */
    public function isLive()
    {
        $now = now();
        $classStart = $this->class_date_and_time;
        $classEnd = $classStart->copy()->addHour();

        return $now >= $classStart && $now <= $classEnd;
    }

    /**
     * Check if the class has ended
     */
    public function hasEnded()
    {
        return $this->class_date_and_time->addHour() < now();
    }
}
