<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NavbarItem extends Model
{
    protected $fillable = [
        'sort',
        'type',
        'slug',
        'title',
        'value',
        'items',
        'active',
        'navbar_id',
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
     * Get the navbar this item belongs to
     */
    public function navbar(): BelongsTo
    {
        return $this->belongsTo(Navbar::class);
    }

    /**
     * Boot the model and set up event listeners
     */
    protected static function boot()
    {
        parent::boot();

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
        $maxSort = self::where('navbar_id', $this->navbar_id)->max('sort');

        return $maxSort ? (int)$maxSort + 1 : 1;
    }
}
