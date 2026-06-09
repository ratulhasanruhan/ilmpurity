<?php

namespace App\Services;

use App\Models\User;
use App\Models\Instructor;
use App\Notifications\InstructorApprovalNotification;
use App\Services\MediaService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class InstructorService extends MediaService
{
   function getInstructorById(string $id): Instructor|null
   {
      return Instructor::with(['user'])->find($id);
   }

   function getInstructorByUserId(string|null $userId): Instructor|null
   {
      return Instructor::where('user_id', $userId)->first();
   }

   function getAllInstructorByStatus(array $params): Collection
   {
      $instructors = Instructor::with(['user'])
         ->when(array_key_exists('search', $params) && $params['search'], function ($query) use ($params) {
            return $query->whereHas('user', function ($user) use ($params) {
               $user->where('name', 'LIKE', '%' . $params['search'] . '%');
            });
         })
         ->when(array_key_exists('status', $params), function ($query) use ($params) {
            return $query->where('status', $params['status']);
         })
         ->get();

      return $instructors;
   }

   function getInstructorProfile(string $id): Instructor
   {
      return Instructor::where('id', $id)
         ->with([
            'user',
            'courses' => function ($query) {
               $query->with('sections.section_lessons')
                  ->withCount('enrollments')
                  ->withCount('reviews')
                  ->withAvg('reviews as average_rating', 'rating');
            },
            'exams' => function ($query) {
               $query->withCount('enrollments')
                  ->withCount('reviews')
                  ->withAvg('reviews as average_rating', 'rating');
            },
         ])
         ->withCount(['courses', 'exams'])
         ->selectRaw('(SELECT COUNT(*) FROM course_reviews 
            INNER JOIN courses ON course_reviews.course_id = courses.id 
            WHERE courses.instructor_id = instructors.id) as total_reviews_count')
         ->selectRaw('(SELECT AVG(rating) FROM course_reviews 
            INNER JOIN courses ON course_reviews.course_id = courses.id 
            WHERE courses.instructor_id = instructors.id) as total_average_rating')
         ->selectRaw('(SELECT COUNT(DISTINCT user_id) FROM course_enrollments
            INNER JOIN courses ON course_enrollments.course_id = courses.id
            WHERE courses.instructor_id = instructors.id) as total_enrollments_count')
         ->selectRaw('(SELECT COUNT(*) FROM exams WHERE exams.instructor_id = instructors.id) as total_exam_count')
         ->selectRaw('(SELECT COUNT(DISTINCT exam_enrollments.user_id) FROM exam_enrollments
            INNER JOIN exams ON exam_enrollments.exam_id = exams.id
            WHERE exams.instructor_id = instructors.id) as total_exam_students_count')
         ->selectRaw('(SELECT COUNT(*) FROM exam_reviews
            INNER JOIN exams ON exam_reviews.exam_id = exams.id
            WHERE exams.instructor_id = instructors.id) as total_exam_reviews_count')
         ->selectRaw('(SELECT AVG(rating) FROM exam_reviews
            INNER JOIN exams ON exam_reviews.exam_id = exams.id
            WHERE exams.instructor_id = instructors.id) as total_exam_average_rating')
         ->first();
   }

   function getInstructorWithStatistics(string $id): Instructor
   {
      return Instructor::where('id', $id)
         ->with(['user'])
         ->withCount(['courses', 'exams'])
         ->selectRaw('(SELECT COUNT(*) FROM course_reviews 
            INNER JOIN courses ON course_reviews.course_id = courses.id 
            WHERE courses.instructor_id = instructors.id) as total_reviews_count')
         ->selectRaw('(SELECT AVG(rating) FROM course_reviews 
            INNER JOIN courses ON course_reviews.course_id = courses.id 
            WHERE courses.instructor_id = instructors.id) as total_average_rating')
         ->selectRaw('(SELECT COUNT(DISTINCT user_id) FROM course_enrollments
            INNER JOIN courses ON course_enrollments.course_id = courses.id
            WHERE courses.instructor_id = instructors.id) as total_enrollments_count')
         ->selectRaw('(SELECT COUNT(*) FROM exams WHERE exams.instructor_id = instructors.id) as total_exam_count')
         ->selectRaw('(SELECT COUNT(DISTINCT exam_enrollments.user_id) FROM exam_enrollments
            INNER JOIN exams ON exam_enrollments.exam_id = exams.id
            WHERE exams.instructor_id = instructors.id) as total_exam_instructors_count')
         ->selectRaw('(SELECT COUNT(*) FROM exam_reviews
            INNER JOIN exams ON exam_reviews.exam_id = exams.id
            WHERE exams.instructor_id = instructors.id) as total_exam_reviews_count')
         ->selectRaw('(SELECT AVG(rating) FROM exam_reviews
            INNER JOIN exams ON exam_reviews.exam_id = exams.id
            WHERE exams.instructor_id = instructors.id) as total_exam_average_rating')
         ->first();
   }

   function getInstructors(array $params, bool $paginate = true): LengthAwarePaginator|Collection
   {
      $page = array_key_exists('per_page', $params) ? intval($params['per_page']) : 10;

      $query = Instructor::with(['user'])
         ->withCount('courses')
         ->when(array_key_exists('no_admin', $params) && $params['no_admin'], function ($query) {
            return $query->where('designation', '!=', 'admin');
         })
         ->when(array_key_exists('search', $params) && $params['search'], function ($query) use ($params) {
            return $query->whereHas('user', function ($user) use ($params) {
               $user->where('name', 'LIKE', '%' . $params['search'] . '%');
            });
         })
         ->when(array_key_exists('status', $params), function ($query) use ($params) {
            if (is_array($params['status'])) {
               return $query->whereIn('status', $params['status']);
            }
            return $query->where('status', $params['status']);
         });

      if (!$paginate) {
         return $query->get();
      }

      return $query->paginate($page);
   }

   function createInstructor(array $data): Instructor
   {
      $user = User::find($data['user_id']);

      $instructor = Instructor::create([
         ...$data,
         'skills' => json_encode($data['skills']),
         'resume' => $this->addNewDeletePrev($user, $data['resume'], "resume"),
      ]);

      $user->update(['instructor_id' => $instructor->id]);

      if (Auth::user()->role !== 'admin') {
         $admin = User::where('role', 'admin')->first();
         $admin->notify(new InstructorApprovalNotification([
            'status' => 'pending',
         ]));
      } else {
         $instructor->update(['status' => 'approved']);
      }

      return $instructor;
   }

   function updateInstructor(array $data, string $id): Instructor
   {
      $user = Auth::user();
      $instructor = Instructor::find($id);

      if (array_key_exists('resume', $data) && $data['resume']) {
         $data['resume'] = $this->addNewDeletePrev($instructor->user, $data['resume'], "resume");
      }

      if (array_key_exists('skills', $data) && is_array($data['skills'])) {
         $data['skills'] = json_encode($data['skills']);
      }

      $filteredData = array_filter($data, function ($value) {
         return $value !== null;
      });

      if ($user->role !== 'admin') {
         $instructor->update([...$filteredData, 'status' => 'pending']);

         $admin = User::where('role', 'admin')->first();
         $admin->notify(new InstructorApprovalNotification([
            'status' => $instructor->status,
         ]));
      }

      $instructor->update($filteredData);

      return $instructor;
   }

   function updateUserRole(array $data, Instructor $instructor): void
   {
      $user = User::find($instructor->user_id);

      if ($instructor->status === 'approved') {
         $user->update(['role' => 'instructor']);
      }

      $user->notify(new InstructorApprovalNotification([
         'status' => $instructor->status,
         'feedback' => $data['feedback'],
      ]));
   }

   function deleteInstructor(Instructor $instructor): void
   {
      DB::transaction(function () use ($instructor) {
         $admin = User::where('role', 'admin')->first();

         $instructor->courses()->update([
            'instructor_id' => $admin->instructor_id,
         ]);

         User::find($instructor->user_id)->update([
            'role' => 'student',
            'instructor_id' => null
         ]);

         $instructor->delete();
      }, 5);
   }
}
