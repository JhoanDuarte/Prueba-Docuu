<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use PHPOpenSourceSaver\JWTAuth\JWTGuard;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email'    => ['required','email'],
            'password' => ['required','string'],
        ]);

        if (!$token = Auth::guard('api')->attempt($credentials)) {
            return response()->json(['errors' => ['credentials' => ['Invalid credentials']]], 401);
        }

        return $this->respondWithToken($token);
    }

    public function me(): JsonResponse
    {
        return response()->json(['data' => Auth::guard('api')->user()]);
    }

    public function logout(): JsonResponse
    {
        Auth::guard('api')->logout();
        return response()->json(['data' => ['message' => 'Logged out']]);
    }

    public function refresh(): JsonResponse
    {
        try {
            $newToken = JWTAuth::parseToken()->refresh();
            return $this->respondWithToken($newToken);
        } catch (\Exception $e) {
            return response()->json(['errors' => ['token' => ['Invalid or expired token']]], 401);
        }
    }

    protected function respondWithToken(string $token): JsonResponse
    {
        /** @var JWTGuard $guard */
        $guard = Auth::guard('api');
        if (method_exists($guard, 'setToken')) {
            // Sincroniza el token actual con el guard para mantener el contexto de usuario
            $guard->setToken($token);
        }

        $user = $guard->user();

        if (!$user) {
            try {
                // Respaldo cuando el guard no cargo el usuario pero el token sigue siendo valido
                $user = JWTAuth::setToken($token)->toUser();
            } catch (\Throwable) {
                $user = null;
            }
        }

        return response()->json([
            'data' => [
                'access_token' => $token,
                'token_type'   => 'bearer',
                // Usamos config en vez de factory() para evitar incompatibilidades
                'expires_in'   => (int) config('jwt.ttl', 60) * 60,
                'user'         => $user,
            ]
        ]);
    }
}
