<?php

use Inertia\Testing\AssertableInertia as Assert;

test('landing page loads successfully with Inertia props', function () {
    $response = $this->get(route('home'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('welcome')
        ->has('t')
        ->has('locale')
        ->has('statistics')
        ->has('services')
        ->has('announcements')
    );
});

test('locale switch endpoint toggles session locale', function () {
    $response = $this->post(route('locale.switch'), [
        'locale' => 'fil',
    ]);

    $response->assertSessionHas('locale', 'fil');

    $response = $this->post(route('locale.switch'), [
        'locale' => 'en',
    ]);

    $response->assertSessionHas('locale', 'en');
});

test('public inquiry form successfully validates and processes inquiry with test turnstile', function () {
    $response = $this->post(route('inquiry.submit'), [
        'name' => 'Maria Santos',
        'email' => 'maria@example.com',
        'subject' => 'Barangay Certificate Requirements',
        'message' => 'Good day, I would like to inquire about the turnaround time for a certificate of residency.',
        'cf-turnstile-response' => '1x00000000000000000000AA',
    ]);

    $response->assertSessionHas('success');
});

test('public inquiry form rejects missing turnstile token', function () {
    $response = $this->post(route('inquiry.submit'), [
        'name' => 'Maria Santos',
        'email' => 'maria@example.com',
        'subject' => 'Inquiry',
        'message' => 'Inquiry message...',
        'cf-turnstile-response' => '',
    ]);

    $response->assertSessionHasErrors(['cf-turnstile-response']);
});
