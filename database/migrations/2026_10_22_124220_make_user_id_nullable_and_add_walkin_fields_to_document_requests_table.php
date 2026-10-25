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
        Schema::table('document_requests', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->change();
            $table->foreignId('document_type_id')->nullable()->change();

            $table->boolean('is_walkin')->default(false)->after('current_status');
            $table->string('walkin_name')->nullable()->after('is_walkin');
            $table->string('walkin_purok')->nullable()->after('walkin_name');
            $table->string('walkin_address')->nullable()->after('walkin_purok');
            $table->date('walkin_birthdate')->nullable()->after('walkin_address');
            $table->unsignedInteger('walkin_age')->nullable()->after('walkin_birthdate');
            $table->string('walkin_gender')->nullable()->after('walkin_age');
            $table->string('walkin_civil_status')->nullable()->after('walkin_gender');
            $table->string('walkin_contact_number')->nullable()->after('walkin_civil_status');
            $table->string('walkin_email')->nullable()->after('walkin_contact_number');
            $table->string('custom_document_title')->nullable()->after('walkin_email');
            $table->text('custom_document_body')->nullable()->after('custom_document_title');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('document_requests', function (Blueprint $table) {
            $table->dropColumn([
                'is_walkin',
                'walkin_name',
                'walkin_purok',
                'walkin_address',
                'walkin_birthdate',
                'walkin_age',
                'walkin_gender',
                'walkin_civil_status',
                'walkin_contact_number',
                'walkin_email',
                'custom_document_title',
                'custom_document_body',
            ]);

            $table->foreignId('user_id')->nullable(false)->change();
            $table->foreignId('document_type_id')->nullable(false)->change();
        });
    }
};
