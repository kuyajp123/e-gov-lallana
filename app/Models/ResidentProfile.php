<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
        'occupation',
        'is_voter',
        'voter_id_number',
        'avatar_file_id',
    ];

    protected $casts = [
        'birthdate' => 'date',
        'is_voter' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function avatar(): BelongsTo
    {
        return $this->belongsTo(FileRecord::class, 'avatar_file_id');
    }

    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->middle_name} {$this->last_name} {$this->suffix}");
    }
}
