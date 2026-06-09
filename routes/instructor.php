<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Course\CourseAssignmentController;
use App\Http\Controllers\Course\CourseController;
use App\Http\Controllers\Course\CourseEnrollmentController;
use App\Http\Controllers\Course\CourseFaqController;
use App\Http\Controllers\Course\CourseOutcomeController;
use App\Http\Controllers\Course\CourseRequirementController;
use App\Http\Controllers\Course\CurriculumController;
use App\Http\Controllers\Course\LessonResourceController;
use App\Http\Controllers\Course\QuestionController;
use App\Http\Controllers\Course\QuizController;
use App\Http\Controllers\LiveClassController;
use App\Http\Controllers\PayoutController;

Route::prefix('dashboard')->group(function () {
   // dashboard
   Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

   // Courses
   Route::resource('courses', CourseController::class)->except(['update', 'destroy']);
   Route::post('courses/{id}', [CourseController::class, 'update'])->name('courses.update');
   Route::put('course/status/{id}', [CourseController::class, 'status'])->name('course.status')->middleware('smtpConfig', 'checkSmtp');

   Route::resource('course/faqs', CourseFaqController::class)->only(['store', 'update', 'destroy']);
   Route::resource('course/outcomes', CourseOutcomeController::class)->only(['store', 'update', 'destroy']);
   Route::resource('course/requirements', CourseRequirementController::class)->only(['store', 'update', 'destroy']);

   // curriculum
   Route::controller(CurriculumController::class)->group(function () {
      // Section route
      Route::post('section', 'section_store')->name('section.store');
      Route::put('section/{id}', 'section_update')->name('section.update');
      Route::delete('section/{id}', 'section_delete')->name('section.delete');
      Route::post('section/sort', 'section_sort')->name('section.sort');

      // lesson route
      Route::post('lesson', 'lesson_store')->name('lesson.store');
      Route::put('lesson/{id}', 'lesson_update')->name('lesson.update');
      Route::delete('lesson/{id}', 'lesson_delete')->name('lesson.delete');
      Route::post('lesson/sort', 'lesson_sort')->name('lesson.sort');
   });

   // assignment route
   Route::controller(CourseAssignmentController::class)->group(function () {
      Route::post('section/assignment', 'store')->name('assignment.store');
      Route::put('section/assignment/{id}', 'update')->name('assignment.update');
      Route::delete('section/assignment/{id}', 'destroy')->name('assignment.delete');
   });

   // Route::post('assignment/submission/grade/{id}', [AssignmentSubmissionController::class, 'update'])->name('assignment.submission.grade');

   // lesson resource route
   Route::resource('lesson/resources', LessonResourceController::class)->only(['store', 'update', 'destroy']);
   Route::get('lesson/resources/download/{id}', [LessonResourceController::class, 'download'])->name('resources.download');

   // section quiz
   Route::controller(QuizController::class)->group(function () {
      Route::post('section/quiz/store', 'store')->name('quiz.store');
      Route::delete('section/quiz/delete/{id}', 'destroy')->name('quiz.delete');
      Route::post('section/quiz/update/{id}', 'update')->name('quiz.update');
      Route::get('section/quiz/participant/result', 'result')->name('quiz.participant.result');
      Route::get('section/quiz/result/preview', 'result_preview')->name('quiz.result.preview');
   });

   // question route
   Route::controller(QuestionController::class)->group(function () {
      Route::post('quiz/question/store', 'store')->name('quiz.question.store');
      Route::put('quiz/question/update/{id}', 'update')->name('quiz.question.update');
      Route::delete('quiz/question/delete/{id}', 'delete')->name('quiz.question.delete');
      Route::post('quiz/question/sort/', 'sort')->name('quiz.question.sort');
   });

   // live classes
   Route::resource('live-class', LiveClassController::class)->only(['store', 'update', 'destroy']);

   // course enrolment
   Route::get('enrollments/courses', [CourseEnrollmentController::class, 'index'])->name('course-enrollments.index');

   // payout
   Route::middleware('checkCourseCreation')->group(function () {
      Route::resource('payouts', PayoutController::class)->only(['index', 'store', 'destroy']);
      Route::get('payouts/settings', [PayoutController::class, 'settings_index'])->name('payouts.settings.index');
      Route::post('payouts/settings', [PayoutController::class, 'settings_update'])->name('payouts.settings.update');
   });

   // settings
   Route::prefix('settings/account')->group(function () {
      Route::get('/', [SettingController::class, 'account'])->name('settings.account');
      Route::post('profile', [SettingController::class, 'profile_update'])->name('account.profile');
   });
});
