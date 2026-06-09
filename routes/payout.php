<?php

use App\Http\Controllers\Payout\MollieController;
use App\Http\Controllers\Payout\PaypalController;
use App\Http\Controllers\Payout\PaystackController;
use App\Http\Controllers\Payout\StripeController;
use App\Http\Controllers\PayoutController;
use Illuminate\Support\Facades\Route;

Route::prefix('payouts')->group(function () {
   Route::post('paypal/payment', [PaypalController::class, 'payment'])->name('payouts.paypal.payment');
   Route::get('paypal/success', [PaypalController::class, 'success'])->name('payouts.paypal.success');
   Route::get('paypal/cancel', [PaypalController::class, 'cancel'])->name('payouts.paypal.cancel');

   Route::post('stripe/payment', [StripeController::class, 'payment'])->name('payouts.stripe.payment');
   Route::get('stripe/success', [StripeController::class, 'success'])->name('payouts.stripe.success');
   Route::get('stripe/cancel', [StripeController::class, 'cancel'])->name('payouts.stripe.cancel');

   Route::post('mollie/payment', [MollieController::class, 'payment'])->name('payouts.mollie.payment');
   Route::get('mollie/success', [MollieController::class, 'success'])->name('payouts.mollie.success');

   Route::get('paystack/redirect', [PaystackController::class, 'paystack_redirect'])->name('payouts.paystack.redirect');
   Route::get('paystack/callback', [PaystackController::class, 'verify_transaction'])->name('payouts.paystack.callback');

   Route::get('{slug}/{request_id}', [PayoutController::class, 'checkout'])->name('payouts.gateway.index');
});
