<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\Auth\SuperAdminSyncService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AdminAuthController extends Controller
{
    /**
     * Display the admin login view.
     */
    public function create(Request $request): Response|RedirectResponse
    {
        if ($user = $request->user()) {
            return $user->can_access_admin
                ? redirect()->route('filament.admin.pages.dashboard')
                : redirect()->route('dashboard');
        }

        return Inertia::render('admin/auth/login', [
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming admin authentication request.
     */
    public function store(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        $email = strtolower(trim((string) $credentials['email']));
        $throttleKey = Str::transliterate($email.'|'.$request->ip());

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);

            throw ValidationException::withMessages([
                'email' => trans('auth.throttle', [
                    'seconds' => $seconds,
                    'minutes' => (int) ceil($seconds / 60),
                ]),
            ]);
        }

        /** @var User|null $user */
        $user = User::where('email', $email)->first();

        // Lazy sync super admin if configured and not yet in database
        if (! $user && $this->isConfiguredSuperAdmin($email)) {
            app(SuperAdminSyncService::class)->sync();
            $user = User::where('email', $email)->first();
        }

        if (! $user || ! Hash::check((string) $credentials['password'], $user->password)) {
            RateLimiter::hit($throttleKey);

            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        // Enforce administrative access control
        if (! $user->can_access_admin) {
            RateLimiter::hit($throttleKey);

            throw ValidationException::withMessages([
                'email' => __('Access restricted: This portal is exclusively for authorized Barangay Officials and Staff. Residents please sign in via the Resident Portal.'),
            ]);
        }

        Auth::login($user, $request->boolean('remember'));
        RateLimiter::clear($throttleKey);
        $request->session()->regenerate();

        return redirect()->intended(route('filament.admin.pages.dashboard'));
    }

    /**
     * Destroy an authenticated admin session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login');
    }

    /**
     * Check if email belongs to configured Super Admins.
     */
    private function isConfiguredSuperAdmin(string $email): bool
    {
        $superAdmins = config('auth.super_admins', []);

        if (! is_array($superAdmins) || empty($superAdmins)) {
            return false;
        }

        $email = strtolower(trim($email));

        foreach ($superAdmins as $adminData) {
            $configuredEmail = is_array($adminData) ? ($adminData['email'] ?? null) : (is_string($adminData) ? $adminData : null);

            if ($configuredEmail && strtolower(trim((string) $configuredEmail)) === $email) {
                return true;
            }
        }

        return false;
    }
}
