<?php

namespace App\Http\Middleware;

use App\Services\SettingsService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SmtpConfigCheck
{
    public function __construct(private SettingsService $settingsService) {}

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check SMTP configuration from config
        if (config('mail.default') === 'smtp') {
            // Check if required SMTP credentials exist in config
            if (
                empty(config('mail.mailers.smtp.host')) ||
                empty(config('mail.mailers.smtp.port')) ||
                empty(config('mail.mailers.smtp.username')) ||
                empty(config('mail.mailers.smtp.password'))
            ) {
                return back()->with('error', 'SMTP configuration is incomplete. Email sending feature is not work right now.');
            }
        } else {
            return back()->with('error', 'SMTP is not set as the mailer. Please check your configuration.');
        }

        return $next($request);
    }
}
