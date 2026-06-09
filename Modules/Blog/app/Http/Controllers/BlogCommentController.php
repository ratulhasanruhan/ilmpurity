<?php

namespace Modules\Blog\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Modules\Blog\Http\Requests\BlogCommentRequest;
use Modules\Blog\Models\BlogComment;
use Illuminate\Support\Facades\Auth;

class BlogCommentController extends Controller
{
    /**
     * Store a new comment.
     */
    public function store(BlogCommentRequest $request): RedirectResponse
    {
        try {
            $userId = Auth::id();

            if (!$userId) {
                return back()->with('error', 'You must be logged in to comment.');
            }

            $validated = $request->validated();
            $validated['user_id'] = $userId;

            BlogComment::create($validated);

            return back()->with('success', 'Comment posted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'An error occurred while posting your comment.');
        }
    }

    /**
     * Update a comment.
     */
    public function update(BlogCommentRequest $request, $id): RedirectResponse
    {
        try {
            $userId = Auth::id();

            if (!$userId) {
                return back()->with('error', 'You must be logged in to update comments.');
            }

            $comment = BlogComment::findOrFail($id);

            // Check if user owns the comment
            if ($comment->user_id !== $userId) {
                return back()->with('error', 'You can only edit your own comments.');
            }

            $comment->update($request->validated());

            return back()->with('success', 'Comment updated successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'An error occurred while updating your comment.');
        }
    }

    /**
     * Delete a comment.
     */
    public function destroy($id): RedirectResponse
    {
        try {
            $userId = Auth::id();

            if (!$userId) {
                return back()->with('error', 'You must be logged in to delete comments.');
            }

            $comment = BlogComment::findOrFail($id);

            // Check if user owns the comment or is admin
            $user = Auth::user();
            if ($comment->user_id !== $userId && (!$user || !$user->hasRole('admin'))) {
                return back()->with('error', 'You can only delete your own comments.');
            }

            $comment->delete();

            return back()->with('success', 'Comment deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'An error occurred while deleting your comment.');
        }
    }
}
