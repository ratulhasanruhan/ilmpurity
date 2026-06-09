<?php

namespace App\Services\Course;

use App\Models\Course\AssignmentSubmission;
use App\Models\Course\CourseAssignment;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class AssignmentSubmissionService extends CourseSectionService
{
   public function getSubmissions(string $id, array $data)
   {
      $page = array_key_exists('per_page', $data) ? intval($data['per_page']) : 10;

      $submissions = AssignmentSubmission::with([
         'assignment',
         'student',
         'grader',
      ])
         ->where('course_assignment_id', $id)
         ->when(array_key_exists('search', $data), function ($query) use ($data) {
            return $query->whereHas('student', function ($q) use ($data) {
               $q->where('name', 'LIKE', '%' . $data['search'] . '%')
                  ->orWhere('email', 'LIKE', '%' . $data['search'] . '%');
            });
         })
         ->orderBy('created_at', 'desc')
         ->paginate($page);

      return $submissions;
   }

   public function submitAssignment(array $data): AssignmentSubmission
   {
      $assignment = CourseAssignment::findOrFail($data['course_assignment_id']);

      // Check if submission is late
      $isLate = false;
      if ($assignment->deadline && Carbon::now()->isAfter($assignment->deadline)) {
         $isLate = true;
      }

      // Check attempt number for this user
      $attemptNumber = AssignmentSubmission::where('course_assignment_id', $assignment->id)
         ->where('user_id', Auth::id())
         ->max('attempt_number') ?? 0;
      $attemptNumber++;

      return AssignmentSubmission::create([
         ...$data,
         'is_late' => $isLate,
         'attempt_number' => $attemptNumber,
      ]);
   }

   public function gradeSubmission(array $data, string $id): bool
   {
      $submission = AssignmentSubmission::findOrFail($id);

      return $submission->update($data);
   }

   public function getStudentSubmissions(string $assignmentId, string $userId)
   {
      return AssignmentSubmission::where('course_assignment_id', $assignmentId)
         ->where('user_id', $userId)
         ->with(['assignment', 'grader'])
         ->orderBy('attempt_number', 'desc')
         ->get();
   }

   public function getSubmissionById(string $id)
   {
      return AssignmentSubmission::with(['assignment', 'student', 'grader'])
         ->findOrFail($id);
   }
}
