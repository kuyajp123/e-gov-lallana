<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class HouseholdMember extends Model
{
    protected $fillable = [
        'household_id',
        'user_id',
        'first_name',
        'middle_name',
        'last_name',
        'suffix',
        'relationship_to_head',
        'is_family_head',
        'birthdate',
        'gender',
        'civil_status',
        'occupation',
        'residency_status',
    ];

    protected $casts = [
        'is_family_head' => 'boolean',
        'birthdate' => 'date',
    ];

    public function household(): BelongsTo
    {
        return $this->belongsTo(Household::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function verification(): MorphOne
    {
        return $this->morphOne(Verification::class, 'verifiable');
    }

    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->middle_name} {$this->last_name} {$this->suffix}");
    }
}
