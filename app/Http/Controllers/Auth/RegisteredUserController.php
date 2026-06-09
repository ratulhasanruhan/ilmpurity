<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AuthService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function __construct(private AuthService $authService) {}

    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        $authStatus = $this->authService->googleAuthStatus();
        $recaptchaStatus = $this->authService->recaptchaStatus();

        return Inertia::render('auth/register', [
            'googleLogIn' => $authStatus['authStatus'],
            'recaptcha' => $recaptchaStatus,
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'recaptcha_status' => 'required|boolean',
            'recaptcha' => 'nullable|captcha|required_if:recaptcha_status,true',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'role' => 'student',
            'status' => 1,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        // return to_route('dashboard');
        return redirect()->route('student.index', ['tab' => 'courses']);
    }
}
