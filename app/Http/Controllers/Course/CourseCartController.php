<?php

namespace App\Http\Controllers\Course;

use App\Models\Course\CourseCart;
use App\Http\Controllers\Controller;
use App\Models\Course\Course;
use App\Services\Course\CourseCartService;
use App\Services\Course\CourseCouponService;
use App\Services\Course\CourseEnrollmentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CourseCartController extends Controller
{

    public function __construct(
        private CourseCartService $cartService,
        private CourseCouponService $couponService,
        private CourseEnrollmentService $enrollmentService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $coupon = null;
        if ($request->has('coupon')) {
            $coupon = $this->couponService->getCoupon($request->coupon);

            if (!$coupon) {
                return back()->with('error', 'This coupon is not valid.');
            }

            if (!$this->couponService->isCouponValid($coupon)) {
                return back()->with('error', 'Ops! coupon is expired.');
            }
        }

        $cart = $this->cartService->getCartItems(Auth::user()->id);
        $calculatedCart = $this->cartService->calculateCart($cart, $coupon);

        return Inertia::render('cart/index', [
            'cart' => $cart,
            'coupon' => $coupon,
            ...$calculatedCart,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->cartService->addToCart(Auth::user()->id, $request->course_id);

        return redirect(route('course-cart.index'))->with('success', 'Course added to cart successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CourseCart $courseCart)
    {
        $this->cartService->clearCart(Auth::user()->id);

        return back()->with('success', 'Cart updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($course_cart)
    {
        $this->cartService->removeFromCart(Auth::user()->id, $course_cart);

        return back()->with('success', 'Course removed from cart successfully.');
    }
}
