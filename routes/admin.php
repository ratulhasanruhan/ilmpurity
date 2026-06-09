<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InstructorController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\Course\CategoryChildController;
use App\Http\Controllers\Course\CourseCategoryController;
use App\Http\Controllers\Course\CourseController;
use App\Http\Controllers\Course\CourseCouponController;
use App\Http\Controllers\Course\CourseEnrollmentController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\JobCircularController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\PayoutController;
use App\Http\Controllers\UsersController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
 */

Route::prefix('dashboard')->group(function () {
    // users
    Route::resource('users', UsersController::class)->only(['index', 'update']);

    // Category
    Route::resource('courses/categories', CourseCategoryController::class)->only(['index', 'store', 'destroy'])->names('categories');
    Route::post('courses/categories/update/{category}', [CourseCategoryController::class, 'update'])->name('categories.update');
    Route::post('courses/categories/sort', [CourseCategoryController::class, 'sort'])->name('categories.sort');
    Route::resource('courses/category-child', CategoryChildController::class)->only(['store', 'update', 'destroy'])->names('category-child');
    Route::post('courses/category-child/sort', [CategoryChildController::class, 'sort'])->name('category-child.sort');

    // course
    Route::delete('courses/{id}', [CourseController::class, 'destroy'])->name('courses.destroy');

    // exam coupon
    Route::resource('courses/course/coupons', CourseCouponController::class)->only(['index', 'store', 'update', 'destroy'])->names('course-coupons');

    // instructor
    Route::middleware('checkCourseCreation')->group(function () {
        Route::get('instructors/applications', [InstructorController::class, 'applications'])->name('instructors.applications');
        Route::put('instructors/status/{id}', [InstructorController::class, 'status'])->name('instructors.status')->middleware('smtpConfig', 'checkSmtp');
        Route::resource('instructors', InstructorController::class)->except(['show', 'update']);
    });

    // course enrolment
    Route::resource('enrollments', CourseEnrollmentController::class)->only(['create', 'destroy']);

    // notification
    Route::resource('newsletters', NewsletterController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::post('newsletters/send', [NewsletterController::class, 'newsletter_send'])->name('newsletters.send')->middleware('smtpConfig', 'checkSmtp');

    // payout
    Route::middleware('checkCourseCreation')->prefix('payouts')->group(function () {
        Route::get('request', [PayoutController::class, 'request_index'])->name('payouts.request.index');
        Route::get('history', [PayoutController::class, 'history_index'])->name('payouts.history.index');
    });

    // job circulars
    Route::resource('job-circulars', JobCircularController::class)->except(['show']);
    Route::put('job-circulars/{job_circular}/toggle-status', [JobCircularController::class, 'toggleStatus'])->name('job-circulars.toggle-status');

    // settings
    Route::controller(SettingController::class)->group(function () {
        Route::get('settings/auth0', 'auth0')->name('settings.auth0');
        Route::post('settings/auth0/{id}', 'auth0_update')->name('settings.auth0.update');

        Route::get('settings/system', 'system')->name('settings.system');
        Route::post('settings/system/{id}', 'system_update')->name('settings.system.update');

        Route::get('settings/pages', 'pages')->name('settings.pages');
        Route::post('settings/home-page/{id}', 'home_pages_update')->name('settings.home-page.update');
        Route::post('settings/system-type', 'system_type_update')->name('settings.system-type.update');

        Route::get('settings/custom-page/{id}', 'custom_pages_edit')->name('settings.custom-page.edit');
        Route::post('settings/custom-page', 'custom_pages_store')->name('settings.custom-page.store');
        Route::put('settings/custom-page/{id}', 'custom_pages_update')->name('settings.custom-page.update');
        Route::delete('settings/custom-page/{id}', 'custom_pages_destroy')->name('settings.custom-page.destroy');

        Route::get('settings/storage', 'storage')->name('settings.storage');
        Route::post('settings/storage/{id}', 'storage_update')->name('settings.storage.update');

        Route::get('settings/payment', 'payment')->name('settings.payment');
        Route::post('settings/payment/{id}', 'payment_update')->name('settings.payment.update');

        Route::get('settings/smtp', 'smtp')->name('settings.smtp');
        Route::post('settings/smtp/{id}', 'smtp_update')->name('settings.smtp.update');

        Route::get('settings/maintenance', 'maintenance')->name('settings.maintenance');

        Route::get('settings/live-class', 'live_class')->name('settings.live-class');
        Route::post('settings/live-class/{id}', 'live_class_update')->name('settings.live-class.update');

        // Navbar management routes
        Route::post('settings/navbar/{navbar}/items', 'navbar_items_store')->name('settings.navbar.items.store');
        Route::put('settings/navbar-items/{item}', 'navbar_items_update')->name('settings.navbar.items.update');
        Route::delete('settings/navbar-items/{item}', 'navbar_items_destroy')->name('settings.navbar.items.destroy');
        Route::post('settings/navbar-items/reorder', 'navbar_items_reorder')->name('settings.navbar.items.reorder');

        // Footer management routes
        Route::post('settings/footer/{footer}/items', 'footer_items_store')->name('settings.footer.items.store');
        Route::put('settings/footer-items/{item}', 'footer_items_update')->name('settings.footer.items.update');
        Route::delete('settings/footer-items/{item}', 'footer_items_destroy')->name('settings.footer.items.destroy');
        Route::post('settings/footer-items/reorder', 'footer_items_reorder')->name('settings.footer.items.reorder');
    });

    // customize home page sections
    Route::controller(HomeController::class)->prefix('page/section')->group(function () {
        Route::post('sort', 'sort_section')->name('page.section.sort');
        Route::post('update/{id}', 'update_section')->name('page.section.update');
    });
});

Route::get('/demo/{slug}', [HomeController::class, 'demo'])->name('home.demo');
