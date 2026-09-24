<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\AnnouncementFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $title
 * @property string $slug
 * @property string|null $excerpt
 * @property string $content
 * @property string $category
 * @property bool $is_published
 * @property CarbonImmutable|Carbon|null $published_at
 * @property int|null $author_id
 * @property int|null $banner_file_id
 * @property CarbonImmutable|Carbon|null $created_at
 * @property CarbonImmutable|Carbon|null $updated_at
 * @property-read User|null $author
 * @property-read FileRecord|null $banner
 */
class Announcement extends Model
{
    /** @use HasFactory<AnnouncementFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'category',
        'is_published',
        'published_at',
        'author_id',
        'banner_file_id',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function banner(): BelongsTo
    {
        return $this->belongsTo(FileRecord::class, 'banner_file_id');
    }
}
