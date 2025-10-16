<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OrderController;

Route::prefix('auth')->group(function () {
    Route::post('login',  [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:api');
    Route::get('me',      [AuthController::class, 'me'])->middleware('auth:api');
    // refresh no usa 'auth:api' para permitir refrescar tokens expirados (dentro del refresh_ttl)
    Route::post('refresh',[AuthController::class, 'refresh']);
});

Route::middleware('auth:api')->group(function () {
    // viewer puede listar/ver
    Route::get('orders',       [OrderController::class, 'index'])->middleware('role:viewer,operator,admin');
    Route::get('orders/{order}',[OrderController::class, 'show'])->middleware('role:viewer,operator,admin');

    // operator/admin crean/editan/eliminan
    Route::post('orders',      [OrderController::class, 'store'])->middleware('role:operator,admin');
    Route::put('orders/{order}',[OrderController::class, 'update'])->middleware('role:operator,admin');
    Route::delete('orders/{order}',[OrderController::class, 'destroy'])->middleware('role:operator,admin');
});
