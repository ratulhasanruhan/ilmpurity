<?php

namespace App\Services\Course;

use App\Models\Course\CourseOutcome;

class CourseOutcomeService
{
   public function createOutcome(array $data)
   {
      return CourseOutcome::create($data);
   }

   public function updateOutcome(array $data, string $id)
   {
      return CourseOutcome::find($id)->update($data);
   }

   public function deleteOutcome(string $id): bool
   {
      return CourseOutcome::find($id)->delete();
   }
}
