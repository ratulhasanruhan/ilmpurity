<?php

namespace Modules\Exam\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Exam\Http\Requests\StoreExamRequirementRequest;
use Modules\Exam\Http\Requests\UpdateExamRequirementRequest;
use Modules\Exam\Services\ExamRequirementService;

class ExamRequirementController extends Controller
{
    public function __construct(
        private ExamRequirementService $requirement,
    ) {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreExamRequirementRequest $request)
    {
        $this->requirement->createRequirement($request->validated());

        return back()->with('success', 'Exam Requirement added successfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateExamRequirementRequest $request, string $requirement)
    {
        $this->requirement->updateRequirement($request->validated(), $requirement);

        return back()->with('success', 'Exam Requirement updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $requirement)
    {
        $this->requirement->deleteRequirement($requirement);

        return back()->with('success', 'Exam Requirement deleted successfully');
    }
}
