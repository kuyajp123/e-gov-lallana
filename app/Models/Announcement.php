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

    /**
     * Mutator to sanitize announcement HTML before persisting to prevent stored XSS.
     */
    public function setContentAttribute(?string $value): void
    {
        $this->attributes['content'] = self::sanitizeHtml($value);
    }

    /**
     * Sanitize HTML to prevent stored XSS attacks while preserving Tiptap formatting tags.
     */
    public static function sanitizeHtml(?string $html): string
    {
        if (empty($html)) {
            return '';
        }

        // 1. Allow only safe rich-text formatting tags used by the Tiptap editor
        $allowedTags = '<h2><h3><h4><p><b><strong><i><em><u><s><blockquote><ul><ol><li><a><hr><br><img><span>';
        $cleaned = strip_tags($html, $allowedTags);

        // 2. Disarm any inline event handlers (e.g. onerror=, onclick=, onload=)
        $cleaned = preg_replace('/(<[a-z0-9]+[^>]*?)\s+on[a-z]+\s*=\s*(["\']?).*?\2/i', '$1', $cleaned) ?? $cleaned;

        // 3. Disarm javascript:, data: (except images), or vbscript: URLs in href/src
        $cleaned = preg_replace('/href\s*=\s*(["\']?)\s*(?:javascript|vbscript|data):[^"\'>]*\1/i', 'href="#"', $cleaned) ?? $cleaned;
        $cleaned = preg_replace('/src\s*=\s*(["\']?)\s*(?:javascript|vbscript):[^"\'>]*\1/i', 'src=""', $cleaned) ?? $cleaned;

        return $cleaned;
    }
}
