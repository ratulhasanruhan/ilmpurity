<?php

namespace App\Http\Controllers\Course;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLessonRequest;
use App\Http\Requests\StoreSectionRequest;
use App\Http\Requests\UpdateLessonRequest;
use App\Http\Requests\UpdateSectionRequest;
use App\Models\Course\SectionLesson;
use App\Services\Course\CourseSectionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CurriculumController extends Controller
{
    protected CourseSectionService $sectionService;

    public function __construct()
    {
        $this->sectionService = new CourseSectionService();
    }

    /**
     * Creates a new course section
     * @param StoreSectionRequest $request Validated request containing section data
     * @return \Illuminate\Http\RedirectResponse
     */
    public function section_store(StoreSectionRequest $request)
    {
        $user = Auth::user();

        $this->sectionService->createSection($request->validated(), $user->id);

        return back()->with('success', 'Section added successfully');
    }

    /**
     * Updates an existing course section
     * @param UpdateSectionRequest $request Validated request containing updated section data
     * @param string $id Section ID to update
     * @return \Illuminate\Http\RedirectResponse
     */
    public function section_update(UpdateSectionRequest $request, string $id)
    {
        $this->sectionService->updateSection($id, $request->validated());

        return back()->with('success', 'Section updated successfully');
    }

    /**
     * Deletes a course section
     * @param string $id Section ID to delete
     * @return \Illuminate\Http\RedirectResponse
     */
    public function section_delete(string $id)
    {
        $this->sectionService->deleteSection($id);

        return back()->with('success', 'Section and all associated lessons deleted successfully');
    }

    /**
     * Updates the sort order of course sections
     * @param Request $request Contains itemJSON with ordered section IDs
     * @return void
     */
    public function section_sort(Request $request)
    {
        $this->sectionService->sortSections($request->sortedData);

        return back()->with('success', 'Sections sorted successfully');
    }

    /**
     * Creates a new lesson within a section
     * @param StoreLessonRequest $request Validated request containing lesson data
     * @return \Illuminate\Http\RedirectResponse
     */
    public function lesson_store(StoreLessonRequest $request)
    {
        $user = Auth::user();

        $this->sectionService->createSectionLesson($request->validated(), $user->id);

        return back()->with('success', 'Lesson added successfully');
    }

    /**
     * Updates an existing lesson
     * @param UpdateLessonRequest $request Validated request containing updated lesson data
     * @param string $id Lesson ID to update
     * @return \Illuminate\Http\RedirectResponse
     */
    public function lesson_update(UpdateLessonRequest $request, string $id)
    {
        $this->sectionService->updateSectionLesson($id, $request->validated());

        return back()->with('success', 'Lesson updated successfully');
    }

    /**
     * Deletes a lesson
     * @param SectionLesson $lesson Lesson model to delete
     * @return \Illuminate\Http\RedirectResponse
     */
    public function lesson_delete(string $id)
    {
        $this->sectionService->deleteSectionLesson($id);

        return back()->with('success', 'Lesson deleted successfully');
    }

    /**
     * Updates the sort order of lessons within a section
     * @param Request $request Contains itemJSON with ordered lesson IDs
     * @return \Illuminate\Http\RedirectResponse
     */
    public function lesson_sort(Request $request)
    {
        $this->sectionService->sortSectionLessons($request->sortedData);

        return back()->with('success', 'Lessons sorted successfully');
    }
}
