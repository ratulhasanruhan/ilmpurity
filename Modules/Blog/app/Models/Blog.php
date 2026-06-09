<?php

namespace Modules\Blog\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Blog extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'thumbnail',
        'banner',
        'keywords',
        'status',
        'user_id',
        'blog_category_id',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    protected $attributes = [
        'status' => 'draft',
    ];

    /**
     * Get the user that owns the blog.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the category of the blog.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(BlogCategory::class, 'blog_category_id');
    }

    /**
     * Get the likes and dislikes for the blog.
     */
    public function likeDislikes(): HasMany
    {
        return $this->hasMany(BlogLikeDislike::class);
    }

    /**
     * Get only the likes for the blog.
     */
    public function likes(): HasMany
    {
        return $this->hasMany(BlogLikeDislike::class)->where('type', 'like');
    }

    /**
     * Get only the dislikes for the blog.
     */
    public function dislikes(): HasMany
    {
        return $this->hasMany(BlogLikeDislike::class)->where('type', 'dislike');
    }

    /**
     * Get the comments for the blog.
     */
    // public function comments(): HasMany
    // {
    //     return $this->hasMany(BlogComment::class);
    // }

    /**
     * Get only parent comments (not replies) for the blog.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(BlogComment::class)->orderBy('created_at', 'desc');
    }

    /**
     * Check if the current user has liked this blog.
     */
    public function isLikedByUser($userId = null): bool
    {
        if (!$userId) {
            $userId = \Illuminate\Support\Facades\Auth::id();
        }

        if (!$userId) {
            return false;
        }

        return $this->likeDislikes()
            ->where('user_id', $userId)
            ->where('type', 'like')
            ->exists();
    }

    /**
     * Check if the current user has disliked this blog.
     */
    public function isDislikedByUser($userId = null): bool
    {
        if (!$userId) {
            $userId = \Illuminate\Support\Facades\Auth::id();
        }

        if (!$userId) {
            return false;
        }

        return $this->likeDislikes()
            ->where('user_id', $userId)
            ->where('type', 'dislike')
            ->exists();
    }

    /**
     * Get the user's reaction to this blog.
     */
    public function getUserReaction($userId = null): ?string
    {
        if (!$userId) {
            $userId = \Illuminate\Support\Facades\Auth::id();
        }

        if (!$userId) {
            return null;
        }

        $reaction = $this->likeDislikes()
            ->where('user_id', $userId)
            ->first();

        return $reaction ? $reaction->type : null;
    }

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::creating(function (Blog $blog) {
            if (empty($blog->slug)) {
                $blog->slug = static::generateUniqueSlug($blog->title);
            }
        });

        static::updating(function (Blog $blog) {
            if ($blog->isDirty('title') && !$blog->isDirty('slug')) {
                $blog->slug = static::generateUniqueSlug($blog->title);
            }
        });
    }

    /**
     * Generate a unique slug for the blog.
     */
    public static function generateUniqueSlug(string $title): string
    {
        $slug = \Illuminate\Support\Str::slug($title);
        $originalSlug = $slug;
        $counter = 1;

        while (static::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    /**
     * Scope a query to only include published blogs.
     */
    public function scopePublished(Builder $query): void
    {
        $query->where('status', 'published');
    }

    /**
     * Scope a query to only include draft blogs.
     */
    public function scopeDraft(Builder $query): void
    {
        $query->where('status', 'draft');
    }

    /**
     * Scope a query to only include archived blogs.
     */
    public function scopeArchived(Builder $query): void
    {
        $query->where('status', 'archived');
    }

    /**
     * Scope a query to filter by author.
     */
    public function scopeByAuthor(Builder $query, int $userId): void
    {
        $query->where('user_id', $userId);
    }

    /**
     * Scope a query to search by title or description.
     */
    public function scopeSearch(Builder $query, string $term): void
    {
        $query->where(function ($q) use ($term) {
            $q->where('title', 'like', '%' . $term . '%')
                ->orWhere('description', 'like', '%' . $term . '%')
                ->orWhere('keywords', 'like', '%' . $term . '%');
        });
    }

    /**
     * Get the excerpt of the blog description.
     */
    public function getExcerptAttribute(int $length = 150): string
    {
        return \Illuminate\Support\Str::limit(strip_tags($this->description), $length);
    }

    /**
     * Get the reading time estimate for the blog.
     */
    public function getReadingTimeAttribute(): string
    {
        $wordCount = str_word_count(strip_tags($this->description));
        $wordsPerMinute = 200;
        $minutes = ceil($wordCount / $wordsPerMinute);

        return $minutes . ' min read';
    }

    /**
     * Get available statuses.
     */
    public static function getStatuses(): array
    {
        return [
            'draft' => 'Draft',
            'published' => 'Published',
            'archived' => 'Archived',
        ];
    }
}
