<?php

namespace App\Services;

use App\Mail\ChangeEmailVerification;
use App\Models\PasswordResetToken;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AccountService extends MediaService
{
    public function updateProfile(array $data, string $id)
    {
        DB::transaction(function () use ($data, $id) {
            $user = User::find($id);

            $user->name = $data['name'];
            $user->social_links = $data['social_links'];

            if (array_key_exists('photo', $data) && $data['photo']) {
                $fullUrl = $this->addNewDeletePrev($user, $data['photo'], 'profile');

                $user->photo = $fullUrl;
            }

            $user->save();
        }, 5);
    }

    public function changeEmail(array $data, string $id)
    {
        DB::transaction(function () use ($data, $id) {
            $app = app('system_settings');
            $user = User::find($id);

            // Generate a unique token for email verification
            $token = Str::random(60);
            $url = route('account.save-email', ['token' => $token]);

            // Delete any existing tokens for this email
            $reset = PasswordResetToken::where('email', $data['new_email'])->first();
            if ($reset) {
                $reset->delete();
            }

            // Create new token
            PasswordResetToken::create([
                'email' => $data['new_email'],
                'token' => $token,
            ]);

            $user->updated_at = now();
            $user->save();

            // Send an email with the verification link to the new email
            Mail::to($data['new_email'])->send(new ChangeEmailVerification($user, $app, $url));
        }, 5);
    }

    public function saveChangedEmail(string $token, string $id): bool
    {
        return DB::transaction(function () use ($token, $id) {
            $user = User::find($id); // Retrieve the authenticated user

            $reset = PasswordResetToken::where('token', $token)->first();

            // Validate if the reset token exists
            if (!$reset) {
                return false;
            }

            // Verify the token securely
            if (!hash_equals($reset->token, $token)) {
                return false;
            }

            // Check if the user was updated within 5 minutes
            $within5Minutes = $user->updated_at->diffInMinutes(Carbon::now()) <= 5;

            if ($within5Minutes) {
                $user->email = $reset->email;
                $user->save();
            }

            $reset->delete(); // Delete the token after use
            return $within5Minutes;
        }, 5);
    }
}
