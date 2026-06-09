<?php

return [
    'status' => env('NOCAPTCHA_STATUS', false),
    'secret' => env('NOCAPTCHA_SECRET', ""),
    'sitekey' => env('NOCAPTCHA_SITEKEY', ""),
    'options' => [
        'timeout' => 30,
    ],
];
