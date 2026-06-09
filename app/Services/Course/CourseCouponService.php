<?php

namespace App\Services\Course;

use App\Models\Course\Course;
use App\Models\Course\CourseCoupon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;

class CourseCouponService
{
   public function getCoursesList(array $data): Collection
   {
      $user = Auth::user();

      return Course::select('id', 'title')
         ->when(!isAdmin(), function ($query) use ($user) {
            $query->where('instructor_id', $user->instructor_id);
         })
         ->when(isset($data['course_search']), function ($query) use ($data) {
            $query->where('title', 'like', '%' . $data['course_search'] . '%');
         })
         ->get();
   }

   public function getCoupon(string $code): ?CourseCoupon
   {
      return CourseCoupon::where('code', $code)->first();
   }

   public function getCourseValidCoupons(string $courseId): Collection
   {
      return CourseCoupon::where('course_id', $courseId)
         ->where('is_active', true)
         ->isValid()
         ->get();
   }

   public function getCouponsList(array $data, bool $paginate = false): LengthAwarePaginator|Collection
   {
      $page = array_key_exists('coupon_per_page', $data) ? intval($data['coupon_per_page']) : 10;

      $coupons = CourseCoupon::with('course:id,title')
         ->when(isset($data['coupon_search']), function ($query) use ($data) {
            $query->where('code', 'like', '%' . $data['coupon_search'] . '%');
         })
         ->when(isset($data['is_active']), function ($query) use ($data) {
            $query->where('is_active', $data['is_active']);
         })
         ->orderBy('created_at', 'desc');

      if ($paginate) {
         return $coupons->paginate($page);
      }

      return $coupons->get();
   }
}
