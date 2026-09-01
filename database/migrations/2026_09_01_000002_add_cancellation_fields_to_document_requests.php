<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('document_requests', function (Blueprint $table) {
            $table->string('cancellation_reason')->nullable()->after('admin_notes');
            $table->text('cancellation_notes')->nullable()->after('cancellation_reason');
            $table->timestamp('cancelled_at')->nullable()->after('completed_at');
        });
    }

    public function down(): void
    {
        Schema::table('document_requests', function (Blueprint $table) {
            $table->dropColumn(['cancellation_reason', 'cancellation_notes', 'cancelled_at']);
        });
    }
};
