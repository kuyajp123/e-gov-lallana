<?php

test('login page loads in browser without javascript errors', function () {
    $page = visit('/login');

    $page->assertSee('Log in to your account')
        ->assertNoJavaScriptErrors();
});

test('resident can view login form fields in browser', function () {
    $page = visit('/login');

    $page->assertSee('Email address')
        ->assertSee('Password')
        ->assertNoJavaScriptErrors();
});
