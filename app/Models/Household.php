<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Household extends Model
{
    protected $fillable = [
        'household_code',
        'family_head_id',
        'address',
        'purok_sitio',
        'status',
        'notes',
        'submitted_at',
        'verified_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'verified_at' => 'datetime',
    ];

    public function familyHead(): BelongsTo
    {
        return $this->belongsTo(User::class, 'family_head_id');
    }

    public function members(): HasMany
    {
        return $this->hasMany(HouseholdMember::class);
    }

    public function verification(): MorphOne
    {
        return $this->morphOne(Verification::class, 'verifiable');
    }
}
