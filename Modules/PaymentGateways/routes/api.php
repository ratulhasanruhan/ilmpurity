<?php

use Illuminate\Support\Facades\Route;
use Modules\PaymentGateways\Http\Controllers\PaymentGatewaysController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('paymentgateways', PaymentGatewaysController::class)->names('paymentgateways');
});
