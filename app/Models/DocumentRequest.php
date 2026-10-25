<?php

namespace App\Models;

use App\Enums\CancellationReason;
use App\Enums\DocumentRequestStatus;
use App\Enums\PaymentStatus;
use App\Enums\QrStatus;
use App\Services\Notification\NotificationService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $reference_code
 * @property int|null $user_id
 * @property int|null $document_type_id
 * @property array<string, mixed>|null $submitted_data
 * @property DocumentRequestStatus $current_status
 * @property int $fee_cents
 * @property PaymentStatus $payment_status
 * @property string|null $purpose
 * @property string|null $admin_notes
 * @property CancellationReason|null $cancellation_reason
 * @property string|null $cancellation_notes
 * @property int|null $generated_pdf_file_id
 * @property bool $is_walkin
 * @property string|null $walkin_name
 * @property string|null $walkin_purok
 * @property string|null $walkin_address
 * @property Carbon|null $walkin_birthdate
 * @property int|null $walkin_age
 * @property string|null $walkin_gender
 * @property string|null $walkin_civil_status
 * @property string|null $walkin_contact_number
 * @property string|null $walkin_email
 * @property string|null $custom_document_title
 * @property string|null $custom_document_body
 * @property Carbon|null $submitted_at
 * @property Carbon|null $completed_at
 * @property Carbon|null $cancelled_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User|null $user
 * @property-read DocumentType|null $documentType
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
    ];

    protected $casts = [
        'submitted_data' => 'array',
        'current_status' => DocumentRequestStatus::class,
        'payment_status' => PaymentStatus::class,
        'cancellation_reason' => CancellationReason::class,
        'fee_cents' => 'integer',
        'is_walkin' => 'boolean',
        'walkin_birthdate' => 'date',
        'walkin_age' => 'integer',
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

    /**
     * @return HasMany<QrIdentifier, $this>
     */
    public function qrIdentifiers(): HasMany
    {
        return $this->hasMany(QrIdentifier::class);
    }

    /**
     * Get the latest active QR identifier.
     */
    public function latestQrIdentifier(): ?QrIdentifier
    {
        return $this->qrIdentifiers()->latest()->first();
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

        if (in_array($newStatus, [DocumentRequestStatus::Cancelled, DocumentRequestStatus::Rejected], true)) {
            $this->qrIdentifiers()->update(['status' => QrStatus::Revoked->value]);
        }

        $this->save();

        $this->statusHistory()->create([
            'status' => $newStatus->value,
            'changed_by_user_id' => $changedByUserId !== null ? (int) $changedByUserId : null,
            'remarks' => $remarks,
        ]);

        $this->sendNotificationForTransition($newStatus, $remarks);
    }

    protected function sendNotificationForTransition(DocumentRequestStatus $status, ?string $remarks = null): void
    {
        $user = $this->user;
        $docName = $this->documentType ? $this->documentType->name : ($this->custom_document_title ?? 'Document Certificate');
        $notificationService = app(NotificationService::class);

        $type = match ($status) {
            DocumentRequestStatus::ReadyForPickup => 'document_ready_for_pickup',
            DocumentRequestStatus::Completed => 'document_completed',
            DocumentRequestStatus::Returned => 'document_returned',
            DocumentRequestStatus::Rejected => 'document_rejected',
            default => null,
        };

        if (! $type) {
            return;
        }

        $title = match ($status) {
            DocumentRequestStatus::ReadyForPickup => 'Document Ready for Pickup',
            DocumentRequestStatus::Completed => 'Document Completed',
            DocumentRequestStatus::Returned => 'Document Returned for Correction',
            DocumentRequestStatus::Rejected => 'Document Request Rejected',
        };

        $message = match ($status) {
            DocumentRequestStatus::ReadyForPickup => "Your {$docName} (Ref: {$this->reference_code}) is now ready for pickup at the Barangay Hall.",
            DocumentRequestStatus::Completed => "Your {$docName} (Ref: {$this->reference_code}) has been completed and issued.",
            DocumentRequestStatus::Returned => "Your request (Ref: {$this->reference_code}) was returned for correction".($remarks ? ": {$remarks}" : '.'),
            DocumentRequestStatus::Rejected => "Your request (Ref: {$this->reference_code}) was rejected".($remarks ? ": {$remarks}" : '.'),
        };

        $actionUrl = $user ? "/documents/{$this->id}" : null;

        if ($user) {
            $notificationService->send(
                $user,
                $type,
                $title,
                $message,
                $actionUrl,
                $this
            );
        } else {
            $notificationService->sendWalkinAlert(
                $this->walkin_email,
                $this->walkin_contact_number,
                $this->walkin_name ?? 'Resident',
                $title,
                $message,
                $actionUrl
            );
        }
    }
}
