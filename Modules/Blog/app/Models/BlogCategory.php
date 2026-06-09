<?php

namespace Modules\Blog\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BlogCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'icon',
        'sort',
        'description',
        'status',
    ];

    protected $attributes = [
        'status' => 'active',
    ];

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

        static::creating(function (BlogCategory $blogCategory) {
            if (empty($blogCategory->slug)) {
                $blogCategory->slug = static::generateUniqueSlug($blogCategory->name);
            }
        });

        static::updating(function (BlogCategory $blogCategory) {
            if ($blogCategory->isDirty('name') && !$blogCategory->isDirty('slug')) {
                $blogCategory->slug = static::generateUniqueSlug($blogCategory->name);
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

    /**
     * Generate a unique slug for the blog category.
     */
    public static function generateUniqueSlug(string $name): string
    {
        $slug = \Illuminate\Support\Str::slug($name);
        $originalSlug = $slug;
        $counter = 1;

        while (static::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    /**
     * Get the blogs for this category.
     */
    public function blogs(): HasMany
    {
        return $this->hasMany(Blog::class, 'blog_category_id');
    }

    /**
     * Get published blogs for this category.
     */
    public function publishedBlogs(): HasMany
    {
        return $this->blogs()->where('status', 'published');
    }

    /**
     * Scope a query to only include active categories.
     */
    public function scopeActive(Builder $query): void
    {
        $query->where('status', 'active');
    }

    /**
     * Scope a query to only include inactive categories.
     */
    public function scopeInactive(Builder $query): void
    {
        $query->where('status', 'inactive');
    }

    /**
     * Get the blogs count for this category.
     */
    public function getBlogsCount(): int
    {
        return $this->blogs()->count();
    }

    /**
     * Get the published blogs count for this category.
     */
    public function getPublishedBlogsCount(): int
    {
        return $this->publishedBlogs()->count();
    }

    /**
     * Get available statuses.
     */
    public static function getStatuses(): array
    {
        return [
            'active' => 'Active',
            'inactive' => 'Inactive',
        ];
    }
}
