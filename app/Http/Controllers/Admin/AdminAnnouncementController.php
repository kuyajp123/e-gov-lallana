<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAnnouncementRequest;
use App\Http\Requests\Admin\UpdateAnnouncementRequest;
use App\Models\Announcement;
use App\Services\Files\FileUploadService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminAnnouncementController extends Controller
{
    /**
     * Display a listing of announcements with search, category, and status filters.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $category = $request->string('category')->trim()->toString();
        $status = $request->string('status')->trim()->toString();

        $query = Announcement::query()
            ->with(['author', 'banner'])
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

        if ($status === 'published') {
            $query->where('is_published', true);
        } elseif ($status === 'draft') {
            $query->where('is_published', false);
        }

        $paginated = $query->paginate(12)->withQueryString();

        $announcements = $paginated->through(function (Announcement $item) {
            return [
                'id' => $item->id,
                'title' => $item->title,
                'slug' => $item->slug,
                'category' => $item->category,
                'excerpt' => $item->excerpt,
                'is_published' => $item->is_published,
                'published_at' => $item->published_at?->format('Y-m-d H:i:s'),
                'published_at_formatted' => $item->published_at?->format('M d, Y h:i A') ?? 'Not published',
                'author_name' => $item->author->name ?? 'Barangay Official',
                'banner_url' => $item->banner?->getUrl(),
                'created_at_formatted' => $item->created_at?->format('M d, Y'),
            ];
        });

        $counts = [
            'all' => Announcement::count(),
            'published' => Announcement::where('is_published', true)->count(),
            'draft' => Announcement::where('is_published', false)->count(),
            'advisory' => Announcement::where('category', 'Advisory')->count(),
            'event' => Announcement::where('category', 'Event')->count(),
            'meeting' => Announcement::where('category', 'Meeting')->count(),
            'emergency' => Announcement::where('category', 'Emergency')->count(),
        ];

        $stats = [
            'total' => $counts['all'],
            'published' => $counts['published'],
            'draft' => $counts['draft'],
            'emergency' => $counts['emergency'],
        ];

        return Inertia::render('admin/announcements/index', [
            'announcements' => $announcements,
            'stats' => $stats,
            'counts' => $counts,
            'filters' => [
                'search' => $search,
                'category' => $category ?: 'all',
                'status' => $status ?: 'all',
            ],
            'categories' => ['Advisory', 'Event', 'Meeting', 'Emergency'],
        ]);
    }

    /**
     * Show the form for creating a new announcement.
     */
    public function create(): Response
    {
        return Inertia::render('admin/announcements/create', [
            'categories' => ['Advisory', 'Event', 'Meeting', 'Emergency'],
        ]);
    }

    /**
     * Store a newly created announcement in storage.
     */
    public function store(StoreAnnouncementRequest $request, FileUploadService $fileUploadService): RedirectResponse
    {
        $title = $request->string('title')->trim()->toString();
        $customSlug = $request->string('slug')->trim()->toString();
        $slug = $customSlug !== '' ? Str::slug($customSlug) : Str::slug($title);

        // Ensure unique slug
        $baseSlug = $slug;
        $counter = 1;
        while (Announcement::where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        $bannerFileId = null;
        if ($request->hasFile('banner')) {
            $fileRecord = $fileUploadService->uploadAnnouncementAttachment(
                $request->file('banner'),
                userId: $request->user()?->id
            );
            $bannerFileId = $fileRecord->id;
        }

        $isPublished = $request->boolean('is_published');
        $publishedAtInput = $request->input('published_at');
        $publishedAt = $publishedAtInput ? Carbon::parse($publishedAtInput) : ($isPublished ? now() : null);

        Announcement::create([
            'title' => $title,
            'slug' => $slug,
            'category' => $request->string('category')->toString(),
            'excerpt' => $request->input('excerpt'),
            'content' => $request->input('content'),
            'is_published' => $isPublished,
            'published_at' => $publishedAt,
            'author_id' => $request->user()?->id,
            'banner_file_id' => $bannerFileId,
        ]);

        return redirect()
            ->route('admin.announcements.index')
            ->with('success', "Announcement '{$title}' created successfully.");
    }

    /**
     * Show the form for editing the specified announcement.
     */
    public function edit(Announcement $announcement): Response
    {
        $announcement->load(['banner', 'author']);

        return Inertia::render('admin/announcements/edit', [
            'announcement' => [
                'id' => $announcement->id,
                'title' => $announcement->title,
                'slug' => $announcement->slug,
                'category' => $announcement->category,
                'excerpt' => $announcement->excerpt,
                'content' => $announcement->content,
                'is_published' => $announcement->is_published,
                'published_at' => $announcement->published_at?->format('Y-m-d\TH:i'),
                'banner_url' => $announcement->banner?->getUrl(),
            ],
            'categories' => ['Advisory', 'Event', 'Meeting', 'Emergency'],
        ]);
    }

    /**
     * Update the specified announcement in storage.
     */
    public function update(
        UpdateAnnouncementRequest $request,
        Announcement $announcement,
        FileUploadService $fileUploadService
    ): RedirectResponse {
        $title = $request->string('title')->trim()->toString();
        $customSlug = $request->string('slug')->trim()->toString();
        $slug = $customSlug !== '' ? Str::slug($customSlug) : Str::slug($title);

        // Ensure unique slug except for current announcement
        $baseSlug = $slug;
        $counter = 1;
        while (Announcement::where('slug', $slug)->where('id', '!=', $announcement->id)->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        // Handle banner update or removal
        if ($request->hasFile('banner')) {
            if ($announcement->banner) {
                Storage::disk($announcement->banner->disk)->delete($announcement->banner->path);
                $announcement->banner->delete();
            }

            $fileRecord = $fileUploadService->uploadAnnouncementAttachment(
                $request->file('banner'),
                userId: $request->user()?->id
            );
            $announcement->banner_file_id = $fileRecord->id;
        } elseif ($request->boolean('remove_banner') && $announcement->banner) {
            Storage::disk($announcement->banner->disk)->delete($announcement->banner->path);
            $announcement->banner->delete();
            $announcement->banner_file_id = null;
        }

        $isPublished = $request->boolean('is_published');
        $publishedAtInput = $request->input('published_at');
        $publishedAt = $publishedAtInput
            ? Carbon::parse($publishedAtInput)
            : ($isPublished ? ($announcement->published_at ?? now()) : null);

        $announcement->update([
            'title' => $title,
            'slug' => $slug,
            'category' => $request->string('category')->toString(),
            'excerpt' => $request->input('excerpt'),
            'content' => $request->input('content'),
            'is_published' => $isPublished,
            'published_at' => $publishedAt,
        ]);

        return redirect()
            ->route('admin.announcements.index')
            ->with('success', "Announcement '{$title}' updated successfully.");
    }

    /**
     * Remove the specified announcement from storage.
     */
    public function destroy(Announcement $announcement): RedirectResponse
    {
        if ($announcement->banner) {
            Storage::disk($announcement->banner->disk)->delete($announcement->banner->path);
            $announcement->banner->delete();
        }

        $title = $announcement->title;
        $announcement->delete();

        return redirect()
            ->route('admin.announcements.index')
            ->with('success', "Announcement '{$title}' has been deleted.");
    }

    /**
     * Toggle the publication status of the specified announcement.
     */
    public function togglePublish(Announcement $announcement): RedirectResponse
    {
        $announcement->is_published = ! $announcement->is_published;

        if ($announcement->is_published && ! $announcement->published_at) {
            $announcement->published_at = now();
        }

        $announcement->save();

        $statusText = $announcement->is_published ? 'published' : 'moved to draft';

        return back()->with('success', "Announcement '{$announcement->title}' has been {$statusText}.");
    }
}
