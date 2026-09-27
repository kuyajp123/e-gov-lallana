<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        try {
            // Check if pg_net is installed in the public schema
            $inPublic = DB::selectOne("
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_extension e 
                    JOIN pg_namespace n ON e.extnamespace = n.oid 
                    WHERE e.extname = 'pg_net' AND n.nspname = 'public'
                ) AS in_public
            ");

            if ($inPublic?->in_public) {
                DB::statement('CREATE SCHEMA IF NOT EXISTS extensions;');

                // Attempt non-destructive relocation so queued HTTP requests and audit tables are preserved
                try {
                    DB::statement('ALTER EXTENSION pg_net SET SCHEMA extensions;');
                } catch (Throwable $e) {
                    Log::info('Non-destructive pg_net extension relocation skipped: '.$e->getMessage().'. Existing extension preserved.');
                }
            }
        } catch (Throwable $e) {
            Log::info('Extension pg_net relocation check in migration skipped: '.$e->getMessage());
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No-op
    }
};
