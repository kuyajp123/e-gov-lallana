<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('document_types', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Barangay Clearance, Barangay Certificate, Certificate of Indigency
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->unsignedInteger('fee_cents')->default(0); // in centavos (e.g. 5000 = PHP 50.00)
            $table->jsonb('requirements')->nullable(); // list of required documents
            $table->jsonb('form_schema')->nullable(); // dynamic fields definition
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_types');
    }
};
