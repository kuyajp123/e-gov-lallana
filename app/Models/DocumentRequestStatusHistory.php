<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $document_request_id
 * @property string $status
 * @property int|null $changed_by_user_id
 * @property string|null $remarks
 * @property Carbon|null $created_at
 * @property-read DocumentRequest $documentRequest
 * @property-read User|null $changedByUser
 */
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

    /**
     * @return BelongsTo<DocumentRequest, $this>
     */
    public function documentRequest(): BelongsTo
    {
        return $this->belongsTo(DocumentRequest::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function changedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by_user_id');
    }
}
