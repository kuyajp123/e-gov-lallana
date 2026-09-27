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

        if (Schema::hasTable('qr_identifiers')) {
            DB::statement('ALTER TABLE "qr_identifiers" ENABLE ROW LEVEL SECURITY;');
            DB::statement('DROP POLICY IF EXISTS "service_role_only" ON "qr_identifiers";');
            DB::statement('CREATE POLICY "service_role_only" ON "qr_identifiers" FOR ALL TO service_role USING (true) WITH CHECK (true);');
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        if (Schema::hasTable('qr_identifiers')) {
            DB::statement('DROP POLICY IF EXISTS "service_role_only" ON "qr_identifiers";');
            DB::statement('ALTER TABLE "qr_identifiers" DISABLE ROW LEVEL SECURITY;');
        }
    }
};
