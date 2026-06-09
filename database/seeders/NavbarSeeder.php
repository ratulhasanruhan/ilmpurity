<?php

namespace Database\Seeders;

use App\Models\Navbar;
use App\Models\NavbarItem;
use Illuminate\Database\Seeder;

class NavbarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create navbar
        $navbar = Navbar::create([
            'active' => true,
            'title' => 'Navbar 1',
            'slug' => 'navbar_1',
        ]);

        // Create navbar items
        $navbarItems = [
            [
                'type' => 'url',
                'slug' => 'courses',
                'title' => 'Courses',
                'value' => '/courses/all',
            ],
            [
                'type' => 'url',
                'slug' => 'exams',
                'title' => 'Exams',
                'value' => '/exams/all',
            ],
            [
                'type' => 'url',
                'slug' => 'about-us',
                'title' => 'About Us',
                'value' => '/about-us',
            ],
            [
                'type' => 'url',
                'slug' => 'our-team',
                'title' => 'Our Team',
                'value' => '/our-team',
            ],
            [
                'type' => 'url',
                'slug' => 'careers',
                'title' => 'Careers',
                'value' => '/careers',
            ],
            [
                'type' => 'url',
                'slug' => 'blogs',
                'title' => 'Blogs',
                'value' => '/blogs/all',
            ],
            [
                'type' => 'action',
                'slug' => 'search',
                'title' => 'Search',
            ],
            [
                'type' => 'action',
                'slug' => 'theme',
                'title' => 'Theme',
            ],
            [
                'type' => 'action',
                'slug' => 'notification',
                'title' => 'Notification',
            ],
            [
                'type' => 'action',
                'slug' => 'cart',
                'title' => 'Cart',
            ],
            [
                'type' => 'action',
                'slug' => 'language',
                'title' => 'Language',
            ],
            [
                'type' => 'action',
                'slug' => 'profile',
                'title' => 'Profile',
            ],
        ];

        foreach ($navbarItems as $itemData) {
            NavbarItem::create([
                'navbar_id' => $navbar->id,
                ...$itemData,
            ]);
        }
    }
}
