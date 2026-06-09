<?php

namespace Modules\Exam\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Exam\Models\ExamCoupon;
use Modules\Exam\Http\Requests\ExamCouponRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Exam\Services\ExamCouponService;

class ExamCouponController extends Controller
{
   public function __construct(private ExamCouponService $examCoupon) {}

   /**
    * Display a listing of coupons
    */
   public function index(Request $request): Response
   {
      $exams = $this->examCoupon->getExamsList($request->all(), true);
      $coupons = $this->examCoupon->getCouponsList($request->all(), true);

      return Inertia::render('dashboard/exams/coupons/index', [
         'exams' => $exams,
         'coupons' => $coupons,
      ]);
   }

   /**
    * Store a newly created coupon
    */
   public function store(ExamCouponRequest $request)
   {
      ExamCoupon::create($request->validated());

      return redirect()
         ->route('exam-coupons.index')
         ->with('success', 'Coupon created successfully.');
   }

   /**
    * Update the specified coupon
    */
   public function update(ExamCouponRequest $request, ExamCoupon $coupon)
   {
      $coupon->update($request->validated());

      return redirect()
         ->route('exam-coupons.index')
         ->with('success', 'Coupon updated successfully.');
   }

   /**
    * Remove the specified coupon
    */
   public function destroy(ExamCoupon $coupon)
   {
      $coupon->delete();

      return redirect()
         ->route('exam-coupons.index')
         ->with('success', 'Coupon deleted successfully.');
   }

   /**
    * Verify a coupon code
    */
   public function verify(Request $request)
   {
      $request->validate([
         'code' => 'required|string',
         'exam_id' => 'nullable|exists:exams,id',
      ]);

      $query = ExamCoupon::where('code', $request->code);

      if ($request->has('exam_id')) {
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
