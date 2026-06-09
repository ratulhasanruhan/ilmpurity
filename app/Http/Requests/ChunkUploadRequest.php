<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChunkUploadRequest extends FormRequest
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
            'part_number' => 'required|integer|min:1',
            'chunk_data' => 'required|string',
            'filename' => 'required|string',
            'mimetype' => 'required|string',
        ];
    }
}
