<?php

namespace App\Http\Controllers\Auth;

use Inertia\Inertia;
use Inertia\Response;
use App\Enums\UserType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use App\Services\AuthService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

class AuthenticatedSessionController extends Controller
{
    public function __construct(private AuthService $authService) {}

    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        $authStatus = $this->authService->googleAuthStatus();
        $recaptchaStatus = $this->authService->recaptchaStatus();

        return Inertia::render('auth/login', [
            'status' => $request->session()->get('status'),
            'canResetPassword' => Route::has('password.request'),
            'googleLogIn' => $authStatus['authStatus'],
            'recaptcha' => $recaptchaStatus,
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $isAdmin = $request->user()->role == UserType::ADMIN->value;
        $isInstructor = $request->user()->role == UserType::INSTRUCTOR->value;

        if ($isAdmin || $isInstructor) {
            return redirect()->intended(route('dashboard', absolute: false));
        } else {
            return redirect()->intended(route('category.courses', ['category' => 'all'], absolute: false));
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
