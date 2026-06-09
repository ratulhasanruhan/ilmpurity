<?php

namespace App\Services\Payout;

use App\Services\SettingsService;
use Illuminate\Support\Facades\Http;
use App\Services\Course\CourseCartService;
use App\Services\Course\CourseCouponService;
use Illuminate\Support\Facades\Auth;

class PaystackService extends PayoutService
{
	private $paystack;
	private $paystackPublicKey;
	private $paystackSecretKey;

	public function __construct(
		private CourseCartService $cartService,
		private SettingsService $settingsService,
		private CourseCouponService $couponService,
	) {
		$this->paystack = $this->settingsService->getSetting(['type' => 'payment', 'sub_type' => 'paystack']);
		$this->paystackPublicKey = $this->paystack->fields['test_mode'] ? $this->paystack->fields['test_public_key'] : $this->paystack->fields['live_public_key'];
		$this->paystackSecretKey = $this->paystack->fields['test_mode'] ? $this->paystack->fields['test_secret_key'] : $this->paystack->fields['live_secret_key'];
	}

	public function paymentProcessingStart(string $couponCode): array
	{
		$coupon = $this->couponService->getCoupon($couponCode);
		$cart = $this->cartService->getCartItems(Auth::user()->id);
		$calculatedCart = $this->cartService->calculateCart($cart, $coupon);

		session()->put('taxAmount', $calculatedCart['taxAmount']);
		session()->put('couponCode', $coupon ? $coupon->code : null);

		return [
			'price' => $calculatedCart['totalPrice'],
			'paystackPublicKey' => $this->paystackPublicKey,
		];
	}

	public function paymentProcessingEnd(string $reference): bool
	{
		$taxAmount = session()->get('taxAmount');
		$couponCode = session()->get('couponCode');

		$response = Http::withHeaders([
			'Authorization' => 'Bearer ' . $this->paystackSecretKey
		])->get("https://api.paystack.co/transaction/verify/$reference");

		$payment = json_decode($response);

		if ($payment->status == true) {
			// $this->coursesBuy('paystack', $payment->data->id, $taxAmount, ($payment->data->amount / 100), $couponCode);

			return true;
		} else {
			return false;
		}
	}
}
