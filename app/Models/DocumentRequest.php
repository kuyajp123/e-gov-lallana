<?php

namespace App\Models;

use App\Enums\CancellationReason;
use App\Enums\DocumentRequestStatus;
use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $reference_code
 * @property int $user_id
 * @property int $document_type_id
 * @property array<string, mixed>|null $submitted_data
 * @property DocumentRequestStatus $current_status
 * @property int $fee_cents
 * @property PaymentStatus $payment_status
 * @property string|null $purpose
 * @property string|null $admin_notes
 * @property CancellationReason|null $cancellation_reason
 * @property string|null $cancellation_notes
 * @property int|null $generated_pdf_file_id
 * @property Carbon|null $submitted_at
 * @property Carbon|null $completed_at
 * @property Carbon|null $cancelled_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User $user
 * @property-read DocumentType $documentType
 * @property-read FileRecord|null $generatedPdf
 * @property-read Collection<int, DocumentRequestStatusHistory> $statusHistory
 * @property-read Collection<int, DocumentRequestFile> $files
 * @property-read string $formatted_fee
 */
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
        'cancellation_reason',
        'cancellation_notes',
        'generated_pdf_file_id',
        'submitted_at',
        'completed_at',
        'cancelled_at',
    ];

    protected $casts = [
        'submitted_data' => 'array',
        'current_status' => DocumentRequestStatus::class,
        'payment_status' => PaymentStatus::class,
        'cancellation_reason' => CancellationReason::class,
        'fee_cents' => 'integer',
        'submitted_at' => 'datetime',
        'completed_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<DocumentType, $this>
     */
    public function documentType(): BelongsTo
    {
        return $this->belongsTo(DocumentType::class);
    }

    /**
     * @return BelongsTo<FileRecord, $this>
     */
    public function generatedPdf(): BelongsTo
    {
        return $this->belongsTo(FileRecord::class, 'generated_pdf_file_id');
    }

    /**
     * @return HasMany<DocumentRequestStatusHistory, $this>
     */
    public function statusHistory(): HasMany
    {
        return $this->hasMany(DocumentRequestStatusHistory::class)->orderBy('created_at', 'asc');
    }

    /**
     * @return HasMany<DocumentRequestFile, $this>
     */
    public function files(): HasMany
    {
        return $this->hasMany(DocumentRequestFile::class);
    }

    /**
     * @return BelongsToMany<FileRecord, $this>
     */
    public function fileRecords(): BelongsToMany
    {
        return $this->belongsToMany(FileRecord::class, 'document_request_files', 'document_request_id', 'file_id')
            ->withPivot(['file_type', 'purpose'])
            ->withTimestamps();
    }

    public function getFormattedFeeAttribute(): string
    {
        if ($this->fee_cents === 0) {
            return 'Free / Libre';
        }

        return '₱'.number_format($this->fee_cents / 100, 2);
    }

    public function canBeCancelled(): bool
    {
        return $this->current_status->isActive();
    }

    public function canBeEdited(): bool
    {
        return $this->current_status === DocumentRequestStatus::Returned;
    }

    /**
     * Record a transition to a new status.
     */
    public function transitionTo(DocumentRequestStatus $newStatus, int|string|null $changedByUserId = null, ?string $remarks = null): void
    {
        $this->current_status = $newStatus;

        if (in_array($newStatus, [DocumentRequestStatus::Completed, DocumentRequestStatus::ReadyForPickup], true) && ! $this->completed_at) {
            $this->completed_at = Carbon::now();
        }

        if ($newStatus === DocumentRequestStatus::Cancelled && ! $this->cancelled_at) {
            $this->cancelled_at = Carbon::now();
        }

        $this->save();

        $this->statusHistory()->create([
            'status' => $newStatus->value,
            'changed_by_user_id' => $changedByUserId !== null ? (int) $changedByUserId : null,
            'remarks' => $remarks,
        ]);
    }
}
