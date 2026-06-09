<?php

namespace App\Http\Controllers\Auth;

use App\Enums\UserType;
use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        $adminDashboard = route('dashboard', absolute: false) . '?verified=1';
        $studentDashboard = route('student.index', ['tab' => 'courses'], absolute: false) . '?verified=1';

        if ($request->user()->hasVerifiedEmail()) {
            if ($request->user()->role === UserType::STUDENT->value) {
                return redirect()->intended($studentDashboard);
            } else {
                return redirect()->intended($adminDashboard);
            }
        }

        if ($request->user()->markEmailAsVerified()) {
            /** @var \Illuminate\Contracts\Auth\MustVerifyEmail $user */
            $user = $request->user();

            event(new Verified($user));
        }

        if ($request->user()->role === UserType::STUDENT->value) {
            return redirect()->intended($studentDashboard);
        } else {
            return redirect()->intended($adminDashboard);
        }
    }
}
