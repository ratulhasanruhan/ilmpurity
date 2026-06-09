<?php

namespace App\Services;

use App\Models\Instructor;
use App\Models\Course\Course;
use App\Models\Course\CourseCategory;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use Modules\Blog\Models\Blog;

class PageSectionService extends MediaService
{
   public function getCategories(array $data)
   {
      $page = array_key_exists('category_page', $data) ? intval($data['category_page']) : 1;
      $per_page = array_key_exists('category_per_page', $data) ? intval($data['category_per_page']) : 10;

      $paginator = CourseCategory::withCount(['courses' => function ($query) {
         $query->where('status', 'approved');
      }])
         ->where('slug', '!=', 'default')
         ->when(array_key_exists('category', $data), function ($query) use ($data) {
            return $query->where('title', 'LIKE', '%' . $data['category'] . '%');
         })
         ->paginate($per_page, ['*'], 'page', $page);

      $paginator->getCollection()->transform(function ($category) {
         return [
            'id' => $category->id,
            'title' => $category->title,
            'icon' => $category->icon ?? null,
            'slug' => $category->slug ?? null,
            'courses_count' => $category->courses_count,
         ];
      });

      return $paginator;
   }

   public function getTopCategories(array $categoryIds)
   {
      // Get all requested categories regardless of courses
      return CourseCategory::whereIn('id', $categoryIds)
         ->withCount(['courses' => function ($query) {
            $query->where('status', 'approved');
         }])
         ->get()
         // Order by ID to maintain the order as in the database
         ->sortBy('id')
         ->map(function ($category) {
            return [
               'id' => $category->id,
               'title' => $category->title,
               'icon' => $category->icon ?? null,
               'slug' => $category->slug ?? null,
               'courses_count' => $category->courses_count ?? 0,
            ];
         });
   }

   public function getCategoryTopCourses(array $categoryIds,  $limit = null)
   {
      // Get top categories with approved courses
      $categories = CourseCategory::withCount(['courses' => function ($query) {
         $query->where('status', 'approved');
      }])
         ->whereIn('id', $categoryIds)
         ->whereHas('courses', function ($query) {
            $query->where('status', 'approved');
         })
         ->with(['courses' => function ($query) use ($limit) {
            $query->where('status', 'approved')
               ->with([
                  'sections' => function ($query) {
                     $query->select('id', 'course_id')
                        ->with(['section_lessons' => function ($query) {
                           $query->select('id', 'course_section_id', 'duration');
                        }]);
                  },
                  'course_category' => function ($query) {
                     $query->select('id', 'title');
                  },
                  'instructor' => function ($query) {
                     $query->select('id', 'user_id')
                        ->with(['user' => function ($query) {
                           $query->select('id', 'name', 'photo');
                        }]);
                  },
                  'reviews' => function ($query) {
                     $query->select('course_id', 'rating');
                  }
               ])
               ->withCount('enrollments')
               ->orderBy('created_at', 'desc')
               ->when($limit, function ($query) use ($limit) {
                  $query->limit($limit);
               });
         }])
         ->orderBy('courses_count', 'desc')
         ->get();

      return $categories;
   }

   public function getLatestCourses(array $courseIds, int $limit = 8)
   {
      return Course::query()
         ->whereIn('id', $courseIds)
         ->with([
            'sections' => function ($query) {
               $query->select('id', 'course_id')
                  ->with(['section_lessons' => function ($query) {
                     $query->select('id', 'course_section_id', 'duration');
                  }]);
            },
            'course_category' => function ($query) {
               $query->select('id', 'title');
            },
            'instructor' => function ($query) {
               $query->select('id', 'user_id')
                  ->with(['user' => function ($query) {
                     $query->select('id', 'name', 'photo');
                  }]);
            },
         ])
         ->withCount('enrollments')
         ->where('status', 'approved')
         ->orderBy('created_at', 'desc')
         ->limit($limit)
         ->get();
   }

   public function getHeroCourses(array $courseIds)
   {
      return Course::query()
         ->select('id', 'title', 'slug', 'thumbnail', 'price', 'short_description', 'course_category_id')
         ->whereIn('id', $courseIds)
         ->where('status', 'approved')
         ->with(['course_category' => function ($query) {
            $query->select('id', 'title');
         }])
         ->orderBy('created_at', 'desc')
         ->get();
   }

   public function getCourses(array $data): LengthAwarePaginator
   {
      $per_page = array_key_exists('course_per_page', $data) ? intval($data['course_per_page']) : 10;

      $paginator = Course::query()
         ->with(['sections' => function ($query) {
            $query->select('id', 'course_id')
               ->with(['section_lessons' => function ($query) {
                  $query->select('id', 'course_section_id', 'duration');
               }]);
         }])
         ->when(array_key_exists('course', $data), function ($query) use ($data) {
            return $query->where('title', 'LIKE', '%' . $data['course'] . '%');
         })
         ->withCount('enrollments')
         ->where('status', 'approved')
         ->orderBy('created_at', 'desc')
         ->paginate($per_page);

      $paginator->getCollection()->transform(function ($course) {
         $course->average_rating = $course->reviews()->avg('rating') ?? 0;
         $course->reviews_count = $course->reviews()->count();
         return $course;
      });

      return $paginator;
   }

   public function getTopCourses(array $courseIds)
   {
      return Course::query()
         ->whereIn('id', $courseIds)
         ->with([
            'sections' => function ($query) {
               $query->select('id', 'course_id')
                  ->with(['section_lessons' => function ($query) {
                     $query->select('id', 'course_section_id', 'duration');
                  }]);
            },
            'course_category' => function ($query) {
               $query->select('id', 'title');
            }
         ])
         ->withCount('enrollments')
         ->where('status', 'approved')
         ->orderBy('enrollments_count', 'desc')
         ->orderBy('created_at', 'desc')
         ->get()
         ->map(function ($course) {
            $course->average_rating = $course->reviews()->avg('rating') ?? 0;
            $course->reviews_count = $course->reviews()->count();
            return $course;
         });
   }

   public function getNewCourses(array $courseIds, int $limit = 8)
   {
      return Course::query()
         ->whereIn('id', $courseIds)
         ->with([
            'sections' => function ($query) {
               $query->select('id', 'course_id')
                  ->with(['section_lessons' => function ($query) {
                     $query->select('id', 'course_section_id', 'duration');
                  }]);
            },
            'course_category' => function ($query) {
               $query->select('id', 'title');
            },
            'instructor' => function ($query) {
               $query->select('id', 'user_id')
                  ->with(['user' => function ($query) {
                     $query->select('id', 'name', 'photo');
                  }]);
            },
         ])
         ->withCount('enrollments')
         ->where('status', 'approved')
         ->orderBy('created_at', 'desc')
         ->limit($limit)
         ->get()
         ->map(function ($course) {
            $course->average_rating = $course->reviews()->avg('rating') ?? 0;
            $course->reviews_count = $course->reviews()->count();
            return $course;
         });
   }

   public function getFirstInstructor(): ?Instructor
   {
      $instructor = Instructor::with(['user'])->first();
      if (!$instructor) {
         return null;
      }

      // Ensure social_links is properly cast as array
      if ($instructor && $instructor->user && $instructor->user->social_links) {
         if (is_string($instructor->user->social_links)) {
            $instructor->user->social_links = json_decode($instructor->user->social_links, true) ?: [];
         }
      }

      return $instructor;
   }

   public function getInstructors(array $data): LengthAwarePaginator
   {
      $page = array_key_exists('instructor_page', $data) ? intval($data['instructor_page']) : 1;
      $per_page = array_key_exists('instructor_per_page', $data) ? intval($data['instructor_per_page']) : 10;

      $paginator = Instructor::query()
         ->with([
            'user',
            'courses' => function ($query) {
               $query->where('status', 'approved');
            }
         ])
         ->when(array_key_exists('instructor', $data), function ($query) use ($data) {
            return $query->whereHas('user', function ($userQuery) use ($data) {
               $userQuery->where('name', 'LIKE', '%' . $data['instructor'] . '%');
            });
         })
         ->whereHas('user', function ($query) {
            $query->where('role', '!=', 'admin');
         })
         ->where('instructors.status', 'approved')
         ->withCount('courses')
         ->selectRaw('(SELECT COUNT(*) FROM course_reviews 
            INNER JOIN courses ON course_reviews.course_id = courses.id 
            WHERE courses.instructor_id = instructors.id) as total_reviews_count')
         ->selectRaw('(SELECT AVG(rating) FROM course_reviews 
            INNER JOIN courses ON course_reviews.course_id = courses.id 
            WHERE courses.instructor_id = instructors.id) as total_average_rating')
         ->selectRaw('(SELECT COUNT(DISTINCT user_id) FROM course_enrollments
            INNER JOIN courses ON course_enrollments.course_id = courses.id
            WHERE courses.instructor_id = instructors.id) as total_enrollments_count')
         ->orderBy('total_enrollments_count', 'desc')
         ->orderBy('created_at', 'desc')
         ->paginate($per_page, ['*'], 'page', $page);

      $paginator->getCollection()->transform(function ($instructor) {
         $instructor->average_rating = $instructor->courses->avg('average_rating') ?? 0;
         $instructor->total_reviews = $instructor->courses->sum('reviews_count');

         // Ensure social_links is properly cast as array
         if ($instructor->user && $instructor->user->social_links) {
            if (is_string($instructor->user->social_links)) {
               $instructor->user->social_links = json_decode($instructor->user->social_links, true) ?: [];
            }
         }

         return $instructor;
      });

      return $paginator;
   }

   public function getTopInstructors(array $instructorIds, int $limit = 8)
   {
      return Instructor::query()
         ->whereIn('id', $instructorIds)
         ->with(['user', 'courses' => function ($query) {
            $query->where('status', 'approved');
         }])
         ->withCount(['courses as enrollments_count' => function ($query) {
            $query->where('status', 'approved');
         }])
         ->addSelect([
            'total_enrollments' => DB::table('courses')
               ->select(DB::raw('COALESCE(SUM(enrollments_count), 0)'))
               ->whereColumn('instructor_id', 'instructors.id')
               ->where('status', 'approved')
         ])
         ->where('instructors.status', 'approved')
         ->orderBy('total_enrollments', 'desc')
         ->orderBy('created_at', 'desc')
         ->limit($limit)
         ->get()
         ->each(function ($instructor) {
            $instructor->average_rating = $instructor->courses->avg('average_rating') ?? 0;
            $instructor->total_reviews = $instructor->courses->sum('reviews_count');

            // Ensure social_links is properly cast as array
            if ($instructor->user && $instructor->user->social_links) {
               if (is_string($instructor->user->social_links)) {
                  $instructor->user->social_links = json_decode($instructor->user->social_links, true) ?: [];
               }
            }

            return $instructor;
         });
   }

   public function getTopBlogs(array $blogsIds)
   {
      return Blog::query()
         ->whereIn('id', $blogsIds)
         ->with(['user:id,name,photo'])
         ->where('status', 'published')
         ->orderBy('created_at', 'desc')
         ->get()
         ->each(function ($blog) {
            $blog->reading_time = $blog->reading_time; // Accessor is called here
         });
   }

   /**
    * Get a single course with detailed statistics
    * 
    * @param int $courseId The ID of the course to retrieve
    * @return Course|null The course with all related statistics
    */
   public function getSingleCourse(int $courseId): ?Course
   {
      $course = Course::query()
         ->where('id', $courseId)
         ->where('status', 'approved')
         ->with([
            'sections' => function ($query) {
               $query->select('id', 'course_id', 'title')
                  ->with([
                     'section_lessons' => function ($query) {
                        $query->select('id', 'course_section_id', 'lesson_type', 'title', 'duration');
                     },
                     'section_quizzes' => function ($query) {
                        $query->select('id', 'course_section_id', 'title');
                     }
                  ]);
            },
         ])
         ->withCount('enrollments')
         ->first();

      if (!$course) {
         return null;
      }

      // Calculate course statistics
      $course->average_rating = round($course->reviews()->avg('rating') ?? 0, 2);
      $course->reviews_count = $course->reviews()->count();

      // Calculate total lessons count
      $course->total_lessons = $course->sections->sum(function ($section) {
         return $section->section_lessons->count();
      });

      // Calculate total course duration in hours and minutes
      $totalDurationMinutes = $course->sections->sum(function ($section) {
         return $section->section_lessons->sum(function ($lesson) {
            $duration = $lesson->duration ?? '0';

            // Handle different duration formats
            if (empty($duration) || $duration === '0') {
               return 0;
            }

            // If it's already a number (minutes)
            if (is_numeric($duration)) {
               return round((float)$duration, 2);
            }

            // If it's in format like "5:30" (minutes:seconds)
            if (strpos($duration, ':') !== false) {
               $parts = explode(':', $duration);
               $minutes = isset($parts[0]) ? (int)$parts[0] : 0;
               $seconds = isset($parts[1]) ? (int)$parts[1] : 0;
               return round($minutes + ($seconds / 60), 2); // Convert to total minutes with 2 decimal places
            }

            // Default to 0 for any other format
            return 0;
         });
      });

      // Convert minutes to hours and format (round to 2 decimal places)
      $totalDurationMinutes = round($totalDurationMinutes, 2);
      $course->total_duration_hours = floor($totalDurationMinutes / 60);
      $course->total_duration_minutes = round($totalDurationMinutes % 60, 2);
      $course->formatted_duration = $course->total_duration_hours > 0 ?
         $course->total_duration_hours . ' hrs' :
         round($totalDurationMinutes, 2) . ' min';

      // Get total quizzes count for this course
      $course->total_quizzes = DB::table('section_quizzes')
         ->where('course_id', $courseId)
         ->count();

      // Format enrollment count
      $enrollmentCount = $course->enrollments_count;
      $course->formatted_students = $enrollmentCount > 0 ?
         ($enrollmentCount >= 1000 ? round($enrollmentCount / 1000, 1) . 'K+' : $enrollmentCount . '+') :
         '0';

      // Format other statistics for display
      $course->formatted_lessons = $course->total_lessons > 0 ? $course->total_lessons . '+' : '0';
      $course->formatted_quizzes = $course->total_quizzes > 0 ? $course->total_quizzes . '+' : '0';

      return $course;
   }
}
