<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('household_members', function (Blueprint $table) {
            $table->string('email')->nullable()->after('suffix')->index();
            $table->string('invitation_status')->nullable()->after('email')->index(); // pending, accepted, rejected
            $table->timestamp('invited_at')->nullable()->after('invitation_status');
        });
    }

    public function down(): void
    {
        Schema::table('household_members', function (Blueprint $table) {
            $table->dropColumn(['email', 'invitation_status', 'invited_at']);
        });
    }
};
