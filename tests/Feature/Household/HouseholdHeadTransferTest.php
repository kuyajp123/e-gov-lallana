<?php

use App\Models\FileRecord;
use App\Models\Household;
use App\Models\HouseholdMember;
use App\Models\ResidentProfile;
use App\Models\User;
use App\Services\Household\HouseholdSuccessionService;

beforeEach(function () {
    $this->headUser = User::factory()->create();
    $this->spouseUser = User::factory()->create();

    $file = FileRecord::create([
        'user_id' => $this->headUser->id,
        'file_name' => 'id.png',
        'disk' => 'local',
        'path' => 'ids/id.png',
        'mime_type' => 'image/png',
        'is_private' => true,
    ]);

    ResidentProfile::create([
        'user_id' => $this->headUser->id,
        'first_name' => 'Cardo',
        'last_name' => 'Dalisay',
        'birthdate' => '1980-01-01',
        'gender' => 'male',
        'civil_status' => 'married',
        'citizenship' => 'Filipino',
        'government_id_file_id' => $file->id,
    ]);

    $this->household = Household::create([
        'household_code' => 'HH-2026-0002',
        'family_head_id' => $this->headUser->id,
        'address' => '456 Mabini St.',
        'purok_sitio' => 'Purok 3',
        'status' => 'verified',
    ]);

    $this->headMember = HouseholdMember::create([
        'household_id' => $this->household->id,
        'user_id' => $this->headUser->id,
        'first_name' => 'Cardo',
        'last_name' => 'Dalisay',
        'relationship_to_head' => 'head',
        'is_family_head' => true,
    ]);

    $this->spouseMember = HouseholdMember::create([
        'household_id' => $this->household->id,
        'user_id' => $this->spouseUser->id,
        'first_name' => 'Alyana',
        'last_name' => 'Dalisay',
        'relationship_to_head' => 'spouse',
        'is_family_head' => false,
    ]);
});

test('family head can transfer authority to another household member', function () {
    $response = $this->actingAs($this->headUser)->post('/household/transfer-head', [
        'new_family_head_member_id' => $this->spouseMember->id,
    ]);

    $response->assertRedirect('/household');
    $response->assertSessionHas('success');

    $this->headMember->refresh();
    $this->spouseMember->refresh();
    $this->household->refresh();

    expect($this->headMember->is_family_head)->toBeFalse()
        ->and($this->spouseMember->is_family_head)->toBeTrue()
        ->and($this->household->family_head_id)->toBe($this->spouseUser->id);
});

test('cannot transfer head authority to member of another household', function () {
    $otherHousehold = Household::create([
        'household_code' => 'HH-2026-0003',
        'family_head_id' => User::factory()->create()->id,
        'address' => '789 Luna St.',
        'purok_sitio' => 'Purok 4',
    ]);

    $otherMember = HouseholdMember::create([
        'household_id' => $otherHousehold->id,
        'first_name' => 'Stranger',
        'last_name' => 'Member',
        'relationship_to_head' => 'head',
        'is_family_head' => true,
    ]);

    $response = $this->actingAs($this->headUser)->post('/household/transfer-head', [
        'new_family_head_member_id' => $otherMember->id,
    ]);

    $response->assertSessionHas('error');
    expect($this->household->fresh()->family_head_id)->toBe($this->headUser->id);
});

test('succession service prioritizes spouse over other adult members', function () {
    $adultChild = HouseholdMember::create([
        'household_id' => $this->household->id,
        'first_name' => 'Junior',
        'last_name' => 'Dalisay',
        'relationship_to_head' => 'son',
        'is_family_head' => false,
        'birthdate' => now()->subYears(22)->format('Y-m-d'),
    ]);
    $adultChild->verification()->create(['status' => 'approved']);

    $successor = app(HouseholdSuccessionService::class)
        ->findSuccessor($this->household, $this->headMember->id);

    expect($successor)->not->toBeNull()
        ->and($successor->id)->toBe($this->spouseMember->id);
});

test('succession service falls back to verified adult member when there is no spouse', function () {
    // Remove spouse from household
    $this->spouseMember->delete();

    $minorChild = HouseholdMember::create([
        'household_id' => $this->household->id,
        'first_name' => 'Baby',
        'last_name' => 'Dalisay',
        'relationship_to_head' => 'daughter',
        'is_family_head' => false,
        'birthdate' => now()->subYears(10)->format('Y-m-d'),
    ]);

    $verifiedAdult = HouseholdMember::create([
        'household_id' => $this->household->id,
        'first_name' => 'Eldest',
        'last_name' => 'Dalisay',
        'relationship_to_head' => 'son',
        'is_family_head' => false,
        'birthdate' => now()->subYears(25)->format('Y-m-d'),
    ]);
    $verifiedAdult->verification()->create(['status' => 'approved']);

    $unverifiedAdult = HouseholdMember::create([
        'household_id' => $this->household->id,
        'first_name' => 'Second',
        'last_name' => 'Dalisay',
        'relationship_to_head' => 'son',
        'is_family_head' => false,
        'birthdate' => now()->subYears(20)->format('Y-m-d'),
    ]);
    $unverifiedAdult->verification()->create(['status' => 'pending']);

    $successor = app(HouseholdSuccessionService::class)
        ->findSuccessor($this->household, $this->headMember->id);

    expect($successor)->not->toBeNull()
        ->and($successor->id)->toBe($verifiedAdult->id);
});

test('deleting household head user automatically transfers headship to spouse and preserves household', function () {
    $householdId = $this->household->id;

    // Delete head user
    $this->headUser->delete();

    $this->household->refresh();
    $this->spouseMember->refresh();

    // Household was NOT deleted
    expect(Household::find($householdId))->not->toBeNull()
        ->and($this->household->family_head_id)->toBe($this->spouseUser->id)
        ->and($this->spouseMember->is_family_head)->toBeTrue()
        ->and($this->spouseMember->relationship_to_head)->toBe('head');
});

test('deleting household head user transfers to verified adult when no spouse exists', function () {
    $this->spouseMember->delete();

    $adultUser = User::factory()->create();
    $verifiedAdult = HouseholdMember::create([
        'household_id' => $this->household->id,
        'user_id' => $adultUser->id,
        'first_name' => 'Kuya',
        'last_name' => 'Dalisay',
        'relationship_to_head' => 'son',
        'is_family_head' => false,
        'birthdate' => now()->subYears(23)->format('Y-m-d'),
    ]);
    $verifiedAdult->verification()->create(['status' => 'approved']);

    $householdId = $this->household->id;

    $this->headUser->delete();

    $this->household->refresh();
    $verifiedAdult->refresh();

    expect(Household::find($householdId))->not->toBeNull()
        ->and($this->household->family_head_id)->toBe($adultUser->id)
        ->and($verifiedAdult->is_family_head)->toBeTrue()
        ->and($verifiedAdult->relationship_to_head)->toBe('head');
});
