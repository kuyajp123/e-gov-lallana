<?php

test('login page loads in browser without javascript errors', function () {
    $page = visit('/login');

    $page->assertSee('Resident Portal Sign In')
        ->assertNoJavaScriptErrors();
});

test('resident can view login form fields in browser', function () {
    $page = visit('/login');

    $page->assertSee('Email address')
        ->assertSee('Password')
        ->assertNoJavaScriptErrors();
});
