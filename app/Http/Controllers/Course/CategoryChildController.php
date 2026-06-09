<?php

namespace App\Http\Controllers\Course;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryChildRequest;
use App\Http\Requests\UpdateCategoryChildRequest;
use App\Models\Course\CourseCategoryChild;
use App\Services\Course\CourseCategoryService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class CategoryChildController extends Controller
{
    protected CourseCategoryService $categoryService;

    public function __construct()
    {
        $this->categoryService = new CourseCategoryService();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryChildRequest $request)
    {
        $this->categoryService->createCategoryChild($request->validated());

        return back()->with('success', 'Child category added successfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryChildRequest $request, CourseCategoryChild $categoryChild)
    {
        if ($request->title != $categoryChild->title && CourseCategoryChild::where('title', $request->title)->exists()) {
            throw ValidationException::withMessages([
                'title' => 'Child category title already exists',
            ]);
        }

        $this->categoryService->updateCategoryChild($request->validated(), $categoryChild);

        return back()->with('success', 'Child category updated successfully');
    }

    public function destroy(CourseCategoryChild $categoryChild)
    {
        $this->categoryService->deleteCategoryChild($categoryChild);

        return back()->with('success', 'Child category deleted successfully');
    }

    public function sort(Request $request)
    {
        $this->categoryService->sortCategoryChildren($request->sortedData);

        return back()->with('success', 'Categories sorted successfully');
    }
}
