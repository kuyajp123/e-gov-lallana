<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sms_messages', function (Blueprint $table) {
            $table->id();
            $table->string('recipient');
            $table->text('message');
            $table->string('provider')->default('fake'); // fake, textbee, semaphore
            $table->string('message_id')->nullable();
            $table->string('status')->default('SENT'); // SENT, FAILED, TIMEOUT, RATE_LIMITED
            $table->text('error_message')->nullable();
            $table->jsonb('raw_response')->nullable();
            $table->timestamp('sent_at')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sms_messages');
    }
};
