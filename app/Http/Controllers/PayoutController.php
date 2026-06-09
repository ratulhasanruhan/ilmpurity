<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePayoutRequest;
use App\Http\Requests\UpdatePayoutGatewayRequest;
use App\Services\Payout\PayoutService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PayoutController extends Controller
{
    public function __construct(
        private PayoutService $payoutService,
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $stats = $this->payoutService->getPayoutStatus($user);
        $payouts = $this->payoutService->getPayouts([...$request->all(), 'user_id' => $user->id], true);

        return Inertia::render('dashboard/payouts/index', [
            ...$stats,
            'payouts' => $payouts,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePayoutRequest $request)
    {
        $user = Auth::user();
        $stats = $this->payoutService->getPayoutStatus($user);

        if ($request->amount > $stats['availableForWithdrawal']) {
            return back()->with('error', 'Insufficient balance');
        }

        $this->payoutService->createPayout($request->validated(), $user->id);

        return back()->with('success', 'Payout request created successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * Display a listing of the resource.
     */
    public function settings_index()
    {
        $instructor = Auth::user()->instructor;

        return Inertia::render('dashboard/payouts/settings', compact('instructor'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function settings_update(UpdatePayoutGatewayRequest $request)
    {
        $instructor = Auth::user()->instructor;
        $this->payoutService->updatePayoutGateway($request->validated(), $instructor->id);

        return back()->with('success', 'Payout gateway updated successfully');
    }

    /**
     * Display a listing of the resource.
     */
    public function request_index(Request $request)
    {
        $payouts = $this->payoutService->getPayouts([...$request->all(), 'status' => 'pending'], true);

        return Inertia::render('dashboard/payouts/request', compact('payouts'));
    }

    /**
     * Display a listing of the resource.
     */
    public function history_index(Request $request)
    {
        $payouts = $this->payoutService->getPayouts([...$request->all(), 'status' => 'paid'], true);

        return Inertia::render('dashboard/payouts/history', compact('payouts'));
    }

    public function checkout(string $slug, string $request_id)
    {
        $payouts = $this->payoutService->getPayoutGateways($request_id);

        return view('payout.checkout', [
            ...$payouts,
            'slug' => $slug,
            'request_id' => $request_id,
        ]);
    }
}
