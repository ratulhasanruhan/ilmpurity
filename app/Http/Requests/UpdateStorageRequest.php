<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStorageRequest extends FormRequest
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
            'storage_driver' => 'required|in:local,s3',
            'aws_access_key_id' => 'required_if:storage_driver,s3|nullable|string|max:255',
            'aws_secret_access_key' => 'required_if:storage_driver,s3|nullable|string|max:255',
            'aws_default_region' => 'required_if:storage_driver,s3|nullable|string|max:255',
            'aws_bucket' => 'required_if:storage_driver,s3|nullable|string|max:255',
        ];
    }
}
