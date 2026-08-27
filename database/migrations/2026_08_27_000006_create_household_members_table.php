<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('household_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('household_id')->constrained('households')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('suffix')->nullable();
            $table->string('relationship_to_head'); // head, spouse, son, daughter, parent, relative, other
            $table->boolean('is_family_head')->default(false);
            $table->date('birthdate')->nullable();
            $table->string('gender')->nullable();
            $table->string('civil_status')->nullable();
            $table->string('occupation')->nullable();
            $table->string('residency_status')->default('resident'); // resident, non_resident, temporary
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('household_members');
    }
};
