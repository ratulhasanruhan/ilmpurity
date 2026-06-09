<?php

namespace Modules\Blog\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;
use Inertia\Inertia;
use Modules\Blog\Http\Requests\BlogRequest;
use Modules\Blog\Models\Blog;
use Modules\Blog\Models\BlogCategory;
use Modules\Blog\Services\BlogCategoryService;
use Modules\Blog\Services\BlogService;

class BlogController extends Controller
{
    function __construct(
        private BlogService $blogService,
        private BlogCategoryService $categoryService
    ) {}

    /**
     * Display a listing of blogs.
     */
    public function index(Request $request): Response
    {
        $blogs = $this->blogService->getBlogs([
            ...$request->all(),
            'with' => ['user:id,name,email', 'category:id,name,slug']
        ], true);

        $categories = $this->categoryService->getCategories(['status' => 'active']);
        $statistics = $this->blogService->getBlogsStats();

        return Inertia::render('dashboard/blogs/index', [
            'blogs' => $blogs,
            'categories' => $categories,
            ...$statistics
        ]);
    }

    /**
     * Display a listing of blogs.
     */
    public function guest_blogs(Request $request): Response
    {
        $category = $this->categoryService->getCategoryBySlug($request->category);

        $blogs = $this->blogService->getBlogs([
            ...$request->all(),
            'status' => 'published',
            'category' =>  $category ? $category->slug : 'all',
            'per_page' => 12,
            'with' => ['user:id,name,email,photo']
        ], true);

        $categories = $this->categoryService->getCategories(['status' => 'active']);

        return Inertia::render('blogs/index', [
            'blogs' => $blogs,
            'category' =>  $category,
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for creating a new blog.
     */
    public function create(): Response
    {
        return Inertia::render('dashboard/blogs/create-edit', [
            'categories' => BlogCategory::active()->select('id', 'name')->get(),
            'statuses' => Blog::getStatuses(),
        ]);
    }

    /**
     * Store a newly created blog.
     */
    public function store(BlogRequest $request): RedirectResponse
    {
        $this->blogService->storeBlog($request->validated());

        return redirect()->route('blogs.index')->with('success', 'Blog created successfully.');
    }

    /**
     * Display the specified blog.
     */
    public function show(string $id): Response
    {
        $blog = Blog::where('id', $id)
            ->with([
                'user:id,name,email,photo',
                'category:id,name,slug',
                'comments.user:id,name,photo',
                'comments.replies.user:id,name,photo'
            ])
            ->withCount([
                'likes',
                'dislikes',
                'comments',
            ])
            ->first();

        if (!$blog) {
            abort(404, 'Blog not found');
        }

        // Get user's reaction if authenticated
        $userReaction = null;
        if (Auth::check()) {
            $userReaction = $blog->getUserReaction(Auth::id());
        }

        return Inertia::render('blogs/show', [
            'blog' => $blog,
            'userReaction' => $userReaction,
            'likesCount' => $blog->likes_count ?? 0,
            'dislikesCount' => $blog->dislikes_count ?? 0,
            'commentsCount' => $blog->comments_count ?? 0,
        ]);
    }

    /**
     * Display the specified blog.
     */
    public function preview(string $id): Response
    {
        $blog = Blog::where('id', $id)->with(['user:id,name,email,photo'])->first();

        return Inertia::render('dashboard/blogs/preview', compact('blog'));
    }

    /**
     * Show the form for editing the specified blog.
     */
    public function edit(Blog $blog): Response
    {
        $blog->load('category');

        return Inertia::render('dashboard/blogs/create-edit', [
            'blog' => $blog,
            'categories' => BlogCategory::active()->select('id', 'name')->get(),
            'statuses' => Blog::getStatuses(),
        ]);
    }

    /**
     * Update the specified blog.
     */
    public function update(BlogRequest $request, string $id): RedirectResponse
    {
        $this->blogService->updateBlog($id, $request->validated());

        return redirect()->route('blogs.index')->with('success', 'Blog updated successfully.');
    }

    /**
     * Remove the specified blog.
     */
    public function destroy(Blog $blog): RedirectResponse
    {

        $blog->clearMediaCollection();

        $blog->delete();

        return redirect()->route('blogs.index')->with('success', 'Blog deleted successfully.');
    }
}
