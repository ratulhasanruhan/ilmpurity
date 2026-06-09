<?php

namespace Modules\Updater\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        // Check if user is not authenticated
        if (Auth::check()) {
            return redirect()->route('system.maintenance');
        }

        return $next($request);
    }
}
