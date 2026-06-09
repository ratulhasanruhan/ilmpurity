<?php

namespace Modules\Exam\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Exam\Http\Requests\StoreExamOutcomeRequest;
use Modules\Exam\Http\Requests\UpdateExamOutcomeRequest;
use Modules\Exam\Services\ExamOutcomeService;

class ExamOutcomeController extends Controller
{
    public function __construct(
        private ExamOutcomeService $outcome,
    ) {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreExamOutcomeRequest $request)
    {
        $this->outcome->createOutcome($request->validated());

        return back()->with('success', 'Exam Outcome added successfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateExamOutcomeRequest $request, string $outcome)
    {
        $this->outcome->updateOutcome($request->validated(), $outcome);

        return back()->with('success', 'Exam Outcome updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $outcome)
    {
        $this->outcome->deleteOutcome($outcome);

        return back()->with('success', 'Exam Outcome deleted successfully');
    }
}
