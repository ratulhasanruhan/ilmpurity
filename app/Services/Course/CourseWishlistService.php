<?php

namespace App\Services\Course;

use App\Models\Course\CourseWishlist;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class CourseWishlistService
{
   public function createWishlist(array $data): CourseWishlist
   {
      return CourseWishlist::create($data);
   }

   public function getWishlists(array $data, bool $paginate = false): LengthAwarePaginator|Collection
   {
      $page = array_key_exists('course_per_page', $data) ? intval($data['course_per_page']) : 10;

      $wishlists = CourseWishlist::with('course.sections.section_lessons')
         ->where('user_id', $data['user_id']);

      return $paginate ? $wishlists->paginate($page) : $wishlists->get();
   }

   public function deleteWishlist(string $id): void
   {
      CourseWishlist::find($id)->delete();
   }
}
