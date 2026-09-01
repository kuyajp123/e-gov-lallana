<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureHouseholdIsVerified
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        /** @var User|null $user */
        $user = $request->user();

        if (! $user) {
            return $next($request);
        }

        // Bypass for administrative roles
        if ($user->isAdmin() || $user->isSubAdmin()) {
            return $next($request);
        }

        if (! $user->belongsToVerifiedHousehold()) {
            abort(403, 'Your household must be verified by the Barangay before you can submit document requests.');
        }

        return $next($request);
    }
}
