<?php

namespace Database\Seeders;

use App\Models\Footer;
use App\Models\FooterItem;
use Illuminate\Database\Seeder;

class FooterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create footer
        $footer = Footer::create([
            'active' => true,
            'slug' => 'footer_1',
            'title' => 'Footer 1',
        ]);

        // Create footer items
        $footerItems = [
            [
                'type' => 'list',
                'slug' => 'company',
                'title' => 'Company',
                'items' => [
                    ['title' => 'About Us', 'url' => '/about-us'],
                    ['title' => 'Our Team', 'url' => '/our-team'],
                    ['title' => 'Careers', 'url' => '/careers'],
                    ['title' => 'Contact Us', 'url' => '/contact-us'],
                ],
            ],
            [
                'type' => 'list',
                'slug' => 'legal_policies',
                'title' => 'Legal & Policies',
                'items' => [
                    ['title' => 'Cookie Policy', 'url' => '/cookie-policy'],
                    ['title' => 'Terms & Conditions', 'url' => '/terms-and-conditions'],
                    ['title' => 'Privacy Policy', 'url' => '/privacy-policy'],
                    ['title' => 'Refund Policy', 'url' => '/refund-policy'],
                ],
            ],
            [
                'type' => 'list',
                'slug' => 'address',
                'title' => 'Address',
                'items' => [
                    ['title' => 'Corner view Subudbazar, Sylhet, Bangladesh.'],
                    ['title' => 'Email: uilib@gmail.com'],
                    ['title' => 'Phone: +880 1123 456 780'],
                ],
            ],
            [
                'type' => 'social_media',
                'slug' => 'social_media',
                'title' => 'Social Media',
                'items' => [
                    ['title' => 'Facebook', 'url' => 'https://www.facebook.com/', 'icon' => 'facebook'],
                    ['title' => 'Twitter', 'url' => 'https://www.twitter.com/', 'icon' => 'twitter'],
                    ['title' => 'Instagram', 'url' => 'https://www.instagram.com/', 'icon' => 'instagram'],
                    ['title' => 'LinkedIn', 'url' => 'https://www.linkedin.com/', 'icon' => 'linkedin'],
                ],
            ],
            [
                'type' => 'payment_methods',
                'slug' => 'payment_methods',
                'title' => 'We support multiple payment gateways.',
                'items' => [
                    ['image' => '/assets/payment/stripe.png'],
                    ['image' => '/assets/payment/paypal.png'],
                    ['image' => '/assets/payment/mollie.png'],
                    ['image' => '/assets/payment/paystack.png'],
                ],
            ],
            [
                'type' => 'copyright',
                'slug' => 'copyright',
                'title' => '© Copyright 2025 UI Lib, All rights reserved.',
                'items' => [],
            ],
        ];

        foreach ($footerItems as $itemData) {
            FooterItem::create([
                'footer_id' => $footer->id,
                ...$itemData,
            ]);
        }
    }
}
