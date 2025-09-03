<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\VoteController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

Route::get('/', [HomeController::class, 'index'])->name('home');

// Public product routes
Route::get('/products', [ProductController::class, 'index'])->name('products.index');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Protected product routes
    Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');

    // Vote routes
    Route::post('/votes', [VoteController::class, 'store'])->name('votes.store');

    // Comment routes
    Route::post('/comments', [CommentController::class, 'store'])->name('comments.store');
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');
});

// Product show route (must come after /create route)
Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
