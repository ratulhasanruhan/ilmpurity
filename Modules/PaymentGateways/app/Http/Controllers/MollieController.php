<?php

namespace Modules\PaymentGateways\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\SettingsService;
use Illuminate\Support\Facades\Auth;
use Modules\PaymentGateways\Services\PaymentService;
use Mollie\Laravel\Facades\Mollie;

class MollieController extends Controller
{
    private $mollie;
    private $mollieSecret;

    public function __construct(
        private PaymentService $payment,
        private SettingsService $settingsService,
    ) {
        $this->mollie = $this->settingsService->getSetting(['type' => 'payment', 'sub_type' => 'mollie']);
        $this->mollieSecret = $this->mollie->fields['test_mode'] ? $this->mollie->fields['test_api_key'] : $this->mollie->fields['live_api_key'];
    }

    // Mollie payment 
    public function payment(Request $request)
    {
        $user = Auth::user();
        $checkoutItem = $this->payment->getCheckoutItem(
            $request->item_type,
            $request->item_id,
            $request->coupon
        );

        Mollie::api()->setApiKey($this->mollieSecret);
        $payment = Mollie::api()->payments->create([
            "amount" => [
                "currency" => $this->mollie->fields['currency'],
                "value" => number_format($checkoutItem['finalPrice'], 2, '.', '') // You must send the correct number of decimals, thus we enforce the use of strings
            ],
            "description" => "Order #12345",
            "redirectUrl" => route('payments.mollie.success'),
            // "webhookUrl" => route('webhooks.mollie'),
            "metadata" => [
                "order_id" => "12345",
            ],
        ]);

        setTempStore([
            'user_id' => $user->id,
            'properties' => [
                'from' => $request->from,
                'item_type' => $request->item_type,
                'item_id' => $request->item_id,
                'mollie_id' => $payment->id,
                'tax_amount' => $checkoutItem['taxAmount'],
                'coupon_code' => $checkoutItem['coupon'] ? $checkoutItem['coupon']->code : null,
            ]
        ]);

        // redirect customer to Mollie checkout page
        return redirect($payment->getCheckoutUrl(), 303);
    }

    // Mollie payment success
    public function success(Request $request)
    {
        $user = Auth::user();
        $temp = getTempStore($user->id);

        $from = $temp->properties['from'];
        $item_type = $temp->properties['item_type'];
        $item_id = $temp->properties['item_id'];
        $mollie_id = $temp->properties['mollie_id'];
        $tax_amount = $temp->properties['tax_amount'];
        $coupon_code = $temp->properties['coupon_code'];

        try {
            Mollie::api()->setApiKey($this->mollieSecret);
            $payment = Mollie::api()->payments->get($mollie_id);

            if ($payment->isPaid()) {
                $this->payment->coursesBuy(
                    'mollie',
                    $item_type,
                    $item_id,
                    $payment->id,
                    $tax_amount,
                    $payment->amount->value,
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
}
