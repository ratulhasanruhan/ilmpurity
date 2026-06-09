<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateZoomConfigRequest extends FormRequest
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
            'zoom_account_email' => 'required|email',
            'zoom_account_id' => 'required|string',
            'zoom_client_id' => 'required|string',
            'zoom_client_secret' => 'required|string',
            'zoom_web_sdk' => 'required|boolean',
            'zoom_sdk_client_id' => 'nullable|string|required_if:zoom_web_sdk,true',
            'zoom_sdk_client_secret' => 'nullable|string|required_if:zoom_web_sdk,true',
        ];
    }
}
