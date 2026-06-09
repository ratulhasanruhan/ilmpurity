<?php

namespace App\Services;

use App\Enums\UserType;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    public function recaptchaStatus()
    {
        $recaptchaStatus = false;
        $status = config('captcha.status');
        $siteKey = config('captcha.sitekey');
        $secretKey = config('captcha.secret');

        if ($status && $siteKey && $secretKey) {
            $recaptchaStatus = true;
        }

        return [
            'status' => $recaptchaStatus,
            'siteKey' => $siteKey,
            'secretKey' => $secretKey,
        ];
    }

    public function googleAuthStatus()
    {
        $authStatus = false;
        $googleStatus = config('services.google.status');
        $clientID = config('services.google.client_id');
        $clientSecret = config('services.google.client_secret');
        $redirectURI = config('services.google.redirect');

        if ($googleStatus && !empty($clientID) && !empty($clientSecret) && !empty($redirectURI)) {
            $authStatus = true;
        }

        return [
            'authStatus' => $authStatus,
            'clientID' => $clientID,
            'clientSecret' => $clientSecret,
            'redirectURI' => $redirectURI,
        ];
    }

    public function googleAuthRegister(object $user): User
    {
        return DB::transaction(function () use ($user) {
            $userData = [
                'name' => $user->name,
                'email' => $user->email,
                'photo' => $user->avatar,
                'role' => UserType::STUDENT->value,
                'email_verified_at' => now(),
                'google_id' => $user->id,
                'password' => Hash::make('googleauth'),
            ];

            // Add OAuth tokens if available
            if (isset($user->token)) {
                $userData['google_access_token'] = $user->token;

                if (isset($user->refreshToken)) {
                    $userData['google_refresh_token'] = $user->refreshToken;
                }

                if (isset($user->expiresIn)) {
                    $userData['google_token_expires_in'] = now()->addSeconds($user->expiresIn);
                }
            }

            $newUser = User::create($userData);

            return $newUser;
        }, 5);
    }

    /**
     * Update Google OAuth tokens for existing user
     */
    public function updateGoogleTokens(User $existingUser, object $googleUser): void
    {
        $updateData = [];

        if (isset($googleUser->token)) {
            $updateData['google_access_token'] = $googleUser->token;
        }

        if (isset($googleUser->refreshToken)) {
            $updateData['google_refresh_token'] = $googleUser->refreshToken;
        }

        if (isset($googleUser->expiresIn)) {
            $updateData['google_token_expires_in'] = now()->addSeconds($googleUser->expiresIn);
        }

        if (!empty($updateData)) {
            $existingUser->update($updateData);
        }
    }
}
