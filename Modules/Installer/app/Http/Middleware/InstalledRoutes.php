<?php

namespace Modules\Installer\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class InstalledRoutes
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $installed = Storage::disk('public')->exists('installed') || env('MENTOR_INSTALLED');

        if ($installed) {
            return $next($request);
        } else {
            return redirect(route('install.index'));
        }
    }
}
