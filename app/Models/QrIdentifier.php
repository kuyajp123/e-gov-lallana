<?php

namespace App\Models;

use App\Enums\QrStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $token
 * @property int|null $document_request_id
 * @property int|null $resident_id
 * @property int|null $household_id
 * @property string $document_type
 * @property string $reference_code
 * @property QrStatus $status
 * @property string $security_hash
 * @property array<string, mixed>|null $metadata
 * @property int $scanned_count
 * @property Carbon|null $last_scanned_at
 * @property Carbon|null $expires_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read DocumentRequest|null $documentRequest
 * @property-read User|null $resident
 * @property-read Household|null $household
 */
class QrIdentifier extends Model
{
    protected $fillable = [
        'token',
        'document_request_id',
        'resident_id',
        'household_id',
        'document_type',
        'reference_code',
        'status',
        'security_hash',
        'metadata',
        'scanned_count',
        'last_scanned_at',
        'expires_at',
    ];

    protected $casts = [
        'status' => QrStatus::class,
        'metadata' => 'array',
        'scanned_count' => 'integer',
        'last_scanned_at' => 'datetime',
        'expires_at' => 'datetime',
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
    public function resident(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resident_id');
    }

    /**
     * @return BelongsTo<Household, $this>
     */
    public function household(): BelongsTo
    {
        return $this->belongsTo(Household::class);
    }

    public function isValid(): bool
    {
        if ($this->status !== QrStatus::Active) {
            return false;
        }

        if ($this->expires_at !== null && $this->expires_at->isPast()) {
            return false;
        }

        return true;
    }

    public function isExpired(): bool
    {
        return $this->expires_at !== null && $this->expires_at->isPast();
    }

    /**
     * Scope for active and unexpired tokens.
     *
     * @param  Builder<QrIdentifier>  $query
     */
    public function scopeValid(Builder $query): void
    {
        $query->where('status', QrStatus::Active->value)
            ->where(function (Builder $q) {
                $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            });
    }
}
