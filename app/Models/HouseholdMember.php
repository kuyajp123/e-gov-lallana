<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $household_id
 * @property int|null $user_id
 * @property string $first_name
 * @property string|null $middle_name
 * @property string $last_name
 * @property string|null $suffix
 * @property string $relationship_to_head
 * @property bool $is_family_head
 * @property Carbon|null $birthdate
 * @property string|null $gender
 * @property string|null $civil_status
 * @property string|null $occupation
 * @property string $residency_status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read string $full_name
 * @property-read Household $household
 * @property-read User|null $user
 * @property-read Verification|null $verification
 */
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

    /**
     * @return BelongsTo<Household, $this>
     */
    public function household(): BelongsTo
    {
        return $this->belongsTo(Household::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return MorphOne<Verification, $this>
     */
    public function verification(): MorphOne
    {
        return $this->morphOne(Verification::class, 'verifiable');
    }

    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->middle_name} {$this->last_name} {$this->suffix}");
    }
}
