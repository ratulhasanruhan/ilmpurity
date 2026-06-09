<?php

namespace App\Http\Controllers\Course;

use App\Http\Controllers\Controller;
use App\Models\Course\CourseCategory;
use App\Http\Requests\StoreCourseCategoryRequest;
use App\Http\Requests\UpdateCourseCategoryRequest;
use App\Services\Course\CourseCategoryService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class CourseCategoryController extends Controller
{
    protected CourseCategoryService $categoryService;

    public function __construct()
    {
        $this->categoryService = new CourseCategoryService();
    }

    public function index()
    {
        $categories = $this->categoryService->getCategories();

        return Inertia::render('dashboard/categories/index', $categories);
    }

    public function store(StoreCourseCategoryRequest $request)
    {
        $this->categoryService->createCategory($request->validated());

        return back()->with('success', 'Category added successfully');
    }

    public function update(UpdateCourseCategoryRequest $request, CourseCategory $category)
    {
        if ($request->title != $category->title && CourseCategory::where('title', $request->title)->exists()) {
            throw ValidationException::withMessages([
                'title' => 'Category title already exists',
            ]);
        }

        $this->categoryService->updateCategory($request->validated(), $category);

        return back()->with('success', 'Category updated successfully');
    }

    public function destroy(CourseCategory $category)
    {
        $this->categoryService->deleteCategory($category);

        return back()->with('success', 'Category deleted successfully');
    }

    public function sort(Request $request)
    {
        $this->categoryService->sortCategories($request->sortedData);

        return back()->with('success', 'Categories sorted successfully');
    }
}
