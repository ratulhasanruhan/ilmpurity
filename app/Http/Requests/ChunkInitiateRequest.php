<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChunkInitiateRequest extends FormRequest
{
    protected $maxSize;
    protected $mimeTypes;

    public function __construct()
    {
        parent::__construct();

        $fileMaxSizes = [
            'audio' => 102400, // 100MB
            'video' => 1048576, // 1GB
            'document' => 20480,    // 20MB
            'image' => 2048,        // 2MB
            'zip' => 262144, // 256MB
            // 'assets' => 262144, // 256MB
        ];
        $fileMimeTypes = [
            'audio' => ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/mp3', 'audio/x-wav'],
            'video' => ['video/mp4', 'video/avi', 'video/mpeg', 'video/ogg', 'video/webm', 'video/3gpp'],
            'document' => ['text/plain', 'application/pdf'],
            'image' => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
            'zip' => ['application/zip', 'application/x-zip-compressed', 'application/x-rar-compressed'],
            // 'assets' => ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/avi', 'video/mpeg', 'video/ogg', 'video/webm', 'video/3gpp', 'text/plain', 'application/pdf', 'application/zip', 'application/x-zip-compressed', 'application/x-rar-compressed'],
        ];

        $this->maxSize = $fileMaxSizes[request('filetype')] ?? 2048;
        $this->mimeTypes = $fileMimeTypes[request('filetype')] ?? [];
    }

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
        $rules = [
            'filename' => 'required|string|max:255',
            'filesize' => [
                'required',
                'numeric',
                'min:1',
                'max:' . $this->maxSize
            ],
            'mimetype' => [
                'required',
                'string',
                'in:' . implode(',', $this->mimeTypes)
            ],
            'filetype' => 'required|string|in:audio,video,document,image,zip',
            'total_chunks' => 'required|integer|min:1',
            'course_id' => 'nullable|exists:courses,id',
            'course_section_id' => 'nullable|exists:course_sections,id',
        ];

        return $rules;
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        $maxSizeMB = round(($this->maxSize / 1024), 1);

        return [
            'filesize.max' => 'The filesize may not be greater than ' . $maxSizeMB . ' MB.',
            'mimetype.in' => 'The filetype must be ' . implode(', ', $this->mimeTypes),
        ];
    }
}
