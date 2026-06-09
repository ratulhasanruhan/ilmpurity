<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLessonRequest extends FormRequest
{
    protected function prepareForValidation()
    {
        $this->merge([
            'sort' => (int) request('sort'),
            'course_id' => (int) request('course_id'),
            'course_section_id' => (int) request('course_section_id'),
            'is_free' => (int) request('is_free'),
            // 'status' => (int) request('status'),
            // 'is_free' => filter_var(request('is_free'), FILTER_VALIDATE_BOOLEAN),
        ]);
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
            'sort' => 'required|integer',
            'title' => 'required|string|max:255',
            'course_id' => 'required|exists:courses,id',
            'course_section_id' => 'required|exists:course_sections,id',
            'lesson_type' => 'required|string|in:video_url,video,document,image,text,embed',
            'lesson_provider' => 'nullable|string|max:255',
            'lesson_src' => 'nullable|string',
            'lesson_src_new' => 'nullable|string',
            'duration' => 'nullable|regex:/^\d{2}:\d{2}:\d{2}$/',
            'is_free' => 'nullable|boolean',
            'description' => 'nullable|string',
            'thumbnail' => 'nullable|string',
            'summary' => 'nullable|string',
            'attachment' => 'nullable|file|max:20480', // Max 20MB
            'embed_source' => [
                'nullable',
                'string',
                function ($attribute, $value, $fail) {
                    if (empty($value)) {
                        return true;
                    }

                    // Check if the string contains an iframe tag
                    $isEmbed = preg_match('/<iframe\s+[^>]*src=[\'"]([^\'"]+)[\'"][^>]*>/i', $value);

                    if (!$isEmbed) {
                        $fail('The embed source must be a valid HTML iframe element.');
                    }
                },
            ],
        ];

        switch (request('lesson_type')) {
            case 'video_url':
                $rules['lesson_src'] = 'required|url';
                break;
        }

        return $rules;
    }
}
