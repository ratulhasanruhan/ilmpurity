<?php

namespace App\Http\Controllers\Auth;

use App\Enums\UserType;
use App\Models\User;
use App\Services\AuthService;
use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    public AuthService $authService;

    public function __construct()
    {
        $this->authService = new AuthService();
    }

    /**
     * Show the google sighup/login form.
     */
    public function show(Request $request)
    {
        session()->put('from', $request->from);

        return Socialite::driver('google')->redirect();
    }

    /**
     * Back to the specific route after login.
     */
    public function callback()
    {
        $from = session()->get('from');

        try {
            $user = Socialite::driver('google')->user();
            $registered = User::where('google_id', $user->id)->orWhere('email', $user->email)->first();

            if ($registered) {
                // Update existing user's tokens
                $this->authService->updateGoogleTokens($registered, $user);
                Auth::login($registered, true);
            } else {
                $registered = $this->authService->googleAuthRegister($user);

                event(new Registered($registered));
                Auth::login($registered, true);
            }

            if ($registered->role === UserType::STUDENT->value) {
                if ($from && $from == 'api') {
                    session()->forget('from');
                    return redirect()->intended(config('app.frontend_url') . '/student');
                } else {
                    return redirect()->intended(route('student.index', ['tab' => 'courses'], absolute: false));
                }
            } else {
                if ($from && $from == 'api') {
                    session()->forget('from');
                    return redirect()->intended(config('app.frontend_url') . '/dashboard');
                } else {
                    return redirect()->intended(route('dashboard', absolute: false));
                }
            }
        } catch (\Throwable $th) {
            if ($from && $from == 'api') {
                session()->forget('from');
                return redirect()->intended(config('app.frontend_url') . '/login');
            } else {
                return redirect()->route('login')->with('error', $th->getMessage());
            }
        }
    }
}
