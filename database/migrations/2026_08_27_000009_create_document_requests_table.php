<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('document_requests', function (Blueprint $table) {
            $table->id();
            $table->string('reference_code')->unique(); // e.g. REQ-2026-0001
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('document_type_id')->constrained('document_types')->restrictOnDelete();
            $table->jsonb('submitted_data')->nullable(); // structured dynamic request inputs
            $table->string('current_status')->default('pending'); // pending, processing, on_hold, returned, ready_for_pickup, completed, rejected, cancelled
            $table->unsignedInteger('fee_cents')->default(0);
            $table->string('payment_status')->default('unpaid'); // unpaid, paid, waived
            $table->text('purpose')->nullable();
            $table->text('admin_notes')->nullable();
            $table->foreignId('generated_pdf_file_id')->nullable()->constrained('files')->nullOnDelete();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_requests');
    }
};
