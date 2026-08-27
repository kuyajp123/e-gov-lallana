<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('resident_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('suffix')->nullable();
            $table->date('birthdate')->nullable();
            $table->string('gender')->nullable(); // male, female, other
            $table->string('civil_status')->nullable(); // single, married, widowed, separated
            $table->string('citizenship')->default('Filipino');
            $table->string('occupation')->nullable();
            $table->boolean('is_voter')->default(false);
            $table->string('voter_id_number')->nullable();
            $table->foreignId('avatar_file_id')->nullable()->constrained('files')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resident_profiles');
    }
};
