<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\DocumentType;
use App\Models\Household;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LandingPageController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $locale = app()->getLocale();

        // 1. Dynamic Aggregate Statistics
        $totalResidents = User::where('status', 'active')->count();
        $totalHouseholds = Household::where('status', 'verified')->count();
        $totalOfficials = User::whereHas('role', fn ($q) => $q->whereIn('slug', ['admin', 'sub_admin']))->count();

        // Official community statistics with fallback baseline counters
        $statistics = [
            'total_population' => 5253,
            'actual_population' => max($totalResidents, 4180),
            'total_residents' => max($totalResidents, 4180),
            'total_households' => max($totalHouseholds, 310),
            'total_officials' => max($totalOfficials, 34),
            'personnel_breakdown' => [
                'officials' => 8,
                'sk' => 8,
                'office' => 5,
                'tanod' => 8,
                'utility' => 5,
            ],
        ];

        // 2. Confirmed Public Services
        $services = DocumentType::where('is_active', true)
            ->get(['id', 'name', 'slug', 'description', 'fee_cents', 'requirements'])
            ->map(function ($doc) {
                return [
                    'id' => $doc->id,
                    'name' => $doc->name,
                    'slug' => $doc->slug,
                    'description' => $doc->description,
                    'fee' => $doc->formatted_fee,
                    'requirements' => $doc->requirements ?? [],
                ];
            });

        // 3. Published Dynamic Announcements
        $announcements = Announcement::with('banner')
            ->where('is_published', true)
            ->where(function ($query) {
                $query->whereNull('published_at')->orWhere('published_at', '<=', now());
            })
            ->latest('published_at')
            ->latest('id')
            ->take(3)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'slug' => $item->slug,
                    'excerpt' => $item->excerpt,
                    'category' => $item->category,
                    'published_at' => $item->published_at?->format('M d, Y') ?? now()->format('M d, Y'),
                    'published_at_formatted' => $item->published_at?->format('M d, Y') ?? now()->format('M d, Y'),
                    'banner_url' => $item->banner?->getUrl(),
                ];
            });

        $announcementCounts = [
            'all' => Announcement::where('is_published', true)->where(fn ($q) => $q->whereNull('published_at')->orWhere('published_at', '<=', now()))->count(),
            'advisory' => Announcement::where('is_published', true)->where('category', 'Advisory')->where(fn ($q) => $q->whereNull('published_at')->orWhere('published_at', '<=', now()))->count(),
            'event' => Announcement::where('is_published', true)->where('category', 'Event')->where(fn ($q) => $q->whereNull('published_at')->orWhere('published_at', '<=', now()))->count(),
            'meeting' => Announcement::where('is_published', true)->where('category', 'Meeting')->where(fn ($q) => $q->whereNull('published_at')->orWhere('published_at', '<=', now()))->count(),
            'emergency' => Announcement::where('is_published', true)->where('category', 'Emergency')->where(fn ($q) => $q->whereNull('published_at')->orWhere('published_at', '<=', now()))->count(),
        ];

        // 4. Translation dictionary
        $t = trans('landing', [], $locale);

        return Inertia::render('welcome', [
            't' => is_array($t) ? $t : trans('landing', [], 'en'),
            'locale' => $locale,
            'statistics' => $statistics,
            'services' => $services,
            'announcements' => $announcements,
            'announcement_counts' => $announcementCounts,
        ]);
    }
}
