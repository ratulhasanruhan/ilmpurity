<?php

namespace App\Http\Middleware;

use App\Services\SettingsService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthConfig
{
    public function __construct(private SettingsService $settingsService) {}

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $auth = $this->settingsService->getSetting([
            'type' => 'auth',
            'sub_type' => 'google'
        ])['fields'];

        $recaptcha = $this->settingsService->getSetting([
            'type' => 'auth',
            'sub_type' => 'recaptcha'
        ])['fields'];

        // Google Auth configuration
        config([
            'services.google.status' => $auth['active'],
            'services.google.client_id' => $auth['client_id'],
            'services.google.client_secret' => $auth['client_secret'],
            'services.google.redirect' => $auth['redirect'],
        ]);

        // Recaptcha configuration
        config([
            'captcha.status' => $recaptcha['active'],
            'captcha.secret' => $recaptcha['secret_key'],
            'captcha.sitekey' => $recaptcha['site_key'],
        ]);

        return $next($request);
    }
}
