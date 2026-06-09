<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInstructorRequest;
use App\Http\Requests\UpdateInstructorRequest;
use App\Http\Requests\UpdateInstructorStatusRequest;
use App\Models\Instructor;
use App\Models\User;
use App\Services\InstructorService;
use Inertia\Inertia;
use Illuminate\Http\Request;

class InstructorController extends Controller
{
    public function __construct(protected InstructorService $instructorService) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = [...$request->all(), 'status' => 'approved'];
        $instructors = $this->instructorService->getInstructors($data);

        return Inertia::render('dashboard/instructors/index', compact('instructors'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $users = User::where('role', 'student')->get();

        return Inertia::render('dashboard/instructors/create-update', compact('users'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreInstructorRequest $request)
    {
        $this->instructorService->createInstructor($request->validated());

        return redirect()->back()->with('success', 'Instructor application submitted successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $instructor = $this->instructorService->getInstructorProfile($id);

        // Generate meta tags for SEO and social sharing
        $system = app('system_settings');
        $siteName = $system->fields['name'] ?? 'Appibrium';
        $siteUrl = request()->url();

        $pageTitle = $instructor->user->name . ' - Expert Instructor | ' . $siteName;
        $pageDescription = "Learn from " . $instructor->user->name . ", an expert instructor with " . count($instructor->courses) . " courses and " . $instructor->total_enrollments_count . " students. Average rating: " . ($instructor->total_average_rating ? number_format($instructor->total_average_rating, 1) : 'New') . " stars.";
        $pageKeywords = $instructor->user->name . ', instructor, online courses, ' . ($system->fields['keywords'] ?? 'learning, education') . ', teacher, expert';
        $instructorImage = $instructor->user->photo ?? '';
        $ogTitle = $instructor->user->name . ' - Expert Instructor';

        return Inertia::render('instructors/show', compact('instructor'))->withViewData([
            'metaTitle' => $pageTitle,
            'metaDescription' => $pageDescription,
            'metaKeywords' => $pageKeywords,
            'ogTitle' => $ogTitle,
            'ogDescription' => $pageDescription,
            'ogImage' => $instructorImage,
            'ogUrl' => $siteUrl,
            'ogType' => 'profile',
            'twitterCard' => 'summary',
            'twitterTitle' => $ogTitle,
            'twitterDescription' => $pageDescription,
            'twitterImage' => $instructorImage,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Instructor $instructor)
    {
        $instructor->with(['user']);

        return Inertia::render('dashboard/instructors/create-update', compact('instructor'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInstructorRequest $request, string $id)
    {
        $this->instructorService->updateInstructor($request->validated(), $id);

        return redirect()->back()->with('success', 'Instructor application updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Instructor $instructor)
    {
        $this->instructorService->deleteInstructor($instructor);

        return back()->with('success', 'Instructor application deleted successfully');
    }

    public function applications(Request $request)
    {
        $applications = $this->instructorService->getInstructors([
            ...$request->all(),
            'status' => ['pending', 'rejected'],
            'no_admin' => true,
        ]);

        return Inertia::render('dashboard/instructors/applications', compact('applications'));
    }

    public function status(UpdateInstructorStatusRequest $request, string $id)
    {
        $instructor = $this->instructorService->updateInstructor($request->validated(), $id);
        $this->instructorService->updateUserRole($request->validated(), $instructor);

        return back()->with('success', 'Instructor status updated successfully');
    }
}
