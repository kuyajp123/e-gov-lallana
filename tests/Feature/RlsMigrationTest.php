<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

test('all defined application tables exist in the database', function () {
    $expectedTables = [
        'users',
        'password_reset_tokens',
        'sessions',
        'cache',
        'cache_locks',
        'jobs',
        'job_batches',
        'failed_jobs',
        'roles',
        'files',
        'resident_profiles',
        'households',
        'household_members',
        'verifications',
        'document_types',
        'document_requests',
        'document_request_status_history',
        'announcements',
        'sms_messages',
        'migrations',
    ];

    foreach ($expectedTables as $table) {
        expect(Schema::hasTable($table))->toBeTrue("Table [{$table}] should exist in schema.");
    }
});

test('postgresql row level security is enabled on all public tables when on pgsql', function () {
    if (DB::getDriverName() !== 'pgsql') {
        $this->markTestSkipped('This test requires a PostgreSQL connection.');
    }

    $tablesWithRls = DB::table('pg_tables')
        ->where('schemaname', 'public')
        ->pluck('rowsecurity', 'tablename')
        ->all();

    $expectedTables = [
        'users',
        'password_reset_tokens',
        'sessions',
        'cache',
        'cache_locks',
        'jobs',
        'job_batches',
        'failed_jobs',
        'roles',
        'files',
        'resident_profiles',
        'households',
        'household_members',
        'verifications',
        'document_types',
        'document_requests',
        'document_request_status_history',
        'announcements',
        'sms_messages',
        'migrations',
    ];

    foreach ($expectedTables as $table) {
        expect($tablesWithRls)->toHaveKey($table)
            ->and($tablesWithRls[$table])->toBeTrue("Table [{$table}] must have Row Level Security (RLS) enabled.");
    }
});

test('postgresql service_role_only policy exists on all public tables when on pgsql', function () {
    if (DB::getDriverName() !== 'pgsql') {
        $this->markTestSkipped('This test requires a PostgreSQL connection.');
    }

    $policies = DB::table('pg_policies')
        ->where('schemaname', 'public')
        ->where('policyname', 'service_role_only')
        ->pluck('tablename')
        ->all();

    $expectedTables = [
        'users',
        'password_reset_tokens',
        'sessions',
        'cache',
        'cache_locks',
        'jobs',
        'job_batches',
        'failed_jobs',
        'roles',
        'files',
        'resident_profiles',
        'households',
        'household_members',
        'verifications',
        'document_types',
        'document_requests',
        'document_request_status_history',
        'announcements',
        'sms_messages',
        'migrations',
    ];

    foreach ($expectedTables as $table) {
        expect($policies)->toContain($table, "Table [{$table}] must have a service_role_only policy.");
    }
});
