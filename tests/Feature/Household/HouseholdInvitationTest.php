<?php

use App\Models\FileRecord;
use App\Models\Household;
use App\Models\HouseholdMember;
use App\Models\ResidentProfile;
use App\Models\User;

beforeEach(function () {
    $this->headUser = User::factory()->create([
        'name' => 'Cardo Dalisay',
        'email' => 'cardo@example.com',
    ]);

    $this->inviteeUser = User::factory()->create([
        'name' => 'Alyana Dalisay',
        'email' => 'alyana@example.com',
    ]);

    $this->otherUser = User::factory()->create([
        'name' => 'Other Resident',
        'email' => 'other@example.com',
    ]);

    $headFile = FileRecord::create([
        'user_id' => $this->headUser->id,
        'file_name' => 'id1.png',
        'disk' => 'local',
        'path' => 'ids/id1.png',
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
        'government_id_file_id' => $headFile->id,
    ]);

    $inviteeFile = FileRecord::create([
        'user_id' => $this->inviteeUser->id,
        'file_name' => 'id2.png',
        'disk' => 'local',
        'path' => 'ids/id2.png',
        'mime_type' => 'image/png',
        'is_private' => true,
    ]);
    ResidentProfile::create([
        'user_id' => $this->inviteeUser->id,
        'first_name' => 'Alyana',
        'last_name' => 'Dalisay',
        'birthdate' => '1985-05-05',
        'gender' => 'female',
        'civil_status' => 'married',
        'citizenship' => 'Filipino',
        'government_id_file_id' => $inviteeFile->id,
    ]);

    $otherFile = FileRecord::create([
        'user_id' => $this->otherUser->id,
        'file_name' => 'id3.png',
        'disk' => 'local',
        'path' => 'ids/id3.png',
        'mime_type' => 'image/png',
        'is_private' => true,
    ]);
    ResidentProfile::create([
        'user_id' => $this->otherUser->id,
        'first_name' => 'Other',
        'last_name' => 'Resident',
        'birthdate' => '1992-02-02',
        'gender' => 'male',
        'civil_status' => 'single',
        'citizenship' => 'Filipino',
        'government_id_file_id' => $otherFile->id,
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
});

test('family head can add member with email and send pending invitation', function () {
    $response = $this->actingAs($this->headUser)->post('/household/members', [
        'first_name' => 'Alyana',
        'last_name' => 'Dalisay',
        'relationship_to_head' => 'spouse',
        'gender' => 'female',
        'civil_status' => 'married',
        'birthdate' => '1985-05-05',
        'email' => 'alyana@example.com',
    ]);

    $response->assertSessionHas('success');

    $this->assertDatabaseHas('household_members', [
        'household_id' => $this->household->id,
        'first_name' => 'Alyana',
        'last_name' => 'Dalisay',
        'email' => 'alyana@example.com',
        'invitation_status' => 'pending',
    ]);

    // An in-app notification should be sent to Alyana
    $this->assertDatabaseHas('notifications', [
        'user_id' => $this->inviteeUser->id,
        'type' => 'household_invitation',
    ]);
});

test('family head cannot invite their own email', function () {
    $response = $this->actingAs($this->headUser)->post('/household/members', [
        'first_name' => 'Clone',
        'last_name' => 'Dalisay',
        'relationship_to_head' => 'relative',
        'email' => 'cardo@example.com',
    ]);

    $response->assertSessionHasErrors(['email']);
});

test('family head cannot invite someone who already heads another household', function () {
    $otherHead = User::factory()->create(['email' => 'head2@example.com']);
    Household::create([
        'household_code' => 'HH-2026-0003',
        'family_head_id' => $otherHead->id,
        'address' => '789 Rizal St.',
        'purok_sitio' => 'Purok 1',
        'status' => 'verified',
    ]);

    $response = $this->actingAs($this->headUser)->post('/household/members', [
        'first_name' => 'Other',
        'last_name' => 'Head',
        'relationship_to_head' => 'relative',
        'email' => 'head2@example.com',
    ]);

    $response->assertSessionHasErrors(['email']);
});

test('invited user sees pending invitation when viewing my household', function () {
    $member = HouseholdMember::create([
        'household_id' => $this->household->id,
        'user_id' => $this->inviteeUser->id,
        'first_name' => 'Alyana',
        'last_name' => 'Dalisay',
        'relationship_to_head' => 'spouse',
        'email' => 'alyana@example.com',
        'invitation_status' => 'pending',
        'invited_at' => now(),
    ]);

    $response = $this->actingAs($this->inviteeUser)->get('/household');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('household/index')
        ->where('household', null)
        ->has('pending_invitation')
        ->where('pending_invitation.id', $member->id)
        ->where('pending_invitation.household.household_code', 'HH-2026-0002')
    );
});

test('invited user can accept invitation and join household', function () {
    $member = HouseholdMember::create([
        'household_id' => $this->household->id,
        'user_id' => $this->inviteeUser->id,
        'first_name' => 'Alyana',
        'last_name' => 'Dalisay',
        'relationship_to_head' => 'spouse',
        'email' => 'alyana@example.com',
        'invitation_status' => 'pending',
        'invited_at' => now(),
    ]);

    $response = $this->actingAs($this->inviteeUser)
        ->post("/household/invitations/{$member->id}/accept");

    $response->assertRedirect('/household');
    $response->assertSessionHas('success');

    $member->refresh();
    expect($member->invitation_status)->toBe('accepted')
        ->and($member->user_id)->toBe($this->inviteeUser->id);

    // Family head should receive acceptance notification
    $this->assertDatabaseHas('notifications', [
        'user_id' => $this->headUser->id,
        'type' => 'household_invitation_accepted',
    ]);

    // When Alyana visits /household, she now sees the household
    $householdPage = $this->actingAs($this->inviteeUser)->get('/household');
    $householdPage->assertOk();
    $householdPage->assertInertia(fn ($page) => $page
        ->component('household/index')
        ->where('household.id', $this->household->id)
        ->where('pending_invitation', null)
    );
});

test('invited user can decline invitation', function () {
    $member = HouseholdMember::create([
        'household_id' => $this->household->id,
        'user_id' => $this->inviteeUser->id,
        'first_name' => 'Alyana',
        'last_name' => 'Dalisay',
        'relationship_to_head' => 'spouse',
        'email' => 'alyana@example.com',
        'invitation_status' => 'pending',
        'invited_at' => now(),
    ]);

    $response = $this->actingAs($this->inviteeUser)
        ->post("/household/invitations/{$member->id}/reject");

    $response->assertRedirect('/household');
    $response->assertSessionHas('info');

    $member->refresh();
    expect($member->invitation_status)->toBe('rejected');

    // Family head should receive declined notification
    $this->assertDatabaseHas('notifications', [
        'user_id' => $this->headUser->id,
        'type' => 'household_invitation_declined',
    ]);

    // Alyana still sees no household
    $householdPage = $this->actingAs($this->inviteeUser)->get('/household');
    $householdPage->assertOk();
    $householdPage->assertInertia(fn ($page) => $page
        ->component('household/index')
        ->where('household', null)
        ->where('pending_invitation', null)
    );
});

test('unrelated user cannot accept or decline another users invitation', function () {
    $member = HouseholdMember::create([
        'household_id' => $this->household->id,
        'user_id' => $this->inviteeUser->id,
        'first_name' => 'Alyana',
        'last_name' => 'Dalisay',
        'relationship_to_head' => 'spouse',
        'email' => 'alyana@example.com',
        'invitation_status' => 'pending',
        'invited_at' => now(),
    ]);

    $response = $this->actingAs($this->otherUser)
        ->post("/household/invitations/{$member->id}/accept");

    $response->assertForbidden();

    $rejectResponse = $this->actingAs($this->otherUser)
        ->post("/household/invitations/{$member->id}/reject");

    $rejectResponse->assertForbidden();
});
