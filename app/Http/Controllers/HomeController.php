<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdatePageSectionRequest;
use App\Models\Page;
use App\Services\Course\CourseCategoryService;
use App\Services\JobCircularService;
use App\Services\PageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Inertia\Inertia;

class HomeController extends Controller
{
   public function __construct(
      protected PageService $pageService,
      protected JobCircularService $jobCircularService,
      protected CourseCategoryService $categoryService,
   ) {}

   public function index(Request $request)
   {
      $page = app('intro_page');
      $sections = $this->pageService->getPageSections($request->all(), $page);

      return Inertia::render('intro/' . $page->slug, [
         'type' => 'intro',
         ...$sections,
      ]);
   }

   public function demo(Request $request, string $slug)
   {
      $page = Page::where('slug', $slug)
         ->with(['sections' => function ($query) {
            $query->orderBy('sort', 'asc');
         }])
         ->first();

      $sections = $this->pageService->getPageSections($request->all(), $page);

      return Inertia::render('intro/' . $page->slug, [
         'page' => $page,
         'type' => 'demo',
         ...$sections,
      ]);
   }

   /**
    * Update the specified section in storage.
    */
   public function update_section(UpdatePageSectionRequest $request, string $id)
   {
      $section = $this->pageService->updatePageSection($id, $request->validated());

      return back()->with('success', "Section '{$section->name}' has been updated successfully");
   }

   /**
    * Update the specified section in storage.
    */
   public function sort_section(Request $request)
   {
      $this->pageService->sortPageSections($request->sortedData);

      return back()->with('success', "Page sections is sorted successfully");
   }

   public function inner_page(Request $request)
   {
      $innerPages = Page::where('type', 'inner_page')->select(['slug'])->get();
      $validSlugs = $innerPages->pluck('slug')->toArray();

      // Check if the requested slug exists in inner pages
      if (!in_array($request->slug, $validSlugs)) {
         abort(404);
      }

      $innerPage = $this->pageService->getCustomPageBySlug($request->slug);
      $sections = $request->slug === 'careers' ? [] : $this->pageService->getPageSections($request->all(), $innerPage);
      $jobCirculars = $request->slug === 'careers' ? $this->jobCircularService->getActiveJobCirculars($request->all()) : null;

      return Inertia::render('inner/index', [
         'innerPage' => $innerPage,
         'jobCirculars' => $jobCirculars,
         ...$sections
      ]);
   }

   public function seeder()
   {
      ini_set('max_execution_time', 600);

      try {
         Artisan::call('migrate:fresh', ['--force' => true, '--seed' => true]);

         Artisan::call('storage:link');

         Artisan::call('optimize:clear');

         return back()->with('success', 'Installation completed successfully. You can now log in.');
      } catch (\Throwable $th) {
         return back()->with('error', 'Error: ' . $th->getMessage());
      }
   }
}
