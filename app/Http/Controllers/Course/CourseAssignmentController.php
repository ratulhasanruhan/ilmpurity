<?php

namespace App\Http\Controllers\Course;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAssignmentRequest;
use App\Http\Requests\UpdateAssignmentRequest;
use App\Services\Course\CourseAssignmentService;
use Illuminate\Http\Request;

class CourseAssignmentController extends Controller
{
    public function __construct(
        private CourseAssignmentService $assignmentService,
    ) {}

    /**
     * Store a newly created assignment in storage.
     */
    public function store(StoreAssignmentRequest $request)
    {
        $this->assignmentService->createAssignment($request->validated());

        return back()->with('success', 'Assignment has been created.');
    }

    /**
     * Update the specified assignment in storage.
     */
    public function update(UpdateAssignmentRequest $request, string $id)
    {
        $this->assignmentService->updateAssignment($request->validated(), $id);

        return back()->with('success', 'Assignment has been updated.');
    }

    /**
     * Remove the specified assignment from storage.
     */
    public function destroy(string $id)
    {
        $this->assignmentService->deleteAssignment($id);

        return back()->with('success', 'Assignment has been deleted.');
    }
}
