<?php

namespace App\Http\Controllers\Course;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCourseOutcomeRequest;
use App\Http\Requests\UpdateCourseOutcomeRequest;
use App\Services\Course\CourseOutcomeService;

class CourseOutcomeController extends Controller
{
    public function __construct(
        private CourseOutcomeService $outcomeService,
    ) {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCourseOutcomeRequest $request)
    {
        $this->outcomeService->createOutcome($request->validated());

        return back()->with('success', 'Course Outcome added successfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCourseOutcomeRequest $request, string $outcome)
    {
        $this->outcomeService->updateOutcome($request->validated(), $outcome);

        return back()->with('success', 'Course Outcome updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $outcome)
    {
        $this->outcomeService->deleteOutcome($outcome);

        return back()->with('success', 'Course Outcome deleted successfully');
    }
}
