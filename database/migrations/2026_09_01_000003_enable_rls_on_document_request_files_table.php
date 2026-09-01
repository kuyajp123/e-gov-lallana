<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        if (Schema::hasTable('document_request_files')) {
            DB::statement('ALTER TABLE "document_request_files" ENABLE ROW LEVEL SECURITY;');
            DB::statement('DROP POLICY IF EXISTS "service_role_only" ON "document_request_files";');
            DB::statement('CREATE POLICY "service_role_only" ON "document_request_files" FOR ALL TO service_role USING (true) WITH CHECK (true);');
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        if (Schema::hasTable('document_request_files')) {
            DB::statement('DROP POLICY IF EXISTS "service_role_only" ON "document_request_files";');
            DB::statement('ALTER TABLE "document_request_files" DISABLE ROW LEVEL SECURITY;');
        }
    }
};
