<?php

use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Support\Facades\Route;
use Modules\Updater\Http\Controllers\SystemController;
use Modules\Updater\Http\Controllers\UpdaterController;
use Modules\Updater\Http\Middleware\MaintenanceMiddleware;
use Modules\Updater\Http\Middleware\AuthMiddleware;

Route::middleware([AuthMiddleware::class])->group(function () {
    Route::get('system/login', [SystemController::class, 'login'])->name('system.login');
    Route::post('system/login', [SystemController::class, 'verify'])->name('system.verify');
});

Route::withoutMiddleware([HandleInertiaRequests::class])->middleware([MaintenanceMiddleware::class])->group(function () {
    Route::get('system/maintenance', [UpdaterController::class, 'index'])->name('system.maintenance');

    Route::post('system/backup', [UpdaterController::class, 'createBackup'])->name('system.backup');
    Route::delete('system/backup/{id}', [UpdaterController::class, 'deleteBackup'])->name('system.backup.delete');
    Route::post('system/backup/{id}/restore', [UpdaterController::class, 'restoreBackup'])->name('system.backup.restore');
    Route::get('system/backup/{id}/download', [UpdaterController::class, 'downloadBackup'])->name('system.backup.download');

    Route::post('system/update', [UpdaterController::class, 'updateApp'])->name('system.update');
    Route::get('system/update', [UpdaterController::class, 'updateAppSeeder'])->name('system.update.seeder');

    Route::post('system/refresh', [SystemController::class, 'refresh'])->name('system.refresh');
    Route::post('system/clear', [SystemController::class, 'clear'])->name('system.clear');
    Route::post('system/reboot', [SystemController::class, 'reboot'])->name('system.reboot');
});
