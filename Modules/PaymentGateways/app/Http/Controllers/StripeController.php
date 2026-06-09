<?php

namespace Modules\PaymentGateways\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\SettingsService;
use Illuminate\Support\Facades\Auth;
use Modules\PaymentGateways\Services\PaymentService;
use Stripe\Checkout\Session;
use Stripe\Stripe;

class StripeController extends Controller
{
    private $stripe;
    private $stripeSecret;

    public function __construct(
        private PaymentService $payment,
        private SettingsService $settingsService,
    ) {
        $this->stripe = $this->settingsService->getSetting(['type' => 'payment', 'sub_type' => 'stripe']);
        $this->stripeSecret = $this->stripe->fields['test_mode'] ? $this->stripe->fields['test_secret_key'] : $this->stripe->fields['live_secret_key'];
    }

    // Stripe payment 
    public function payment(Request $request)
    {
        $user = Auth::user();
        $checkoutItem = $this->payment->getCheckoutItem(
            $request->item_type,
            $request->item_id,
            $request->coupon
        );

        Stripe::setApiKey($this->stripeSecret);
        $response = Session::create([
            'line_items' => [
                [
                    'price_data' => [
                        'currency' => strtolower($this->stripe->fields['currency']),
                        'product_data' => [
                            'name' => ucfirst($request->item_type) . ' Purchase',
                        ],
                        'unit_amount' => round($checkoutItem['finalPrice'] * 100),
                    ],
                    'quantity' => 1,
                ]
            ],
            'mode' => 'payment',
            'success_url' => route('payments.stripe.success'),
            'cancel_url' => route('payments.stripe.cancel'),
        ]);

        setTempStore([
            'user_id' => $user->id,
            'properties' => [
                'from' => $request->from,
                'item_type' => $request->item_type,
                'item_id' => $request->item_id,
                'stripe_id' => $response->id,
                'tax_amount' => $checkoutItem['taxAmount'],
                'coupon_code' => $checkoutItem['coupon'] ? $checkoutItem['coupon']->code : null,
            ]
        ]);

        return redirect()->away($response->url);
    }


    // Stripe payment success
    public function success(Request $request)
    {
        $user = Auth::user();
        $temp = getTempStore($user->id);

        $from = $temp->properties['from'];
        $item_type = $temp->properties['item_type'];
        $item_id = $temp->properties['item_id'];
        $stripe_id = $temp->properties['stripe_id'];
        $tax_amount = $temp->properties['tax_amount'];
        $coupon_code = $temp->properties['coupon_code'];

        if (!in_array($item_type, ['course', 'exam'])) {
            return redirect()->route('student.index', ['tab' => 'courses'])
                ->with('error', 'Invalid item type');
        }

        try {
            Stripe::setApiKey($this->stripeSecret);
            $order = Session::retrieve($stripe_id);

            $this->payment->coursesBuy(
                'stripe',
                $item_type,
                $item_id,
                $order->payment_intent,
                $tax_amount,
                ($order->amount_total / 100),
                $coupon_code
            );

            if ($from == 'api') {
                return redirect()->to(env('FRONTEND_URL') . '/student');
            } else {
                return redirect()
                    ->route('student.index', ['tab' => 'courses'])
                    ->with('success', 'Congratulation! Your payment have completed');
            }
        } catch (\Throwable $th) {
            return redirect()
                ->route('payments.index', ['from' => $from, 'item' => $item_type, 'id' => $item_id])
                ->with('error', $th->getMessage());
        }
    }


    // Stripe payment cancel
    public function cancel()
    {
        $user = Auth::user();
        $temp = getTempStore($user->id);

        $from = $temp->properties['from'];
        $item_type = $temp->properties['item_type'];
        $item_id = $temp->properties['item_id'];

        return redirect()
            ->route('payments.index', ['from' => $from, 'item' => $item_type, 'id' => $item_id])
            ->with('error', 'Your payment have failed, please try again later.');
    }
}
