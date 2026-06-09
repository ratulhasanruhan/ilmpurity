<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePayoutGatewayRequest extends FormRequest
{
   /**
    * Determine if the user is authorized to make this request.
    */
   public function authorize(): bool
   {
      return true;
   }

   /**
    * Get the validation rules that apply to the request.
    */
   public function rules(): array
   {
      // Common rules for all payment gateways
      $rules = [
         'type' => 'required|string|max:255',
         'active' => 'required|boolean',
         'currency' => 'required|string|size:3',
         'test_mode' => 'required|boolean',
      ];

      // Add specific rules based on payment gateway type
      return array_merge($rules, $this->getGatewaySpecificRules());
   }

   /**
    * Get rules specific to a payment gateway type
    */
   private function getGatewaySpecificRules(): array
   {
      $type = request('type');
      return match ($type) {
         'paypal' => $this->paypalRules(),
         'stripe' => $this->stripeRules(),
         'mollie' => $this->mollieRules(),
         'razorpay' => $this->razorpayRules(),
         'paystack' => $this->paystackRules(),
         default => [],
      };
   }

   /**
    * Get validation rules for PayPal
    */
   private function paypalRules(): array
   {
      $rules = [
         'sandbox_client_id' => 'nullable|string|max:255',
         'sandbox_secret_key' => 'nullable|string|max:255',
         'production_client_id' => 'nullable|string|max:255',
         'production_secret_key' => 'nullable|string|max:255',
      ];

      // Make test mode credentials required when test_mode is true
      if (isset($this->test_mode) && request('test_mode')) {
         $rules['sandbox_client_id'] = 'required|string|max:255';
         $rules['sandbox_secret_key'] = 'required|string|max:255';
      }

      // Make production credentials required when test_mode is false
      else {
         $rules['production_client_id'] = 'required|string|max:255';
         $rules['production_secret_key'] = 'required|string|max:255';
      }

      return $rules;
   }

   /**
    * Get validation rules for Stripe
    */
   private function stripeRules(): array
   {
      $rules = [
         'webhook_secret' => 'nullable|string|max:255',
         'test_public_key' => 'nullable|string|max:255',
         'test_secret_key' => 'nullable|string|max:255',
         'live_public_key' => 'nullable|string|max:255',
         'live_secret_key' => 'nullable|string|max:255',
      ];

      // Make test keys required when test_mode is true
      if (isset($this->test_mode) && request('test_mode')) {
         $rules['test_public_key'] = 'required|string|max:255';
         $rules['test_secret_key'] = 'required|string|max:255';
      }

      // Make live keys required when test_mode is false
      else {
         $rules['live_public_key'] = 'required|string|max:255';
         $rules['live_secret_key'] = 'required|string|max:255';
      }

      return $rules;
   }

   /**
    * Get validation rules for Mollie
    */
   private function mollieRules(): array
   {
      return [
         'test_api_key' => 'nullable|string|max:255',
         'live_api_key' => 'nullable|string|max:255',
      ];
   }

   /**
    * Get validation rules for Razorpay
    */
   private function razorpayRules(): array
   {
      return [
         'public_key' => 'required|string|max:255',
         'secret_key' => 'required|string|max:255',
      ];
   }


   /**
    * Get validation rules for Paystack
    */
   private function paystackRules(): array
   {
      $rules = [
         'test_public_key' => 'nullable|string|max:255',
         'test_secret_key' => 'nullable|string|max:255',
         'live_public_key' => 'nullable|string|max:255',
         'live_secret_key' => 'nullable|string|max:255',
      ];

      // Make test keys required when test_mode is true
      if (isset($this->test_mode) && request('test_mode')) {
         $rules['test_public_key'] = 'required|string|max:255';
         $rules['test_secret_key'] = 'required|string|max:255';
      }

      // Make live keys required when test_mode is false
      else {
         $rules['live_public_key'] = 'required|string|max:255';
         $rules['live_secret_key'] = 'required|string|max:255';
      }

      return $rules;
   }



   /**
    * Custom messages for validation errors.
    */
   public function messages(): array
   {
      return [
         'active.required' => 'The active status is required.',
         'active.boolean' => 'The active status must be either true or false.',
         'currency.required' => 'The currency is required.',
         'currency.size' => 'The currency code must be 3 characters.',
         'test_mode.required' => 'The test mode status is required.',
         'test_mode.boolean' => 'The test mode status must be either true or false.',
         'sandbox_client_id.required' => 'The sandbox client ID is required when test mode is enabled.',
         'sandbox_secret_key.required' => 'The sandbox secret key is required when test mode is enabled.',
         'production_client_id.required' => 'The production client ID is required when test mode is disabled.',
         'production_secret_key.required' => 'The production secret key is required when test mode is disabled.',
         'test_public_key.required' => 'The public test key is required when test mode is enabled.',
         'test_secret_key.required' => 'The secret test key is required when test mode is enabled.',
         'live_public_key.required' => 'The public live key is required when test mode is disabled.',
         'live_secret_key.required' => 'The secret live key is required when test mode is disabled.',
         'public_key.required' => 'The public key is required.',
         'secret_key.required' => 'The secret key is required.',
      ];
   }
}
