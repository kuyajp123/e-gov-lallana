<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

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
        /** @var FilesystemAdapter $storageDisk */
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

        if (Route::has('storage.'.$this->disk)) {
            return URL::temporarySignedRoute(
                'storage.'.$this->disk,
                now()->addMinutes($expirationMinutes),
                ['path' => $this->path]
            );
        }

        if (Route::has('storage.local')) {
            $relativePath = str_starts_with($this->path, $this->disk.'/')
                ? $this->path
                : ($this->disk !== 'local' ? $this->disk.'/'.ltrim($this->path, '/') : $this->path);

            return URL::temporarySignedRoute(
                'storage.local',
                now()->addMinutes($expirationMinutes),
                ['path' => $relativePath]
            );
        }

        return $storageDisk->url($this->path);
    }
}
