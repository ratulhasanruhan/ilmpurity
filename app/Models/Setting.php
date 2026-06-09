<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Setting extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'type',
        'sub_type',
        'title',
        'fields',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'fields' => 'array',
    ];

    /**
     * Scope a query to only include settings of a specific type.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string  $type
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope a query to only include settings of a specific sub-type.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string  $subType
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOfSubType($query, $subType)
    {
        return $query->where('sub_type', $subType);
    }

    /**
     * Get a specific field from the fields JSON.
     *
     * @param  string  $key
     * @param  mixed  $default
     * @return mixed
     */
    public function getField($key, $default = null)
    {
        return data_get($this->fields, $key, $default);
    }

    /**
     * Set a specific field in the fields JSON.
     *
     * @param  string  $key
     * @param  mixed  $value
     * @return $this
     */
    public function setField($key, $value)
    {
        $fields = $this->fields;
        data_set($fields, $key, $value);
        $this->fields = $fields;

        return $this;
    }

    /**
     * Get settings by type and sub_type.
     *
     * @param  string  $type
     * @param  string|null  $subType
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getByType($type, $subType = null)
    {
        $query = self::ofType($type);

        if ($subType) {
            $query->ofSubType($subType);
        }

        return $query->get();
    }
}
