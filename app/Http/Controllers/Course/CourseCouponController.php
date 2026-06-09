<?php

namespace App\Http\Controllers\Course;

use Inertia\Inertia;
use Inertia\Response;
use App\Http\Controllers\Controller;
use App\Http\Requests\CourseCouponRequest;
use App\Models\Course\CourseCoupon;
use App\Services\Course\CourseCouponService;
use Illuminate\Http\Request;

class CourseCouponController extends Controller
{
   public function __construct(private CourseCouponService $courseCoupon) {}

   /**
    * Display a listing of coupons
    */
   public function index(Request $request): Response
   {
      $courses = $this->courseCoupon->getCoursesList($request->all(), true);
      $coupons = $this->courseCoupon->getCouponsList($request->all(), true);

      return Inertia::render('dashboard/courses/coupons/index', [
         'courses' => $courses,
         'coupons' => $coupons,
      ]);
   }

   /**
    * Store a newly created coupon
    */
   public function store(CourseCouponRequest $request)
   {
      CourseCoupon::create($request->validated());

      return redirect()
         ->route('course-coupons.index')
         ->with('success', 'Coupon created successfully.');
   }

   /**
    * Update the specified coupon
    */
   public function update(CourseCouponRequest $request, CourseCoupon $coupon)
   {
      $coupon->update($request->validated());

      return redirect()
         ->route('course-coupons.index')
         ->with('success', 'Coupon updated successfully.');
   }

   /**
    * Remove the specified coupon
    */
   public function destroy(CourseCoupon $coupon)
   {
      $coupon->delete();

      return redirect()
         ->route('course-coupons.index')
         ->with('success', 'Coupon deleted successfully.');
   }

   /**
    * Verify a coupon code
    */
   public function verify(Request $request)
   {
      $request->validate([
         'code' => 'required|string',
         'course_id' => 'nullable|exists:courses,id',
      ]);

      $query = CourseCoupon::where('code', $request->code);

      if ($request->has('course_id')) {
         $query->where(function ($q) use ($request) {
            $q->where('exam_id', $request->exam_id)
               ->orWhereNull('exam_id');
         });
      }

      $coupon = $query->first();

      if (!$coupon) {
         return response()->json([
            'valid' => false,
            'message' => 'Invalid coupon code.',
         ], 404);
      }

      if (!$coupon->isValid()) {
         return response()->json([
            'valid' => false,
            'message' => 'Coupon is not valid or has expired.',
         ], 400);
      }

      return response()->json([
         'valid' => true,
         'coupon' => $coupon,
      ]);
   }
}
