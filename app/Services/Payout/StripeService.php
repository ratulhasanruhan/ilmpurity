<?php

namespace App\Services\Payout;

use Stripe\Stripe;
use Stripe\Checkout\Session;
use App\Services\SettingsService;
use App\Services\Course\CourseCartService;
use App\Services\Course\CourseCouponService;
use Illuminate\Support\Facades\Auth;

class StripeService extends PayoutService
{
    private $stripe;
    private $stripeSecret;

    public function __construct(
        private CourseCouponService $couponService,
        private CourseCartService $cartService,
        private SettingsService $settingsService,
    ) {
        $this->stripe = $this->settingsService->getSetting(['type' => 'payment', 'sub_type' => 'stripe']);
        $this->stripeSecret = $this->stripe->fields['test_mode'] ? $this->stripe->fields['test_secret_key'] : $this->stripe->fields['live_secret_key'];
    }

    public function paymentProcessingStart(string $couponCode): ?string
    {
        $cart = $this->cartService->getCartItems(Auth::user()->id);
        $coupon = $this->couponService->getCoupon($couponCode);
        $calculatedCart = $this->cartService->calculateCart($cart, $coupon);

        Stripe::setApiKey($this->stripeSecret);
        $response = Session::create([
            'line_items' => [
                [
                    'price_data' => [
                        'currency' => strtolower($this->stripe->fields['currency']),
                        'product_data' => [
                            'name' => 'Course Purchase',
                        ],
                        'unit_amount' => $calculatedCart['totalPrice'] * 100,
                    ],
                    'quantity' => 1,
                ]
            ],
            'mode' => 'payment',
            'success_url' => route('payments.stripe.success'),
            'cancel_url' => route('payments.stripe.cancel'),
        ]);

        session()->put('stripe_id', $response->id);
        session()->put('taxAmount', $calculatedCart['taxAmount']);
        session()->put('couponCode', $coupon ? $coupon->code : null);

        if ($response->url) {
            return $response->url;
        }

        return null;
    }

    public function paymentProcessingEnd(): bool
    {
        $stripe_id = session()->get('stripe_id');
        $taxAmount = session()->get('taxAmount');
        $couponCode = session()->get('couponCode');

        Stripe::setApiKey($this->stripeSecret);
        $order = Session::retrieve($stripe_id);

        // $this->coursesBuy('stripe', $order->payment_intent, $taxAmount, ($order->amount_total / 100), $couponCode);

        session()->forget('taxAmount');
        session()->forget('couponCode');

        return true;
    }
}
