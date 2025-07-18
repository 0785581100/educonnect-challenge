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

// Password Reset Routes
Route::get('/password/reset', function () {
    return response()->json(['message' => 'Password reset page']);
})->name('password.reset');

Route::get('/password/reset/{token}', function ($token) {
    return response()->json(['message' => 'Password reset form', 'token' => $token]);
})->name('password.reset');

Route::post('/password/reset', function () {
    return response()->json(['message' => 'Password reset processed']);
})->name('password.update');
