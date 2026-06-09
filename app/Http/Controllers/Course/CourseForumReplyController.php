<?php

namespace App\Http\Controllers\Course;

use App\Http\Controllers\Controller;
use App\Models\Course\CourseForumReply;
use App\Http\Requests\StoreCourseForumReplyRequest;
use App\Http\Requests\UpdateCourseForumReplyRequest;
use App\Services\Course\CourseForumService;
use Illuminate\Http\Request;

class CourseForumReplyController extends Controller
{
    public function __construct(
        protected CourseForumService $forumService
    ) {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCourseForumReplyRequest $request)
    {
        $this->forumService->createForumReply($request->validated());

        return back()->with('success', 'Forum reply created successfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCourseForumReplyRequest $request, string $id)
    {
        $this->forumService->updateForumReply($id, $request->validated());

        return back()->with('success', 'Forum reply updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CourseForumReply $courseForumReply)
    {
        $this->forumService->deleteForumReply($courseForumReply->id);

        return back()->with('success', 'Forum reply deleted successfully');
    }
}
