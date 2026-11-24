<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('resident_profiles', function (Blueprint $table) {
            $table->string('philsys_card_no')->nullable()->after('voter_id_number');
            $table->string('birth_place')->nullable()->after('birthdate');
            $table->string('educational_status')->nullable()->after('educational_attainment'); // graduate, undergraduate
            $table->boolean('is_ofw')->default(false)->after('solo_parent_status');
            $table->boolean('is_ip')->default(false)->after('is_ofw');
            $table->boolean('is_out_of_school')->default(false)->after('is_ip');
        });

        Schema::table('household_members', function (Blueprint $table) {
            $table->string('birth_place')->nullable()->after('birthdate');
            $table->string('citizenship')->default('Filipino')->after('civil_status');
            $table->boolean('is_ofw')->default(false)->after('residency_status');
            $table->boolean('is_ip')->default(false)->after('is_ofw');
            $table->boolean('pwd_status')->default(false)->after('is_ip');
            $table->boolean('solo_parent_status')->default(false)->after('pwd_status');
            $table->boolean('is_out_of_school')->default(false)->after('solo_parent_status');
        });
    }

    public function down(): void
    {
        Schema::table('resident_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'philsys_card_no',
                'birth_place',
                'educational_status',
                'is_ofw',
                'is_ip',
                'is_out_of_school',
            ]);
        });

        Schema::table('household_members', function (Blueprint $table) {
            $table->dropColumn([
                'birth_place',
                'citizenship',
                'is_ofw',
                'is_ip',
                'pwd_status',
                'solo_parent_status',
                'is_out_of_school',
            ]);
        });
    }
};
