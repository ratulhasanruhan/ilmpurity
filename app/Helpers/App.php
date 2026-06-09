<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

function isDBConnected(): bool
{
   try {
      DB::connection()->getPdo();
      return true;
   } catch (\Exception $e) {
      return false;
   }
}

function setSmtpConfig(array $config)
{
   config([
      'mail.default' => $config['mail_mailer'] ?? 'smtp',
      'mail.mailers.smtp.host' => $config['mail_host'] ?? '',
      'mail.mailers.smtp.port' => $config['mail_port'] ?? '',
      'mail.mailers.smtp.encryption' => $config['mail_encryption'] ?? '',
      'mail.mailers.smtp.username' => $config['mail_username'] ?? null,
      'mail.mailers.smtp.password' => $config['mail_password'] ?? null,
      'mail.from.address' => $config['mail_from_address'],
      'mail.from.name' => $config['mail_from_name'] ?? 'System',
   ]);
}

function testSmtpConnection(array $config)
{
   // Basic validation
   if (empty($config['mail_from_address']) || !filter_var($config['mail_from_address'], FILTER_VALIDATE_EMAIL)) {
      throw new \Exception('A valid from email address is required');
   }

   // Set mail config temporarily
   $previousConfig = config('mail');

   // Configure mail with test settings
   setSmtpConfig($config);

   // Send a test email to the admin email
   $subject = 'SMTP Test Email';
   $body = 'This is a test email to verify your SMTP settings. If you received this email, your SMTP configuration is working correctly.';
   $recipient = $config['mail_from_address'];

   Mail::raw($body, function ($message) use ($recipient, $subject) {
      $message->to($recipient)->subject($subject);
   });

   // Reset config
   config(['mail' => $previousConfig]);

   return true;
}

function setPaypalConfig(array $config, string $mode = 'sandbox')
{
   config(['paypal.mode' => $mode]); // Can only be 'sandbox' Or 'live'. If empty or invalid, 'live' will be used.
   config(['paypal.sandbox.client_id' => $config['sandbox_client_id']]);
   config(['paypal.sandbox.client_secret' => $config['sandbox_secret_key']]);
   config(['paypal.live.client_id' => $config['production_client_id']]);
   config(['paypal.live.client_secret' => $config['production_secret_key']]);

   $config = [
      'mode'    => $mode, // Can only be 'sandbox' Or 'live'. If empty or invalid, 'live' will be used.
      'sandbox' => [
         'client_id'     => $config['sandbox_client_id'],
         'client_secret' => $config['sandbox_secret_key'],
         'app_id'        => 'APP-80W284485P519543T',
      ],
      'live' => [
         'client_id'     => $config['production_client_id'],
         'client_secret' => $config['production_secret_key'],
         'app_id'        => '',
      ],
      'payment_action' => 'Sale', // Can only be 'Sale', 'Authorization' or 'Order'
      'currency'       => 'USD',
      'notify_url'     => '', // Change this accordingly for your application.
      'locale'         => 'en_US', // force gateway language  i.e. it_IT, es_ES, en_US ... (for express checkout only)
      'validate_ssl'   => true, // Validate SSL when creating api client.
   ];

   return $config;
}

function apiResponse(array $data = [], array $flash = [], int $status = 200)
{
   return response()->json([
      'data' => $data,
      'flash' => $flash,
   ], $status);
}
