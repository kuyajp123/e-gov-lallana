<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('households', function (Blueprint $table) {
            $table->id();
            $table->string('household_code')->unique(); // e.g. HH-2026-0001
            $table->foreignId('family_head_id')->constrained('users')->cascadeOnDelete();
            $table->string('address');
            $table->string('purok_sitio'); // e.g. Purok 1, Sitio Pag-Asa
            $table->string('status')->default('unverified'); // unverified, verified, returned, rejected, restricted
            $table->text('notes')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('households');
    }
};
