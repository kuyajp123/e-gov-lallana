<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * The tables to enable Row Level Security on.
     *
     * @var list<string>
     */
    protected array $tables = [
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

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        foreach ($this->tables as $table) {
            if (Schema::hasTable($table)) {
                DB::statement("ALTER TABLE \"{$table}\" ENABLE ROW LEVEL SECURITY;");
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        foreach ($this->tables as $table) {
            if (Schema::hasTable($table)) {
                DB::statement("ALTER TABLE \"{$table}\" DISABLE ROW LEVEL SECURITY;");
            }
        }
    }
};
