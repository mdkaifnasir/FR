<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/login-face', [AuthController::class, 'loginByFace']);

// Public registration for students
Route::post('/students', [\App\Http\Controllers\StudentController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::apiResource('students', \App\Http\Controllers\StudentController::class)->except(['store']);
    Route::apiResource('courses', \App\Http\Controllers\CourseController::class);
    Route::apiResource('attendances', \App\Http\Controllers\AttendanceController::class);
    Route::post('/attendance/mark', [\App\Http\Controllers\AttendanceController::class, 'markPresent']);
});
