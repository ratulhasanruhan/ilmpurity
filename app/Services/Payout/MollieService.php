<?php

namespace App\Services\Payout;

use Mollie\Laravel\Facades\Mollie;
use App\Services\Course\CourseCartService;
use App\Services\Course\CourseCouponService;
use Illuminate\Support\Facades\Auth;

class MollieService extends PayoutService
{
	private $user;
	private $mollie;
	private $mollieSecret;

	public function __construct(
		private CourseCouponService $couponService,
		private CourseCartService $cartService,
		private PayoutService $payoutService,
	) {
		$this->user = Auth::user();
		$this->mollie = $this->payoutService->getPayoutGateway($this->user->instructor_id, 'mollie');
		$this->mollieSecret = $this->mollie['fields']['test_mode'] ? $this->mollie['fields']['test_api_key'] : $this->mollie['fields']['live_api_key'];
	}

	public function paymentProcessingStart(string $couponCode): ?string
	{
		$cart = $this->cartService->getCartItems($this->user->id);
		$coupon = $this->couponService->getCoupon($couponCode);
		$calculatedCart = $this->cartService->calculateCart($cart, $coupon);

		Mollie::api()->setApiKey($this->mollieSecret);
		$payment = Mollie::api()->payments->create([
			"amount" => [
				"currency" => $this->mollie['fields']['currency'],
				"value" =>  number_format($calculatedCart['totalPrice'], 2, '.', '') // You must send the correct number of decimals, thus we enforce the use of strings
			],
			"description" => "Order #12345",
			"redirectUrl" => route('payments.mollie.success'),
			// "webhookUrl" => route('webhooks.mollie'),
			"metadata" => [
				"order_id" => "12345",
			],
		]);

		session()->put('mollie_id', $payment->id);
		session()->put('taxAmount', $calculatedCart['taxAmount']);
		session()->put('couponCode', $coupon ? $coupon->code : null);

		if ($payment->getCheckoutUrl()) {
			return $payment->getCheckoutUrl();
		}

		return null;
	}

	public function paymentProcessingEnd(): bool
	{
		$mollie_id = session()->get('mollie_id');
		$taxAmount = session()->get('taxAmount');
		$couponCode = session()->get('couponCode');

		Mollie::api()->setApiKey($this->mollieSecret);
		$payment = Mollie::api()->payments->get($mollie_id);

		if ($payment->isPaid()) {
			// $this->coursesBuy('mollie', $payment->id, $taxAmount, $payment->amount->value, $couponCode);

			return true;
		} else {
			return false;
		}
	}
}
