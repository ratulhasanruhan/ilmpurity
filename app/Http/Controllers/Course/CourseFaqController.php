<?php

namespace App\Http\Controllers\Course;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCourseFaqRequest;
use App\Http\Requests\UpdateCourseFaqRequest;
use App\Services\Course\CourseFaqService;

class CourseFaqController extends Controller
{
    public function __construct(
        private CourseFaqService $faqService,
    ) {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCourseFaqRequest $request)
    {
        $this->faqService->createFaq($request->validated());

        return back()->with('success', 'Course Faq added successfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCourseFaqRequest $request, string $faq)
    {
        $this->faqService->updateFaq($request->validated(), $faq);

        return back()->with('success', 'Course Faq updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $faq)
    {
        $this->faqService->deleteFaq($faq);

        return back()->with('success', 'Course Faq deleted successfully');
    }
}
