<?php

namespace Modules\PaymentGateways\Services;

use App\Enums\UserType;
use App\Models\Course\Course;
use App\Models\Instructor;
use App\Models\PaymentHistory;
use App\Services\Course\CourseCartService;
use App\Services\Course\CourseEnrollmentService;
use App\Services\Course\CourseService;
use App\Services\Course\CourseCouponService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Modules\Exam\Models\Exam;
use Modules\Exam\Services\ExamCouponService;
use Modules\Exam\Services\ExamEnrollmentService;
use Modules\Exam\Services\ExamService;

class PaymentService
{
    public function __construct(
        private ExamService $examService,
        private CourseService $courseService,
        private CourseCouponService $courseCoupon,
        private CourseCartService $cartService,
        private CourseEnrollmentService $courseEnrollment,
        private ExamEnrollmentService $examEnrollment,
        private ExamCouponService $examCoupon,

    ) {}

    public function getCheckoutItem(string $item_type, string $item_id, ?string $coupon_code)
    {
        $item = null;
        $coupon = null;

        if ($item_type === 'course') {
            $item = $this->courseService->getCheckoutCourse($item_id);

            if ($coupon_code) {
                $coupon = $this->courseCoupon->getCoupon($coupon_code);
            }
        } else {
            $item = $this->examService->getCheckoutExam($item_id);

            if ($coupon_code) {
                $coupon = $this->examCoupon->getCoupon($coupon_code);
            }
        }

        $calculatedItemPrice = $this->cartService->calculateItemPrice($item, $coupon);

        return [
            'item' => $item,
            'coupon' => $coupon,
            ...$calculatedItemPrice,
        ];
    }

    public function validateExamCoupons(string $item_type, string $item_id)
    {
        if ($item_type === 'exam') {
            return $this->examCoupon->getExamValidCoupons($item_id);
        }

        return $this->courseCoupon->getCourseValidCoupons($item_id);
    }

    public function coursesBuy(
        string $paymentMethod,
        string $item_type,
        string $item_id,
        string $transactionId,
        float $taxAmount,
        float $totalPrice,
        ?string $couponCode,
        ?string $user_id = null
    ) {
        $user_id = $user_id ?? Auth::user()->id;
        $invoice_no = random_int(10000000, 99999999);
        $instructorRevenue = app('system_settings')->fields['instructor_revenue'];

        // Initialize variables to avoid undefined errors
        $instructor = null;
        $historyData = [];

        // Handle course purchase
        if ($item_type === 'course') {
            $course = Course::findOrFail($item_id);
            $instructor = Instructor::with('user')
                ->where('id', $course->instructor_id)
                ->first();

            $historyData = [
                'purchase_type' => Course::class,
                'purchase_id' => $course->id,
            ];

            $this->courseEnrollment->createCourseEnroll([
                'user_id' => $user_id,
                'course_id' => $course->id,
                'enrollment_type' => 'paid',
            ]);

            $this->cartService->clearCart($user_id);
        }

        // Handle exam purchase
        if ($item_type === 'exam') {
            $exam = Exam::findOrFail($item_id);
            $instructor = Instructor::with('user')
                ->where('id', $exam->instructor_id)
                ->first();

            $historyData = [
                'purchase_type' => Exam::class,
                'purchase_id' => $exam->id,
            ];

            $this->examEnrollment->createExamEnroll([
                'user_id' => $user_id,
                'exam_id' => $exam->id,
                'enrollment_type' => 'paid',
            ]);
        }

        // Calculate revenue split
        if ($instructor->user->role == UserType::ADMIN->value) {
            $historyData['admin_revenue'] = $totalPrice;
        } else {
            $instructorRevenueAmount = $totalPrice * ($instructorRevenue / 100);
            $historyData['instructor_revenue'] = $instructorRevenueAmount - $taxAmount;
            $historyData['admin_revenue'] = ($totalPrice - $instructorRevenueAmount) + $taxAmount;
        }

        // Create payment history
        PaymentHistory::create([
            'user_id' => $user_id,
            'amount' => $totalPrice,
            'tax' => $taxAmount,
            'payment_type' => $paymentMethod,
            'coupon' => $couponCode,
            'transaction_id' => $transactionId,
            'invoice' => $invoice_no,
            ...$historyData,
        ]);
    }

    /**
     * Convert currency using external API (Optional upgrade)
     * Uncomment the API call in convertCurrency() to use this
     * 
     * @param float $amount
     * @param string $fromCurrency
     * @param string $toCurrency
     * @return float|null
     */
    private function convertCurrencyWithAPI($amount, $fromCurrency, $toCurrency)
    {
        try {
            // Using free ExchangeRate-API (no API key required)
            $response = Http::timeout(5)->get("https://api.exchangerate-api.com/v4/latest/{$fromCurrency}");

            if ($response->successful()) {
                $data = $response->json();
                $rate = $data['rates'][$toCurrency] ?? null;

                if ($rate) {
                    return round($amount * $rate, 2);
                }
            }
        } catch (\Exception $e) {
            // API failed, fall back to fixed rates
        }

        return null;
    }
}
