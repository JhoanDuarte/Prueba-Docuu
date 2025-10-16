<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function login(Request $request)
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

    public function me()
    {
        return response()->json(['data' => Auth::guard('api')->user()]);
    }

    public function logout()
    {
        Auth::guard('api')->logout();
        return response()->json(['data' => ['message' => 'Logged out']]);
    }

    public function refresh()
    {
        try {
            $newToken = JWTAuth::parseToken()->refresh();
            return $this->respondWithToken($newToken);
        } catch (\Exception $e) {
            return response()->json(['errors' => ['token' => ['Invalid or expired token']]], 401);
        }
    }

    protected function respondWithToken($token)
    {
        return response()->json([
            'data' => [
                'access_token' => $token,
                'token_type'   => 'bearer',
                // Usamos config en vez de factory() para evitar incompatibilidades
                'expires_in'   => (int) config('jwt.ttl', 60) * 60,
                'user'         => Auth::guard('api')->user(),
            ]
        ]);
    }
}
