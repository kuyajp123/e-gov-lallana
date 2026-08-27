<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocumentRequestStatusHistory extends Model
{
    public $timestamps = false;

    protected $table = 'document_request_status_history';

    protected $fillable = [
        'document_request_id',
        'status',
        'changed_by_user_id',
        'remarks',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function documentRequest(): BelongsTo
    {
        return $this->belongsTo(DocumentRequest::class);
    }

    public function changedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by_user_id');
    }
}
