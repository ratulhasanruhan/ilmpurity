<?php

namespace App\Http\Controllers\Course;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCourseForumRequest;
use App\Http\Requests\UpdateCourseForumRequest;
use App\Services\Course\CourseForumService;

class CourseForumController extends Controller
{
    public function __construct(
        protected CourseForumService $forumService
    ) {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCourseForumRequest $request)
    {
        $this->forumService->createForum($request->validated());

        return back()->with('success', 'Forum created successfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCourseForumRequest $request, string $id)
    {
        $this->forumService->updateForum($id, $request->validated());

        return back()->with('success', 'Forum updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->forumService->deleteForum($id);

        return back()->with('success', 'Forum deleted successfully');
    }
}
