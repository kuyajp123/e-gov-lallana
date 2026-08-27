<?php

use App\Http\Controllers\Dev\DevSmsController;
use App\Http\Controllers\Public\InquiryController;
use App\Http\Controllers\Public\LandingPageController;
use App\Http\Controllers\Public\LocaleController;
use Illuminate\Support\Facades\Route;

// Public Landing Page & Inquiry Routes
Route::get('/', LandingPageController::class)->name('home');
Route::post('/inquiry', InquiryController::class)->name('inquiry.submit');
Route::post('/locale', LocaleController::class)->name('locale.switch');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

// Developer SMS Simulator & Inbox (Local development only)
if (app()->isLocal()) {
    Route::prefix('dev/sms')->group(function () {
        Route::get('/', [DevSmsController::class, 'index'])->name('dev.sms.index');
        Route::post('/mode', [DevSmsController::class, 'setMode'])->name('dev.sms.mode');
        Route::post('/send', [DevSmsController::class, 'sendTest'])->name('dev.sms.send');
        Route::delete('/clear', [DevSmsController::class, 'clear'])->name('dev.sms.clear');
    });
}

require __DIR__.'/settings.php';
