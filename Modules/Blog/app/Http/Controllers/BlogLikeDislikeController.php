<?php

namespace Modules\Blog\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Modules\Blog\Http\Requests\BlogLikeDislikeRequest;
use Modules\Blog\Models\BlogLikeDislike;
use Illuminate\Support\Facades\Auth;

class BlogLikeDislikeController extends Controller
{
    /**
     * Toggle like/dislike for a blog.
     */
    public function toggle(BlogLikeDislikeRequest $request): RedirectResponse
    {

        $userId = Auth::id();
        $type = $request->validated('type');
        $blogId = $request->validated('blog_id');

        // Check if user already has a reaction to this blog
        $existingReaction = BlogLikeDislike::where('blog_id', $blogId)
            ->where('user_id', $userId)
            ->first();

        if ($existingReaction) {
            if ($existingReaction->type === $type) {
                // Same reaction - remove it (toggle off)
                $existingReaction->delete();
                $message = ucfirst($type) . ' removed successfully.';
            } else {
                // Different reaction - update it
                $existingReaction->update(['type' => $type]);
                $message = 'Changed to ' . $type . ' successfully.';
            }
        } else {
            // No existing reaction - create new one
            BlogLikeDislike::create([
                'blog_id' => $blogId,
                'user_id' => $userId,
                'type' => $type,
            ]);
            $message = ucfirst($type) . ' added successfully.';
        }

        return back()->with('success', $message);
    }
}
