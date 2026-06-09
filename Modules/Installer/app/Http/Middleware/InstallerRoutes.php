<?php

namespace Modules\Installer\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class InstallerRoutes
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $installed = Storage::disk('public')->exists('installed') || env('MENTOR_INSTALLED');

        if ($installed) {
            return redirect('/');
        } else {
            Inertia::share('flash', [
                'error' => fn() => $request->session()->get('error'),
                'warning' => fn() => $request->session()->get('warning'),
                'success' => fn() => $request->session()->get('success'),
            ]);

            return $next($request);
        }
    }
}
