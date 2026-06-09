<?php

namespace Modules\Exam\Services;

use Modules\Exam\Models\ExamWishlist;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class ExamWishlistService
{
    public function getExamWishlist(string $exam_id, ?string $user_id): ?ExamWishlist
    {
        return ExamWishlist::where('user_id', $user_id)
            ->where('exam_id', $exam_id)
            ->first();
    }

    public function getWishlists(array $data, bool $paginate = false): LengthAwarePaginator|Collection
    {
        $page = array_key_exists('exam_per_page', $data) ? intval($data['exam_per_page']) : 10;

        $wishlists = ExamWishlist::with('exam')
            ->where('user_id', $data['user_id']);

        return $paginate ? $wishlists->paginate($page) : $wishlists->get();
    }

    public function createWishlist(array $data): ExamWishlist
    {
        return ExamWishlist::create($data);
    }

    public function deleteWishlist(string $exam_id): bool
    {
        return ExamWishlist::where('exam_id', $exam_id)
            ->first()
            ->delete();
    }
}
