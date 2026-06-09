<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifiedAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is logged in
        if (!$request->user()) {
            return redirect()->route('login');
        }

        // Check if user has verified their email
        if (!$request->user()->hasVerifiedEmail()) {
            return redirect()->back()->with('error', 'Please verify your email address.');
        }

        return $next($request);
    }
}
