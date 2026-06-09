<?php

namespace Modules\Exam\Services;

use App\Services\MediaService;
use Modules\Exam\Models\ExamCategory;
use Illuminate\Database\Eloquent\Collection;

class ExamCategoryService extends MediaService
{
   /**
    * Get category by slug
    */
   public function getCategoryBySlug(string $slug): ExamCategory
   {
      return ExamCategory::where('slug', $slug)->first();
   }

   /**
    * Get all categories with pagination data
    */
   public function getCategories(): Collection
   {
      $categories = ExamCategory::where('slug', '!=', 'default')
         ->withCount('exams')
         ->orderBy('sort', 'asc')
         ->get();

      return $categories;
   }

   /**
    * Create a new exam category
    */
   public function createCategory(array $data): ExamCategory
   {
      $category = ExamCategory::create($data);

      if (isset($data['thumbnail']) && $data['thumbnail']) {
         $category->update([
            'thumbnail' => $this->addNewDeletePrev($category, $data['thumbnail'], "thumbnail")
         ]);
      }

      return $category;
   }

   /**
    * Update an exam category
    */
   public function updateCategory(array $data, ExamCategory $category): ExamCategory
   {
      $category->update($data);

      if (isset($data['thumbnail']) && $data['thumbnail']) {
         $category->update([
            'thumbnail' => $this->addNewDeletePrev($category, $data['thumbnail'], "thumbnail")
         ]);
      }

      return $category;
   }

   /**
    * Delete an exam category
    * Reassigns all exams to default category before deletion
    */
   public function deleteCategory(string $id): bool
   {
      $category = ExamCategory::find($id);
      $defaultCategory = ExamCategory::where('slug', 'default')->first();

      // If no default category exists, create one
      if (!$defaultCategory) {
         $defaultCategory = ExamCategory::create([
            'title' => 'Default',
            'icon' => 'fa-folder',
            'status' => true,
         ]);
      }

      // Reassign all exams to default category
      $category->exams()->update([
         'exam_category_id' => $defaultCategory->id,
      ]);

      // Delete the category
      $category->delete();

      return true;
   }
}
