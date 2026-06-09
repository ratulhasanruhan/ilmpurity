<?php

namespace Modules\Exam\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Enums\CoursePricingType;
use App\Http\Controllers\Controller;
use App\Services\UserService;
use Illuminate\Support\Facades\Auth;
use Modules\Exam\Http\Requests\ExamEnrollmentRequest;
use Modules\Exam\Services\ExamEnrollmentService;
use Modules\Exam\Services\ExamService;

class ExamEnrollmentController extends Controller
{
    public function __construct(
        private UserService $user,
        private ExamService $exam,
        private ExamEnrollmentService $examEnrollments,
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $data = array_merge(
            $request->all(),
            isAdmin() ? [] : (
                $user->instructor ?
                ['instructor_id' => $user->instructor->id] :
                ['user_id' => $user->id])
        );

        $prices = CoursePricingType::cases();
        $users = $this->user->getUsers([]);
        $exams = $this->exam->getAllExams(['status' => 'published']);
        $enrollments = $this->examEnrollments->getEnrollments($data, true);

        return Inertia::render('dashboard/enrollments/exams', compact('prices', 'users', 'exams', 'enrollments'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ExamEnrollmentRequest $request)
    {
        $this->examEnrollments->createExamEnroll($request->validated());

        return back()->with('success', 'Enrollment is successfully done in this exam');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->examEnrollments->deleteEnrollment($id);

        return back()->with('success', 'Enrollment is successfully deleted');
    }
}
