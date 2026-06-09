<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class PageSection extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
        'title',
        'description',
        'thumbnail',
        'flags',
        'properties',
        'active',
        'sort',
        'page_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'active' => 'boolean',
        'sort' => 'integer',
        'flags' => 'array',
        'properties' => 'array',
    ];

    /**
     * Get the page that owns this section
     */
    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class, 'page_id');
    }

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::creating(function ($navbarItem) {
            if (is_null($navbarItem->sort)) {
                $navbarItem->sort = $navbarItem->getNextSortValue();
            }
        });
    }

    /**
     * Get the next sort value for this navbar item
     */
    protected function getNextSortValue(): int
    {
        $maxSort = static::query()->max('sort');

        return is_null($maxSort) ? 1 : (int)$maxSort + 1;
    }
}
