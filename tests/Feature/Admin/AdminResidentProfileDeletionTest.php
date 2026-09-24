<?php

use App\Models\FileRecord;
use App\Models\Household;
use App\Models\HouseholdMember;
use App\Models\ResidentProfile;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

beforeEach(function () {
    /** @var TestCase $this */
    $this->adminRole = Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Admin']);
    $this->subAdminRole = Role::firstOrCreate(['slug' => 'sub_admin'], ['name' => 'Sub Admin']);
    $this->residentRole = Role::firstOrCreate(['slug' => 'resident'], ['name' => 'Resident']);

    $this->admin = User::factory()->create(['role_id' => $this->adminRole->id]);
    $this->subAdmin = User::factory()->create(['role_id' => $this->subAdminRole->id]);
    $this->residentUser = User::factory()->create(['role_id' => $this->residentRole->id]);

    $this->profile = ResidentProfile::create([
        'user_id' => $this->residentUser->id,
        'first_name' => 'Juan',
        'last_name' => 'Dela Cruz',
        'birthdate' => '1990-01-01',
        'gender' => 'male',
        'civil_status' => 'single',
        'citizenship' => 'Filipino',
        'residency_status' => 'official',
        'is_voter' => true,
    ]);
});

test('admin can permanently delete a resident profile and user account', function () {
    $response = $this->actingAs($this->admin)
        ->delete("/admin/resident-profiles/{$this->profile->id}");

    $response->assertRedirect('/admin/resident-profiles');
    $response->assertSessionHas('success');

    $this->assertDatabaseMissing('resident_profiles', ['id' => $this->profile->id]);
    $this->assertDatabaseMissing('users', ['id' => $this->residentUser->id]);
});

test('deleting a resident who is the sole member of a household deletes the entire household', function () {
    $household = Household::create([
        'household_code' => 'HH-2026-TEST1',
        'family_head_id' => $this->residentUser->id,
        'address' => '123 Rizal St',
        'purok_sitio' => 'Purok 1',
        'status' => 'verified',
    ]);

    $member = HouseholdMember::create([
        'household_id' => $household->id,
        'user_id' => $this->residentUser->id,
        'first_name' => 'Juan',
        'last_name' => 'Dela Cruz',
        'relationship_to_head' => 'head',
        'is_family_head' => true,
        'birthdate' => '1990-01-01',
    ]);

    $response = $this->actingAs($this->admin)
        ->delete("/admin/resident-profiles/{$this->profile->id}");

    $response->assertRedirect('/admin/resident-profiles');

    $this->assertDatabaseMissing('resident_profiles', ['id' => $this->profile->id]);
    $this->assertDatabaseMissing('users', ['id' => $this->residentUser->id]);
    $this->assertDatabaseMissing('household_members', ['id' => $member->id]);
    $this->assertDatabaseMissing('households', ['id' => $household->id]);
});

test('deleting a resident who is family head of a multi-member household transfers head authority to successor', function () {
    $household = Household::create([
        'household_code' => 'HH-2026-TEST2',
        'family_head_id' => $this->residentUser->id,
        'address' => '456 Bonifacio St',
        'purok_sitio' => 'Purok 2',
        'status' => 'verified',
    ]);

    $headMember = HouseholdMember::create([
        'household_id' => $household->id,
        'user_id' => $this->residentUser->id,
        'first_name' => 'Juan',
        'last_name' => 'Dela Cruz',
        'relationship_to_head' => 'head',
        'is_family_head' => true,
        'birthdate' => '1990-01-01',
    ]);

    $spouseUser = User::factory()->create(['role_id' => $this->residentRole->id]);
    $spouseMember = HouseholdMember::create([
        'household_id' => $household->id,
        'user_id' => $spouseUser->id,
        'first_name' => 'Maria',
        'last_name' => 'Dela Cruz',
        'relationship_to_head' => 'spouse',
        'is_family_head' => false,
        'birthdate' => '1992-05-15',
    ]);

    $response = $this->actingAs($this->admin)
        ->delete("/admin/resident-profiles/{$this->profile->id}");

    $response->assertRedirect('/admin/resident-profiles');

    $this->assertDatabaseMissing('resident_profiles', ['id' => $this->profile->id]);
    $this->assertDatabaseMissing('household_members', ['id' => $headMember->id]);

    // Household should remain, and spouse should be promoted
    $this->assertDatabaseHas('households', ['id' => $household->id]);
    $spouseMember->refresh();
    expect($spouseMember->is_family_head)->toBeTrue();
});

test('deleting a resident who is a regular non-head member removes the member and preserves the household', function () {
    $headUser = User::factory()->create(['role_id' => $this->residentRole->id]);
    $household = Household::create([
        'household_code' => 'HH-2026-TEST3',
        'family_head_id' => $headUser->id,
        'address' => '789 Mabini St',
        'purok_sitio' => 'Purok 3',
        'status' => 'verified',
    ]);

    $headMember = HouseholdMember::create([
        'household_id' => $household->id,
        'user_id' => $headUser->id,
        'first_name' => 'Emilio',
        'last_name' => 'Aguinaldo',
        'relationship_to_head' => 'head',
        'is_family_head' => true,
        'birthdate' => '1980-01-01',
    ]);

    $regularMember = HouseholdMember::create([
        'household_id' => $household->id,
        'user_id' => $this->residentUser->id,
        'first_name' => 'Juan',
        'last_name' => 'Dela Cruz',
        'relationship_to_head' => 'son',
        'is_family_head' => false,
        'birthdate' => '2005-01-01',
    ]);

    $response = $this->actingAs($this->admin)
        ->delete("/admin/resident-profiles/{$this->profile->id}");

    $response->assertRedirect('/admin/resident-profiles');

    $this->assertDatabaseMissing('resident_profiles', ['id' => $this->profile->id]);
    $this->assertDatabaseMissing('household_members', ['id' => $regularMember->id]);
    $this->assertDatabaseHas('households', ['id' => $household->id]);
    $this->assertDatabaseHas('household_members', ['id' => $headMember->id]);
});

test('deleting a resident purges physical files from storage', function () {
    Storage::fake('government-ids');
    Storage::disk('government-ids')->put('test-gov-id.png', 'dummy image content');

    $fileRecord = FileRecord::create([
        'user_id' => $this->residentUser->id,
        'file_name' => 'test-gov-id.png',
        'disk' => 'government-ids',
        'bucket' => 'government-ids',
        'path' => 'test-gov-id.png',
        'mime_type' => 'image/png',
        'size_bytes' => 1234,
        'is_private' => true,
    ]);

    $this->profile->update(['government_id_file_id' => $fileRecord->id]);

    Storage::disk('government-ids')->assertExists('test-gov-id.png');

    $response = $this->actingAs($this->admin)
        ->delete("/admin/resident-profiles/{$this->profile->id}");

    $response->assertRedirect('/admin/resident-profiles');

    // Storage file should be deleted
    Storage::disk('government-ids')->assertMissing('test-gov-id.png');
    $this->assertDatabaseMissing('files', ['id' => $fileRecord->id]);
});

test('admin cannot delete another admin or staff member profile', function () {
    $staffProfile = ResidentProfile::create([
        'user_id' => $this->subAdmin->id,
        'first_name' => 'Staff',
        'last_name' => 'Member',
        'birthdate' => '1995-01-01',
        'gender' => 'female',
        'civil_status' => 'single',
        'citizenship' => 'Filipino',
        'residency_status' => 'official',
    ]);

    $response = $this->actingAs($this->admin)
        ->delete("/admin/resident-profiles/{$staffProfile->id}");

    $response->assertSessionHasErrors('deletion');
    $this->assertDatabaseHas('resident_profiles', ['id' => $staffProfile->id]);
    $this->assertDatabaseHas('users', ['id' => $this->subAdmin->id]);
});

test('sub-admin staff cannot delete resident profiles', function () {
    $response = $this->actingAs($this->subAdmin)
        ->delete("/admin/resident-profiles/{$this->profile->id}");

    $response->assertForbidden();
    $this->assertDatabaseHas('resident_profiles', ['id' => $this->profile->id]);
});

test('regular resident cannot delete resident profiles', function () {
    $anotherResident = User::factory()->create(['role_id' => $this->residentRole->id]);

    $response = $this->actingAs($anotherResident)
        ->delete("/admin/resident-profiles/{$this->profile->id}");

    $response->assertNotFound();
    $this->assertDatabaseHas('resident_profiles', ['id' => $this->profile->id]);
});
