<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = auth('api')->user();
        if (!$user) {
            // No hay token valido, detiene la ejecucion de inmediato
            return response()->json(['errors' => ['auth' => ['Unauthorized']]], 401);
        }

        if (!in_array($user->role, $roles, true)) {
            // El rol autenticado no coincide con los roles permitidos para la ruta
            return response()->json(['errors' => ['auth' => ['Forbidden']]], 403);
        }

        return $next($request);
    }
}
