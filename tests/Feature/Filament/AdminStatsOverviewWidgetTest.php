<?php

use App\Enums\DocumentRequestStatus;
use App\Filament\Widgets\AdminStatsOverviewWidget;
use App\Filament\Widgets\DemographicsChartWidget;
use App\Filament\Widgets\DocumentRequestVolumeChartWidget;
use App\Filament\Widgets\SpecialSectorsChartWidget;
use App\Models\DocumentRequest;
use App\Models\DocumentType;
use App\Models\Household;
use App\Models\ResidentProfile;
use App\Models\Role;
use App\Models\User;
use Livewire\Livewire;

beforeEach(function () {
    $this->adminRole = Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Barangay Administrator']);
    $this->subAdminRole = Role::firstOrCreate(['slug' => 'sub_admin'], ['name' => 'Barangay Sub-admin / Staff']);
    $this->residentRole = Role::firstOrCreate(['slug' => 'resident'], ['name' => 'Resident']);

    $this->admin = User::factory()->create(['role_id' => $this->adminRole->id, 'status' => 'active']);
    $this->subAdmin = User::factory()->create(['role_id' => $this->subAdminRole->id, 'status' => 'active']);
});

test('admin dashboard renders successfully with phase 5 widgets for admin', function () {
    $response = $this->actingAs($this->admin)->get('/admin');

    $response->assertOk();
    $response->assertSee('AdminStatsOverviewWidget');
    $response->assertSee('DemographicsChartWidget');
});

test('admin stats overview widget computes accurate live metrics', function () {
    // Seed test data
    $user1 = User::factory()->create(['role_id' => $this->residentRole->id]);
    $user2 = User::factory()->create(['role_id' => $this->residentRole->id]);

    ResidentProfile::create([
        'user_id' => $user1->id,
        'first_name' => 'Maria',
        'last_name' => 'Santos',
        'gender' => 'female',
        'birthdate' => '1995-05-15',
        'residency_status' => 'resident',
    ]);

    ResidentProfile::create([
        'user_id' => $user2->id,
        'first_name' => 'Pedro',
        'last_name' => 'Penduko',
        'gender' => 'male',
        'birthdate' => '1950-01-01',
        'senior_citizen_status' => true,
        'residency_status' => 'resident',
    ]);

    Household::create([
        'household_code' => 'HH-2026-TEST1',
        'family_head_id' => $user1->id,
        'address' => 'Zone 1',
        'purok_sitio' => 'Purok 1',
        'status' => 'verified',
    ]);

    Household::create([
        'household_code' => 'HH-2026-TEST2',
        'family_head_id' => $user2->id,
        'address' => 'Zone 2',
        'purok_sitio' => 'Purok 2',
        'status' => 'unverified',
    ]);

    $docType = DocumentType::firstOrCreate(
        ['name' => 'Barangay Clearance'],
        ['slug' => 'barangay-clearance', 'fee_cents' => 5000, 'processing_days' => 1, 'is_active' => true]
    );

    DocumentRequest::create([
        'reference_code' => 'REQ-2026-0001',
        'user_id' => $user1->id,
        'document_type_id' => $docType->id,
        'current_status' => DocumentRequestStatus::Pending,
        'purpose' => 'Employment',
    ]);

    DocumentRequest::create([
        'reference_code' => 'REQ-2026-0002',
        'user_id' => $user2->id,
        'document_type_id' => $docType->id,
        'current_status' => DocumentRequestStatus::ReadyForPickup,
        'purpose' => 'Identification',
    ]);

    $this->actingAs($this->admin);

    $component = Livewire::test(AdminStatsOverviewWidget::class);
    $component->assertSuccessful();

    // Verify stats array
    $stats = $component->instance()->getStats();
    expect($stats)->toBeArray()
        ->and(count($stats))->toBeGreaterThanOrEqual(5);

    $labels = array_map(fn ($stat) => $stat->getLabel(), $stats);
    expect($labels)->toContain('Total Residents')
        ->toContain('Verified Households')
        ->toContain('Pending Verifications')
        ->toContain('Active Document Requests')
        ->toContain('Ready for Release')
        ->toContain('Active Sub-Admins');
});

test('sub-admin stats overview excludes active sub-admins count', function () {
    $this->actingAs($this->subAdmin);

    $component = Livewire::test(AdminStatsOverviewWidget::class);
    $component->assertSuccessful();

    $stats = $component->instance()->getStats();
    $labels = array_map(fn ($stat) => $stat->getLabel(), $stats);

    expect($labels)->not->toContain('Active Sub-Admins');
});

test('demographics chart widget calculates age cohort data', function () {
    $this->actingAs($this->admin);

    $component = Livewire::test(DemographicsChartWidget::class);
    $component->assertSuccessful();

    $data = $component->instance()->getData();
    expect($data)->toHaveKey('datasets')
        ->and($data)->toHaveKey('labels');
});

test('special sectors chart widget returns sector counts', function () {
    $this->actingAs($this->admin);

    $component = Livewire::test(SpecialSectorsChartWidget::class);
    $component->assertSuccessful();

    $data = $component->instance()->getData();
    expect($data)->toHaveKey('datasets')
        ->and($data['labels'])->toContain('Senior Citizens', 'PWDs', 'Solo Parents', 'Registered Voters');
});

test('document request volume chart widget returns 6-month trends', function () {
    $this->actingAs($this->admin);

    $component = Livewire::test(DocumentRequestVolumeChartWidget::class);
    $component->assertSuccessful();

    $data = $component->instance()->getData();
    expect($data)->toHaveKey('datasets')
        ->and($data)->toHaveKey('labels')
        ->and(count($data['labels']))->toBe(6);
});
