<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
   /**
    * Run the migrations.
    */
   public function up(): void
   {
      Schema::create('payment_settings', function (Blueprint $table) {
         $table->id();
         $table->string('type')->unique()->comment('paypal, stripe, razorpay, paytm, paystack, etc.');
         $table->string('name');
         $table->text('description')->nullable();
         $table->json('fields')->nullable();
         $table->timestamps();
      });

      // Insert default payment settings
      // $this->seedDefaultSettings();
   }

   /**
    * Reverse the migrations.
    */
   public function down(): void
   {
      Schema::dropIfExists('payment_settings');
   }

   /**
    * Seed default payment settings
    */
   // private function seedDefaultSettings(): void
   // {
   //    $paymentGateways = [
   //       [
   //          'type' => 'paypal',
   //          'name' => 'PayPal',
   //          'description' => 'Pay online with PayPal payment gateway',
   //          'fields' => [
   //             'active' => false,
   //             'currency' => 'USD',
   //             'test_mode' => true,
   //             'sandbox_client_id' => '',
   //             'sandbox_secret_key' => '',
   //             'production_client_id' => '',
   //             'production_secret_key' => ''
   //          ],
   //       ],
   //       [
   //          'type' => 'stripe',
   //          'name' => 'Stripe',
   //          'description' => 'Pay online with Stripe payment gateway',
   //          'fields' => [
   //             'active' => false,
   //             'currency' => 'USD',
   //             'test_mode' => true,
   //             'webhook_secret' => '',
   //             'public_live_key' => '',
   //             'public_test_key' => '',
   //             'secret_live_key' => '',
   //             'secret_test_key' => ''
   //          ],
   //       ],
   //       [
   //          'type' => 'razorpay',
   //          'name' => 'Razorpay',
   //          'description' => 'Pay online with Razorpay payment gateway',
   //          'fields' => [
   //             'active' => false,
   //             'currency' => 'USD',
   //             'test_mode' => true,
   //             'public_key' => '',
   //             'secret_key' => ''
   //          ],
   //       ],
   //       [
   //          'type' => 'paytm',
   //          'name' => 'Paytm',
   //          'description' => 'Pay online with Paytm payment gateway',
   //          'fields' => [
   //             'active' => false,
   //             'currency' => 'USD',
   //             'test_mode' => true,
   //             'public_key' => '',
   //             'secret_key' => ''
   //          ],
   //       ],
   //       [
   //          'type' => 'paystack',
   //          'name' => 'Paystack',
   //          'description' => 'Pay online with Paystack payment gateway',
   //          'fields' => [
   //             'active' => false,
   //             'currency' => 'USD',
   //             'test_mode' => true,
   //             'public_live_key' => '',
   //             'public_test_key' => '',
   //             'secret_live_key' => '',
   //             'secret_test_key' => ''
   //          ],
   //       ],
   //    ];

   //    foreach ($paymentGateways as $gateway) {
   //       DB::table('payment_settings')->insert([
   //          'type' => $gateway['type'],
   //          'name' => $gateway['name'],
   //          'description' => $gateway['description'],
   //          'fields' => json_encode($gateway['fields']),
   //          'created_at' => now(),
   //          'updated_at' => now(),
   //       ]);
   //    }
   // }
};
