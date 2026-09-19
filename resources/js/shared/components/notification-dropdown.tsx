import { Link, router, usePage } from '@inertiajs/react';
import { Bell, CheckCheck, FileText, Home, Info } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import type { AppNotificationType, SharedData } from '@/shared/types';

function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) {
        return 'just now';
    }

    const diffMinutes = Math.floor(diffSeconds / 60);

    if (diffMinutes < 60) {
        return `${diffMinutes}m ago`;
    }

    const diffHours = Math.floor(diffMinutes / 60);

    if (diffHours < 24) {
        return `${diffHours}h ago`;
    }

    const diffDays = Math.floor(diffHours / 24);

    if (diffDays < 7) {
        return `${diffDays}d ago`;
    }

    return date.toLocaleDateString('en-PH', {
        month: 'short',
        day: 'numeric',
    });
}

function getNotificationIcon(type: string) {
    if (type.startsWith('document_')) {
        return <FileText className="size-4 text-sky-600 dark:text-sky-400" />;
    }

    if (type.startsWith('household_')) {
        return (
            <Home className="size-4 text-emerald-600 dark:text-emerald-400" />
        );
    }

    return <Info className="size-4 text-amber-600 dark:text-amber-400" />;
}

export function NotificationDropdown() {
    const page = usePage<SharedData>();
    const unreadCount = page.props.auth?.unreadNotificationsCount ?? 0;
    const notifications: AppNotificationType[] =
        page.props.auth?.recentNotifications ?? [];

    const handleNotificationClick = (notification: AppNotificationType) => {
        if (!notification.read_at) {
            router.patch(
                `/notifications/${notification.id}/read`,
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        if (notification.action_url) {
                            router.visit(notification.action_url);
                        }
                    },
                },
            );
        } else if (notification.action_url) {
            router.visit(notification.action_url);
        }
    };

    const handleMarkAllAsRead = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        router.post('/notifications/read-all', {}, { preserveScroll: true });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative size-9 cursor-pointer text-muted-foreground hover:text-foreground"
                    aria-label="Notifications"
                >
                    <Bell className="size-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 flex size-4.5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-xs">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-80 p-0 shadow-lg sm:w-96"
            >
                <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-3">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">
                            Notifications
                        </span>
                        {unreadCount > 0 && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                {unreadCount} new
                            </span>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="flex cursor-pointer items-center gap-1 text-xs text-muted-foreground hover:text-foreground hover:underline"
                        >
                            <CheckCheck className="size-3.5" />
                            <span>Mark all as read</span>
                        </button>
                    )}
                </div>

                <div className="max-h-80 divide-y divide-border overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="py-8 text-center text-sm text-muted-foreground">
                            No notifications right now.
                        </div>
                    ) : (
                        notifications.map((item) => (
                            <DropdownMenuItem
                                key={item.id}
                                onClick={() => handleNotificationClick(item)}
                                className={`flex cursor-pointer items-start gap-3 p-3.5 focus:bg-accent/50 ${
                                    !item.read_at
                                        ? 'bg-primary/5 dark:bg-primary/10'
                                        : ''
                                }`}
                            >
                                <div className="mt-0.5 shrink-0 rounded-full bg-muted p-1.5">
                                    {getNotificationIcon(item.type)}
                                </div>
                                <div className="min-w-0 flex-1 space-y-1">
                                    <div className="flex items-center justify-between gap-1">
                                        <p className="truncate text-xs font-semibold text-foreground">
                                            {item.title}
                                        </p>
                                        <span className="text-[10px] whitespace-nowrap text-muted-foreground">
                                            {formatRelativeTime(
                                                item.created_at,
                                            )}
                                        </span>
                                    </div>
                                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                                        {item.message}
                                    </p>
                                </div>
                                {!item.read_at && (
                                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                                )}
                            </DropdownMenuItem>
                        ))
                    )}
                </div>

                <DropdownMenuSeparator className="m-0" />

                <div className="bg-muted/20 p-2 text-center">
                    <Link
                        href="/notifications"
                        className="text-xs font-medium text-primary hover:underline"
                    >
                        View all notifications →
                    </Link>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
