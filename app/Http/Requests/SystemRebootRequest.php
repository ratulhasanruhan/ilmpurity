<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Validator;

class SystemRebootRequest extends FormRequest
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
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $email = $this->input('email');
            $password = $this->input('password');

            // Find user by email
            $user = User::where('email', $email)->first();

            if (!$user) {
                $validator->errors()->add('email', 'User with this email does not exist.');
                return;
            }

            // Check if user is admin
            if ($user->role !== 'admin') {
                $validator->errors()->add('email', 'Only administrators can perform system reboot.');
                return;
            }

            // Verify password
            if (!Hash::check($password, $user->password)) {
                $validator->errors()->add('password', 'The provided password is incorrect.');
                return;
            }
        });
    }
}
