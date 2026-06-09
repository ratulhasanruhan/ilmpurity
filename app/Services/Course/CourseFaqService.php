<?php

namespace App\Services\Course;

use App\Models\Course\CourseFaq;

class CourseFaqService
{
   public function createFaq(array $data)
   {
      return CourseFaq::create($data);
   }

   public function updateFaq(array $data, string $id)
   {
      return CourseFaq::find($id)->update($data);
   }

   public function deleteFaq(string $id): bool
   {
      return CourseFaq::find($id)->delete();
   }
}
