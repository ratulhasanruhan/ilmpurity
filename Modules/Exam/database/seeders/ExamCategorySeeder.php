<?php

namespace Modules\Exam\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Exam\Models\ExamCategory;

class ExamCategorySeeder extends Seeder
{
   /**
    * Run the database seeds.
    */
   public function run(): void
   {
      $categories = [
         [
            'title' => 'Default',
            'icon' => 'recycle',
         ],
      ];

      foreach ($categories as $category) {
         ExamCategory::create($category);
      }
   }
}
