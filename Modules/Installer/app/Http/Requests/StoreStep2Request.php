<?php

namespace Modules\Installer\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStep2Request extends FormRequest
{
    protected function prepareForValidation()
    {
        // Convert numeric fields
        $this->merge([
            'app_debug' => filter_var(request('app_debug'), FILTER_VALIDATE_BOOLEAN),
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'app_env' => 'required',
            'app_debug' => 'required',
            'app_key' => 'required',
            'app_timezone' => 'required',
            'app_url' => 'required',
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
