<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Modules\Installer\Http\Controllers\InstallerController;
use Modules\Installer\Http\Controllers\InstallerDBController;
use Modules\Installer\Http\Middleware\InstallerRoutes;

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

// Only override session driver if application is not installed
if (!Storage::disk('public')->exists('installed') || !env('MENTOR_INSTALLED')) {
    config(['session.driver' => 'file']);
}

Route::middleware(InstallerRoutes::class)->group(function () {
    Route::get('install/step-1', [InstallerController::class, 'index'])->name('install.index');

    Route::get('install/step-2', [InstallerController::class, 'show_step2'])->name('install.show-step2');
    Route::post('install/step-2', [InstallerController::class, 'store_step2'])->name('install.store-step2');

    Route::get('install/step-3', [InstallerController::class, 'show_step3'])->name('install.show-step3');
    Route::post('install/step-3', [InstallerController::class, 'store_step3'])->name('install.store-step3');

    Route::get('install/step-4', [InstallerController::class, 'show_step4'])->name('install.show-step4');
    Route::post('install/step-4', [InstallerController::class, 'store_step4'])->name('install.store-step4');

    Route::get('install/processing', [InstallerController::class, 'show_processing'])->name('install.show-processing');
    Route::post('install/processing', [InstallerController::class, 'store_processing'])->name('install.store-processing');

    Route::get('install/finish', [InstallerController::class, 'finish'])->name('install.finish');

    Route::post('install/check-database', [InstallerDBController::class, 'databaseChecker'])->name('check-database');
    Route::get('install/generate-app-key', [InstallerController::class, 'generateAppKey'])->name('generate-app-key');
});

Route::get('install/refresh', [InstallerController::class, 'refresh'])->name('install.refresh');
