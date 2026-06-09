<?php

namespace Modules\PaymentGateways\Http\Middleware;

use App\Services\SettingsService;
use Closure;
use Illuminate\Http\Request;

class SSLConfigMiddleware
{
    private $sslcommerz;

    public function __construct(
        private SettingsService $settingsService,
    ) {
        $this->sslcommerz = $this->settingsService->getSetting(['type' => 'payment', 'sub_type' => 'sslcommerz']);
    }

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $testMode = $this->sslcommerz->fields['test_mode'];
        $apiDomain = $testMode ? "https://sandbox.sslcommerz.com" : "https://securepay.sslcommerz.com";

        config([
            'paymentgateways.sslcommerz.apiCredentials.store_id' => $this->sslcommerz->fields['store_id'],
            'paymentgateways.sslcommerz.apiCredentials.store_password' => $this->sslcommerz->fields['store_password'],
            'paymentgateways.sslcommerz.apiDomain' => $apiDomain,
            'paymentgateways.sslcommerz.connect_from_localhost' => $testMode,
        ]);

        return $next($request);
    }
}
