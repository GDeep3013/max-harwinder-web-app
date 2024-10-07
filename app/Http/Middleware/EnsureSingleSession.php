<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class EnsureSingleSession
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // if (Auth::check()) {
        //     $user = Auth::user();
        //     $currentSessionId = Session::getId();
            
        //     // If the current session does not match the one in the database, log out the other session
        //     if ($user->session_id && $user->session_id !== $currentSessionId) {
        //         Auth::logout();
        //         return redirect('/login')->withErrors(['message' => 'You have been logged out from another session.']);
        //     }

        //     // Update the session ID in the database
        //     $user->session_id = $currentSessionId;
        //     $user->save();
        // }

        return $next($request);
    }
}
