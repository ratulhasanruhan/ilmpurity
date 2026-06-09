<?php

namespace Modules\Installer\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInstallingRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'course_creation' => 'required|in:collaborative,administrative',
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
