<?php

namespace App\Services\Payout;

use App\Models\Course\Course;
use App\Models\Instructor;
use App\Models\PaymentHistory;
use App\Models\PayoutHistory;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class PayoutService
{
	function getPayouts(array $params, bool $paginate = true): LengthAwarePaginator|Collection
	{
		$page = array_key_exists('per_page', $params) ? intval($params['per_page']) : 10;

		$query = PayoutHistory::with(['user'])
			->when(array_key_exists('search', $params) && $params['search'], function ($query) use ($params) {
				return $query->whereHas('user', function ($user) use ($params) {
					$user->where('amount', 'LIKE', '%' . $params['search'] . '%');
				});
			})
			->when(array_key_exists('status', $params), function ($query) use ($params) {
				return $query->where('status', $params['status']);
			})
			->when(array_key_exists('user_id', $params), function ($query) use ($params) {
				return $query->where('user_id', $params['user_id']);
			})
			->orderBy('created_at', 'desc');

		if (!$paginate) {
			return $query->get();
		}

		return $query->paginate($page);
	}

	function getPayoutRequest(string $request_id): PayoutHistory
	{
		return PayoutHistory::with(['user'])->find($request_id);
	}

	function getPayoutStatus(User $user): array
	{
		// Get all courses for the current instructor
		$courses = Course::where('instructor_id', $user->instructor_id)->pluck('id');

		// Get all payment histories for these courses
		$paymentHistories = PaymentHistory::query()
			->where('purchase_type', Course::class)
			->whereIn('purchase_id', $courses)
			->where('instructor_revenue', '>', 0)
			->get();

		// Get all payouts for this user
		$payouts = PayoutHistory::where('user_id', $user->id)->get();

		// Calculate metrics
		$totalEarnings = number_format($paymentHistories->sum('instructor_revenue'), 2, '.', '');
		$totalPaidOut = number_format($payouts->where('status', 'paid')->sum('amount'), 2, '.', '');
		$pendingPayouts = number_format($payouts->where('status', 'pending')->sum('amount'), 2, '.', '');
		$availableForWithdrawal = number_format($totalEarnings - $totalPaidOut - $pendingPayouts, 2, '.', '');

		return [
			'totalEarnings' => $totalEarnings,
			'totalPayouts' => $totalPaidOut,
			'pendingPayouts' => $pendingPayouts,
			'availableForWithdrawal' => max(0, $availableForWithdrawal), // Ensure it's not negative
		];
	}

	function createPayout(array $data, string $userId)
	{
		DB::transaction(function () use ($data, $userId) {
			PayoutHistory::create([
				'user_id' => $userId,
				'amount' => $data['amount'],
			]);
		}, 5);
	}

	function updatePayoutGateway(array $data, string $id)
	{
		DB::transaction(function () use ($data, $id) {
			$instructor = Instructor::find($id);
			$payoutMethods = $instructor->payout_methods;

			foreach ($payoutMethods as $key => $method) {
				if ($method['sub_type'] === $data['type']) {
					$dataWithoutType = array_filter($data, function ($key) {
						return $key !== 'type';
					}, ARRAY_FILTER_USE_KEY);

					$payoutMethods[$key]['fields'] = array_merge($method['fields'], $dataWithoutType);

					break;
				}
			}

			$instructor->update(['payout_methods' => $payoutMethods]);
		}, 5);
	}

	function getPayoutGateway(string $instructorId, string $payoutMethod): array
	{
		return DB::transaction(function () use ($instructorId, $payoutMethod) {
			$instructor = Instructor::find($instructorId);
			$payoutMethods = $instructor->payout_methods;

			foreach ($payoutMethods as $key => $method) {
				if ($method['sub_type'] === $payoutMethod) {
					return $method;
				}
			}
		}, 5);
	}

	function getPayoutGateways(string $request_id): array
	{
		return DB::transaction(function () use ($request_id) {
			$payout = PayoutHistory::find($request_id);
			$user = User::find($payout->user_id);
			$instructor = Instructor::find($user->instructor_id);
			$payoutMethods = $instructor->payout_methods;

			return ['payout' => $payout, 'payoutMethods' => $payoutMethods];
		}, 5);
	}

	function completePayoutRequest(string $payoutId, string $transactionId, string $payoutMethod)
	{
		DB::transaction(function () use ($payoutId, $transactionId, $payoutMethod) {
			PayoutHistory::where('id', $payoutId)->update([
				'status' => 'paid',
				'transaction_id' => $transactionId,
				'payout_method' => $payoutMethod,
			]);
		}, 5);
	}
}
