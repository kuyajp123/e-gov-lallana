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

        $tables = ['notifications', 'notification_preferences'];

        foreach ($tables as $table) {
            if (Schema::hasTable($table)) {
                DB::statement("ALTER TABLE \"{$table}\" ENABLE ROW LEVEL SECURITY;");
                DB::statement("DROP POLICY IF EXISTS \"service_role_only\" ON \"{$table}\";");
                DB::statement("CREATE POLICY \"service_role_only\" ON \"{$table}\" FOR ALL TO service_role USING (true) WITH CHECK (true);");
            }
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        $tables = ['notifications', 'notification_preferences'];

        foreach ($tables as $table) {
            if (Schema::hasTable($table)) {
                DB::statement("DROP POLICY IF EXISTS \"service_role_only\" ON \"{$table}\";");
                DB::statement("ALTER TABLE \"{$table}\" DISABLE ROW LEVEL SECURITY;");
            }
        }
    }
};
