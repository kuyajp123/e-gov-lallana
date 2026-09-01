<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('resident_profiles', function (Blueprint $table) {
            $table->string('educational_attainment')->nullable()->after('occupation');
            $table->string('employment_status')->nullable()->after('educational_attainment');
            $table->string('religion')->nullable()->after('citizenship');
            $table->string('residency_status')->default('resident')->after('religion');
            $table->date('date_of_residency')->nullable()->after('residency_status');
            $table->boolean('senior_citizen_status')->default(false)->after('is_voter');
            $table->boolean('pwd_status')->default(false)->after('senior_citizen_status');
            $table->string('pwd_id_number')->nullable()->after('pwd_status');
            $table->boolean('solo_parent_status')->default(false)->after('pwd_id_number');
            $table->string('solo_parent_id_number')->nullable()->after('solo_parent_status');
            $table->foreignId('government_id_file_id')->nullable()->after('avatar_file_id')->constrained('files')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('resident_profiles', function (Blueprint $table) {
            $table->dropForeign(['government_id_file_id']);
            $table->dropColumn([
                'educational_attainment',
                'employment_status',
                'religion',
                'residency_status',
                'date_of_residency',
                'senior_citizen_status',
                'pwd_status',
                'pwd_id_number',
                'solo_parent_status',
                'solo_parent_id_number',
                'government_id_file_id',
            ]);
        });
    }
};
