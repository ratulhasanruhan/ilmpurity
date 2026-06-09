<?php

namespace Modules\Exam\Http\Controllers;

use App\Enums\CourseLevelType;
use App\Enums\CoursePricingType;
use App\Http\Controllers\Controller;
use App\Services\InstructorService;
use Modules\Exam\Models\Exam;
use Modules\Exam\Http\Requests\ExamRequest;
use Modules\Exam\Http\Requests\UpdateExamRequest;
use Modules\Exam\Services\ExamService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Modules\Exam\Services\ExamCategoryService;
use Illuminate\Http\RedirectResponse;
use Modules\Exam\Services\ExamEnrollmentService;
use Modules\Exam\Services\ExamReviewService;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Exam\Services\ExamAttemptService;
use Modules\Exam\Services\ExamWishlistService;

class ExamController extends Controller
{
    public function __construct(
        protected ExamService $exam,
        protected ExamReviewService $examReview,
        protected ExamCategoryService $examCategory,
        protected ExamEnrollmentService $examEnrollment,
        protected ExamWishlistService $examWishlist,
        protected ExamAttemptService $examAttempt,
        protected InstructorService $instructor,
    ) {}

    /**
     * Display a listing of exams
     */
    public function index(Request $request): Response
    {
        $exams = $this->exam->getAllExams($request->all(), Auth::user(), true);

        return Inertia::render('dashboard/exams/index', compact('exams'));
    }

    /**
     * Display exams by category (public page, similar to courses)
     */
    public function category_exams(Request $request, string $slug): Response
    {
        $levels = CourseLevelType::cases();
        $prices = CoursePricingType::cases();
        $query = [...$request->all(), 'per_page' => 12, 'category' => $slug, 'status' => 'published'];

        $category = $slug !== 'all' ? $this->examCategory->getCategoryBySlug($slug) : null;
        $categories = $this->examCategory->getCategories();
        $exams = $this->exam->getAllExams($query, null, true);
        $metadata = $this->exam->getCategoryExamsMetadata($category, $exams);

        return Inertia::render('exams/index', [
            'levels' => $levels,
            'prices' => $prices,
            'exams' => $exams,
            'category' => $category,
            'categories' => $categories,
        ])->withViewData($metadata);
    }

    /**
     * Show the form for creating a new exam
     */
    public function create(): Response
    {
        $categories = $this->examCategory->getCategories();
        $instructors = $this->instructor->getInstructors(['status' => 'approved'], false);

        return Inertia::render('dashboard/exams/create', compact('categories', 'instructors'));
    }

    /**
     * Store a newly created exam
     */
    public function store(ExamRequest $request)
    {
        $this->exam->createExam($request->validated());

        return redirect()
            ->route('exams.index')
            ->with('success', 'Exam created successfully.');
    }

    /**
     * Show single exam details (public page)
     */
    public function show(Request $request, string $slug, string $id): Response|RedirectResponse
    {
        $user = Auth::user() ? Auth::user()->id : null;

        // Get exam details
        $tab = $request->tab ?? 'overview';
        $exam = $this->exam->getExamPreview($id, $tab);
        $enrollment = $this->examEnrollment->getEnrollmentByExamId($exam->id, $user);
        $instructor = $this->instructor->getInstructorWithStatistics($exam->instructor_id);

        $reviews = $tab === 'reviews' ? $this->examReview->getExamReviews($exam->id, $request->all(), true) : null;
        $reviewsStatistics = $tab === 'reviews' ? $this->examReview->getExamRatingStatistics($exam->id) : null;

        $metadata = $this->exam->getExamPreviewMetadata($exam);
        $wishlist = $this->examWishlist->getExamWishlist($exam->id, $user);

        return Inertia::render('exams/show', [
            'tab' => $tab,
            'exam' => $exam,
            'enrollment' => $enrollment,
            'reviews' => $reviews,
            'wishlist' => $wishlist,
            'reviewsStatistics' => $reviewsStatistics,
            'instructor' => $instructor,
        ])->withViewData($metadata);
    }

    /**
     * Show the form for editing the exam
     */
    public function edit(Request $request, Exam $exam): Response
    {
        $tab = $request->tab;
        $user = Auth::user();

        // Load exam with relationships
        $exam->load([
            'exam_category',
            'questions.question_options',
            'instructor.user',
            'enrollments',
            'reviews',
            'faqs',
            'requirements',
            'outcomes',
            'resources'
        ]);

        // Get categories and instructors
        $categories = $this->examCategory->getCategories();
        $instructors = isAdmin() ? $this->instructor->getInstructors(['status' => 'approved'], false) : null;

        // Get attempts with pagination if on attempts tab
        $attempt = null;
        $attempts = null;
        if ($request->tab == 'attempts') {
            $data = array_merge($request->all(), ['exam_id' => $exam->id]);
            $attempts = $this->examAttempt->getExamAttempts($data, true);
            if ($request->review) {
                $attempt = $this->examAttempt->getExamAttempt((int) $request->review);

                // // Auto-grade the attempt if it's in submitted status
                // if ($request->review && $attempt->status === 'submitted') {
                //     // Auto-grade only the auto-gradable questions (not listening/short_answer)
                //     // $this->examAttempt->autoGradeAttempt($attempt);
                //     // Refresh the attempt to get updated data
                //     $attempt = $this->examAttempt->getExamAttempt((int) $request->review);
                // }
            }
        }

        return Inertia::render('dashboard/exams/update', [
            'tab' => $tab,
            'exam' => $exam,
            'attempt' => $attempt,
            'attempts' => $attempts,
            'categories' => $categories,
            'instructors' => $instructors,
        ]);
    }

    /**
     * Update the specified exam
     */
    public function update(UpdateExamRequest $request, Exam $exam)
    {
        $this->exam->updateExam($exam, $request->validated());

        return back()->with('success', "Exam " . $request->tab . " updated successfully");
    }

    /**
     * Remove the specified exam
     */
    public function destroy(Exam $exam)
    {
        $this->exam->deleteExam($exam);

        return redirect()
            ->route('exams.index')
            ->with('success', 'Exam deleted successfully.');
    }
}
