<?php

namespace Modules\Blog\Services;

use Illuminate\Support\Facades\DB;
use Modules\Blog\Models\BlogCategory;

class BlogCategoryService
{
   public function getCategories(array $data)
   {
      $categories = BlogCategory::query()
         ->withCount(['blogs', 'publishedBlogs'])
         ->when(array_key_exists('status', $data) && $data['status'] && $data['status'] !== 'all', function ($query) use ($data) {
            return $query->where('status', $data['status']);
         })
         ->orderBy('sort', 'asc')
         ->get();

      return $categories;
   }

   public function getCategoryBySlug(string $slug)
   {
      return BlogCategory::where('slug', $slug)->first();
   }

   public function getCategoriesStats(): array
   {
      $statistics = [
         'total' => BlogCategory::count(),
         'active' => BlogCategory::active()->count(),
         'inactive' => BlogCategory::inactive()->count(),
      ];

      return [
         'statistics' => $statistics,
         'statuses' => BlogCategory::getStatuses(),
      ];
   }

   public function storeCategory(array $data): BlogCategory
   {
      return BlogCategory::create($data);
   }

   public function updateCategory(string $id, array $data): bool
   {
      return BlogCategory::find($id)->update($data);
   }


   function deleteCategory(string $id): bool
   {
      $category = BlogCategory::find($id);
      $defaultCategory = BlogCategory::where('slug', 'default')->first();

      $category->blogs()->update([
         'blog_category_id' => $defaultCategory->id,
      ]);

      $category->delete();

      return true;
   }
}
