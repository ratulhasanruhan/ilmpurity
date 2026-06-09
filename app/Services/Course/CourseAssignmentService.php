<?php

namespace App\Services\Course;

use App\Models\Course\CourseAssignment;

class CourseAssignmentService extends CourseSectionService
{
   public function createAssignment(array $data): CourseAssignment
   {
      return CourseAssignment::create($data);
   }

   public function updateAssignment(array $data, string $id): bool
   {
      return CourseAssignment::findOrFail($id)->update($data);
   }

   public function deleteAssignment(string $id): bool
   {
      return CourseAssignment::findOrFail($id)->delete();
   }
}
