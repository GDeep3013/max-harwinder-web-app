<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
class CheckUserStatus
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        // Check if the user is authenticated and if their status is inactive
        if ($user && $user->status === 'InActive') {
            Auth::logout(); // Log the user out
            return redirect()->route('login')->with('error', 'Your account is inactive. Please contact support.');
        }
        return $next($request);
    }
}
