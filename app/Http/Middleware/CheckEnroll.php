<?php

namespace App\Http\Middleware;

use App\Models\Course\Course;
use App\Models\Course\CourseEnrollment;
use App\Models\Course\WatchHistory;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckEnroll
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if ($user->role == 'admin') {
            return $next($request);
        }

        $watchHistory = $request->route('watch_history');
        if (!WatchHistory::find($watchHistory)) {
            return back()->with('error', 'Invalid watch history');
        }

        $course = Course::find($watchHistory->course_id);

        if ($user->role == 'instructor' && $user->instructor_id == $course->instructor_id) {
            return $next($request);
        }

        $enrollment = CourseEnrollment::where('user_id', $user->id)
            ->where('course_id', $watchHistory->course_id)
            ->first();

        if ($enrollment) {
            return $next($request);
        }

        return back()->with('error', 'You are not enrolled in this course');
    }
}
