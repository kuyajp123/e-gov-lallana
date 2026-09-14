import { Head, Link, router } from '@inertiajs/react';
import {
    CheckCheck,
    ChevronRight,
    FileText,
    Home,
    Info,
    Inbox,
} from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import type { AppNotificationType, BreadcrumbItem } from '@/shared/types';

type PaginatedData<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    total: number;
};

type Props = {
    notifications: PaginatedData<AppNotificationType>;
    unreadCount: number;
    currentFilter: 'all' | 'unread';
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Notifications', href: '/notifications' },
];

function formatTime(dateString: string): string {
    const date = new Date(dateString);

    return date.toLocaleString('en-PH', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}

function getNotificationIcon(type: string) {
    if (type.startsWith('document_')) {
        return <FileText className="size-5 text-sky-600 dark:text-sky-400" />;
    }

    if (type.startsWith('household_')) {
        return (
            <Home className="size-5 text-emerald-600 dark:text-emerald-400" />
        );
    }

    return <Info className="size-5 text-amber-600 dark:text-amber-400" />;
}

export default function NotificationsIndex({
    notifications,
    unreadCount,
    currentFilter,
}: Props) {
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

    const handleMarkAllAsRead = () => {
        router.post('/notifications/read-all', {}, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Notifications" />

            <div className="mx-auto flex h-full w-full max-w-4xl flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Page Header */}
                <div className="flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl font-bold tracking-tight">
                                Notifications
                            </h1>
                            {unreadCount > 0 && (
                                <Badge
                                    variant="default"
                                    className="rounded-full px-2.5"
                                >
                                    {unreadCount} unread
                                </Badge>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Stay updated with your document requests, household
                            verification, and barangay advisories.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleMarkAllAsRead}
                                className="flex items-center gap-1.5"
                            >
                                <CheckCheck className="size-4" />
                                <span>Mark all as read</span>
                            </Button>
                        )}
                        <Link href="/settings/notifications">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs"
                            >
                                Preferences
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2">
                    <Link
                        href="/notifications?filter=all"
                        className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                            currentFilter === 'all'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                        }`}
                    >
                        All ({notifications.total})
                    </Link>
                    <Link
                        href="/notifications?filter=unread"
                        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                            currentFilter === 'unread'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                        }`}
                    >
                        <span>Unread</span>
                        {unreadCount > 0 && (
                            <span className="py-0.2 rounded-full bg-red-500 px-1.5 text-xs text-white">
                                {unreadCount}
                            </span>
                        )}
                    </Link>
                </div>

                {/* Notifications List */}
                {notifications.data.length === 0 ? (
                    <Card className="border-dashed py-12 text-center">
                        <CardContent className="flex flex-col items-center justify-center space-y-3">
                            <div className="rounded-full bg-muted p-4">
                                <Inbox className="size-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-base font-semibold">
                                No Notifications
                            </h3>
                            <p className="max-w-sm text-sm text-muted-foreground">
                                {currentFilter === 'unread'
                                    ? "You're all caught up! You have no unread notifications."
                                    : "You don't have any notifications yet."}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {notifications.data.map((notification) => (
                            <Card
                                key={notification.id}
                                onClick={() =>
                                    handleNotificationClick(notification)
                                }
                                className={`cursor-pointer transition-all duration-150 hover:border-primary/50 hover:shadow-sm ${
                                    !notification.read_at
                                        ? 'border-l-4 border-l-primary bg-primary/[0.02] dark:bg-primary/[0.05]'
                                        : 'opacity-90'
                                }`}
                            >
                                <CardContent className="flex items-start gap-4 p-4 sm:p-5">
                                    <div className="mt-0.5 shrink-0 rounded-full bg-muted p-2.5">
                                        {getNotificationIcon(notification.type)}
                                    </div>

                                    <div className="min-w-0 flex-1 space-y-1">
                                        <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-semibold text-foreground">
                                                    {notification.title}
                                                </h4>
                                                {!notification.read_at && (
                                                    <span className="size-2 shrink-0 rounded-full bg-primary" />
                                                )}
                                            </div>
                                            <span className="text-xs whitespace-nowrap text-muted-foreground">
                                                {formatTime(
                                                    notification.created_at,
                                                )}
                                            </span>
                                        </div>

                                        <p className="text-sm leading-relaxed text-muted-foreground">
                                            {notification.message}
                                        </p>
                                    </div>

                                    {notification.action_url && (
                                        <div className="shrink-0 self-center text-muted-foreground hover:text-foreground">
                                            <ChevronRight className="size-5" />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Pagination Controls */}
                {notifications.last_page > 1 && (
                    <div className="flex items-center justify-between border-t pt-4">
                        <span className="text-xs text-muted-foreground">
                            Page {notifications.current_page} of{' '}
                            {notifications.last_page}
                        </span>
                        <div className="flex items-center gap-2">
                            {notifications.prev_page_url ? (
                                <Link href={notifications.prev_page_url}>
                                    <Button variant="outline" size="sm">
                                        ← Previous
                                    </Button>
                                </Link>
                            ) : (
                                <Button variant="outline" size="sm" disabled>
                                    ← Previous
                                </Button>
                            )}

                            {notifications.next_page_url ? (
                                <Link href={notifications.next_page_url}>
                                    <Button variant="outline" size="sm">
                                        Next →
                                    </Button>
                                </Link>
                            ) : (
                                <Button variant="outline" size="sm" disabled>
                                    Next →
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

NotificationsIndex.layout = {
    breadcrumbs,
};
