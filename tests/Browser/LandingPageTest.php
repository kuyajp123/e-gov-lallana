<?php

use App\Models\Announcement;
use App\Models\DocumentType;

test('landing page loads in real browser without javascript errors', function () {
    DocumentType::create([
        'name' => 'Barangay Clearance',
        'slug' => 'barangay-clearance',
        'fee_cents' => 5000,
        'requirements' => ['Valid ID'],
        'is_active' => true,
    ]);

    Announcement::create([
        'title' => 'Community Clean-Up Drive',
        'slug' => 'community-clean-up-drive',
        'content' => 'Join us this Saturday for our clean-up drive.',
        'category' => 'Advisory',
        'is_published' => true,
        'published_at' => now(),
    ]);

    $page = visit('/');

    $page->assertSee('Barangay Lallana')
        ->assertNoJavaScriptErrors();
});

test('resident can navigate between sections on landing page', function () {
    $page = visit('/');

    $page->assertSee('Barangay Lallana')
        ->assertSee('Services')
        ->assertSee('Announcements')
        ->assertSee('Contact')
        ->assertNoJavaScriptErrors();
});
