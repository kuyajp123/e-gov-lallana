<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminDocumentRequestController;
use App\Http\Controllers\Admin\AdminDocumentTypeController;
use App\Http\Controllers\Admin\AdminHouseholdController;
use App\Http\Controllers\Admin\AdminResidentProfileController;
use App\Http\Controllers\Admin\AdminStaffController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Dev\DevSmsController;
use App\Http\Controllers\Document\DocumentRequestController;
use App\Http\Controllers\Household\HouseholdController;
use App\Http\Controllers\Household\HouseholdHeadTransferController;
use App\Http\Controllers\Household\HouseholdInvitationController;
use App\Http\Controllers\Household\HouseholdMemberController;
use App\Http\Controllers\Household\HouseholdRegistrationController;
use App\Http\Controllers\Notification\NotificationController;
use App\Http\Controllers\Public\InquiryController;
use App\Http\Controllers\Public\LandingPageController;
use App\Http\Controllers\Public\LocaleController;
use App\Http\Controllers\Resident\ProfileAvatarController;
use App\Http\Controllers\Resident\ProfileController;
use App\Http\Middleware\EnsureHouseholdIsVerified;
use App\Http\Middleware\EnsureProfileIsComplete;
use App\Http\Middleware\EnsureUserIsAdmin;
use Illuminate\Support\Facades\Route;

// Public Landing Page & Inquiry Routes
Route::get('/', LandingPageController::class)->name('home');
Route::post('/inquiry', InquiryController::class)->name('inquiry.submit');
Route::post('/locale', LocaleController::class)->name('locale.switch');

// Authenticated Application Routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    // Administrative Portal (Inertia React)
    Route::middleware([EnsureUserIsAdmin::class])->group(function () {
        Route::get('/admin', AdminDashboardController::class)->name('filament.admin.pages.dashboard');
        Route::get('/admin/overview', AdminDashboardController::class)->name('admin.dashboard');

        // Document Requests Management
        Route::prefix('admin/document-requests')->name('admin.document-requests.')->group(function () {
            Route::get('/', [AdminDocumentRequestController::class, 'index'])->name('index');
            Route::get('/{documentRequest}', [AdminDocumentRequestController::class, 'show'])->name('show')->whereNumber('documentRequest');
            Route::patch('/{documentRequest}/status', [AdminDocumentRequestController::class, 'updateStatus'])->name('update-status')->whereNumber('documentRequest');
            Route::patch('/{documentRequest}/payment', [AdminDocumentRequestController::class, 'updatePayment'])->name('update-payment')->whereNumber('documentRequest');
            Route::patch('/{documentRequest}/notes', [AdminDocumentRequestController::class, 'updateNotes'])->name('update-notes')->whereNumber('documentRequest');
        });

        // Households Management & Verification
        Route::prefix('admin/households')->name('admin.households.')->group(function () {
            Route::get('/', [AdminHouseholdController::class, 'index'])->name('index');
            Route::get('/{household}', [AdminHouseholdController::class, 'show'])->name('show')->whereNumber('household');
            Route::post('/{household}/verify', [AdminHouseholdController::class, 'verify'])->name('verify')->whereNumber('household');
            Route::post('/{household}/restrict', [AdminHouseholdController::class, 'restrict'])->name('restrict')->whereNumber('household');
            Route::post('/{household}/archive', [AdminHouseholdController::class, 'archive'])->name('archive')->whereNumber('household');
            Route::post('/{household}/transfer-head', [AdminHouseholdController::class, 'transferHead'])->name('transfer-head')->whereNumber('household');
        });

        // Resident Profiles Civil Registry
        Route::prefix('admin/resident-profiles')->name('admin.resident-profiles.')->group(function () {
            Route::get('/', [AdminResidentProfileController::class, 'index'])->name('index');
            Route::get('/{residentProfile}', [AdminResidentProfileController::class, 'show'])->name('show')->whereNumber('residentProfile');
        });

        // Document Services Configuration
        Route::prefix('admin/document-types')->name('admin.document-types.')->group(function () {
            Route::get('/', [AdminDocumentTypeController::class, 'index'])->name('index');
            Route::get('/create', [AdminDocumentTypeController::class, 'create'])->name('create');
            Route::post('/', [AdminDocumentTypeController::class, 'store'])->name('store');
            Route::get('/{documentType}/edit', [AdminDocumentTypeController::class, 'edit'])->name('edit')->whereNumber('documentType');
            Route::put('/{documentType}', [AdminDocumentTypeController::class, 'update'])->name('update')->whereNumber('documentType');
            Route::post('/{documentType}/toggle', [AdminDocumentTypeController::class, 'toggleActive'])->name('toggle')->whereNumber('documentType');
            Route::delete('/{documentType}', [AdminDocumentTypeController::class, 'destroy'])->name('destroy')->whereNumber('documentType');
        });

        // Staff & Privileges Management
        Route::prefix('admin/staff')->name('admin.staff.')->group(function () {
            Route::get('/', [AdminStaffController::class, 'index'])->name('index');
            Route::post('/', [AdminStaffController::class, 'store'])->name('store');
            Route::post('/designate', [AdminStaffController::class, 'designate'])->name('designate');
            Route::put('/{user}', [AdminStaffController::class, 'update'])->name('update')->whereNumber('user');
            Route::post('/{user}/toggle-status', [AdminStaffController::class, 'toggleStatus'])->name('toggle-status')->whereNumber('user');
            Route::post('/{user}/revoke', [AdminStaffController::class, 'revoke'])->name('revoke')->whereNumber('user');
        });
    });

    // In-App Notifications
    Route::prefix('notifications')->name('notifications.')->group(function () {
        Route::get('/', [NotificationController::class, 'index'])->name('index');
        Route::patch('/{id}/read', [NotificationController::class, 'markAsRead'])->name('read');
        Route::post('/read-all', [NotificationController::class, 'markAllAsRead'])->name('read-all');
    });

    // Resident Profile (KYC) Routes
    Route::prefix('resident/profile')->name('resident.profile.')->group(function () {
        Route::get('/', fn () => redirect()->route('profile.edit'))->name('show');
        Route::get('/edit', fn () => redirect()->route('profile.edit'))->name('edit');
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

            // Household invitation response
            Route::post('/invitations/{member}/accept', [HouseholdInvitationController::class, 'accept'])->name('invitations.accept');
            Route::post('/invitations/{member}/reject', [HouseholdInvitationController::class, 'reject'])->name('invitations.reject');
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

// Developer SMS Simulator & Inbox (Local and Staging development only)
if (app()->environment(['local', 'staging', 'testing'])) {
    Route::prefix('dev/sms')->group(function () {
        Route::get('/', [DevSmsController::class, 'index'])->name('dev.sms.index');
        Route::post('/mode', [DevSmsController::class, 'setMode'])->name('dev.sms.mode');
        Route::post('/send', [DevSmsController::class, 'sendTest'])->name('dev.sms.send');
        Route::delete('/clear', [DevSmsController::class, 'clear'])->name('dev.sms.clear');
    });
}

require __DIR__.'/settings.php';
