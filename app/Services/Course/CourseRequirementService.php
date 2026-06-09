<?php

namespace App\Services\Course;

use App\Models\Course\CourseRequirement;

class CourseRequirementService
{
   public function createRequirement(array $data)
   {
      return CourseRequirement::create($data);
   }

   public function updateRequirement(array $data, string $id)
   {
      return CourseRequirement::find($id)->update($data);
   }

   public function deleteRequirement(string $id): bool
   {
      return CourseRequirement::find($id)->delete();
   }
}
