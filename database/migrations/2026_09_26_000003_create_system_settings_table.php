<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('system_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('type', 30)->default('string');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        if (DB::getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE "system_settings" ENABLE ROW LEVEL SECURITY;');
            DB::statement('DROP POLICY IF EXISTS "service_role_only" ON "system_settings";');
            DB::statement('CREATE POLICY "service_role_only" ON "system_settings" FOR ALL TO service_role USING (true) WITH CHECK (true);');
        }

        // Insert default keep-alive settings
        DB::table('system_settings')->insert([
            [
                'key' => 'render_keep_alive_enabled',
                'value' => 'false',
                'type' => 'boolean',
                'description' => 'Flag determining whether the Supabase pg_cron + pg_net keep-alive ping is enabled.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'render_keep_alive_interval_minutes',
                'value' => '11',
                'type' => 'integer',
                'description' => 'Cron frequency in minutes for the keep-alive ping (default: every 11 minutes).',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'render_keep_alive_target_url',
                'value' => null,
                'type' => 'string',
                'description' => 'Target URL for the keep-alive ping. If null, defaults to APP_URL/healthz.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('DROP POLICY IF EXISTS "service_role_only" ON "system_settings";');
        }

        Schema::dropIfExists('system_settings');
    }
};
