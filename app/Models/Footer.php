<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Footer extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];

    /**
     * Get all footer items for this footer
     */
    public function footerItems(): HasMany
    {
        return $this->hasMany(FooterItem::class)->orderBy('sort');
    }
}
