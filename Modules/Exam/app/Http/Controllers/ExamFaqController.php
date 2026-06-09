<?php

namespace Modules\Exam\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Exam\Http\Requests\StoreExamFaqRequest;
use Modules\Exam\Http\Requests\UpdateExamFaqRequest;
use Modules\Exam\Services\ExamFaqService;

class ExamFaqController extends Controller
{
    public function __construct(
        private ExamFaqService $faqs,
    ) {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreExamFaqRequest $request)
    {
        $this->faqs->createFaq($request->validated());

        return back()->with('success', 'Exam FAQ added successfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateExamFaqRequest $request, string $faq)
    {
        $this->faqs->updateFaq($request->validated(), $faq);

        return back()->with('success', 'Exam FAQ updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $faq)
    {
        $this->faqs->deleteFaq($faq);

        return back()->with('success', 'Exam FAQ deleted successfully');
    }
}
