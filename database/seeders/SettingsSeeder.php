<?php

namespace Database\Seeders;

use App\Enums\TeachingType;
use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            [
                'type' => 'system',
                'sub_type' => TeachingType::COLLABORATIVE->value,
                'title' => 'System Settings',
                'fields' => [
                    'name' => 'Appibrium',
                    'title' => 'Appibrium',
                    'keywords' => 'LMS, Learning Management System, Courses, Appibrium',
                    'description' => 'Transform your learning journey with Appibrium - a comprehensive online learning platform developed by Appibrium connecting expert instructors with passionate learners. Discover courses, build skills, and achieve your goals.',
                    'logo_dark' => '/assets/icons/logo-dark.png',
                    'logo_light' => '/assets/icons/logo-light.png',
                    'favicon' => '/favicon.ico',
                    'banner' => '/banner.png',
                    'author' => 'UiLib',
                    'slogan' => 'A course based video CMS',
                    'email' => 'admin@yourdomain.com',
                    'phone' => '+123 45 678 9201',
                    'selling_tax' => 5,
                    'selling_currency' => 'USD',
                    'instructor_revenue' => 70,
                    'global_style' => '',
                    'direction' => 'none',
                    'language_selector' => true,
                    'theme' => 'system',
                ],
            ],
            [
                'type' => 'payment',
                'sub_type' => 'paypal',
                'title' => 'Paypal Settings',
                'fields' => [
                    'active' => false,
                    'test_mode' => true,
                    'currency' => 'USD',
                    'sandbox_client_id' => '',
                    'sandbox_secret_key' => '',
                    'production_client_id' => '',
                    'production_secret_key' => '',
                ],
            ],
            [
                'type' => 'payment',
                'sub_type' => 'stripe',
                'title' => 'Stripe Settings',
                'fields' => [
                    'active' => false,
                    'test_mode' => true,
                    'currency' => 'USD',
                    'test_public_key' => '',
                    'test_secret_key' => '',
                    'live_public_key' => '',
                    'live_secret_key' => '',
                    'webhook_secret' => '',
                ],
            ],
            [
                'type' => 'payment',
                'sub_type' => 'mollie',
                'title' => 'Mollie Settings',
                'fields' => [
                    'active' => false,
                    'test_mode' => true,
                    'currency' => 'USD',
                    'test_api_key' => '',
                    'live_api_key' => '',
                ],
            ],
            [
                'type' => 'payment',
                'sub_type' => 'paystack',
                'title' => 'Paystack Settings',
                'fields' => [
                    'active' => false,
                    'test_mode' => true,
                    'currency' => 'USD',
                    'test_public_key' => '',
                    'test_secret_key' => '',
                    'live_public_key' => '',
                    'live_secret_key' => '',
                ],
            ],
            [
                'type' => 'payment',
                'sub_type' => 'sslcommerz',
                'title' => 'SSLCommerz Settings',
                'fields' => [
                    'active' => false,
                    'test_mode' => true,
                    'currency' => 'BDT',
                    'store_id' => '',
                    'store_password' => '',
                ],
            ],
            [
                'type' => 'payment',
                'sub_type' => 'razorpay',
                'title' => 'Razorpay Settings',
                'fields' => [
                    'active' => false,
                    'test_mode' => true,
                    'currency' => 'INR',
                    'api_key' => '',
                    'api_secret' => '',
                ],
            ],
            [
                'type' => 'smtp',
                'sub_type' => null,
                'title' => 'SMTP Settings',
                'fields' => [
                    'mail_mailer' => 'smtp',
                    'mail_host' => '',
                    'mail_port' => '465',
                    'mail_username' => '',
                    'mail_password' => '',
                    'mail_encryption' => 'ssl',
                    'mail_from_address' => '',
                    'mail_from_name' => 'Appibrium',
                ],
            ],
            [
                'type' => 'auth',
                'sub_type' => 'google',
                'title' => 'Google Auth',
                'fields' => [
                    'active' => false,
                    'client_id' => "",
                    'client_secret' => "",
                    'redirect' => "http://localhost:8000/auth/google/callback",
                ],
            ],
            [
                'type' => 'auth',
                'sub_type' => 'recaptcha',
                'title' => 'Google Recaptcha',
                'fields' => [
                    'active' => false,
                    'site_key' => "",
                    'secret_key' => "",
                ],
            ],
            [
                'type' => 'storage',
                'sub_type' => null,
                'title' => 'Storage Settings',
                'fields' => [
                    'storage_driver' => 'local',
                    'aws_access_key_id' => '',
                    'aws_secret_access_key' => '',
                    'aws_default_region' => 'us-east-1',
                    'aws_bucket' => '',
                    'aws_use_path_style_endpoint' => false,
                ],
            ],
            [
                'type' => 'live_class',
                'sub_type' => null,
                'title' => 'Live Class Settings',
                'fields' => [
                    'zoom_account_email' => '',
                    'zoom_account_id' => '',
                    'zoom_client_id' => '',
                    'zoom_client_secret' => '',
                    'zoom_web_sdk' => false,
                    'zoom_sdk_client_id' => '',
                    'zoom_sdk_client_secret' => '',
                ],
            ],
        ];

        foreach ($settings as $setting) {
            Setting::create($setting);
        };
    }
}
