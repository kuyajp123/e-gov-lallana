<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property string $first_name
 * @property string|null $middle_name
 * @property string $last_name
 * @property string|null $suffix
 * @property Carbon|null $birthdate
 * @property string|null $gender
 * @property string|null $civil_status
 * @property string $citizenship
 * @property string|null $religion
 * @property string $residency_status
 * @property Carbon|null $date_of_residency
 * @property string|null $occupation
 * @property string|null $educational_attainment
 * @property string|null $employment_status
 * @property bool $is_voter
 * @property string|null $voter_id_number
 * @property bool $senior_citizen_status
 * @property bool $pwd_status
 * @property string|null $pwd_id_number
 * @property bool $solo_parent_status
 * @property string|null $solo_parent_id_number
 * @property int|null $avatar_file_id
 * @property int|null $government_id_file_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read string $full_name
 * @property-read User $user
 * @property-read FileRecord|null $avatar
 * @property-read FileRecord|null $governmentId
 */
class ResidentProfile extends Model
{
    protected $fillable = [
        'user_id',
        'first_name',
        'middle_name',
        'last_name',
        'suffix',
        'birthdate',
        'gender',
        'civil_status',
        'citizenship',
        'religion',
        'residency_status',
        'date_of_residency',
        'occupation',
        'educational_attainment',
        'employment_status',
        'is_voter',
        'voter_id_number',
        'senior_citizen_status',
        'pwd_status',
        'pwd_id_number',
        'solo_parent_status',
        'solo_parent_id_number',
        'avatar_file_id',
        'government_id_file_id',
    ];

    protected $casts = [
        'birthdate' => 'date',
        'date_of_residency' => 'date',
        'is_voter' => 'boolean',
        'senior_citizen_status' => 'boolean',
        'pwd_status' => 'boolean',
        'solo_parent_status' => 'boolean',
    ];

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<FileRecord, $this>
     */
    public function avatar(): BelongsTo
    {
        return $this->belongsTo(FileRecord::class, 'avatar_file_id');
    }

    /**
     * @return BelongsTo<FileRecord, $this>
     */
    public function governmentId(): BelongsTo
    {
        return $this->belongsTo(FileRecord::class, 'government_id_file_id');
    }

    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->middle_name} {$this->last_name} {$this->suffix}");
    }
}
