<?php

use App\Models\AppNotification;
use App\Models\Household;
use App\Models\HouseholdMember;
use App\Models\Role;
use App\Models\User;
use App\Services\Notification\NotificationService;
use Illuminate\Support\Facades\Gate;

beforeEach(function () {
    $this->adminRole = Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Barangay Administrator']);
    $this->subAdminRole = Role::firstOrCreate(['slug' => 'sub_admin'], ['name' => 'Barangay Sub-admin / Staff']);
    $this->residentRole = Role::firstOrCreate(['slug' => 'resident'], ['name' => 'Resident']);

    $this->admin = User::factory()->create(['role_id' => $this->adminRole->id, 'status' => 'active']);
    $this->subAdmin = User::factory()->create(['role_id' => $this->subAdminRole->id, 'status' => 'active']);
    $this->familyHead = User::factory()->create(['role_id' => $this->residentRole->id, 'status' => 'active']);

    $this->household = Household::create([
        'household_code' => 'HH-2026-RESTRICT-01',
        'family_head_id' => $this->familyHead->id,
        'address' => '123 Rizal St.',
        'purok_sitio' => 'Purok 3',
        'status' => 'verified',
        'verified_at' => now(),
    ]);

    HouseholdMember::create([
        'household_id' => $this->household->id,
        'user_id' => $this->familyHead->id,
        'first_name' => 'Juan',
        'last_name' => 'Dela Cruz',
        'relationship_to_head' => 'head',
        'is_family_head' => true,
        'birthdate' => '1985-06-15',
        'gender' => 'male',
        'residency_status' => 'resident',
    ]);
});

test('admin can restrict a verified household with mandatory reason', function () {
    expect($this->household->isVerified())->toBeTrue()
        ->and($this->familyHead->belongsToVerifiedHousehold())->toBeTrue();

    // Restrict household
    $reason = 'Failed to submit updated residency proof after notice.';
    $this->household->update([
        'status' => 'restricted',
        'notes' => $reason,
    ]);

    $this->household->verification()->updateOrCreate(
        ['verifiable_type' => Household::class, 'verifiable_id' => $this->household->id],
        [
            'status' => 'restricted',
            'review_notes' => $reason,
            'reviewer_id' => $this->admin->id,
            'reviewed_at' => now(),
        ]
    );

    app(NotificationService::class)->send(
        $this->familyHead,
        'household_restricted',
        'Household Placed Under Administrative Restriction',
        "Your household registration ({$this->household->household_code}) has been placed under administrative restriction: {$reason}",
        '/household',
        $this->household
    );

    $this->household->refresh();

    expect($this->household->isRestricted())->toBeTrue()
        ->and($this->household->notes)->toBe($reason)
        ->and($this->familyHead->belongsToVerifiedHousehold())->toBeFalse();

    // Check notification was logged
    $notification = AppNotification::where('user_id', $this->familyHead->id)
        ->where('type', 'household_restricted')
        ->first();

    expect($notification)->not->toBeNull()
        ->and($notification->message)->toContain($reason);
});

test('admin can unrestrict a restricted household and restore verified status', function () {
    $this->household->update([
        'status' => 'restricted',
        'notes' => 'Under administrative review',
    ]);

    expect($this->household->isRestricted())->toBeTrue();

    // Lift restriction
    $liftingNotes = 'Settled boundary and document verification requirements.';
    $this->household->update([
        'status' => 'verified',
        'verified_at' => now(),
        'notes' => $liftingNotes,
    ]);

    $this->household->verification()->updateOrCreate(
        ['verifiable_type' => Household::class, 'verifiable_id' => $this->household->id],
        [
            'status' => 'approved',
            'review_notes' => $liftingNotes,
            'reviewer_id' => $this->admin->id,
            'reviewed_at' => now(),
        ]
    );

    app(NotificationService::class)->send(
        $this->familyHead,
        'household_unrestricted',
        'Administrative Restriction Lifted',
        "The administrative restriction on your household registration ({$this->household->household_code}) has been lifted.",
        '/household',
        $this->household
    );

    $this->household->refresh();

    expect($this->household->isVerified())->toBeTrue()
        ->and($this->familyHead->belongsToVerifiedHousehold())->toBeTrue();

    // Check notification was logged
    $notification = AppNotification::where('user_id', $this->familyHead->id)
        ->where('type', 'household_unrestricted')
        ->first();

    expect($notification)->not->toBeNull();
});

test('admin can archive and restore household records', function () {
    $this->household->update(['status' => 'restricted']);

    // Admin archives household
    $this->household->update(['status' => 'archived']);
    $this->household->refresh();

    expect($this->household->isArchived())->toBeTrue()
        ->and($this->familyHead->belongsToVerifiedHousehold())->toBeFalse();

    // Admin restores household
    $this->household->update(['status' => 'verified', 'verified_at' => now()]);
    $this->household->refresh();

    expect($this->household->isVerified())->toBeTrue();
});

test('sub-admin is forbidden from restricting, un-restricting, or archiving households', function () {
    expect(Gate::forUser($this->subAdmin)->allows('restrict', $this->household))->toBeFalse()
        ->and(Gate::forUser($this->subAdmin)->allows('unrestrict', $this->household))->toBeFalse()
        ->and(Gate::forUser($this->subAdmin)->allows('archive', $this->household))->toBeFalse()
        ->and(Gate::forUser($this->subAdmin)->allows('restore', $this->household))->toBeFalse();

    // Admin is authorized
    expect(Gate::forUser($this->admin)->allows('restrict', $this->household))->toBeTrue()
        ->and(Gate::forUser($this->admin)->allows('unrestrict', $this->household))->toBeTrue()
        ->and(Gate::forUser($this->admin)->allows('archive', $this->household))->toBeTrue()
        ->and(Gate::forUser($this->admin)->allows('restore', $this->household))->toBeTrue();
});
