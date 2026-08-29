<?php

test('resident can view public inquiry form on landing page', function () {
    $page = visit('/');

    $page->assertSee('Send Us an Inquiry')
        ->assertSee('Full Name')
        ->assertSee('Email Address')
        ->assertSee('Subject')
        ->assertNoJavaScriptErrors();
});
