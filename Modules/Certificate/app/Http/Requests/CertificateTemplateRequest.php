<?php

namespace Modules\Certificate\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CertificateTemplateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'logo' => 'nullable|image|mimes:png,svg,webp|max:1024',
            'template_data' => 'required|array',
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
