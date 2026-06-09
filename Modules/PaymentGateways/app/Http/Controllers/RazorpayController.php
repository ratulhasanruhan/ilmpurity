<?php

namespace Modules\PaymentGateways\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\SettingsService;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Modules\PaymentGateways\Services\PaymentService;
use Razorpay\Api\Api;

class RazorpayController extends Controller
{
    private $razorpay;

    public function __construct(
        private PaymentService $payment,
        private SettingsService $settingsService,
    ) {
        $this->razorpay = $this->settingsService->getSetting(['type' => 'payment', 'sub_type' => 'razorpay']);
    }

    // Razorpay payment redirect
    public function index(Request $request)
    {
        $user = Auth::user();
        $checkoutItem = $this->payment->getCheckoutItem(
            $request->item_type,
            $request->item_id,
            $request->coupon
        );

        setTempStore([
            'user_id' => $user->id,
            'properties' => [
                'from' => $request->from,
                'item_type' => $request->item_type,
                'item_id' => $request->item_id,
                'tax_amount' => $checkoutItem['taxAmount'],
                'coupon_code' => $checkoutItem['coupon'] ? $checkoutItem['coupon']->code : null,
            ]
        ]);

        $data = array();
        $data['user'] = $user;
        $data['key'] = $this->razorpay->fields['api_key'];
        $data['amount'] = $checkoutItem['finalPrice'];
        $data['currency'] = $this->razorpay->fields['currency'];
        $data['description'] = $checkoutItem['item']->title;

        return view('paymentgateways::gateways.razorpay', $data);
    }

    // Razorpay payment callback
    public function payment(Request $request)
    {
        $key = $this->razorpay->fields['api_key'];
        $secret = $this->razorpay->fields['api_secret'];

        $api = new Api($key, $secret);

        $user = Auth::user();
        $temp = getTempStore($user->id);

        $from = $temp->properties['from'];
        $item_type = $temp->properties['item_type'];
        $item_id = $temp->properties['item_id'];
        $tax_amount = $temp->properties['tax_amount'];
        $coupon_code = $temp->properties['coupon_code'];

        if ($request->has('razorpay_payment_id') && $request->filled('razorpay_payment_id')) {
            try {
                $payment = $api->payment->fetch($request->razorpay_payment_id);
                $response = $api->payment->fetch($request->razorpay_payment_id)->capture(['amount' => $payment['amount']]);
                $transactionId = $response['id'];

                // Use the actual payment amount from Razorpay response
                $amount = round($response['amount'] / 100, 2);

                $this->payment->coursesBuy(
                    'razorpay',
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
            } catch (\Throwable $th) {
                return redirect()
                    ->route('payments.index', ['from' => $from, 'item' => $item_type, 'id' => $item_id])
                    ->with('error', $th->getMessage());
            }
        }

        return redirect()
            ->route('payments.index', ['from' => $from, 'item' => $item_type, 'id' => $item_id])
            ->with('error', 'Transaction was failed.');
    }
}
