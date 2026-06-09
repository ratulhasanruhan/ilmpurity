<?php

namespace Database\Seeders;

use App\Models\Page;
use App\Models\PageSection;
use App\Models\Setting;
use Database\Data\PageData;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;

class PageSeeder extends Seeder
{
   /**
    * Run the database seeds.
    */
   public function run(): void
   {
      // Get page data from organized data class
      $pagesData = PageData::getAllPages();

      // First create the page
      foreach ($pagesData as $pageData) {
         $page = Page::create(Arr::except($pageData, ['sections']));

         // Then create all sections for this page
         foreach ($pageData['sections'] as $section) {
            // Add the page ID to each section
            $section['page_id'] = $page->id;

            // Create the section
            PageSection::create($section);
         }
      }

      // Set default home page
      $page = Page::where('slug', 'home-1')->first();

      Setting::create([
         'type' => 'home_page',
         'sub_type' => null,
         'title' => 'Select Home Page',
         'fields' => [
            'page_id' => $page->id,
            'page_name' => $page->name,
            'page_slug' => $page->slug,
         ],
      ]);
   }
}
