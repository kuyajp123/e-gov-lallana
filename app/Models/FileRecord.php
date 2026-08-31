<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

/**
 * @property int $id
 * @property int|null $user_id
 * @property string $file_name
 * @property string $disk
 * @property string|null $bucket
 * @property string $path
 * @property string $mime_type
 * @property int|null $size_bytes
 * @property bool $is_private
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User|null $user
 */
class FileRecord extends Model
{
    protected $table = 'files';

    protected $fillable = [
        'user_id',
        'file_name',
        'disk',
        'bucket',
        'path',
        'mime_type',
        'size_bytes',
        'is_private',
    ];

    protected $casts = [
        'is_private' => 'boolean',
        'size_bytes' => 'integer',
    ];

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get temporary signed URL or public URL.
     */
    public function getUrl(int $expirationMinutes = 30): string
    {
        $storageDisk = Storage::disk($this->disk);

        if (! $this->is_private) {
            return $storageDisk->url($this->path);
        }

        // S3 / Supabase private bucket signed URL
        if ($storageDisk->providesTemporaryUrls()) {
            return $storageDisk->temporaryUrl(
                $this->path,
                now()->addMinutes($expirationMinutes)
            );
        }

        return $storageDisk->url($this->path);
    }
}
