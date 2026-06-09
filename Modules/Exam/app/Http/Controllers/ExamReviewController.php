<?php

namespace Modules\Exam\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Exam\Models\Exam;
use Modules\Exam\Models\ExamReview;
use Modules\Exam\Http\Requests\ExamReviewRequest;
use Illuminate\Http\Request;

class ExamReviewController extends Controller
{
   /**
    * Display reviews for an exam
    */
   public function index(Exam $exam)
   {
      $reviews = $exam->reviews()
         ->with('user')
         ->orderBy('created_at', 'desc')
         ->paginate(20);

      return response()->json([
         'reviews' => $reviews,
      ]);
   }

   /**
    * Store a new review
    */
   public function store(ExamReviewRequest $request)
   {
      $data = $request->validated();
      $data['user_id'] = auth()->id();

      // Check if user has already reviewed this exam
      $existingReview = ExamReview::where('user_id', $data['user_id'])
         ->where('exam_id', $data['exam_id'])
         ->first();

      if ($existingReview) {
         return back()->with('error', 'You have already reviewed this exam.');
      }

      ExamReview::create($data);

      return back()->with('success', 'Review submitted successfully!');
   }

   /**
    * Update a review
    */
   public function update(ExamReviewRequest $request, ExamReview $review)
   {
      // Check if review belongs to user
      if ($review->user_id !== auth()->id()) {
         abort(403);
      }

      $review->update($request->validated());

      return back()->with('success', 'Review updated successfully!');
   }

   /**
    * Remove a review
    */
   public function destroy(ExamReview $review)
   {
      // Check if review belongs to user or user is admin
      if ($review->user_id !== auth()->id() && auth()->user()->user_type !== 'admin') {
         abort(403);
      }

      $review->delete();

      return back()->with('success', 'Review deleted successfully.');
   }
}
