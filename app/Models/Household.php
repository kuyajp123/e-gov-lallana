<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $household_code
 * @property int $family_head_id
 * @property string $address
 * @property string $purok_sitio
 * @property string $status
 * @property string|null $notes
 * @property Carbon|null $submitted_at
 * @property Carbon|null $verified_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User $familyHead
 * @property-read Collection<int, HouseholdMember> $members
 * @property-read Verification|null $verification
 */
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

    /**
     * @return BelongsTo<User, $this>
     */
    public function familyHead(): BelongsTo
    {
        return $this->belongsTo(User::class, 'family_head_id');
    }

    /**
     * @return HasMany<HouseholdMember, $this>
     */
    public function members(): HasMany
    {
        return $this->hasMany(HouseholdMember::class);
    }

    /**
     * @return MorphOne<Verification, $this>
     */
    public function verification(): MorphOne
    {
        return $this->morphOne(Verification::class, 'verifiable');
    }
}
