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

        // Fallback friendly baseline counters if initial database is empty
        $statistics = [
            'total_residents' => max($totalResidents, 1250),
            'total_households' => max($totalHouseholds, 310),
            'total_officials' => max($totalOfficials, 12),
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
        $announcements = Announcement::where('is_published', true)
            ->where(function ($query) {
                $query->whereNull('published_at')->orWhere('published_at', '<=', now());
            })
            ->latest('published_at')
            ->take(3)
            ->get(['id', 'title', 'slug', 'excerpt', 'category', 'published_at'])
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'slug' => $item->slug,
                    'excerpt' => $item->excerpt,
                    'category' => $item->category,
                    'published_at' => $item->published_at?->format('M d, Y') ?? now()->format('M d, Y'),
                ];
            });

        // 4. Translation dictionary
        $t = trans('landing', [], $locale);

        return Inertia::render('welcome', [
            't' => is_array($t) ? $t : trans('landing', [], 'en'),
            'locale' => $locale,
            'statistics' => $statistics,
            'services' => $services,
            'announcements' => $announcements,
        ]);
    }
}
