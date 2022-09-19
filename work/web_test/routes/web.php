<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('welcome', function () {
    return view('test');
});

Route::get('index', function () {
    return view('index');
})->middleware('auth');

Route::get('form', function () {
    return view('form');
});

Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::get('/page', [App\Http\Controllers\HomeController::class, 'page']);

Route::post('postprofile', [App\Http\Controllers\ProfileController::class, 'saveprofile']);