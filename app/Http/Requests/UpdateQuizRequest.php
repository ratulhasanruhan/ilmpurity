<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateQuizRequest extends FormRequest
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
            'title' => 'required|string',
            'course_id' => 'required',
            'course_section_id' => 'required',
            'seconds' => [
                'required',
                'max:59',
                // function ($attribute, $value, $fail) {
                //     if ($this->hour == 0 && $this->minute == 0 && $value == 0) {
                //         $fail('If hour and minute are 0, second must be greater than 0.');
                //     }
                // }
            ],
            'minutes' => [
                'required',
                'max:59',
                // function ($attribute, $value, $fail) {
                //     if ($this->hour == 0 && $value == 0 && $this->second < 1) {
                //         $fail('If hour is 0, minute must be greater than 0.');
                //     }
                // }
            ],
            'hours' => [
                'required',
                'max:23',
                // function ($attribute, $value, $fail) {
                //     if ($this->minute == 0 && $this->second == 0 && $value < 1) {
                //         $fail('If minute and second are 0, hour must be greater than 0.');
                //     }
                // }
            ],
            'total_mark' => 'required|numeric',
            'pass_mark' => [
                'required',
                'numeric',
                function ($attribute, $value, $fail) {
                    if ($value > $this->total_mark) {
                        $fail('The pass mark must be less than the total mark.');
                    }
                }
            ],
            'retake' => 'required|numeric|min:1',
        ];
    }
}
