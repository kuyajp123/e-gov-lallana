<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $document_request_id
 * @property int $file_id
 * @property string $file_type
 * @property string|null $purpose
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read DocumentRequest $documentRequest
 * @property-read FileRecord $fileRecord
 */
class DocumentRequestFile extends Model
{
    protected $fillable = [
        'document_request_id',
        'file_id',
        'file_type',
        'purpose',
    ];

    /**
     * @return BelongsTo<DocumentRequest, $this>
     */
    public function documentRequest(): BelongsTo
    {
        return $this->belongsTo(DocumentRequest::class);
    }

    /**
     * @return BelongsTo<FileRecord, $this>
     */
    public function fileRecord(): BelongsTo
    {
        return $this->belongsTo(FileRecord::class, 'file_id');
    }
}
