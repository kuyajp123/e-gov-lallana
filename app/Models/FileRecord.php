<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

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

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get temporary signed URL or public URL.
     */
    public function getUrl(int $expirationMinutes = 30): string
    {
        if ($this->disk === 'public') {
            return Storage::disk('public')->url($this->path);
        }

        // Supabase / S3 private bucket signed URL
        return Storage::disk($this->disk)->temporaryUrl(
            $this->path,
            now()->addMinutes($expirationMinutes)
        );
    }
}
