<?php

namespace App\Http\Requests;

use App\Enums\ExpiryLimitType;
use App\Enums\CoursePricingType;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCourseRequest extends FormRequest
{
    protected function prepareForValidation()
    {
        // Convert numeric fields
        $this->merge([
            'price' => request('price') ? (float) request('price') : null,
            'discount' => filter_var(request('discount'), FILTER_VALIDATE_BOOLEAN),
            'discount_price' => request('discount_price') ? (float) request('discount_price') : null,
            'course_category_id' => (int) request('course_category_id', 0),
            'course_category_child_id' => request('course_category_child_id') ? (int) request('course_category_child_id') : null,
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
        // Common rules for all tabs
        $rules = [
            'tab' => 'required|string',
        ];

        // Merge with tab-specific rules
        return array_merge($rules, $this->getTabSpecificRules());
    }

    /**
     * Get validation rules specific to the current tab
     */
    private function getTabSpecificRules(): array
    {
        $tab = request('tab');
        return match ($tab) {
            'basic' => $this->basicTabRules(),
            'pricing' => $this->pricingTabRules(),
            'media' => $this->mediaTabRules(),
            'seo' => $this->seoTabRules(),
            default => [],
        };
    }

    /**
     * Validation rules for the basic tab
     */
    private function basicTabRules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'short_description' => 'required|string',
            'description' => 'nullable|string',
            'status' => 'required|string',
            'level' => 'required|string',
            'language' => 'required|string|max:255',
            'drip_content' => 'required|boolean',
            'course_category_id' => 'required|exists:course_categories,id',
            'course_category_child_id' => 'nullable|exists:course_category_children,id',
        ];
    }

    /**
     * Validation rules for the pricing tab
     */
    private function pricingTabRules(): array
    {
        $free = CoursePricingType::FREE->value;
        $paid = CoursePricingType::PAID->value;
        $lifetime = ExpiryLimitType::LIFETIME->value;
        $limited = ExpiryLimitType::LIMITED_TIME->value;

        return [
            'pricing_type' => "required|string|in:$free,$paid",
            'price' => "nullable|numeric|min:1|required_if:pricing_type,$paid",
            'discount' => 'boolean',
            'discount_price' => 'nullable|numeric|min:1|lt:price|required_if:discount,true',
            'expiry_type' => "required|string|in:$lifetime,$limited",
            'expiry_duration' => "nullable|string|required_if:expiry_type,$limited",
        ];
    }

    /**
     * Validation rules for the media tab
     */
    private function mediaTabRules(): array
    {
        return [
            'thumbnail' => 'nullable|image|max:2048',
            'banner' => 'nullable|image|max:2048',
            'preview_type' => 'nullable|string|in:video_url,video',
            'preview' => 'nullable|string',
        ];
    }

    /**
     * Validation rules for the SEO tab
     */
    private function seoTabRules(): array
    {
        return [
            'meta_title' => 'nullable|string|max:255',
            'meta_keywords' => 'nullable|string',
            'meta_description' => 'nullable|string',
            'og_title' => 'nullable|string|max:255',
            'og_description' => 'nullable|string',
        ];
    }
}
