<?php

namespace Modules\Exam\Services;

use Modules\Exam\Models\ExamReview;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ExamReviewService
{
   public function createReview(array $data): ExamReview
   {
      return ExamReview::create($data);
   }

   public function updateReview(string $id, array $data): ExamReview
   {
      return ExamReview::findOrFail($id)->update($data);
   }

   public function deleteReview(string $id): bool
   {
      return ExamReview::findOrFail($id)->delete();
   }

   function getExamReviews(string $exam_id, array $data, bool $paginate = false): LengthAwarePaginator|Collection
   {
      $page = array_key_exists('reviews_per_page', $data) ? intval($data['reviews_per_page']) : 10;

      $reviews = ExamReview::with(['user'])
         ->where('exam_id', $exam_id)
         ->when(array_key_exists('search', $data), function ($query) use ($data) {
            return $query->where('review', 'LIKE', '%' . $data['search'] . '%');
         })
         ->orderBy('created_at', 'desc');

      if ($paginate) {
         return $reviews->paginate($page);
      }

      return $reviews->get();
   }

   function getExamRatingStatistics(string $exam_id): array
   {
      $reviews = ExamReview::where('exam_id', $exam_id)
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
}
