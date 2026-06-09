<?php

namespace Modules\Blog\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BlogComment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'blog_id',
        'user_id',
        'parent_id',
        'content',
    ];

    /**
     * Get the blog that owns the comment.
     */
    public function blog(): BelongsTo
    {
        return $this->belongsTo(Blog::class);
    }

    /**
     * Get the user that owns the comment.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the parent comment (for replies).
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(BlogComment::class, 'parent_id');
    }

    /**
     * Get all replies including nested ones.
     */
    public function replies(): HasMany
    {
        return $this->hasMany(BlogComment::class, 'parent_id')->with('replies');
    }
}
