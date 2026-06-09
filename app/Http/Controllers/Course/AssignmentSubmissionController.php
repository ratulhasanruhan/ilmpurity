<?php

namespace App\Http\Controllers\Course;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAssignmentSubmissionRequest;
use App\Http\Requests\UpdateAssignmentSubmissionRequest;
use App\Services\Course\AssignmentSubmissionService;
use Illuminate\Support\Facades\Auth;

class AssignmentSubmissionController extends Controller
{
    public function __construct(
        private AssignmentSubmissionService $submissionService,
    ) {}

    /**
     * Store a newly created submission in storage.
     */
    public function store(StoreAssignmentSubmissionRequest $request)
    {
        $user = Auth::user();

        $this->submissionService->submitAssignment([
            'user_id' => $user->id,
            ...$request->validated()
        ]);

        return back()->with('success', 'Assignment submitted successfully.');
    }

    /**
     * Update/Grade the specified submission.
     */
    public function update(UpdateAssignmentSubmissionRequest $request, string $id)
    {
        $user = Auth::user();

        $this->submissionService->gradeSubmission([
            'grader_id' => $user->id,
            ...$request->validated()
        ], $id);

        return back()->with('success', 'Assignment graded successfully.');
    }

    /**
     * Get student submissions for an assignment.
     */
    public function getStudentSubmissions(string $assignmentId)
    {
        $submissions = $this->submissionService->getStudentSubmissions($assignmentId, Auth::id());

        return response()->json($submissions);
    }

    /**
     * Get a specific submission.
     */
    public function show(string $id)
    {
        $submission = $this->submissionService->getSubmissionById($id);

        return response()->json($submission);
    }
}
