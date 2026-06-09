<?php

namespace App\Http\Middleware;

use App\Services\SettingsService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SmtpConfig
{
    public function __construct(private SettingsService $settingsService) {}

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $smtp = $this->settingsService->getSetting(['type' => 'smtp'])['fields'];

        // SMTP configuration
        config([
            'mail.default' => $smtp['mail_mailer'],
            'mail.mailers.smtp.host' => $smtp['mail_host'],
            'mail.mailers.smtp.port' => intval($smtp['mail_port']),
            'mail.mailers.smtp.encryption' => $smtp['mail_encryption'],
            'mail.mailers.smtp.username' => $smtp['mail_username'],
            'mail.mailers.smtp.password' => $smtp['mail_password'],
            'mail.mailers.smtp.timeout' => null,
            // 'mail.mailers.smtp.local_domain' => $_SERVER['SERVER_NAME'],
            'mail.from.name' => $smtp['mail_from_name'],
            'mail.from.address' => $smtp['mail_from_address'],
        ]);

        return $next($request);
    }
}
