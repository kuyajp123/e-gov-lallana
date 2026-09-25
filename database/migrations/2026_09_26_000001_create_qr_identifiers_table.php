<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('qr_identifiers', function (Blueprint $table) {
            $table->id();
            $table->string('token', 64)->unique();
            $table->foreignId('document_request_id')->nullable()->constrained('document_requests')->cascadeOnDelete();
            $table->foreignId('resident_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('household_id')->nullable()->constrained('households')->nullOnDelete();
            $table->string('document_type', 100);
            $table->string('reference_code', 100)->index();
            $table->string('status', 30)->default('active');
            $table->string('security_hash', 128);
            $table->jsonb('metadata')->nullable();
            $table->unsignedInteger('scanned_count')->default(0);
            $table->timestamp('last_scanned_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('qr_identifiers');
    }
};
