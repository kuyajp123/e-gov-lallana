<?php

use App\Models\Household;
use App\Models\HouseholdMember;
use App\Models\ResidentProfile;
use App\Models\User;

beforeEach(function () {
    $this->headUser = User::factory()->create();
    $this->spouseUser = User::factory()->create();

    ResidentProfile::create([
        'user_id' => $this->headUser->id,
        'first_name' => 'Cardo',
        'last_name' => 'Dalisay',
        'birthdate' => '1980-01-01',
        'gender' => 'male',
        'civil_status' => 'married',
        'citizenship' => 'Filipino',
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
