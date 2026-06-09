<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAuthRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        // Common rules for all auth types
        $rules = [
            'type' => 'required|string|in:google_auth,google_recaptcha',
            'active' => 'required|boolean',
        ];

        // Add specific rules based on auth type
        return array_merge($rules, $this->getAuthSpecificRules());
    }

    /**
     * Get rules specific to an authentication type
     */
    private function getAuthSpecificRules(): array
    {
        $type = $this->input('type');
        return match ($type) {
            'google_auth' => $this->googleAuthRules(),
            'google_recaptcha' => $this->googleRecaptchaRules(),
            default => [],
        };
    }

    /**
     * Get validation rules for Google Auth
     */
    private function googleAuthRules(): array
    {
        return [
            'client_id' => 'required|string|max:255',
            'client_secret' => 'required|string|max:255',
            'redirect' => 'required|url|max:255',
        ];
    }

    /**
     * Get validation rules for reCAPTCHA
     */
    private function googleRecaptchaRules(): array
    {
        return [
            'site_key' => 'required|string|max:255',
            'secret_key' => 'required|string|max:255',
        ];
    }

    /**
     * Custom messages for validation errors.
     */
    public function messages(): array
    {
        return [
            'client_id.required' => 'The Google Client ID is required when Google Auth is active.',
            'client_secret.required' => 'The Google Client Secret is required when Google Auth is active.',
            'redirect.required' => 'The redirect URL is required when Google Auth is active.',
            'redirect.url' => 'The redirect must be a valid URL.',
            'site_key.required' => 'The reCAPTCHA site key is required when reCAPTCHA is active.',
            'secret_key.required' => 'The reCAPTCHA secret key is required when reCAPTCHA is active.',
        ];
    }
}
