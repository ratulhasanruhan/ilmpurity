<?php

namespace App\Http\Middleware;

use App\Enums\TeachingType;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckCourseCreation
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $system = app('system_settings');

        if ($system->sub_type === TeachingType::COLLABORATIVE->value) {
            return $next($request);
        }

        return abort(404);
    }
}
