<?php

namespace App\Services\Course;

use App\Services\MediaService;
use App\Models\Course\CourseReview;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class CourseReviewService extends MediaService
{
   function totalReviews(string $courseId): array
   {
      $reviews = CourseReview::where('course_id', $courseId)
         ->select('rating')
         ->get();

      $totalReviews = $reviews->count();
      $ratingCounts = [
         5 => 0,
         4 => 0,
         3 => 0,
         2 => 0,
         1 => 0,
      ];

      // Count reviews for each rating
      foreach ($reviews as $review) {
         $rating = max(1, min(5, $review->rating)); // Ensure rating is between 1-5
         $ratingCounts[$rating]++;
      }

      // Calculate percentages
      $ratingDistribution = [
         ['stars' => 5, 'percentage' => $totalReviews ? ($ratingCounts[5] / $totalReviews) * 100 : 0],
         ['stars' => 4, 'percentage' => $totalReviews ? ($ratingCounts[4] / $totalReviews) * 100 : 0],
         ['stars' => 3, 'percentage' => $totalReviews ? ($ratingCounts[3] / $totalReviews) * 100 : 0],
         ['stars' => 2, 'percentage' => $totalReviews ? ($ratingCounts[2] / $totalReviews) * 100 : 0],
         ['stars' => 1, 'percentage' => $totalReviews ? ($ratingCounts[1] / $totalReviews) * 100 : 0],
      ];

      return [
         'total_reviews' => $totalReviews,
         'rating_distribution' => $ratingDistribution,
      ];
   }

   function getReviews(array $data, bool $paginate = false): LengthAwarePaginator|Collection
   {
      $page = array_key_exists('per_page', $data) ? intval($data['per_page']) : 10;

      $courses = CourseReview::with(['user'])
         ->where('course_id', $data['course_id'])
         ->when(array_key_exists('search', $data), function ($query) use ($data) {
            return $query->where('review', 'LIKE', '%' . $data['search'] . '%');
         })
         ->orderBy('created_at', 'desc');

      if ($paginate) {
         return $courses->paginate($page);
      }

      return $courses->get();
   }

   function userReview(string $courseId, string $userId): CourseReview | null
   {
      return CourseReview::where('course_id', $courseId)->where('user_id', $userId)->first();
   }

   function createReview(array $data): CourseReview
   {
      return CourseReview::create($data);
   }

   function updateReview(string $id, array $data): bool
   {
      return CourseReview::find($id)->update($data);
   }

   function deleteReview(string $id): void
   {
      CourseReview::find($id)->delete();
   }
}
