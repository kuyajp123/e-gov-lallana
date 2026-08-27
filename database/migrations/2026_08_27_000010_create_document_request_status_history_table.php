<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('document_request_status_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_request_id')->constrained('document_requests')->cascadeOnDelete();
            $table->string('status'); // previous / new status transition
            $table->foreignId('changed_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('remarks')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_request_status_history');
    }
};
