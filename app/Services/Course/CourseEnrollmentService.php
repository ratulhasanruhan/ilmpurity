<?php

namespace App\Services\Course;

use App\Models\Course\CourseEnrollment;
use App\Models\Course\SectionLesson;
use App\Models\Course\SectionQuiz;
use App\Services\Course\CourseSectionService;
use App\Services\MediaService;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class CourseEnrollmentService extends MediaService
{
   function getEnrollmentById(int $id): ?CourseEnrollment
   {
      return CourseEnrollment::with(['user', 'course'])->find($id);
   }

   function getEnrollmentByCourseId(int $courseId, int $userId): ?CourseEnrollment
   {
      return CourseEnrollment::where('course_id', $courseId)->where('user_id', $userId)->first();
   }

   function getEnrollments(array $data, bool $paginate = false): LengthAwarePaginator|Collection
   {
      $page = array_key_exists('per_page', $data) ? intval($data['per_page']) : 10;

      $enrollments = CourseEnrollment::with(['user', 'course.instructor.user'])
         ->when(array_key_exists('search', $data), function ($query) use ($data) {
            return $query->whereHas('user', function ($user) use ($data) {
               $user->where('name', 'LIKE', '%' . $data['search'] . '%');
            });
         })
         ->when(array_key_exists('instructor_id', $data), function ($query) use ($data) {
            return $query->whereHas('course.instructor.user', function ($user) use ($data) {
               $user->where('id', $data['instructor_id']);
            });
         })
         ->when(array_key_exists('user_id', $data), function ($query) use ($data) {
            $query->where('user_id', $data['user_id']);
         })
         ->orderBy('created_at', 'desc');

      if ($paginate) {
         return $enrollments->paginate($page);
      }

      return $enrollments->get();
   }


   function createCourseEnroll(array $data): CourseEnrollment
   {
      return DB::transaction(function () use ($data) {
         $courseId = $data['course_id'];
         $courseSectionService = new CourseSectionService();

         $enrollment = CourseEnrollment::create([...$data, 'entry_date' => now()]);

         $lessons = SectionLesson::query()->where('course_id', $courseId);
         if ($lessons->exists()) {
            $courseSectionService->initWatchHistory($courseId, 'lesson', $data['user_id']);
            return $enrollment;
         }

         $quizzes = SectionQuiz::query()->where('course_id', $courseId);
         if ($quizzes->exists()) {
            $courseSectionService->initWatchHistory($courseId, 'quiz', $data['user_id']);
            return $enrollment;
         }

         return $enrollment;
      }, 5);
   }

   function deleteEnrollment(string $id): void
   {
      $enrollment = CourseEnrollment::find($id);
      $enrollment->delete();
   }
}
