<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property string $preferred_channel
 * @property bool $notify_document_updates
 * @property bool $notify_household_updates
 * @property bool $notify_announcements
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User $user
 */
class NotificationPreference extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'preferred_channel',
        'notify_document_updates',
        'notify_household_updates',
        'notify_announcements',
    ];

    protected function casts(): array
    {
        return [
            'notify_document_updates' => 'boolean',
            'notify_household_updates' => 'boolean',
            'notify_announcements' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
