<?php

namespace App\Http\Middleware;

use App\Models\ResidentProfile;
use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureProfileIsComplete
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

        // Allow access to profile completion routes and settings
        if ($request->routeIs('resident.profile.*') || $request->routeIs('settings.*') || $request->routeIs('profile.*') || $request->routeIs('logout')) {
            return $next($request);
        }

        /** @var ResidentProfile|null $profile */
        $profile = $user->residentProfile;

        $isComplete = $profile !== null
            && ! empty($profile->first_name)
            && ! empty($profile->last_name)
            && $profile->birthdate !== null
            && ! empty($profile->gender)
            && ! empty($profile->civil_status)
            && ! empty($profile->citizenship)
            && $profile->government_id_file_id !== null;

        if (! $isComplete) {
            return redirect()->route('profile.edit')
                ->with('warning', 'Please complete your resident profile and upload a valid government ID to access barangay services.');
        }

        return $next($request);
    }
}
