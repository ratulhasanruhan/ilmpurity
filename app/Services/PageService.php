<?php

namespace App\Services;

use App\Models\Page;
use App\Models\PageSection;

class PageService extends PageSectionService
{
   private function getIdCollection(Page $page, array $data)
   {
      $idCollection = array_fill_keys($data, []);

      foreach ($page->sections as $section) {
         $slug = $section->slug;
         if (
            in_array($slug, $data)
            && isset($section->properties['contents'])
         ) {
            $idCollection[$slug] = $section->properties['contents'];
         }
      }

      return $idCollection;
   }

   public function getPageById(string $id)
   {
      return Page::where('id', $id)
         ->with(['sections' => function ($query) {
            $query->orderBy('sort', 'asc');
         }])
         ->first();
   }

   public function getCustomPageBySlug(string $slug)
   {
      return Page::where('slug', $slug)
         ->with(['sections' => function ($query) {
            $query->orderBy('sort', 'asc');
         }])
         ->first();
   }

   public function getPageSections(array $data, Page $page)
   {
      $sections = [];
      $collection = [
         'hero',
         'blogs',
         'top_course',
         'top_courses',
         'new_courses',
         'testimonials',
         'top_instructors',
         'top_categories',
         'category_courses'
      ];

      $idCollection = $this->getIdCollection($page, $collection);

      $sections['courses'] = $this->getCourses($data);
      $sections['categories'] = $this->getCategories($data);
      $sections['instructors'] = $this->getInstructors($data);

      $sections['topCourses'] = $this->getTopCourses($idCollection['top_courses']);
      $sections['topCategories'] = $this->getTopCategories($idCollection['top_categories']);
      $sections['blogs'] = $this->getTopBlogs($idCollection['blogs']);

      if ($page->slug === 'home-1' || $page->slug === 'home-2' || $page->slug === 'home-3' || $page->slug === 'our-team') {
         $sections['newCourses'] = $this->getNewCourses($idCollection['new_courses']);
         $sections['topInstructors'] = $this->getTopInstructors($idCollection['top_instructors']);
      }

      if ($page->slug === 'home-3') {
         $limit = null;
         $section = $page->sections->where('slug', 'category_courses')->first();
         $limit = $section->properties['content_limit'];

         $sections['categoryTopCourses'] = $this->getCategoryTopCourses($idCollection['category_courses'], $limit);
      }

      if ($page->slug === 'home-4' || $page->slug === 'home-5') {
         $sections['instructor'] = $this->getFirstInstructor();

         if ($page->slug === 'home-5') {
            $sections['heroCourses'] = $this->getHeroCourses($idCollection['hero']);
         }

         $sections['topCourse'] = $this->getSingleCourse($idCollection['top_course'][0]);
      }

      return $sections;
   }

   public function updatePageSection(string $id, array $data)
   {
      $section = PageSection::where('id', $id)->first();

      // Process main thumbnail if exists
      if (array_key_exists('thumbnail', $data) && $data['thumbnail']) {
         $data['thumbnail'] = $this->addNewDeletePrev($section, $data['thumbnail'], 'thumbnail');
      }

      if (array_key_exists('background_image', $data) && $data['background_image']) {
         $data['background_image'] = $this->addNewDeletePrev($section, $data['background_image'], 'background_image');
      }

      // Process images inside properties->array if they exist
      if (isset($data['properties']) && isset($data['properties']['array']) && is_array($data['properties']['array'])) {
         foreach ($data['properties']['array'] as $key => $item) {
            if ($key === 0) {
               foreach ($item as $propKey => $value) {
                  if ($value === null) {
                     $data['properties']['array'][$key][$propKey] = "";
                  }
               }
            }

            if (array_key_exists('new_image', $item) && $item['new_image']) {
               // Create a unique field name for each image
               $imageField = 'properties_array_' . $key . '_image';
               $imageUrl = $this->addNewDeletePrev($section, $item['new_image'], $imageField);
               $data['properties']['array'][$key]['image'] = $imageUrl;
            }

            unset($data['properties']['array'][$key]['new_image']);
         }
      }

      // Remove null values from the data array recursively
      $dataNew = $this->removeImageNullProperties($data);
      foreach ($dataNew as $key => $value) {
         $section[$key] = $value;
      }
      $section->save();

      return $section;
   }

   public function sortPageSections(array $sortedData): bool
   {
      foreach ($sortedData as $value) {
         PageSection::where('id', $value['id'])
            ->update(['sort' => $value['sort']]);
      }

      return true;
   }

   private function removeImageNullProperties(array $array): array
   {
      // Define image-related properties that can have null values
      $imageProperties = ['thumbnail', 'background_image', 'image', 'avatar', 'logo', 'photo'];

      // Filter out null values at current level except for specific image properties
      $array = array_filter($array, function ($value, $key) use ($imageProperties) {
         // Keep null values for image-related properties
         if (in_array($key, $imageProperties)) {
            return $value !== null;
         }

         // Remove null values for other properties
         return true;
      }, ARRAY_FILTER_USE_BOTH);

      // // Then recursively filter nested arrays
      // foreach ($array as $key => $value) {
      //    if (is_array($value)) {
      //       $array[$key] = $this->removeImageNullProperties($value);

      //       // // Remove empty arrays after processing
      //       // if (empty($array[$key])) {
      //       //    unset($array[$key]);
      //       // }
      //    }
      // }

      return $array;
   }
}
