<?php

namespace App\Services\Course;

use App\Models\Course\Course;
use App\Models\Course\CourseEnrollment;
use App\Models\Instructor;
use App\Models\User;
use App\Notifications\CourseApprovalNotification;
use App\Services\MediaService;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class CourseService extends MediaService
{
   function getCheckoutCourse(string $id): Course
   {
      return Course::where('id', $id)->first();
   }

   function createCourse(array $data): Course
   {
      $course = Course::create([
         ...$data,
         'slug' => Str::slug($data['title']),
         'user_id' => Auth::user()->id,
         'course_type' => 'general',
      ]);

      if ($data['thumbnail']) {
         $course->update([
            'thumbnail' => $this->addNewDeletePrev($course, $data['thumbnail'], "thumbnail")
         ]);
      }

      return $course;
   }

   function updateCourse(string $id, array $data): Course
   {
      $course = Course::find($id);

      switch ($data['tab']) {
         case 'basic':
            $course->update([
               ...$data,
               'slug' => Str::slug($data['title']),
            ]);
            break;

         case 'pricing':
            $course->update($data);
            break;

         case 'info':
            $course->update($data);
            break;

         case 'media':
            $media = ['preview' => $data['preview']];

            if ($data['banner']) {
               $media['banner'] = $this->addNewDeletePrev($course, $data['banner'], "banner");
            }

            if ($data['thumbnail']) {
               $media['thumbnail'] = $this->addNewDeletePrev($course, $data['thumbnail'], "thumbnail");
            }

            $course->update($media);
            break;

         case 'seo':
            $course->update($data);
            break;

         case 'status':
            $course->update($data);

            if (array_key_exists('feedback', $data)) {
               $instructor = Instructor::find($course->instructor_id);
               $user = User::find($instructor->user_id);

               $user->notify(new CourseApprovalNotification($course, $data));
            }

            break;

         case 'default':
            $course->update($data);
            break;
      }

      return $course;
   }

   function getCourses(array $data, ?User $user = null, bool $paginate = false): LengthAwarePaginator|Collection
   {
      $page = array_key_exists('per_page', $data) ? intval($data['per_page']) : 10;

      $courses = Course::with([
         'enrollments',
         'instructor.user',
         'course_category',
         'course_category_child',
         'sections.section_lessons',
      ])
         ->withCount('reviews')
         ->withAvg('reviews as average_rating', 'rating')
         ->when(array_key_exists('search', $data), function ($query) use ($data) {
            return $query->where('title', 'LIKE', '%' . $data['search'] . '%');
         })
         ->when(array_key_exists('category', $data) && $data['category'] !== 'all', function ($query) use ($data) {
            return $query->whereHas('course_category', function ($category) use ($data) {
               $category->where('slug', $data['category']);
            });
         })
         ->when(array_key_exists('category_child', $data) && $data['category_child'] && $data['category_child'] !== 'all', function ($query) use ($data) {
            return $query->whereHas('course_category_child', function ($child) use ($data) {
               $child->where('slug',  $data['category_child']);
            });
         })
         ->when(array_key_exists('status', $data) && $data['status'] !== 'all', function ($query) use ($data) {
            return $query->where('status', $data['status']);
         })
         ->when(array_key_exists('level', $data) && $data['level'] !== 'all', function ($query) use ($data) {
            return $query->where('level', $data['level']);
         })
         ->when(array_key_exists('price', $data) && $data['price'] !== 'all', function ($query) use ($data) {
            return $query->where('pricing_type', $data['price']);
         })
         ->when(array_key_exists('language', $data) && $data['language'] !== 'all', function ($query) use ($data) {
            return $query->where('language', $data['language']);
         })
         ->when($user && $user->role === 'instructor', function ($query) use ($user) {
            return $query->where('instructor_id', $user->instructor_id);
         })
         ->orderBy('created_at', 'desc');

      if ($paginate) {
         return $courses->paginate($page);
      }

      return $courses->get();
   }

   function getUserCourseById(string $id, User $user): ?Course
   {
      $course = Course::where('id', $id)->with([
         'faqs',
         'outcomes',
         'requirements',
         'instructor.user',
         'live_classes',
         'assignments.submissions',
         'enrollments:id',
         'sections' => function ($query) use ($user) {
            $query->with([
               'section_lessons.resources',
               'section_quizzes' => function ($quizzes) use ($user) {
                  $quizzes->with([
                     'quiz_questions' => function ($questions) use ($user) {
                        $questions->with(['answers' => function ($answers) use ($user) {
                           $answers->when($user, function ($query) use ($user) {
                              $query->where('user_id', $user->id)
                                 ->latest()
                                 ->limit(1);
                           });
                        }]);
                     },
                     'quiz_submissions' => function ($submissions) use ($user) {
                        $submissions->when($user, function ($query) use ($user) {
                           $query->where('user_id', $user->id)
                              ->latest()
                              ->limit(1);
                        });
                     }
                  ]);
               },
            ]);
         },
      ])->first();

      return $course;
   }

   function getGuestCourseById(string $id): Course
   {
      $course = Course::where('id', $id)
         ->withCount('enrollments')
         ->withAvg('reviews as average_rating', 'rating')
         ->with([
            'faqs',
            'outcomes',
            'requirements',
            'sections' => function ($query) {
               $query->with([
                  'section_lessons',
                  'section_quizzes',
               ]);
            },
            'instructor' => function ($query) {
               $query->with([
                  'user',
                  'courses' => function ($query) {
                     $query->withCount('enrollments')
                        ->withCount('reviews')
                        ->withAvg('reviews as average_rating', 'rating');
                  }
               ])
                  ->withCount(['courses'])
                  ->selectRaw('(SELECT COUNT(*) FROM course_reviews 
                     INNER JOIN courses ON course_reviews.course_id = courses.id 
                     WHERE courses.instructor_id = instructors.id) as total_reviews_count')
                  ->selectRaw('(SELECT AVG(rating) FROM course_reviews 
                     INNER JOIN courses ON course_reviews.course_id = courses.id 
                     WHERE courses.instructor_id = instructors.id) as total_average_rating')
                  ->selectRaw('(SELECT COUNT(DISTINCT user_id) FROM course_enrollments
                     INNER JOIN courses ON course_enrollments.course_id = courses.id
                     WHERE courses.instructor_id = instructors.id) as total_enrollments_count');
            },
         ])->first();

      return $course;
   }

   function lastSectionLessonSort(Course $course): array
   {
      $maxSectionSort = $course->sections->max('sort') ?? 0;
      $maxLessonSort = $course->sections->flatMap->section_lessons->max('sort') ?? 0;

      return [
         'lastSectionSort' => $maxSectionSort,
         'lastLessonSort' => $maxLessonSort,
      ];
   }

   function getCourseEnroll(string $courseId): ?CourseEnrollment
   {
      $user = Auth::user();
      if ($user) {
         return CourseEnrollment::where('course_id', $courseId)
            ->where('user_id', $user->id)
            ->first();
      } else {
         return null;
      }
   }

   function deleteCourse(string $id): void
   {
      $course = Course::find($id);
      $course->delete();
   }

   /**
    * Validate if a course is ready for approval based on content completeness
    *
    * @param Course $course The course object to validate
    * @return array Contains validation result with counts and approval status
    */
   function validateCourseForApproval(Course $course): array
   {
      // Initialize counts
      $sectionsCount = 0;
      $lessonsCount = 0;
      $quizzesCount = 0;
      $totalContent = 0;

      // Check if course has required basic information
      $hasThumbnail = !empty($course->thumbnail);

      // Calculate content counts if sections are loaded
      if ($course->sections) {
         $sectionsCount = $course->sections->count();

         // Get lessons count
         $lessonsCount = $course->sections->reduce(function ($carry, $section) {
            return $carry + ($section->section_lessons ? $section->section_lessons->count() : 0);
         }, 0);

         // Get quizzes count
         $quizzesCount = $course->sections->reduce(function ($carry, $section) {
            return $carry + ($section->section_quizzes ? $section->section_quizzes->count() : 0);
         }, 0);

         $totalContent = $sectionsCount + $lessonsCount;
      }

      // Define minimum requirements for approval
      $minSections = 1;
      $minLessons = 1;
      $minTotalContent = 2; // At least 2 content items (lessons + quizzes)

      // Check if content meets minimum requirements
      $hasMinSections = $sectionsCount >= $minSections;
      $hasMinLessons = $lessonsCount >= $minLessons;
      $hasMinContent = $totalContent >= $minTotalContent;

      // Check if course has outcomes and requirements
      $hasOutcomes = $course->outcomes && $course->outcomes->count() > 0;
      $hasRequirements = $course->requirements && $course->requirements->count() > 0;

      // Determine if the course is ready for approval
      $isReadyForApproval =
         $hasThumbnail &&
         $hasMinSections &&
         $hasMinContent &&
         $hasOutcomes &&
         $hasRequirements;

      // Build validation result
      $validationMessages = [];
      if (!$hasThumbnail) $validationMessages[] = 'Course thumbnail is missing';
      if (!$hasMinSections) $validationMessages[] = "Course needs at least {$minSections} section";
      if (!$hasMinLessons) $validationMessages[] = "Course needs at least {$minLessons} lesson";
      if (!$hasMinContent) $validationMessages[] = "Course needs at least {$minTotalContent} content items (sections + section_lessons)";
      if (!$hasOutcomes) $validationMessages[] = 'Course outcomes are missing';
      if (!$hasRequirements) $validationMessages[] = 'Course requirements are missing';

      return [
         'approve_able' => $isReadyForApproval,
         'counts' => [
            'sections_count' => $sectionsCount,
            'lessons_count' => $lessonsCount,
            'quizzes_count' => $quizzesCount,
            'total_content_count' => $totalContent
         ],
         'has_requirements' => [
            'thumbnail' => $hasThumbnail,
            'min_sections' => $hasMinSections,
            'min_lessons' => $hasMinLessons,
            'min_content' => $hasMinContent,
            'outcomes' => $hasOutcomes,
            'requirements' => $hasRequirements
         ],
         'validation_messages' => $validationMessages
      ];
   }
}
