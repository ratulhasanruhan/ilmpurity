<?php

namespace App\Http\Controllers\Course;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Course\WatchHistory;
use App\Services\Course\CoursePlayerService;
use App\Services\Course\CourseReviewService;
use App\Services\Course\CourseService;
use App\Services\Course\CourseSectionService;
use App\Services\LiveClass\ZoomLiveService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PlayerController extends Controller
{
    public function __construct(
        protected CourseService $courseService,
        protected CoursePlayerService $coursePlay,
        protected CourseSectionService $sectionService,
        protected CourseReviewService $reviewService,
        protected ZoomLiveService $zoomLiveService,
        // protected AssignmentSubmissionService $submissionService,
    ) {}

    public function index(Request $request)
    {
        $courses = $this->courseService->getCourses($request->all(), null, true);

        return Inertia::render('courses/index', compact('courses'));
    }

    public function intWatchHistory(Request $request)
    {
        $user = Auth::user();
        $watchHistory = $this->sectionService->initWatchHistory($request->course_id, 'lesson', $user->id);

        return redirect()->route('course.player', [
            'type' => $watchHistory->current_watching_type,
            'watch_history' => $watchHistory->id,
            'lesson_id' => $watchHistory->current_watching_id,
        ]);
    }

    public function course_player(Request $request, string $type, WatchHistory $watch_history, string $lesson_id)
    {
        try {
            $user = Auth::user();

            $section_id = $watch_history->current_section_id;
            $watching_id = $lesson_id ?? $watch_history->current_watching_id;
            $watching_type = $type; // Use the route parameter, not old watch history

            $course = $this->courseService->getUserCourseById($watch_history->course_id, $user);
            $watching = $this->coursePlay->getWatchingLesson($lesson_id, $type);
            $reviews = $this->reviewService->getReviews(['course_id' => $course->id, ...$request->all()], true);
            $userReview = $this->reviewService->userReview($course->id, $user->id);
            $totalReviews = $this->reviewService->totalReviews($course->id);
            $zoomConfig = $this->zoomLiveService->zoomConfig;

            $section = null;
            $totalContent = 0;

            foreach ($course->sections as $courseSection) {
                $totalContent += count($courseSection->section_lessons) + count($courseSection->section_quizzes);

                if ($courseSection->id == $section_id) {
                    $section = $courseSection;
                }
            }

            $watchHistory = $this->coursePlay->watchHistory($course, $watching_id, $watching_type, $user->id);

            // $submissions = null;
            // if ($assignment) {
            //     $submissions = $this->submissionService->getSubmissions($assignment, $request->all());
            // }

            return Inertia::render('course-player/index', [
                'type' => $type,
                'course' => $course,
                'section' => $section,
                'reviews' => $reviews,
                'watching' => $watching,
                'totalContent' => $totalContent,
                'watchHistory' => $watchHistory,
                'userReview' => $userReview,
                'totalReviews' => $totalReviews,
                'zoomConfig' => $zoomConfig,
            ]);
        } catch (\Throwable $th) {
            return redirect()->route('category.courses', ['category' => 'all'])->with('error', $th->getMessage());
        }
    }

    public function finish_course(WatchHistory $watch_history)
    {
        $completedItems = json_decode($watch_history->completed_watching, true) ?: [];
        $lastItem = [
            'id' => $watch_history->current_watching_id,
            'type' => $watch_history->current_watching_type,
        ];

        // Check if lastItem already exists in completedItems
        $itemExists = false;
        foreach ($completedItems as $item) {
            if ((string)$item['id'] === (string)$lastItem['id'] && $item['type'] === $lastItem['type']) {
                $itemExists = true;
                break;
            }
        }

        // Add lastItem to completedItems if it doesn't exist
        if (!$itemExists) {
            $completedItems[] = $lastItem;
        }

        // Clean up duplicates and ensure consistent data types
        $completedItems = $this->cleanupCompletedItems($completedItems);

        $watch_history->completed_watching = json_encode($completedItems);
        $watch_history->completion_date = now();
        $watch_history->save();

        return back()->with('success', 'Course completed successfully');
    }

    /**
     * Clean up completed items to remove duplicates and ensure consistent data types
     */
    private function cleanupCompletedItems(array $completedItems): array
    {
        $cleaned = [];
        $seen = [];

        foreach ($completedItems as $item) {
            // Ensure consistent data types (string for ID)
            $normalizedItem = [
                'id' => (string)$item['id'],
                'type' => $item['type']
            ];

            // Create unique key for duplicate checking
            $key = $normalizedItem['id'] . '|' . $normalizedItem['type'];

            // Only add if not already seen
            if (!isset($seen[$key])) {
                $seen[$key] = true;
                $cleaned[] = $normalizedItem;
            }
        }

        return $cleaned;
    }
}
