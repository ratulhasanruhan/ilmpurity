<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Authentication Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines are used during authentication for various
    | messages that we need to display to the user.
    |
    */

    // Authentication Messages
    [
        'name' => 'Authentication Messages',
        'slug' => 'authentication_messages',
        'properties' => [
            'failed' => 'These credentials do not match our records.',
            'password' => 'The provided password is incorrect.',
            'throttle' => 'Too many login attempts. Please try again in :seconds seconds.',
            'password_updated' => 'Your password has been updated.',
            'verification_link_sent' => 'A fresh verification link has been sent to your email address.',
            'password_reset_sent' => 'We have emailed your password reset link.',
            'google_auth_settings' => 'Google Auth Settings',
            'google_auth_description' => 'Google Auth Description',
        ]
    ],

    // Login Page
    [
        'name' => 'Login Page',
        'slug' => 'login_page',
        'properties' => [
            'login_title' => 'Log in to your account',
            'login_description' => 'Enter your email and password below to log in',
            'remember_me' => 'Remember me',
            'forgot_password' => 'Forgot Password',
            'continue_with' => 'Or continue with',
            'no_account' => "Don't have an account?",
            'google_auth' => 'Google Auth',
        ]
    ],

    // Register Page
    [
        'name' => 'Register Page',
        'slug' => 'register_page',
        'properties' => [
            'register_title' => 'Create an account',
            'register_description' => 'Enter your details below to create your account',
            'have_account' => 'Already have an account?',
        ]
    ],

    // Forgot Password
    [
        'name' => 'Forgot Password',
        'slug' => 'forgot_password',
        'properties' => [
            'forgot_description' => 'Enter your email to receive a password reset link',
            'return_to_login' => 'Or, return to',
        ]
    ],

    // Reset Password
    [
        'name' => 'Reset Password',
        'slug' => 'reset_password',
        'properties' => [
            'reset_title' => 'Reset password',
            'reset_description' => 'Please enter your new password below',
        ]
    ],

    // Confirm Password
    [
        'name' => 'Confirm Password',
        'slug' => 'confirm_password',
        'properties' => [
            'confirm_title' => 'Confirm your password',
            'confirm_description' => 'This is a secure area of the application. Please confirm your password before continuing.',
        ]
    ],

    // Verify Email
    [
        'name' => 'Verify Email',
        'slug' => 'verify_email',
        'properties' => [
            'change_email' => 'Change Email',
            'verify_title' => 'Verify email',
            'verify_description' => 'Please verify your email address by clicking on the link we just emailed to you.',
            'verification_sent' => 'A new verification link has been sent to the email address you provided during registration.',
        ]
    ],
];
