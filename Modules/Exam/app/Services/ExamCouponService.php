<?php

namespace Modules\Exam\Services;

use Modules\Exam\Models\Exam;
use Modules\Exam\Models\ExamCoupon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class ExamCouponService
{
    public function getExamsList(array $data): Collection
    {
        $user = Auth::user();

        return Exam::select('id', 'title')
            ->when(!isAdmin(), function ($query) use ($user) {
                $query->where('instructor_id', $user->instructor_id);
            })
            ->when(isset($data['exam_search']), function ($query) use ($data) {
                $query->where('title', 'like', '%' . $data['exam_search'] . '%');
            })
            ->get();
    }

    public function getCoupon(string $code): ?ExamCoupon
    {
        return ExamCoupon::where('code', $code)->first();
    }

    public function getExamValidCoupons(string $examId): Collection
    {
        return ExamCoupon::where('exam_id', $examId)
            ->where('is_active', true)
            ->isValid()
            ->get();
    }

    public function getCouponsList(array $data, bool $paginate = false): LengthAwarePaginator|Collection
    {
        $page = array_key_exists('coupon_per_page', $data) ? intval($data['coupon_per_page']) : 10;

        $coupons = ExamCoupon::with('exam:id,title')
            ->when(isset($data['coupon_search']), function ($query) use ($data) {
                $query->where('code', 'like', '%' . $data['coupon_search'] . '%');
            })
            ->when(isset($data['is_active']), function ($query) use ($data) {
                $query->where('is_active', $data['is_active']);
            })
            ->orderBy('created_at', 'desc');

        if ($paginate) {
            return $coupons->paginate($page);
        }

        return $coupons->get();
    }
}
