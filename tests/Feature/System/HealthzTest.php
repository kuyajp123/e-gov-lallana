<?php

use Illuminate\Support\Facades\DB;

test('/healthz returns HTTP 200 OK without database queries', function () {
    DB::enableQueryLog();

    $response = $this->get('/healthz');

    $response->assertOk();
    $response->assertSee('OK');
    expect($response->headers->get('Content-Type'))->toContain('text/plain');

    // Confirm zero database queries are executed
    $queryLog = DB::getQueryLog();
    expect($queryLog)->toBeEmpty();
});
