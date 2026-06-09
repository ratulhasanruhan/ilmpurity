<?php

use Illuminate\Support\Facades\Route;
use Modules\Certificate\Http\Controllers\CertificateController;
use Modules\Certificate\Http\Controllers\CertificateTemplateController;
use Modules\Certificate\Http\Controllers\MarksheetTemplateController;

Route::middleware(['auth', 'verified'])->group(function () {
    // Admin routes for managing certificate templates
    Route::middleware(['role:admin'])->prefix('dashboard/certification')->group(function () {
        Route::resource('certificate', CertificateTemplateController::class)->except(['show', 'create', 'update'])->names('certificate.templates');
        Route::get('certificate/create-certificate', [CertificateTemplateController::class, 'create'])->name('certificate.templates.create');
        Route::post('certificate/{id}', [CertificateTemplateController::class, 'update'])->name('certificate.templates.update');
        Route::post('certificate/{id}/activate', [CertificateTemplateController::class, 'activate'])->name('certificate.templates.activate');

        Route::resource('marksheet', MarksheetTemplateController::class)->except(['show', 'create', 'update'])->names('marksheet.templates');
        Route::get('marksheet/create-marksheet', [MarksheetTemplateController::class, 'create'])->name('marksheet.templates.create');
        Route::post('marksheet/{id}', [MarksheetTemplateController::class, 'update'])->name('marksheet.templates.update');
        Route::post('marksheet/{id}/activate', [MarksheetTemplateController::class, 'activate'])->name('marksheet.templates.activate');
    });

    // Student routes for certificate download
    Route::resource('certificates', CertificateController::class)->names('certificate');
});
