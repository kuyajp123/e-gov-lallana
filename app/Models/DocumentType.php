<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    public function documentRequests(): HasMany
    {
        return $this->hasMany(DocumentRequest::class);
    }

    public function getFormattedFeeAttribute(): string
    {
        if ($this->fee_cents === 0) {
            return 'Free';
        }

        return 'PHP '.number_format($this->fee_cents / 100, 2);
    }
}
