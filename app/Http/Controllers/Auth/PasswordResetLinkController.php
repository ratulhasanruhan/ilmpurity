<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\UpdatePasswordRequest;
use App\Models\User;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    /**
     * Show the password reset link request page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        config(['app.frontend_url' => config('app.url')]);

        // Password::sendResetLink(
        //     $request->only('email')
        // );
        $user = User::where('email', $request->email)->first();

        if ($user) {
            $token = Password::createToken($user);
            $user->notify(new ResetPasswordNotification($token));
        }

        return back()->with('status', __('A reset link will be sent if the account exists.'));
    }

    /**
     * Handle an incoming change password request.
     */
    public function update(UpdatePasswordRequest $request): RedirectResponse
    {
        $user = $request->user();
        $user->password = Hash::make($request->password);
        $user->save();

        return back()->with('success', 'Password Successfully Changed');
    }
}
