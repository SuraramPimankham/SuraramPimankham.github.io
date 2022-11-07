<?php

use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;
use App\Http\Controllers\MangaController;
use App\Models\Post;
use Illuminate\Support\Facades\Auth;

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
    $data = Post::latest()->paginate(5);
                    //latest
                    //first
        return view('home', compact('data'))
                ->with('i', (request()->input('page', 1) - 1) * 5);
});

Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
Route::get('admin',[HomeController::class,'adminHome'])->name('adminhome')->middleware('is_admin');

Route::resource('posts', PostController::class);
Route::resource('mangas', MangaController::class);
