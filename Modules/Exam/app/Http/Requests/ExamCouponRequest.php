<?php

namespace Modules\Exam\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExamCouponRequest extends FormRequest
{
   public function authorize(): bool
   {
      return true;
   }

   public function rules(): array
   {
      $couponId = $this->route('coupon') ? $this->route('coupon')->id ?? '' : '';

      return [
         'exam_id' => 'nullable|exists:exams,id',
         'code' => 'required|string|max:50|unique:exam_coupons,code,' . $couponId,
         'discount_type' => 'required|in:percentage,fixed',
         'discount' => 'required|numeric|min:0',
         'valid_from' => 'nullable|date',
         'valid_to' => 'nullable|date|after:valid_from',
         'usage_limit' => 'nullable|integer|min:1',
         'is_active' => 'boolean',
      ];
   }

   public function messages(): array
   {
      return [
         'code.required' => 'The coupon code is required.',
         'code.unique' => 'This coupon code already exists.',
         'discount_type.required' => 'Please select a discount type.',
         'discount.required' => 'Please specify the discount value.',
         'valid_to.after' => 'Valid to date must be after valid from date.',
      ];
   }
}
