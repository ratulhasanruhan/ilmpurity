<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateStudentProfileRequest;
use App\Models\Course\WatchHistory;
use App\Services\Course\CourseEnrollmentService;
use App\Services\Course\CoursePlayerService;
use App\Services\LiveClass\ZoomLiveService;
use App\Services\StudentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Modules\Exam\Services\ExamAttemptService;
use Modules\Exam\Services\ExamEnrollmentService;

class StudentController extends Controller
{
    public function __construct(
        protected StudentService $studentService,
        protected ZoomLiveService $zoomLiveService,
        protected CoursePlayerService $coursePlayerService,
        protected CourseEnrollmentService $enrollmentService,
        protected ExamEnrollmentService $examEnrollment,
        protected ExamAttemptService $examAttempt,
    ) {}

    /**
     * Display the student profile page.
     */
    public function index(Request $request, string $tab)
    {
        $hasVerifiedEmail = $request->user()->hasVerifiedEmail();

        if ($tab !== 'courses' && !$request->user()->hasVerifiedEmail()) {
            return redirect()
                ->route('student.index', ['tab' => 'courses'])
                ->with('error', 'Please verify your email address.');
        }

        $props = $this->studentService->getStudentData($tab);

        return Inertia::render('student/index', [
            ...$props,
            'tab' => $tab,
            'status' => $request->session()->get('status'),
            'hasVerifiedEmail' => $hasVerifiedEmail,
        ]);
    }

    public function show_course(int $id, string $tab)
    {
        $user = Auth::user();
        $course = $this->studentService->getEnrolledCourse($id, $user);
        $props = $this->studentService->getEnrolledCourseOverview($id, $tab, $user);
        $zoomConfig = $tab === 'live_classes' ? $this->zoomLiveService->zoomConfig : null;
        $watchHistory = $this->coursePlayerService->getWatchHistory($id, $user->id);
        $completion = $this->coursePlayerService->calculateCompletion($course, $watchHistory);

        return Inertia::render('student/course', [
            ...$props,
            'tab' => $tab,
            'course' => $course,
            'watchHistory' => $watchHistory,
            'zoomConfig' => $zoomConfig,
            'completion' => $completion,
        ]);
    }

    public function show_exam(Request $request, int $id, string $tab)
    {
        $user = Auth::user();
        $exam = $this->examEnrollment->getEnrolledExam($id, $user);
        $attempts = $this->examAttempt->getExamAttempts(['exam_id' => $id, 'user_id' => $user->id]);
        $bestAttempt = $this->examAttempt->getBestExamAttempt($id, $user->id);
        $props = $this->studentService->getEnrolledExamTabProps($id, $tab, $user);

        if ($tab === 'resources') {
            $exam->load('resources');
        }

        if ($tab === 'attempts' && $request->attempt) {
            $attemptId = (int) $request->attempt;
            $props['attempt'] = $this->examAttempt->getExamAttempt($attemptId, ['user_id' => $user->id]);
        }

        return Inertia::render('student/exam/index', [
            ...$props,
            'tab' => $tab,
            'exam' => $exam,
            'attempts' => $attempts,
            'bestAttempt' => $bestAttempt,
        ]);
    }

    /**
     * Update the authenticated student's profile information.
     */
    public function update_profile(UpdateStudentProfileRequest $request)
    {
        $this->studentService->updateProfile($request->validated(), Auth::user()->id);

        return redirect()->back()->with('success', 'Profile updated successfully');
    }
}
