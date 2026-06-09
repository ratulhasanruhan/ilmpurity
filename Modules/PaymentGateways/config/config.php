<?php

return [
    'sslcommerz' => [
        'apiCredentials' => [
            'store_id' => env("SSLCZ_STORE_ID"),
            'store_password' => env("SSLCZ_STORE_PASSWORD"),
        ],
        'apiUrl' => [
            'make_payment' => "/gwprocess/v4/api.php",
            'transaction_status' => "/validator/api/merchantTransIDvalidationAPI.php",
            'order_validate' => "/validator/api/validationserverAPI.php",
            'refund_payment' => "/validator/api/merchantTransIDvalidationAPI.php",
            'refund_status' => "/validator/api/merchantTransIDvalidationAPI.php",
        ],
        'apiDomain' => "https://securepay.sslcommerz.com",
        'connect_from_localhost' => env("IS_LOCALHOST", false), // For Sandbox, use "true", For Live, use "false"
        'success_url' => '/payments/sslcommerz/success',
        'failed_url' => '/payments/sslcommerz/fail',
        'cancel_url' => '/payments/sslcommerz/cancel',
        'ipn_url' => '/payments/sslcommerz/ipn',
    ],
];
