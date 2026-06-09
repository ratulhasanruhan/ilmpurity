<?php

namespace App\Http\Controllers\Payout;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\Payout\PayoutService;
use Mollie\Laravel\Facades\Mollie;


class MollieController extends Controller
{
    public function __construct(
        private PayoutService $payoutService
    ) {}

    public function payment(Request $request)
    {
        $payout = $this->payoutService->getPayoutRequest($request->request_id);
        $mollie = $this->payoutService->getPayoutGateway($payout->user->instructor_id, 'mollie');
        $mollieSecret = $mollie['fields']['test_mode'] ? $mollie['fields']['test_api_key'] : $mollie['fields']['live_api_key'];

        Mollie::api()->setApiKey($mollieSecret);
        $payment = Mollie::api()->payments->create([
            "amount" => [
                "currency" => $mollie['fields']['currency'],
                "value" => number_format($payout->amount, 2, '.', '')
            ],
            "description" => "Payout Request #" . $request->request_id,
            "redirectUrl" => route('payouts.mollie.success'),
            // "webhookUrl" => route('webhooks.mollie'),
            "metadata" => [
                "order_id" => $request->request_id,
            ],
        ]);

        session()->put('slug', $request->slug);
        session()->put('mollie_id', $payment->id);
        session()->put('request_id', $request->request_id);

        // redirect customer to Mollie checkout page
        return redirect($payment->getCheckoutUrl(), 303);
    }

    public function success(Request $request)
    {
        $slug = session()->get('slug');
        $mollie_id = session()->get('mollie_id');
        $request_id = session()->get('request_id');

        $payout = $this->payoutService->getPayoutRequest($request_id);
        $mollie = $this->payoutService->getPayoutGateway($payout->user->instructor_id, 'mollie');
        $mollieSecret = $mollie['fields']['test_mode'] ? $mollie['fields']['test_api_key'] : $mollie['fields']['live_api_key'];

        try {
            Mollie::api()->setApiKey($mollieSecret);
            $payment = Mollie::api()->payments->get($mollie_id);

            if ($payment->isPaid()) {
                $this->payoutService->completePayoutRequest($request_id, $payment->id, 'mollie');

                if ($slug == 'api') {
                    return redirect()->to(env('FRONTEND_URL') . '/student');
                } else {
                    return redirect()
                        ->route('payouts.request.index')
                        ->with('success', 'Congratulation! payout have completed');
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
}
