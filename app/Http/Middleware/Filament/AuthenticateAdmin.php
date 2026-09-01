<?php

namespace App\Http\Middleware\Filament;

use Filament\Http\Middleware\Authenticate as BaseAuthenticate;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class AuthenticateAdmin extends BaseAuthenticate
{
    /**
     * @param  Request  $request
     * @param  array<string>  ...$guards
     */
    protected function authenticate($request, array $guards): void
    {
        $guard = $this->auth->guard($guards[0] ?? null);

        if (! $guard->check()) {
            $this->unauthenticated($request, $guards);
        }

        $this->auth->shouldUse($guards[0] ?? null);

        /** @var Model|null $user */
        $user = $guard->user();

        /** @var Panel $panel */
        $panel = filament()->getCurrentOrDefaultPanel();

        abort_unless($user instanceof FilamentUser && $user->canAccessPanel($panel), 404);
    }
}
