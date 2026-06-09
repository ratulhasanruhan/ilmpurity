<?php

namespace Modules\PaymentGateways\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\SettingsService;
use Modules\PaymentGateways\Services\PaymentService;

class PaymentController extends Controller
{
    public function __construct(
        private PaymentService $payment,
        private SettingsService $settings,
    ) {}

    public function index(Request $request, string $from, string $item_type, string $id)
    {
        $payments = $this->settings->getSettings(['type' => 'payment']);
        $currency = app('system_settings')->fields['selling_currency'] ?? 'USD';
        $checkoutItem = $this->payment->getCheckoutItem($item_type, $id, $request->coupon);
        $itemCoupons = $this->payment->validateExamCoupons($item_type, $id);

        return view('paymentgateways::index', [
            'id' => $id,
            'from' => $from,
            'coupon' => $request->coupon,
            'item_type' => $item_type,
            'payments' => $payments,
            'currency' => $currency,
            'itemCoupons' => $itemCoupons,
            ...$checkoutItem,
        ]);
    }
}
