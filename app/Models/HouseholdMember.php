<?php

namespace App\Models;

use App\Services\Household\HouseholdSuccessionService;
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
 * @property-read Household|null $household
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

    protected static function booted(): void
    {
        static::deleting(function (HouseholdMember $member) {
            if ($member->is_family_head && $member->household) {
                app(HouseholdSuccessionService::class)
                    ->handleHeadDeletion($member->household, deletedHeadMemberId: $member->id);
            }
        });
    }

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
        return implode(' ', array_filter([
            $this->first_name,
            $this->middle_name,
            $this->last_name,
            $this->suffix,
        ]));
    }

    public function isAdult(): bool
    {
        return $this->birthdate !== null && $this->birthdate->diffInYears(now()) >= 18;
    }

    public function isVerified(): bool
    {
        return $this->verification?->status === 'approved';
    }

    public function isSpouse(): bool
    {
        return strtolower((string) $this->relationship_to_head) === 'spouse';
    }
}
