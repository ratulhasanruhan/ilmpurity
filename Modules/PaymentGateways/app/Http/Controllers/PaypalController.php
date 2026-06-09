<?php

namespace Modules\PaymentGateways\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\SettingsService;
use Illuminate\Support\Facades\Auth;
use Modules\PaymentGateways\Services\PaymentService;
use Srmklive\PayPal\Services\PayPal as PayPalClient;

class PaypalController extends Controller
{
    private $paypal;
    private $paypalMode;

    public function __construct(
        private PaymentService $payment,
        private SettingsService $settingsService,
    ) {
        $this->paypal = $this->settingsService->getSetting(['type' => 'payment', 'sub_type' => 'paypal']);
        $this->paypalMode = $this->paypal->fields['test_mode'] ? 'sandbox' : 'live';
    }

    // Paypal payment 
    public function payment(Request $request)
    {
        $user = Auth::user();
        $checkoutItem = $this->payment->getCheckoutItem(
            $request->item_type,
            $request->item_id,
            $request->coupon
        );

        $config = setPaypalConfig($this->paypal->fields, $this->paypalMode);

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
                        "value" => round($checkoutItem['finalPrice'], 2)
                    ]
                ]
            ]
        ]);

        if (isset($response['id']) && $response['id'] != null) {
            setTempStore([
                'user_id' => $user->id,
                'properties' => [
                    'from' => $request->from,
                    'item_type' => $request->item_type,
                    'item_id' => $request->item_id,
                    'paypal_order_id' => $response['id'],
                    'tax_amount' => $checkoutItem['taxAmount'],
                    'coupon_code' => $checkoutItem['coupon'] ? $checkoutItem['coupon']->code : null,
                ]
            ]);

            foreach ($response['links'] as $link) {
                if ($link['rel'] == 'approve') {
                    return redirect()->away($link['href']);
                }
            }
        } else {
            return redirect(route('payments.paypal.cancel'));
        }
    }

    // Paypal payment success
    public function success(Request $request)
    {
        $user = Auth::user();
        $temp = getTempStore($user->id);

        $from = $temp->properties['from'];
        $item_type = $temp->properties['item_type'];
        $item_id = $temp->properties['item_id'];
        $tax_amount = $temp->properties['tax_amount'];
        $coupon_code = $temp->properties['coupon_code'];

        try {
            $config = setPaypalConfig($this->paypal->fields, $this->paypalMode);

            $provider = new PayPalClient;
            $provider->setApiCredentials($config);
            $accessToken = $provider->getAccessToken();
            $response = $provider->capturePaymentOrder($request->token);

            if (isset($response['status']) && $response['status'] == 'COMPLETED') {
                $amount = $response['purchase_units'][0]['payments']['captures'][0]['amount']['value'];
                $transactionId = $response['purchase_units'][0]['payments']['captures'][0]['id'];

                $this->payment->coursesBuy(
                    'paypal',
                    $item_type,
                    $item_id,
                    $transactionId,
                    $tax_amount,
                    $amount,
                    $coupon_code
                );

                if ($from == 'api') {
                    return redirect()->to(env('FRONTEND_URL') . '/student');
                } else {
                    return redirect()
                        ->route('student.index', ['tab' => 'courses'])
                        ->with('success', 'Congratulation! Your payment have completed');
                }
            } else {
                return redirect()
                    ->route('payments.index', ['from' => $from, 'item' => $item_type, 'id' => $item_id])
                    ->with('error', 'Your payment have failed, please try again later.');
            }
        } catch (\Throwable $th) {
            return redirect()
                ->route('payments.index', ['from' => $from, 'item' => $item_type, 'id' => $item_id])
                ->with('error', $th->getMessage());
        }
    }

    // Paypal payment cancel
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
