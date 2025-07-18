<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CourseController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
// Password reset routes removed

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/courses', [CourseController::class, 'index']); // List courses
    Route::get('/courses/{id}', [CourseController::class, 'show']); // Course details
    Route::post('/courses/{id}/enroll', [CourseController::class, 'enroll']); // Enroll in course
    Route::get('/my-courses', [CourseController::class, 'myCourses']); // User's enrolled courses
    
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
