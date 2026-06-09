<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Page extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
        'title',
        'banner',
        'favicon',
        'description',
        'meta_description',
        'meta_keywords',
    ];

    /**
     * Get all sections for this page
     */
    public function sections(): HasMany
    {
        return $this->hasMany(PageSection::class, 'page_id');
    }
}
