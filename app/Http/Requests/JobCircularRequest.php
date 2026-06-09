<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class JobCircularRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        $jobCircular = $this->route('job_circular');
        $jobCircularId = $jobCircular && is_object($jobCircular) ? $jobCircular->id : null;

        return [
            'title' => 'required|string|max:255',
            'slug' => [
                'sometimes',
                'string',
                'max:255',
                Rule::unique('job_circulars', 'slug')->ignore($jobCircularId),
            ],
            'description' => 'required|string',
            'experience_level' => 'required|string|in:entry,mid,senior,executive',
            'location' => 'required|string|max:255',
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|min:0|gte:salary_min',
            'salary_currency' => 'nullable|string|size:3',
            'salary_negotiable' => 'boolean',
            'application_deadline' => 'required|date|after:today',
            'contact_email' => 'required|email|max:255',
            'skills_required' => 'nullable|array',
            'skills_required.*' => 'string|max:100',
            'positions_available' => 'required|integer|min:1|max:100',
            'job_type' => 'required|string|in:full-time,part-time,contract,internship,freelance',
            'work_type' => 'required|string|in:on-site,remote,hybrid',
            'status' => 'required|string|in:draft,active,closed',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'title.required' => 'The job title is required.',
            'title.max' => 'The job title cannot exceed 255 characters.',
            'slug.unique' => 'This slug is already taken. Please choose a different one.',
            'description.required' => 'The job description is required.',
            'job_type.required' => 'The job type is required.',
            'job_type.in' => 'The job type must be one of: full-time, part-time, contract, internship, or freelance.',
            'work_type.required' => 'The work type is required.',
            'work_type.in' => 'The work type must be one of: on-site, remote, or hybrid.',
            'experience_level.required' => 'The experience level is required.',
            'experience_level.in' => 'The experience level must be one of: entry, mid, senior, or executive.',
            'location.required' => 'The job location is required.',
            'salary_min.numeric' => 'The minimum salary must be a valid number.',
            'salary_min.min' => 'The minimum salary cannot be negative.',
            'salary_max.numeric' => 'The maximum salary must be a valid number.',
            'salary_max.min' => 'The maximum salary cannot be negative.',
            'salary_max.gte' => 'The maximum salary must be greater than or equal to the minimum salary.',
            'salary_currency.size' => 'The salary currency must be a 3-character code (e.g., USD).',
            'application_deadline.required' => 'The application deadline is required.',
            'application_deadline.date' => 'The application deadline must be a valid date.',
            'application_deadline.after' => 'The application deadline must be a future date.',
            'contact_email.required' => 'The contact email is required.',
            'contact_email.email' => 'The contact email must be a valid email address.',
            'skills_required.array' => 'Skills required must be an array.',
            'skills_required.*.string' => 'Each skill must be a text value.',
            'skills_required.*.max' => 'Each skill cannot exceed 100 characters.',
            'positions_available.required' => 'The number of available positions is required.',
            'positions_available.integer' => 'The number of available positions must be a whole number.',
            'positions_available.min' => 'At least 1 position must be available.',
            'positions_available.max' => 'Cannot exceed 100 available positions.',
            'status.required' => 'The job status is required.',
            'status.in' => 'The job status must be one of: draft, active, or closed.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array
     */
    public function attributes(): array
    {
        return [
            'job_type' => 'job type',
            'work_type' => 'work type',
            'experience_level' => 'experience level',
            'salary_min' => 'minimum salary',
            'salary_max' => 'maximum salary',
            'salary_currency' => 'salary currency',
            'salary_negotiable' => 'salary negotiable',
            'application_deadline' => 'application deadline',
            'contact_email' => 'contact email',
            'skills_required' => 'required skills',
            'positions_available' => 'positions available',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Convert empty strings to null for nullable fields
        $this->merge([
            'salary_min' => $this->input('salary_min') ?: null,
            'salary_max' => $this->input('salary_max') ?: null,
            'salary_currency' => $this->input('salary_currency') ?: 'USD',
        ]);

        // Convert checkboxes to booleans
        $this->merge([
            'salary_negotiable' => (bool) $this->input('salary_negotiable'),
        ]);

        // Filter out empty skills
        if ($this->has('skills_required') && is_array($this->input('skills_required'))) {
            $this->merge([
                'skills_required' => array_filter($this->input('skills_required'), function ($skill) {
                    return !empty(trim($skill));
                }),
            ]);
        }
    }
}
