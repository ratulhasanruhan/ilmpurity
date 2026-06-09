<?php

namespace App\Http\Controllers\Payout;

use App\Http\Controllers\Controller;
use App\Services\Payout\PayoutService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class PaystackController extends Controller
{
    public function __construct(
        private PayoutService $payoutService
    ) {}

    public function paystack_redirect(Request $request)
    {
        $payout = $this->payoutService->getPayoutRequest($request->request_id);
        $paystack = $this->payoutService->getPayoutGateway($payout->user->instructor_id, 'paystack');
        $paystackPublicKey = $paystack['fields']['test_mode'] ? $paystack['fields']['test_public_key'] : $paystack['fields']['live_public_key'];

        // Convert USD to Paystack currency (ZAR)
        $convertedAmount = $this->convertCurrency($payout->amount, 'USD', 'ZAR');

        session()->put('slug', $request->slug);
        session()->put('request_id', $request->request_id);

        return view('payout.gateway.paystack-redirect', [
            'user' => Auth::user(),
            'price' => number_format($convertedAmount, 2, '.', ''), // Use converted ZAR amount
            'paystackPublicKey' => $paystackPublicKey,
        ]);
    }


    public function verify_transaction(Request $request)
    {
        $slug = session()->get('slug');
        $request_id = session()->get('request_id');

        $payout = $this->payoutService->getPayoutRequest($request_id);
        $paystack = $this->payoutService->getPayoutGateway($payout->user->instructor_id, 'paystack');
        $paystackSecretKey = $paystack['fields']['test_mode'] ? $paystack['fields']['test_secret_key'] : $paystack['fields']['live_secret_key'];

        try {
            $reference = $request->reference;
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $paystackSecretKey
            ])->get("https://api.paystack.co/transaction/verify/$reference");

            $payment = json_decode($response);

            if ($payment->status == true) {
                // Complete payout with original USD amount for system consistency
                $this->payoutService->completePayoutRequest($request_id, $payment->data->id, 'paystack');

                // Clear session data
                session()->forget(['request_id']);

                if ($slug == 'api') {
                    return redirect()->to(env('FRONTEND_URL') . '/student');
                } else {
                    return redirect()->route('payouts.request.index')->with('success', 'Congratulation! payout have completed');
                }
            } else {
                return redirect()
                    ->route('payouts.request.index')
                    ->with('error', 'Your payment have failed, please try again later.');
            }
        } catch (\Throwable $th) {
            return redirect()
                ->route('payouts.request.index')
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

        // Try API conversion first (uncomment to use live rates)
        // $convertedAmount = $this->convertCurrencyWithAPI($amount, $fromCurrency, $toCurrency);
        // if ($convertedAmount !== null) {
        //     return $convertedAmount;
        // }

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
