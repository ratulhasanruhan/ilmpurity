<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateEmailRequest;
use App\Services\AccountService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EmailVerificationNotificationController extends Controller
{
    public function __construct(private AccountService $accountService) {}

    /**
     * Send a new email verification notification.
     */
    public function store(Request $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard', absolute: false));
        }

        $request->user()->sendEmailVerificationNotification();

        return back()->with('status', 'verification-link-sent');
    }

    /**
     * Send a new email for verify the new email.
     */
    public function update(UpdateEmailRequest $request)
    {
        $this->accountService->changeEmail($request->validated(), Auth::user()->id);

        return back()->with('success', 'We have sent a email verification link to your new email account.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function save(Request $request)
    {
        $user = Auth::user();
        $saved = $this->accountService->saveChangedEmail($request->token, $user->id);
        $flash = $saved ? 'success' : 'error';
        $message = $saved ? "New email successfully changed." : "Verification token didn't match or expire.";

        if ($user->role == 'student') {
            return redirect()->route('student.index', ['tab' => 'settings'])
                ->with($flash, $message);
        }

        return redirect()->route('settings.account')
            ->with($flash, $message);
    }
}
