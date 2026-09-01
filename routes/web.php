<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Dev\DevSmsController;
use App\Http\Controllers\Document\DocumentRequestController;
use App\Http\Controllers\Household\HouseholdController;
use App\Http\Controllers\Household\HouseholdHeadTransferController;
use App\Http\Controllers\Household\HouseholdMemberController;
use App\Http\Controllers\Household\HouseholdRegistrationController;
use App\Http\Controllers\Public\InquiryController;
use App\Http\Controllers\Public\LandingPageController;
use App\Http\Controllers\Public\LocaleController;
use App\Http\Controllers\Resident\ProfileAvatarController;
use App\Http\Controllers\Resident\ProfileController;
use App\Http\Middleware\EnsureHouseholdIsVerified;
use App\Http\Middleware\EnsureProfileIsComplete;
use Illuminate\Support\Facades\Route;

// Public Landing Page & Inquiry Routes
Route::get('/', LandingPageController::class)->name('home');
Route::post('/inquiry', InquiryController::class)->name('inquiry.submit');
Route::post('/locale', LocaleController::class)->name('locale.switch');

// Authenticated Application Routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    // Resident Profile (KYC) Routes
    Route::prefix('resident/profile')->name('resident.profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'show'])->name('show');
        Route::get('/edit', [ProfileController::class, 'edit'])->name('edit');
        Route::post('/', [ProfileController::class, 'store'])->name('store');
        Route::put('/', [ProfileController::class, 'update'])->name('update');
        Route::post('/avatar', [ProfileAvatarController::class, 'update'])->name('avatar');
    });

    // Household & Member Routes (guarded by profile completion)
    Route::middleware([EnsureProfileIsComplete::class])->group(function () {
        Route::prefix('household')->name('household.')->group(function () {
            Route::get('/', [HouseholdController::class, 'index'])->name('index');
            Route::get('/register', [HouseholdRegistrationController::class, 'create'])->name('register');
            Route::post('/register/otp/send', [HouseholdRegistrationController::class, 'sendOtp'])->name('register.otp.send');
            Route::post('/register/otp/verify', [HouseholdRegistrationController::class, 'verifyOtp'])->name('register.otp.verify');
            Route::post('/register', [HouseholdRegistrationController::class, 'store'])->name('register.store');
            Route::get('/edit', [HouseholdController::class, 'edit'])->name('edit');
            Route::put('/', [HouseholdController::class, 'update'])->name('update');

            // Member management
            Route::post('/members', [HouseholdMemberController::class, 'store'])->name('members.store');
            Route::put('/members/{member}', [HouseholdMemberController::class, 'update'])->name('members.update');
            Route::delete('/members/{member}', [HouseholdMemberController::class, 'destroy'])->name('members.destroy');
            Route::post('/transfer-head', [HouseholdHeadTransferController::class, 'store'])->name('transfer-head');
        });

        // Document Request Routes
        Route::prefix('documents')->name('documents.')->group(function () {
            Route::get('/', [DocumentRequestController::class, 'index'])->name('index');
            Route::get('/{documentRequest}', [DocumentRequestController::class, 'show'])->name('show')->whereNumber('documentRequest');

            // Submission and mutation actions require verified household
            Route::middleware([EnsureHouseholdIsVerified::class])->group(function () {
                Route::get('/create/{documentType:slug}', [DocumentRequestController::class, 'create'])->name('create');
                Route::post('/', [DocumentRequestController::class, 'store'])->name('store');
                Route::get('/{documentRequest}/edit', [DocumentRequestController::class, 'edit'])->name('edit')->whereNumber('documentRequest');
                Route::put('/{documentRequest}', [DocumentRequestController::class, 'update'])->name('update')->whereNumber('documentRequest');
                Route::post('/{documentRequest}/cancel', [DocumentRequestController::class, 'cancel'])->name('cancel')->whereNumber('documentRequest');
            });
        });
    });
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
