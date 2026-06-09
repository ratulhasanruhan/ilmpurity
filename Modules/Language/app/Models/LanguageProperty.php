<?php

namespace Modules\Language\Models;

use Illuminate\Database\Eloquent\Model;

class LanguageProperty extends Model
{
    protected $fillable = [
        'group',
        'name',
        'slug',
        'properties',
        'language_id',
    ];

    protected $casts = [
        'properties' => 'array',
    ];

    public function language()
    {
        return $this->belongsTo(Language::class);
    }
}
