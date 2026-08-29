<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

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

        if (Schema::hasTable('migrations')) {
            DB::statement('ALTER TABLE "migrations" ENABLE ROW LEVEL SECURITY;');
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

        if (Schema::hasTable('migrations')) {
            DB::statement('ALTER TABLE "migrations" DISABLE ROW LEVEL SECURITY;');
        }
    }
};
