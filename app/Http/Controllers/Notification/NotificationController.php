<?php

namespace App\Http\Controllers\Notification;

use App\Http\Controllers\Controller;
use App\Models\AppNotification;
use App\Services\Notification\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function __construct(
        protected NotificationService $notificationService
    ) {}

    /**
     * Display all notifications for the authenticated user.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $filter = $request->query('filter', 'all');

        $query = AppNotification::where('user_id', $user->id)
            ->latest('created_at');

        if ($filter === 'unread') {
            $query->whereNull('read_at');
        }

        $notifications = $query->paginate(15)->withQueryString();

        return Inertia::render('notifications/index', [
            'notifications' => $notifications,
            'unreadCount' => $this->notificationService->getUnreadCount($user),
            'currentFilter' => $filter,
        ]);
    }

    /**
     * Mark a specific notification as read.
     */
    public function markAsRead(Request $request, string $id): JsonResponse|RedirectResponse
    {
        $user = $request->user();
        $success = $this->notificationService->markAsRead($user, $id);

        if ($request->wantsJson()) {
            return response()->json(['success' => $success]);
        }

        return back();
    }

    /**
     * Mark all notifications as read for the authenticated user.
     */
    public function markAllAsRead(Request $request): RedirectResponse
    {
        $user = $request->user();
        $this->notificationService->markAllAsRead($user);

        return back()->with('success', 'Lahat ng notifications ay namarkahan nang nabasa na.');
    }
}
