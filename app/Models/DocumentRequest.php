<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DocumentRequest extends Model
{
    protected $fillable = [
        'reference_code',
        'user_id',
        'document_type_id',
        'submitted_data',
        'current_status',
        'fee_cents',
        'payment_status',
        'purpose',
        'admin_notes',
        'generated_pdf_file_id',
        'submitted_at',
        'completed_at',
    ];

    protected $casts = [
        'submitted_data' => 'array',
        'fee_cents' => 'integer',
        'submitted_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function documentType(): BelongsTo
    {
        return $this->belongsTo(DocumentType::class);
    }

    public function generatedPdf(): BelongsTo
    {
        return $this->belongsTo(FileRecord::class, 'generated_pdf_file_id');
    }

    public function statusHistory(): HasMany
    {
        return $this->hasMany(DocumentRequestStatusHistory::class);
    }

    public function getFormattedFeeAttribute(): string
    {
        if ($this->fee_cents === 0) {
            return 'Free / Libre';
        }

        return '?'.number_format($this->fee_cents / 100, 2);
    }
}
