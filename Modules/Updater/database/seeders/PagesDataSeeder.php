<?php

namespace Modules\Updater\Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Page;
use App\Models\PageSection;
use App\Models\Navbar;
use App\Models\NavbarItem;

class PagesDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $aboutUsArray = [
            'hero' => [
                'flags' => [
                    'title' => true,
                ]
            ],
            'success_statistics' => [
                'flags' => [
                    'title' => true,
                    'description' => true,
                ]
            ],
            'team' => [
                'flags' => [
                    'title' => true,
                    'description' => true,
                ]
            ],
            'call_to_action' => [
                'flags' => [
                    'title' => true,
                    'sub_title' => true,
                    'description' => true,
                ]
            ],
        ];

        $ourTeamArray = [
            'top_instructors' => [
                'flags' => [
                    'title' => true,
                    'description' => true,
                ]
            ],
            'partners' => [
                'flags' => [
                    'title' => true,
                ]
            ]
        ];

        $aboutUs = Page::where('type', 'inner_page')
            ->where('slug', 'about-us')
            ->with(['sections:id,page_id,slug'])
            ->first();

        $ourTeam = Page::where('type', 'inner_page')
            ->where('slug', 'our-team')
            ->with(['sections:id,page_id,slug'])
            ->first();

        foreach ($aboutUs->sections as $section) {
            if (isset($aboutUsArray[$section->slug]['flags'])) {
                $sectionModel = PageSection::find($section->id);
                $sectionModel->flags = $aboutUsArray[$section->slug]['flags'];
                $sectionModel->save();
            }
        }

        foreach ($ourTeam->sections as $section) {
            if (isset($ourTeamArray[$section->slug]['flags'])) {
                $sectionModel = PageSection::find($section->id);
                $sectionModel->flags = $ourTeamArray[$section->slug]['flags'];
                $sectionModel->save();
            }
        }

        // Create navbar item (existing functionality)
        $navbar = Navbar::where('slug', 'navbar_1')->first();
        if ($navbar) {
            NavbarItem::firstOrCreate(
                ['slug' => 'exams'],
                [
                    'navbar_id' => $navbar->id,
                    'type' => 'url',
                    'title' => 'Exams',
                    'value' => '/exams/all',
                ]
            );
            NavbarItem::firstOrCreate(
                ['slug' => 'blogs'],
                [
                    'navbar_id' => $navbar->id,
                    'type' => 'url',
                    'title' => 'Blogs',
                    'value' => '/blogs/all',
                ]
            );
            NavbarItem::firstOrCreate(
                ['slug' => 'cart'],
                [
                    'navbar_id' => $navbar->id,
                    'type' => 'action',
                    'title' => 'Cart',
                ]
            );
            NavbarItem::firstOrCreate(
                ['slug' => 'language'],
                [
                    'navbar_id' => $navbar->id,
                    'type' => 'action',
                    'title' => 'Language',
                ]
            );
        }

        // Add blog section into home-4 and home-5
        $home4 = Page::where('slug', 'home-4')->first();
        if ($home4) {
            PageSection::firstOrCreate(
                ['page_id' => $home4->id, 'slug' => 'blogs'],
                [
                    'page_id' => $home4->id,
                    'name' => 'Blogs',
                    'slug' => 'blogs',
                    'title' => 'Best Rated Posts',
                    'description' => 'These are the most popular courses among listen courses learners worldwide',
                    'flags' => [
                        'title' => true,
                        'description' => true,
                    ],
                    'properties' => [
                        'contents' => [1, 2, 3, 4, 5, 6] // Example blog post IDs
                    ],
                ]
            );
        }

        $home5 = Page::where('slug', 'home-5')->first();
        if ($home5) {
            PageSection::firstOrCreate(
                ['page_id' => $home5->id, 'slug' => 'blogs'],
                [
                    'page_id' => $home5->id,
                    'name' => 'Blogs',
                    'slug' => 'blogs',
                    'title' => 'Blogs',
                    'sub_title' => 'Best Rated Posts',
                    'description' => 'These are the most popular courses among listen courses learners worldwide',
                    'flags' => [
                        'title' => true,
                        'sub_title' => true,
                        'description' => true,
                    ],
                    'properties' => [
                        'contents' => [1, 2, 3, 4, 5, 6] // Example blog post IDs
                    ],
                ]
            );
        }

        // Updating pages sections data
        $sections = require base_path('Modules/Updater/database/data/intro-section.php');
        $pageSections = PageSection::with(['page:id,slug'])
            // ->whereJsonContains('properties', ['array' => []])
            ->get();

        // Process each page section
        foreach ($pageSections as $pageSection) {
            // Skip if page relationship is not loaded or invalid
            if (!isset($pageSection->page, $pageSection->page->slug)) {
                continue;
            }

            $pageSlug = $pageSection->page->slug;
            $sectionSlug = $pageSection->slug;
            $properties = $pageSection->properties ?? [];
            $existingArray = $properties['array'] ?? [];

            // Find and process matching section
            $matchingSection = collect($sections)->first(function ($section) use ($pageSlug, $sectionSlug) {
                return isset($section['pages'][$pageSlug]) &&
                    in_array($sectionSlug, (array) $section['pages'][$pageSlug], true);
            });

            // Update properties if matching section is found
            if ($matchingSection && isset($matchingSection['array'])) {
                $newArray = $matchingSection['array'];

                // Check if the new array already exists in the existing array
                $arrayExists = collect($existingArray)->contains(function ($item) use ($newArray) {
                    // Deep comparison of arrays
                    return $item == $newArray;
                });

                // Only merge if the array doesn't exist
                if (!$arrayExists) {
                    $pageSection->properties = array_merge($properties, [
                        'array' => array_merge(
                            [$newArray],  // Add the new array as first element
                            $existingArray
                        )
                    ]);
                    $pageSection->save();
                }
            }
        }
    }
}
