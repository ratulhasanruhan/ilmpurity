<?php

namespace Modules\Updater\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SystemController extends Controller
{
    public function login()
    {
        return Inertia::render('system/login');
    }

    public function verify(LoginRequest $request)
    {
        $request->authenticate();
        $request->session()->regenerate();

        return redirect()->intended(route('system.maintenance', absolute: false));
    }

    public function refresh()
    {
        try {
            // Touch .env file to trigger application reload
            $envPath = base_path('.env');
            if (file_exists($envPath)) {
                touch($envPath);
            }

            return redirect(route('system.maintenance'))->with('success', 'Server refreshed successfully!');
        } catch (\Exception $e) {
            Log::error('Server refresh failed: ' . $e->getMessage());
            return redirect(route('system.maintenance'))->with('error', 'Server refresh failed: ' . $e->getMessage());
        }
    }

    public function clear(Request $request)
    {
        // Clear caches without affecting logged in users
        Artisan::call('optimize:clear');
        Artisan::call('up');

        return redirect(route('system.maintenance'))->with('success', 'System cache cleared successfully!');
    }

    public function reboot(Request $request)
    {
        // Clear caches without affecting logged in users
        Artisan::call('cache:clear');
        Artisan::call('config:clear');
        Artisan::call('route:clear');
        Artisan::call('view:clear');
        // Artisan::call('optimize');
        Artisan::call('up');

        return redirect(route('system.maintenance'))->with('success', 'System rebooted successfully!');
    }
}
