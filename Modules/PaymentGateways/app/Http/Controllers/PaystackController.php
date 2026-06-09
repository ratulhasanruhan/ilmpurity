<?php

namespace Modules\PaymentGateways\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\SettingsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Modules\PaymentGateways\Services\PaymentService;

class PaystackController extends Controller
{
    private $paystack;
    private $paystackPublicKey;
    private $paystackSecretKey;

    public function __construct(
        private PaymentService $payment,
        private SettingsService $settingsService,
    ) {
        $this->paystack = $this->settingsService->getSetting(['type' => 'payment', 'sub_type' => 'paystack']);
        $this->paystackPublicKey = $this->paystack->fields['test_mode'] ? $this->paystack->fields['test_public_key'] : $this->paystack->fields['live_public_key'];
        $this->paystackSecretKey = $this->paystack->fields['test_mode'] ? $this->paystack->fields['test_secret_key'] : $this->paystack->fields['live_secret_key'];
    }

    // Paystack payment redirect
    public function paystack_redirect(Request $request)
    {
        $user = Auth::user();
        $checkoutItem = $this->payment->getCheckoutItem(
            $request->item_type,
            $request->item_id,
            $request->coupon
        );

        // Get Paystack currency from settings
        $paystackCurrency = $this->paystack->fields['currency'] ?? 'USD';

        // Convert price to Paystack currency if needed
        // Note: This assumes the system currency is USD. Adjust if your system uses a different base currency.
        $systemCurrency = 'USD';
        $convertedPrice = $this->convertCurrency($checkoutItem['finalPrice'], $systemCurrency, $paystackCurrency);

        setTempStore([
            'user_id' => $user->id,
            'properties' => [
                'from' => $request->from,
                'item_type' => $request->item_type,
                'item_id' => $request->item_id,
                'tax_amount' => $checkoutItem['taxAmount'],
                'coupon_code' => $checkoutItem['coupon'] ? $checkoutItem['coupon']->code : null,
                'original_price' => $checkoutItem['finalPrice'], // Store original price for database
            ]
        ]);

        return view('paymentgateways::gateways.paystack', [
            'user' => $user,
            'price' => $convertedPrice, // Use converted price for Paystack
            'paystackPublicKey' => $this->paystackPublicKey,
        ]);
    }

    // Paystack payment callback/verification
    public function verify_transaction(Request $request)
    {
        $user = Auth::user();
        $temp = getTempStore($user->id);

        $from = $temp->properties['from'];
        $item_type = $temp->properties['item_type'];
        $item_id = $temp->properties['item_id'];
        $tax_amount = $temp->properties['tax_amount'];
        $coupon_code = $temp->properties['coupon_code'];
        $original_price = $temp->properties['original_price'];

        try {
            $reference = $request->reference;
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->paystackSecretKey
            ])->get("https://api.paystack.co/transaction/verify/$reference");

            $payment = json_decode($response);

            if ($payment->status == true) {
                // Use original price for consistency in the system
                $this->payment->coursesBuy(
                    'paystack',
                    $item_type,
                    $item_id,
                    $payment->data->id,
                    $tax_amount,
                    $original_price,
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

    /**
     * Convert currency from one to another
     * 
     * @param float $amount
     * @param string $fromCurrency
     * @param string $toCurrency
     * @return float
     */
    private function convertCurrency($amount, $fromCurrency, $toCurrency)
    {
        // If same currency, no conversion needed
        if ($fromCurrency === $toCurrency) {
            return round($amount, 2);
        }

        // Define exchange rates (you can move this to settings or use API)
        $exchangeRates = [
            'USD_TO_ZAR' => 18.50, // 1 USD = 18.50 ZAR (update this regularly)
            'USD_TO_NGN' => 1520.00, // 1 USD = 1520 NGN
            'USD_TO_GHS' => 15.80, // 1 USD = 15.80 GHS
            'USD_TO_KES' => 128.00, // 1 USD = 128 KES
            // Add more rates as needed
        ];

        $rateKey = $fromCurrency . '_TO_' . $toCurrency;

        if (isset($exchangeRates[$rateKey])) {
            return round($amount * $exchangeRates[$rateKey], 2);
        }

        // If no rate found, return original amount
        return round($amount, 2);
    }
}
