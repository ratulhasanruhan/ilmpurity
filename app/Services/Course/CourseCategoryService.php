<?php

namespace App\Services\Course;

use App\Models\Course\CourseCategory;
use App\Models\Course\CourseCategoryChild;
use App\Services\MediaService;
use Illuminate\Support\Str;

class CourseCategoryService extends MediaService
{
   function getCategoryBySlug(?string $name): ?CourseCategory
   {
      return CourseCategory::where('slug', $name)->first();
   }

   function getCategoryChildBySlug(?string $name): ?CourseCategoryChild
   {
      return CourseCategoryChild::where('slug', $name)->first();
   }

   function getCategories(): array
   {
      $categories = CourseCategory::with(['category_children' => function ($query) {
         $query->orderBy('sort', 'asc');
      }])->orderBy('sort', 'asc')->get();

      return [
         'categories' => $categories,
         'lastPosition' => $categories->max('sort') ?? 0,
         'lastChildPosition' => $categories->flatMap->category_children->max('sort') ?? 0,
      ];
   }

   function createCategory(array $data): CourseCategory
   {
      $category = CourseCategory::create([
         ...$data,
         'slug' => Str::slug($data['title']),
      ]);

      if ($data['thumbnail']) {
         $category->update([
            'thumbnail' => $this->addNewDeletePrev($category, $data['thumbnail'], "thumbnail")
         ]);
      }

      return $category;
   }

   function updateCategory(array $data, CourseCategory $category): CourseCategory
   {
      $category->update([
         ...$data,
         'slug' => Str::slug($data['title']),
      ]);

      if ($data['thumbnail']) {
         $category->update([
            'thumbnail' => $this->addNewDeletePrev($category, $data['thumbnail'], "thumbnail")
         ]);
      }

      return $category;
   }

   function createCategoryChild(array $data): CourseCategoryChild
   {
      $categoryChild = CourseCategoryChild::create([
         ...$data,
         'slug' => Str::slug($data['title']),
      ]);

      return $categoryChild;
   }

   function updateCategoryChild(array $data, CourseCategoryChild $categoryChild): CourseCategoryChild
   {
      $categoryChild->update([
         ...$data,
         'slug' => Str::slug($data['title']),
      ]);

      return $categoryChild;
   }

   function deleteCategory(CourseCategory $category): bool
   {
      $defaultCategory = CourseCategory::where('slug', 'default')->first();

      $category->courses()->update([
         'course_category_id' => $defaultCategory->id,
      ]);

      $category->delete();

      return true;
   }

   function deleteCategoryChild(CourseCategoryChild $categoryChild): bool
   {
      $categoryChild->courses()->update([
         'course_category_child_id' => null,
      ]);

      $categoryChild->delete();

      return true;
   }

   function sortCategories(array $sortedData): bool
   {
      foreach ($sortedData as $value) {
         CourseCategory::where('id', $value['id'])->update([
            'sort' => $value['sort']
         ]);
      }

      return true;
   }

   function sortCategoryChildren(array $sortedData): bool
   {
      foreach ($sortedData as $value) {
         CourseCategoryChild::where('id', $value['id'])->update([
            'sort' => $value['sort']
         ]);
      }

      return true;
   }
}
