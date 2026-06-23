<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ConfiguratorController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Products (Master Data)
    Route::resource('products', ProductController::class);
    Route::post('products/{product}/sync-configurators', [ProductController::class, 'syncConfigurators'])->name('products.sync-configurators');
    
    // Configurators (Packages)
    Route::resource('configurators', ConfiguratorController::class);
    Route::post('configurators/{configurator}/sync-products', [ConfiguratorController::class, 'syncProducts'])->name('configurators.sync-products');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
