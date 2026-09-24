<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PublicAnnouncementController extends Controller
{
    /**
     * Display a listing of public announcements.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $category = $request->string('category')->trim()->toString();

        $query = Announcement::query()
            ->with(['banner', 'author'])
            ->where('is_published', true)
            ->where(function ($q) {
                $q->whereNull('published_at')->orWhere('published_at', '<=', now());
            })
            ->latest('published_at')
            ->latest('id');

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        if ($category !== '' && $category !== 'all') {
            $query->where('category', $category);
        }

        $paginated = $query->paginate(9)->withQueryString();

        $announcements = $paginated->through(function (Announcement $item) {
            return [
                'id' => $item->id,
                'title' => $item->title,
                'slug' => $item->slug,
                'category' => $item->category,
                'excerpt' => $item->excerpt,
                'published_at_formatted' => $item->published_at?->format('M d, Y') ?? 'Recently',
                'author_name' => $item->author->name ?? 'Barangay Lallana Council',
                'banner_url' => $item->banner?->getUrl(),
            ];
        });

        $counts = [
            'all' => Announcement::where('is_published', true)
                ->where(fn ($q) => $q->whereNull('published_at')->orWhere('published_at', '<=', now()))
                ->count(),
            'advisory' => Announcement::where('is_published', true)
                ->where('category', 'Advisory')
                ->where(fn ($q) => $q->whereNull('published_at')->orWhere('published_at', '<=', now()))
                ->count(),
            'event' => Announcement::where('is_published', true)
                ->where('category', 'Event')
                ->where(fn ($q) => $q->whereNull('published_at')->orWhere('published_at', '<=', now()))
                ->count(),
            'meeting' => Announcement::where('is_published', true)
                ->where('category', 'Meeting')
                ->where(fn ($q) => $q->whereNull('published_at')->orWhere('published_at', '<=', now()))
                ->count(),
            'emergency' => Announcement::where('is_published', true)
                ->where('category', 'Emergency')
                ->where(fn ($q) => $q->whereNull('published_at')->orWhere('published_at', '<=', now()))
                ->count(),
        ];

        return Inertia::render('public/announcements/index', [
            'announcements' => $announcements,
            'counts' => $counts,
            'filters' => [
                'search' => $search,
                'category' => $category ?: 'all',
            ],
            'categories' => ['Advisory', 'Event', 'Meeting', 'Emergency'],
        ]);
    }

    /**
     * Display the specified public announcement article.
     */
    public function show(Announcement $announcement): Response
    {
        /** @var User|null $user */
        $user = Auth::user();
        $canPreviewDraft = (bool) $user?->can_access_admin;

        // If not published or future-dated, require admin preview rights
        if (! $canPreviewDraft) {
            if (! $announcement->is_published || ($announcement->published_at && $announcement->published_at->isFuture())) {
                abort(404, 'Announcement not found or not published.');
            }
        }

        $announcement->load(['banner', 'author']);

        // Fetch up to 3 recent related announcements (preferring same category)
        $relatedQuery = Announcement::where('id', '!=', $announcement->id)
            ->where('is_published', true)
            ->where(function ($q) {
                $q->whereNull('published_at')->orWhere('published_at', '<=', now());
            });

        $sameCategoryCount = (clone $relatedQuery)->where('category', $announcement->category)->count();
        if ($sameCategoryCount > 0) {
            $relatedQuery->where('category', $announcement->category);
        }

        $related = $relatedQuery
            ->latest('published_at')
            ->take(3)
            ->get(['id', 'title', 'slug', 'category', 'excerpt', 'published_at', 'banner_file_id'])
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'slug' => $item->slug,
                    'category' => $item->category,
                    'excerpt' => $item->excerpt,
                    'published_at_formatted' => $item->published_at?->format('M d, Y') ?? 'Recently',
                    'banner_url' => $item->banner?->getUrl(),
                ];
            });

        return Inertia::render('public/announcements/show', [
            'announcement' => [
                'id' => $announcement->id,
                'title' => $announcement->title,
                'slug' => $announcement->slug,
                'category' => $announcement->category,
                'excerpt' => $announcement->excerpt,
                'content' => $announcement->content,
                'is_published' => $announcement->is_published,
                'published_at_formatted' => $announcement->published_at?->format('F d, Y • h:i A') ?? 'Draft',
                'author_name' => $announcement->author->name ?? 'Barangay Council of Lallana',
                'banner_url' => $announcement->banner?->getUrl(),
            ],
            'related' => $related,
            'relatedAnnouncements' => $related,
            'canEdit' => $canPreviewDraft,
        ]);
    }
}
