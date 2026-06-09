<?php

namespace Modules\Exam\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Modules\Exam\Models\Exam;
use Modules\Exam\Models\ExamEnrollment;

class CheckExamEnrollMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        if ($user->role == 'admin') {
            return $next($request);
        }

        $exam = Exam::find($request->exam_id);

        if ($user->role == 'instructor' && $user->instructor_id == $exam->instructor_id) {
            return $next($request);
        }

        $enrollment = ExamEnrollment::where('user_id', $user->id)
            ->where('exam_id', $exam->id)
            ->first();

        if ($enrollment) {
            return $next($request);
        }

        return back()->with('error', 'You are not enrolled in this exam');
    }
}
