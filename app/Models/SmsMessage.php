<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SmsMessage extends Model
{
    protected $fillable = [
        'recipient',
        'message',
        'provider',
        'message_id',
        'status',
        'error_message',
        'raw_response',
        'sent_at',
    ];

    protected $casts = [
        'raw_response' => 'array',
        'sent_at' => 'datetime',
    ];
}
