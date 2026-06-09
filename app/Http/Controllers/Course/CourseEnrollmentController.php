<?php

namespace App\Http\Controllers\Course;

use App\Enums\CoursePricingType;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCourseEnrollmentRequest;
use App\Services\Course\CourseEnrollmentService;
use App\Services\Course\CourseService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CourseEnrollmentController extends Controller
{
    public function __construct(
        private UserService $user,
        private CourseService $course,
        private CourseEnrollmentService $courseEnrollment,
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
        $courses = $this->course->getCourses(['status' => 'approved']);
        $enrollments = $this->courseEnrollment->getEnrollments($data, true);

        return Inertia::render('dashboard/enrollments/courses', compact('prices', 'users', 'courses', 'enrollments'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $prices = CoursePricingType::cases();
        $users = $this->user->getUsers([]);
        $courses = $this->course->getCourses(['status' => 'approved']);

        return Inertia::render('dashboard/enrollments/create', compact('prices', 'users', 'courses'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCourseEnrollmentRequest $request)
    {
        $this->courseEnrollment->createCourseEnroll($request->validated());

        return redirect(route('course-enrollments.index'))->with('success', 'Enrollment is successfully done in this course');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $this->courseEnrollment->deleteEnrollment($id);

        return redirect(route('course-enrollments.index'))->with('success', 'Enrollment is successfully deleted');
    }
}
