import { Head, Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    Calendar,
    CheckCircle2,
    Eye,
    FileText,
    Layers,
    Megaphone,
    Pencil,
    Plus,
    Search,
    Trash2,
    Users,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';

interface AnnouncementItem {
    id: number;
    title: string;
    slug: string;
    category: string;
    excerpt: string | null;
    is_published: boolean;
    published_at_formatted: string | null;
    created_at_formatted: string;
    author_name: string;
    banner_url: string | null;
}

interface AnnouncementsIndexProps {
    announcements: {
        data: AnnouncementItem[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    stats: {
        total: number;
        published: number;
        draft: number;
        emergency: number;
    };
    filters: {
        search: string;
        category: string;
        status: string;
    };
    categories: string[];
}

export default function AnnouncementsIndex({
    announcements,
    stats,
    filters,
    categories,
}: AnnouncementsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [categoryFilter, setCategoryFilter] = useState(
        filters.category || 'all',
    );
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [deleteTarget, setDeleteTarget] = useState<AnnouncementItem | null>(
        null,
    );
    const [isDeleting, setIsDeleting] = useState(false);

    const applyFilters = (newCategory?: string, newStatus?: string) => {
        const cat = newCategory !== undefined ? newCategory : categoryFilter;
        const st = newStatus !== undefined ? newStatus : statusFilter;

        router.get(
            '/admin/announcements',
            {
                search: search || undefined,
                category: cat !== 'all' ? cat : undefined,
                status: st !== 'all' ? st : undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    const handleCategoryChange = (cat: string) => {
        setCategoryFilter(cat);
        applyFilters(cat, undefined);
    };

    const handleStatusChange = (st: string) => {
        setStatusFilter(st);
        applyFilters(undefined, st);
    };

    const handleClearFilters = () => {
        setSearch('');
        setCategoryFilter('all');
        setStatusFilter('all');
        router.get(
            '/admin/announcements',
            {},
            { preserveState: true, replace: true },
        );
    };

    const handleTogglePublish = (announcement: AnnouncementItem) => {
        router.patch(
            `/admin/announcements/${announcement.id}/toggle`,
            {},
            { preserveScroll: true },
        );
    };

    const confirmDelete = () => {
        if (!deleteTarget) {
            return;
        }

        setIsDeleting(true);
        router.delete(`/admin/announcements/${deleteTarget.id}`, {
            onFinish: () => {
                setIsDeleting(false);
                setDeleteTarget(null);
            },
        });
    };

    const getCategoryBadge = (category: string) => {
        switch (category.toLowerCase()) {
            case 'emergency':
                return (
                    <Badge
                        variant="destructive"
                        className="gap-1 text-xs font-semibold capitalize"
                    >
                        <AlertTriangle className="h-3 w-3" />
                        Emergency
                    </Badge>
                );
            case 'event':
                return (
                    <span className="inline-flex items-center gap-1 rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-600 capitalize dark:text-indigo-400">
                        <Calendar className="h-3 w-3" />
                        Event
                    </span>
                );
            case 'meeting':
                return (
                    <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 capitalize dark:text-amber-400">
                        <Users className="h-3 w-3" />
                        Meeting
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary capitalize">
                        <Megaphone className="h-3 w-3" />
                        Advisory
                    </span>
                );
        }
    };

    return (
        <>
            <Head title="Announcements Management | Admin Console" />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <div className="rounded-lg bg-primary/10 p-2 text-primary">
                                <Megaphone className="h-5 w-5" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                                    Community Announcements
                                </h1>
                                <p className="text-xs text-muted-foreground">
                                    Publish public advisories, community events,
                                    barangay sessions, and emergency broadcasts.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            asChild
                            size="sm"
                            className="h-9 gap-1.5 shadow-xs"
                        >
                            <Link href="/admin/announcements/create">
                                <Plus className="h-4 w-4" />
                                New Announcement
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <Card className="border-border/70 shadow-2xs">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-medium text-muted-foreground">
                                    Total Articles
                                </p>
                                <Layers className="h-4 w-4 text-muted-foreground/70" />
                            </div>
                            <p className="mt-2 text-2xl font-bold tracking-tight text-foreground tabular-nums">
                                {stats.total}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/70 shadow-2xs">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-medium text-muted-foreground">
                                    Published
                                </p>
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            </div>
                            <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-600 tabular-nums dark:text-emerald-400">
                                {stats.published}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/70 shadow-2xs">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-medium text-muted-foreground">
                                    Drafts
                                </p>
                                <FileText className="h-4 w-4 text-amber-500" />
                            </div>
                            <p className="mt-2 text-2xl font-bold tracking-tight text-amber-600 tabular-nums dark:text-amber-400">
                                {stats.draft}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/70 shadow-2xs">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-medium text-muted-foreground">
                                    Emergency Alerts
                                </p>
                                <AlertTriangle className="h-4 w-4 text-destructive" />
                            </div>
                            <p className="mt-2 text-2xl font-bold tracking-tight text-destructive tabular-nums">
                                {stats.emergency}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-card p-3 shadow-2xs md:flex-row md:items-center md:justify-between">
                    <form
                        onSubmit={handleSearchSubmit}
                        className="relative flex-1"
                    >
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search by title, excerpt, or keywords..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-9 pr-9 pl-9 text-xs"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    router.get(
                                        '/admin/announcements',
                                        {
                                            category:
                                                categoryFilter !== 'all'
                                                    ? categoryFilter
                                                    : undefined,
                                            status:
                                                statusFilter !== 'all'
                                                    ? statusFilter
                                                    : undefined,
                                        },
                                        { preserveState: true, replace: true },
                                    );
                                }}
                                className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </form>

                    <div className="flex flex-wrap items-center gap-2">
                        {/* Category filter tabs */}
                        <div className="flex items-center rounded-lg border border-border/80 bg-muted/30 p-0.5 text-xs">
                            <button
                                type="button"
                                onClick={() => handleCategoryChange('all')}
                                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                                    categoryFilter === 'all'
                                        ? 'bg-background font-semibold text-foreground shadow-2xs'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                All
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => handleCategoryChange(cat)}
                                    className={`rounded-md px-2.5 py-1 font-medium capitalize transition-colors ${
                                        categoryFilter === cat
                                            ? 'bg-background font-semibold text-foreground shadow-2xs'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Status filter tabs */}
                        <div className="flex items-center rounded-lg border border-border/80 bg-muted/30 p-0.5 text-xs">
                            {['all', 'published', 'draft'].map((st) => (
                                <button
                                    key={st}
                                    type="button"
                                    onClick={() => handleStatusChange(st)}
                                    className={`rounded-md px-2.5 py-1 font-medium capitalize transition-colors ${
                                        statusFilter === st
                                            ? 'bg-background font-semibold text-foreground shadow-2xs'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {st}
                                </button>
                            ))}
                        </div>

                        {(search ||
                            categoryFilter !== 'all' ||
                            statusFilter !== 'all') && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClearFilters}
                                className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-3.5 w-3.5" />
                                Reset
                            </Button>
                        )}
                    </div>
                </div>

                {/* Table or Empty State */}
                <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-2xs">
                    {announcements.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="rounded-full bg-muted p-3 text-muted-foreground">
                                <Megaphone className="h-8 w-8" />
                            </div>
                            <h3 className="mt-4 text-base font-semibold text-foreground">
                                No announcements found
                            </h3>
                            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                                {search ||
                                categoryFilter !== 'all' ||
                                statusFilter !== 'all'
                                    ? 'Try adjusting your search criteria or clearing active filters.'
                                    : 'Get started by creating your first barangay advisory or announcement.'}
                            </p>
                            <div className="mt-4">
                                <Button asChild size="sm">
                                    <Link href="/admin/announcements/create">
                                        <Plus className="mr-1.5 h-4 w-4" />
                                        Create Announcement
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-border/80 bg-muted/40 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-4 py-3 sm:px-6"
                                        >
                                            Announcement
                                        </th>
                                        <th scope="col" className="px-4 py-3">
                                            Category
                                        </th>
                                        <th scope="col" className="px-4 py-3">
                                            Author
                                        </th>
                                        <th scope="col" className="px-4 py-3">
                                            Status
                                        </th>
                                        <th scope="col" className="px-4 py-3">
                                            Published Date
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3 text-right"
                                        >
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/60">
                                    {announcements.data.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="transition-colors hover:bg-muted/30"
                                        >
                                            {/* Title & Banner */}
                                            <td className="px-4 py-3.5 sm:px-6">
                                                <div className="flex items-center gap-3">
                                                    {item.banner_url ? (
                                                        <img
                                                            src={
                                                                item.banner_url
                                                            }
                                                            alt={item.title}
                                                            className="h-12 w-16 shrink-0 rounded-md border border-border/60 object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-md border border-border/60 bg-muted/60 text-muted-foreground">
                                                            <Megaphone className="h-5 w-5 opacity-60" />
                                                        </div>
                                                    )}
                                                    <div className="max-w-md min-w-0">
                                                        <p className="truncate text-sm font-semibold text-foreground">
                                                            {item.title}
                                                        </p>
                                                        {item.excerpt && (
                                                            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                                                                {item.excerpt}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Category */}
                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                {getCategoryBadge(
                                                    item.category,
                                                )}
                                            </td>

                                            {/* Author */}
                                            <td className="px-4 py-3.5 text-xs whitespace-nowrap text-muted-foreground">
                                                {item.author_name}
                                            </td>

                                            {/* Status Toggle Badge */}
                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleTogglePublish(
                                                            item,
                                                        )
                                                    }
                                                    title={`Click to ${item.is_published ? 'unpublish (move to draft)' : 'publish'}`}
                                                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors hover:opacity-80"
                                                >
                                                    {item.is_published ? (
                                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-emerald-600 dark:text-emerald-400">
                                                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                                                            Published
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-amber-600 dark:text-amber-400">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                                            Draft
                                                        </span>
                                                    )}
                                                </button>
                                            </td>

                                            {/* Published Date */}
                                            <td className="px-4 py-3.5 text-xs whitespace-nowrap text-muted-foreground">
                                                {item.published_at_formatted ??
                                                    'Not published'}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-4 py-3.5 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                        title="View public reader"
                                                    >
                                                        <Link
                                                            href={`/announcements/${item.slug}`}
                                                            target="_blank"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                        title="Edit announcement"
                                                    >
                                                        <Link
                                                            href={`/admin/announcements/${item.id}/edit`}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                        onClick={() =>
                                                            setDeleteTarget(
                                                                item,
                                                            )
                                                        }
                                                        title="Delete announcement"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {announcements.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-border/80 px-4 py-3 sm:px-6">
                            <p className="text-xs text-muted-foreground">
                                Showing page{' '}
                                <span className="font-semibold">
                                    {announcements.current_page}
                                </span>{' '}
                                of{' '}
                                <span className="font-semibold">
                                    {announcements.last_page}
                                </span>{' '}
                                ({announcements.total} total)
                            </p>
                            <div className="flex items-center gap-1">
                                {announcements.links.map((link, idx) => (
                                    <Button
                                        key={idx}
                                        asChild={Boolean(link.url)}
                                        disabled={!link.url}
                                        variant={
                                            link.active ? 'default' : 'outline'
                                        }
                                        size="sm"
                                        className="h-8 px-3 text-xs"
                                    >
                                        {link.url ? (
                                            <Link
                                                href={link.url}
                                                preserveScroll
                                                preserveState
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        ) : (
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        )}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={Boolean(deleteTarget)}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Announcement</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to permanently delete{' '}
                            <span className="font-semibold text-foreground">
                                &quot;{deleteTarget?.title}&quot;
                            </span>
                            ? The banner image and all article contents will be
                            purged from the server. This action cannot be
                            undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteTarget(null)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={confirmDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete Permanently'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
