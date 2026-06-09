<?php

namespace App\Services\Payout;

use App\Services\SettingsService;
use App\Services\Course\CourseCartService;
use App\Services\Course\CourseCouponService;
use App\Services\Payment\PaymentService;
use Illuminate\Support\Facades\Auth;
use Srmklive\PayPal\Services\PayPal as PayPalClient;

class PaypalService extends PayoutService
{
    private $paypal;

    public function __construct(
        private CourseCartService $cartService,
        private SettingsService $settingsService,
        private CourseCouponService $couponService,
    ) {
        $this->paypal = $this->settingsService->getSetting(['type' => 'payment', 'sub_type' => 'paypal']);
    }

    public function paymentProcessingStart(string $couponCode): ?string
    {
        $cart = $this->cartService->getCartItems(Auth::user()->id);
        $coupon = $this->couponService->getCoupon($couponCode);
        $calculatedCart = $this->cartService->calculateCart($cart, $coupon);

        $config = setPaypalConfig($this->paypal->fields, 'sandbox');

        $provider = new PayPalClient;
        $provider->setApiCredentials($config);
        $accessToken = $provider->getAccessToken();

        $response = $provider->createOrder([
            "intent" => "CAPTURE",
            "application_context" => [
                "return_url" => route('payments.paypal.success'),
                "cancel_url" => route('payments.paypal.cancel'),
            ],
            "purchase_units" => [
                [
                    "amount" => [
                        "currency_code" => strtolower($this->paypal->fields['currency']),
                        "value" => $calculatedCart['totalPrice']
                    ]
                ]
            ]
        ]);

        if (isset($response['id']) && $response['id'] != null) {
            session()->put('taxAmount', $calculatedCart['taxAmount']);
            session()->put('couponCode', $coupon ? $coupon->code : null);

            foreach ($response['links'] as $link) {
                if ($link['rel'] == 'approve') {
                    return  $link['href'];
                }
            }
        }

        return null;
    }

    public function paymentProcessingEnd(string $token): bool
    {
        $taxAmount = session()->get('taxAmount');
        $couponCode = session()->get('couponCode');
        $config = setPaypalConfig($this->paypal->fields, 'sandbox');

        $provider = new PayPalClient;
        $provider->setApiCredentials($config);
        $accessToken = $provider->getAccessToken();
        $response = $provider->capturePaymentOrder($token);

        if (isset($response['status']) && $response['status'] == 'COMPLETED') {
            $amount = $response['purchase_units'][0]['payments']['captures'][0]['amount']['value'];

            // $this->coursesBuy('paypal', $response['id'], $taxAmount, $amount, $couponCode);

            session()->forget('taxAmount');
            session()->forget('couponCode');

            return true;
        } else {
            return false;
        }
    }
}
