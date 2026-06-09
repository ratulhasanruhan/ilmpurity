<?php

namespace App\Http\Controllers\Course;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCourseReviewRequest;
use App\Http\Requests\UpdateCourseReviewRequest;
use App\Services\Course\CourseReviewService;

class CourseReviewController extends Controller
{
    public function __construct(
        public CourseReviewService $reviewService,
    ) {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCourseReviewRequest $request)
    {
        $this->reviewService->createReview($request->validated());

        return redirect()->back()->with('success', 'Review created successfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCourseReviewRequest $request, string $id)
    {
        $this->reviewService->updateReview($id, $request->validated());

        return redirect()->back()->with('success', 'Review updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->reviewService->deleteReview($id);

        return redirect()->back()->with('success', 'Review deleted successfully');
    }
}
