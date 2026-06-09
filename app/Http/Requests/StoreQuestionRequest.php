<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreQuestionRequest extends FormRequest
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
            'title' => 'required|string|max:255',
            'type' => 'required|in:single,multiple,boolean',
            'options' => 'required_unless:type,boolean',
            'answer' => 'required',
            'sort' => 'required|integer',
            'section_quiz_id' => 'required|exists:section_quizzes,id',
        ];
    }
}
