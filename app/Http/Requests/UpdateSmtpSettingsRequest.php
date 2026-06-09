<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSmtpSettingsRequest extends FormRequest
{
   /**
    * Determine if the user is authorized to make this request.
    */
   public function authorize(): bool
   {
      // Authorization will be handled by the middleware in the routes
      return true;
   }

   /**
    * Get the validation rules that apply to the request.
    *
    * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
    */
   public function rules(): array
   {
      return [
         'mail_mailer' => 'required|string|in:smtp,sendmail,mailgun,ses,postmark,log,array',
         'mail_host' => 'required|string|max:255',
         'mail_port' => 'required|numeric|between:1,65535',
         'mail_username' => 'nullable|string|max:255',
         'mail_password' => 'nullable|string',
         'mail_encryption' => 'nullable|in:tls,ssl,',
         'mail_from_address' => 'required|email|max:255',
         'mail_from_name' => 'required|string|max:255',
      ];
   }

   /**
    * Get custom messages for validator errors.
    *
    * @return array<string, string>
    */
   public function messages(): array
   {
      return [
         'mail_mailer.required' => 'Mail driver is required',
         'mail_mailer.in' => 'Selected mail driver is invalid',
         'mail_host.required' => 'SMTP host is required',
         'mail_port.required' => 'SMTP port is required',
         'mail_port.numeric' => 'SMTP port must be a number',
         'mail_port.between' => 'SMTP port must be between 1 and 65535',
         'mail_encryption.in' => 'Encryption type must be TLS, SSL, or none',
         'mail_from_address.required' => 'From address is required',
         'mail_from_address.email' => 'From address must be a valid email',
         'mail_from_name.required' => 'From name is required',
      ];
   }
}
