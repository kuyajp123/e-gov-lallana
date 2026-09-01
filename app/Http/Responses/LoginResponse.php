<?php

namespace App\Http\Responses;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Symfony\Component\HttpFoundation\Response;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  Request  $request
     */
    public function toResponse($request): Response
    {
        /** @var User|null $user */
        $user = $request->user();

        if ($user && ($user->isAdmin() || $user->isSubAdmin())) {
            return Inertia::location(url('/admin'));
        }

        return redirect()->intended('/dashboard');
    }
}
