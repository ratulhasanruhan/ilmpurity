<?php

namespace App\Models\Course;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class CourseCategory extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'title',
        'slug',
        'icon',
        'sort',
        'status',
        'description',
        'thumbnail',
    ];

    public function courses()
    {
        return $this->hasMany(Course::class);
    }

    public function category_children()
    {
        return $this->hasMany(CourseCategoryChild::class);
    }
}
