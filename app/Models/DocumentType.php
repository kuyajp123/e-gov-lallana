<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property int $fee_cents
 * @property array<int, string>|null $requirements
 * @property array<int, array<string, mixed>>|null $form_schema
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, DocumentRequest> $documentRequests
 * @property-read string $formatted_fee
 */
class DocumentType extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'fee_cents',
        'requirements',
        'form_schema',
        'is_active',
    ];

    protected $casts = [
        'fee_cents' => 'integer',
        'requirements' => 'array',
        'form_schema' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * @param  Builder<DocumentType>  $query
     * @return Builder<DocumentType>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * @return HasMany<DocumentRequest, $this>
     */
    public function documentRequests(): HasMany
    {
        return $this->hasMany(DocumentRequest::class);
    }

    public function getFormattedFeeAttribute(): string
    {
        if ($this->fee_cents === 0) {
            return 'Free / Libre';
        }

        return '₱'.number_format($this->fee_cents / 100, 2);
    }
}
