<?php

namespace Modules\Blog\Services;

use App\Models\User;
use App\Services\MediaService;
use Modules\Blog\Models\Blog;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class BlogService extends MediaService
{
   function getBlogs(array $data, bool $paginate = false, ?User $user = null): LengthAwarePaginator|Collection
   {
      $page = array_key_exists('per_page', $data) ? intval($data['per_page']) : 10;

      $blogs = Blog::when(array_key_exists('with', $data) && $data['with'], function ($query) use ($data) {
         return $query->with($data['with']);
      })
         ->when(array_key_exists('search', $data) && $data['search'], function ($query) use ($data) {
            return $query->search($data['search']);
         })
         ->when(array_key_exists('category', $data) && $data['category'] && $data['category'] !== 'all', function ($query) use ($data) {
            return $query->whereHas('category', function ($category) use ($data) {
               $category->where('slug', $data['category']);
            });
         })
         ->when(array_key_exists('status', $data) && $data['status'] && $data['status'] !== 'all', function ($query) use ($data) {
            return $query->where('status', $data['status']);
         })
         ->when($user && $user->role === 'instructor', function ($query) use ($user) {
            return $query->where('user_id', $user->id);
         })
         ->orderBy('created_at', 'desc');

      if ($paginate) {
         return $blogs->paginate($page);
      }

      return $blogs->get();
   }

   function getBlog(string $id, array $data): LengthAwarePaginator|Collection
   {
      $page = array_key_exists('per_page', $data) ? intval($data['per_page']) : 10;

      $blogs = Blog::find($id)
         ->when(array_key_exists('with', $data) && $data['with'], function ($query) use ($data) {
            return $query->with($data['with']);
         })
         ->when(array_key_exists('status', $data) && $data['status'] && $data['status'] !== 'all', function ($query) use ($data) {
            return $query->where('status', $data['status']);
         });

      return $blogs->first();
   }

   public function getBlogsStats()
   {
      // Get statistics
      $statistics = [
         'total' => Blog::count(),
         'published' => Blog::published()->count(),
         'draft' => Blog::draft()->count(),
         'archived' => Blog::archived()->count(),
      ];

      return [
         'statistics' => $statistics,
         'statuses' => Blog::getStatuses(),
      ];
   }

   public function storeBlog(array $data): Blog
   {
      $blog = Blog::create($data);

      if ($data['thumbnail']) {
         $blog->update([
            'thumbnail' => $this->addNewDeletePrev($blog, $data['thumbnail'], "thumbnail")
         ]);
      }

      if ($data['banner']) {
         $blog->update([
            'banner' => $this->addNewDeletePrev($blog, $data['banner'], "banner")
         ]);
      }

      return $blog;
   }

   public function updateBlog(string $id, array $data): Blog
   {
      $blog = Blog::find($id);

      if ($data['thumbnail']) {
         $data['thumbnail'] = $this->addNewDeletePrev($blog, $data['thumbnail'], "thumbnail");
      }

      if ($data['banner']) {
         $data['banner'] = $this->addNewDeletePrev($blog, $data['banner'], "banner");
      }

      $blog->update(removeNullProperties($data));

      return $blog;
   }
}
