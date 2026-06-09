<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FooterItem extends Model
{
    protected $fillable = [
        'sort',
        'type',
        'slug',
        'title',
        'items',
        'active',
        'footer_id',
    ];

    protected $casts = [
        'sort' => 'integer',
        'active' => 'boolean',
        'items' => 'array',
    ];

    protected $attributes = [
        'items' => '[]',
    ];

    /**
     * Get the footer this item belongs to
     */
    public function footer(): BelongsTo
    {
        return $this->belongsTo(Footer::class);
    }

    /**
     * Boot the model and set up event listeners
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($footerItem) {
            if (is_null($footerItem->sort)) {
                $footerItem->sort = $footerItem->getNextSortValue();
            }
        });
    }

    /**
     * Get the next sort value for this footer item
     */
    protected function getNextSortValue(): int
    {
        $maxSort = self::where('footer_id', $this->footer_id)->max('sort');

        return $maxSort ? (int)$maxSort + 1 : 1;
    }
}
