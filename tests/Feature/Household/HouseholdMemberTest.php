<?php

use App\Models\Household;
use App\Models\HouseholdMember;
use App\Models\ResidentProfile;
use App\Models\User;

beforeEach(function () {
    $this->headUser = User::factory()->create();
    ResidentProfile::create([
        'user_id' => $this->headUser->id,
        'first_name' => 'Pedro',
        'last_name' => 'Penduko',
        'birthdate' => '1985-06-12',
        'gender' => 'male',
        'civil_status' => 'married',
        'citizenship' => 'Filipino',
    ]);

    $this->household = Household::create([
        'household_code' => 'HH-2026-0001',
        'family_head_id' => $this->headUser->id,
        'address' => '123 Rizal St.',
        'purok_sitio' => 'Purok 2',
        'status' => 'verified',
    ]);

    $this->headMember = HouseholdMember::create([
        'household_id' => $this->household->id,
        'user_id' => $this->headUser->id,
        'first_name' => 'Pedro',
        'last_name' => 'Penduko',
        'relationship_to_head' => 'head',
        'is_family_head' => true,
    ]);
});

test('family head can add new member to household', function () {
    $response = $this->actingAs($this->headUser)->post('/household/members', [
        'first_name' => 'Ana',
        'middle_name' => 'Reyes',
        'last_name' => 'Penduko',
        'relationship_to_head' => 'spouse',
        'birthdate' => '1988-03-20',
        'gender' => 'female',
        'civil_status' => 'married',
        'occupation' => 'Nurse',
        'residency_status' => 'resident',
    ]);

    $response->assertSessionHas('success');

    $this->assertDatabaseHas('household_members', [
        'household_id' => $this->household->id,
        'first_name' => 'Ana',
        'last_name' => 'Penduko',
        'relationship_to_head' => 'spouse',
        'is_family_head' => false,
    ]);

    $member = HouseholdMember::where('first_name', 'Ana')->first();
    $this->assertDatabaseHas('verifications', [
        'verifiable_type' => HouseholdMember::class,
        'verifiable_id' => $member->id,
        'status' => 'pending',
    ]);
});

test('non-family-head resident cannot add household members', function () {
    $otherUser = User::factory()->create();
    ResidentProfile::create([
        'user_id' => $otherUser->id,
        'first_name' => 'Other',
        'last_name' => 'User',
        'birthdate' => '1992-01-01',
        'gender' => 'female',
        'civil_status' => 'single',
        'citizenship' => 'Filipino',
    ]);

    $response = $this->actingAs($otherUser)->post('/household/members', [
        'first_name' => 'Intruder',
        'last_name' => 'Member',
        'relationship_to_head' => 'relative',
    ]);

    $response->assertSessionHas('error');
    $this->assertDatabaseMissing('household_members', ['first_name' => 'Intruder']);
});

test('family head can remove a non-head member from household', function () {
    $member = HouseholdMember::create([
        'household_id' => $this->household->id,
        'first_name' => 'Junior',
        'last_name' => 'Penduko',
        'relationship_to_head' => 'son',
        'is_family_head' => false,
    ]);

    $response = $this->actingAs($this->headUser)->delete("/household/members/{$member->id}");

    $response->assertSessionHas('success');
    $this->assertDatabaseMissing('household_members', ['id' => $member->id]);
});

test('cannot delete the active family head member', function () {
    $response = $this->actingAs($this->headUser)->delete("/household/members/{$this->headMember->id}");

    $response->assertSessionHas('error');
    $this->assertDatabaseHas('household_members', ['id' => $this->headMember->id]);
});
