<?php

namespace Modules\Blog\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BlogLikeDislike extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'type',
        'user_id',
        'blog_id',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'type' => 'string',
    ];

    /**
     * Get the blog that owns the like/dislike.
     */
    public function blog(): BelongsTo
    {
        return $this->belongsTo(Blog::class);
    }

    /**
     * Get the user that owns the like/dislike.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get available types.
     */
    public static function getTypes(): array
    {
        return [
            'like' => 'Like',
            'dislike' => 'Dislike',
        ];
    }
}
