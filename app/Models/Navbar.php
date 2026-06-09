<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Navbar extends Model
{
    protected $fillable = [
        'slug',
        'title',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];

    /**
     * Get all navbar items for this navbar
     */
    public function navbarItems(): HasMany
    {
        return $this->hasMany(NavbarItem::class)->orderBy('sort');
    }
}
