<?php

namespace Modules\Exam\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Exam\Models\ExamCategory;
use Modules\Exam\Http\Requests\ExamCategoryRequest;
use Modules\Exam\Services\ExamCategoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ExamCategoryController extends Controller
{
   public function __construct(protected ExamCategoryService $category) {}

   /**
    * Display a listing of exam categories
    */
   public function index(): Response
   {
      $categories = $this->category->getCategories();

      return Inertia::render('dashboard/exams/categories/index', compact('categories'));
   }

   /**
    * Store a newly created category
    */
   public function store(ExamCategoryRequest $request): RedirectResponse
   {
      $this->category->createCategory($request->validated());

      return back()->with('success', 'Category created successfully.');
   }

   /**
    * Update the specified category
    */
   public function update(ExamCategoryRequest $request, ExamCategory $category): RedirectResponse
   {
      $this->category->updateCategory($request->validated(), $category);

      return back()->with('success', 'Category updated successfully.');
   }

   /**
    * Remove the specified category
    */
   public function destroy(string $id): RedirectResponse
   {
      $this->category->deleteCategory($id);

      return back()->with('success', 'Category deleted successfully.');
   }

   /**
    * Sort categories via drag-drop
    */
   public function sort(Request $request): RedirectResponse
   {
      $this->category->updateSortValues('exam_categories', $request->sortedData);

      return back()->with('success', 'Categories sorted successfully');
   }
}
