<?php

namespace Modules\Installer\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStep5Request extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'mail_mailer' => 'required',
            'mail_host' => 'required',
            'mail_port' => 'required',
            'mail_encryption' => 'required',
            'mail_username' => 'required',
            'mail_password' => 'required',
            'mail_address' => 'required',
            'mail_from_name' => 'required',
        ];
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
}
