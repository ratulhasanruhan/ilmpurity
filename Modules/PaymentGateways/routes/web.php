<?php

use Illuminate\Support\Facades\Route;
use Modules\PaymentGateways\Http\Controllers\RazorpayController;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Modules\PaymentGateways\Http\Controllers\MollieController;
use Modules\PaymentGateways\Http\Controllers\PaymentController;
use Modules\PaymentGateways\Http\Controllers\PaypalController;
use Modules\PaymentGateways\Http\Controllers\PaystackController;
use Modules\PaymentGateways\Http\Controllers\SslCommerzController;
use Modules\PaymentGateways\Http\Controllers\StripeController;
use Modules\PaymentGateways\Http\Middleware\SSLConfigMiddleware;

Route::middleware(['auth', 'verified'])->prefix('payments')->group(function () {
    Route::get('{from}/{item}/{id}', [PaymentController::class, 'index'])->name('payments.index');

    Route::post('paypal/payment', [PaypalController::class, 'payment'])->name('payments.paypal.payment');
    Route::get('paypal/success', [PaypalController::class, 'success'])->name('payments.paypal.success');
    Route::get('paypal/cancel', [PaypalController::class, 'cancel'])->name('payments.paypal.cancel');

    Route::post('stripe/payment', [StripeController::class, 'payment'])->name('payments.stripe.payment');
    Route::get('stripe/success', [StripeController::class, 'success'])->name('payments.stripe.success');
    Route::get('stripe/cancel', [StripeController::class, 'cancel'])->name('payments.stripe.cancel');

    Route::post('mollie/payment', [MollieController::class, 'payment'])->name('payments.mollie.payment');
    Route::get('mollie/success', [MollieController::class, 'success'])->name('payments.mollie.success');

    Route::get('paystack/redirect', [PaystackController::class, 'paystack_redirect'])->name('payments.paystack.redirect');
    Route::get('paystack/callback', [PaystackController::class, 'verify_transaction'])->name('payments.paystack.callback');

    Route::post('razorpay/redirect', [RazorpayController::class, 'index'])->name('razorpay.redirect');
    Route::post('razorpay/payment', [RazorpayController::class, 'payment'])->name('razorpay.payment');
});

Route::withoutMiddleware([VerifyCsrfToken::class])->middleware([SSLConfigMiddleware::class])->prefix('payments/sslcommerz')->group(function () {
    Route::post('/payment', [SslCommerzController::class, 'index'])->name('sslcommerz.payment');

    Route::post('/success', [SslCommerzController::class, 'success']);
    Route::post('/fail', [SslCommerzController::class, 'fail']);
    Route::post('/cancel', [SslCommerzController::class, 'cancel']);

    Route::post('/ipn', [SslCommerzController::class, 'ipn']);
});
