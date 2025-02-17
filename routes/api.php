<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DealController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ContactController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);
    
    // CRM Deals (Mapped to /projects for frontend stability during migration)
    Route::get('/projects', [DealController::class, 'index']);
    Route::post('/projects', [DealController::class, 'store']);
    Route::get('/projects/{id}', [DealController::class, 'show']);
    Route::put('/projects/{id}', [DealController::class, 'update']);
    Route::delete('/projects/{id}', [DealController::class, 'destroy']);
    Route::post('/projects/{id}/members', [DealController::class, 'addMember']);

    // Canonical CRM routes
    Route::apiResource('deals', DealController::class);
    Route::apiResource('contacts', ContactController::class);
    
    // Activities (Tasks)
    Route::get('/my-tasks', [TaskController::class, 'myTasks']);
    Route::get('/projects/{projectId}/tasks', [TaskController::class, 'index']);
    Route::post('/projects/{projectId}/tasks', [TaskController::class, 'store']);
    Route::get('/projects/{projectId}/tasks/{taskId}', [TaskController::class, 'show']);
    Route::put('/projects/{projectId}/tasks/{taskId}', [TaskController::class, 'update']);
    Route::delete('/projects/{projectId}/tasks/{taskId}', [TaskController::class, 'destroy']);
    
    // Comments
    Route::get('/tasks/{taskId}/comments', [CommentController::class, 'index']);
    Route::post('/tasks/{taskId}/comments', [CommentController::class, 'store']);
    Route::put('/tasks/{taskId}/comments/{commentId}', [CommentController::class, 'update']);
    Route::delete('/tasks/{taskId}/comments/{commentId}', [CommentController::class, 'destroy']);
});