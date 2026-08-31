<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $verifiable_type
 * @property int $verifiable_id
 * @property string $status
 * @property int|null $reviewer_id
 * @property string|null $review_notes
 * @property Carbon|null $reviewed_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Model|\Eloquent $verifiable
 * @property-read User|null $reviewer
 */
class Verification extends Model
{
    protected $fillable = [
        'verifiable_type',
        'verifiable_id',
        'status',
        'reviewer_id',
        'review_notes',
        'reviewed_at',
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
    ];

    /**
     * @return MorphTo<Model, $this>
     */
    public function verifiable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}
