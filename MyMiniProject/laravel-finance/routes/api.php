<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\TransactionsController;
use App\Http\Controllers\Api\UsersController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('jwt')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::get('/dashboard', [DashboardController::class, 'show']);

    Route::get('/transactions', [TransactionsController::class, 'index']);
    Route::get('/transactions/{id}', [TransactionsController::class, 'show'])->whereNumber('id');
    Route::post('/transactions', [TransactionsController::class, 'store']);
    Route::put('/transactions/{id}', [TransactionsController::class, 'update'])->whereNumber('id');
    Route::delete('/transactions/{id}', [TransactionsController::class, 'destroy'])->whereNumber('id');

    Route::middleware('jwt:admin')->group(function () {
        Route::get('/users', [UsersController::class, 'index']);
        Route::get('/users/{id}', [UsersController::class, 'show'])->whereNumber('id');
        Route::post('/users', [UsersController::class, 'store']);
        Route::put('/users/{id}', [UsersController::class, 'update'])->whereNumber('id');
        Route::delete('/users/{id}', [UsersController::class, 'destroy'])->whereNumber('id');
    });
});
