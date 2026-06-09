<?php

use Illuminate\Support\Facades\Route;
use Modules\Updater\Http\Controllers\UpdaterController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('updater', UpdaterController::class)->names('updater');
});
