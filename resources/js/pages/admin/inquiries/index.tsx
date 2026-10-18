import { Head, router } from '@inertiajs/react';
import {
    AlertCircle,
    Archive,
    CheckCircle2,
    Clock,
    ExternalLink,
    Inbox,
    Mail,
    MessageSquare,
    Search,
    Trash2,
    User,
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
import { Label } from '@/shared/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';

interface InquiryItem {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    ip_address: string | null;
    status: 'pending' | 'in_progress' | 'resolved' | 'spam';
    admin_notes: string | null;
    resolved_by: { id: number; name: string } | null;
    resolved_at_formatted: string | null;
    created_at_formatted: string;
    created_at_full: string;
}

interface InquiriesIndexProps {
    inquiries: {
        data: InquiryItem[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    stats: {
        total: number;
        pending: number;
        in_progress: number;
        resolved: number;
    };
    filters: {
        search: string;
        status: string;
    };
}

export default function InquiriesIndex({
    inquiries,
    stats,
    filters,
}: InquiriesIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    // Dialog State
    const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(
        null,
    );
    const [adminNotes, setAdminNotes] = useState('');
    const [statusToUpdate, setStatusToUpdate] = useState<
        'pending' | 'in_progress' | 'resolved' | 'spam'
    >('pending');
    const [isUpdating, setIsUpdating] = useState(false);

    // Delete State
    const [deleteTarget, setDeleteTarget] = useState<InquiryItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const applyFilters = (newStatus?: string) => {
        const st = newStatus !== undefined ? newStatus : statusFilter;
        router.get(
            '/admin/inquiries',
            {
                search: search || undefined,
                status: st !== 'all' ? st : undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    const handleClearSearch = () => {
        setSearch('');
        router.get(
            '/admin/inquiries',
            {
                status: statusFilter !== 'all' ? statusFilter : undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleOpenInquiry = (inquiry: InquiryItem) => {
        setSelectedInquiry(inquiry);
        setAdminNotes(inquiry.admin_notes || '');
        setStatusToUpdate(inquiry.status);
    };

    const handleSaveStatus = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedInquiry) {
            return;
        }

        setIsUpdating(true);
        router.patch(
            `/admin/inquiries/${selectedInquiry.id}/status`,
            {
                status: statusToUpdate,
                admin_notes: adminNotes,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedInquiry(null);
                    setIsUpdating(false);
                },
                onError: () => {
                    setIsUpdating(false);
                },
            },
        );
    };

    const handleConfirmDelete = () => {
        if (!deleteTarget) {
            return;
        }

        setIsDeleting(true);
        router.delete(`/admin/inquiries/${deleteTarget.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteTarget(null);
                setIsDeleting(false);

                if (selectedInquiry?.id === deleteTarget.id) {
                    setSelectedInquiry(null);
                }
            },
            onError: () => {
                setIsDeleting(false);
            },
        });
    };

    const getStatusBadge = (status: InquiryItem['status']) => {
        switch (status) {
            case 'pending':
                return (
                    <Badge
                        variant="outline"
                        className="border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                    >
                        <Clock className="mr-1 size-3" />
                        Pending
                    </Badge>
                );
            case 'in_progress':
                return (
                    <Badge
                        variant="outline"
                        className="border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                    >
                        <AlertCircle className="mr-1 size-3" />
                        In Progress
                    </Badge>
                );
            case 'resolved':
                return (
                    <Badge
                        variant="outline"
                        className="border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                    >
                        <CheckCircle2 className="mr-1 size-3" />
                        Resolved
                    </Badge>
                );
            case 'spam':
                return (
                    <Badge
                        variant="outline"
                        className="border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                    >
                        <Archive className="mr-1 size-3" />
                        Spam / Archived
                    </Badge>
                );
        }
    };

    return (
        <>
            <Head title="Citizen Inquiries — Barangay Lallana Admin" />

            <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            Citizen Inquiries
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Review and respond to messages, feedback, and public
                            inquiries submitted by residents.
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                    <Card className="border border-border/80 shadow-xs">
                        <CardContent className="p-4 sm:p-5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                    Total Inquiries
                                </span>
                                <MessageSquare className="size-4 text-muted-foreground" />
                            </div>
                            <div className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                {stats.total}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-border/80 shadow-xs">
                        <CardContent className="p-4 sm:p-5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium tracking-wider text-amber-600 uppercase dark:text-amber-400">
                                    Pending Review
                                </span>
                                <Clock className="size-4 text-amber-500" />
                            </div>
                            <div className="mt-2 text-2xl font-bold tracking-tight text-amber-600 sm:text-3xl dark:text-amber-400">
                                {stats.pending}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-border/80 shadow-xs">
                        <CardContent className="p-4 sm:p-5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium tracking-wider text-blue-600 uppercase dark:text-blue-400">
                                    In Progress
                                </span>
                                <AlertCircle className="size-4 text-blue-500" />
                            </div>
                            <div className="mt-2 text-2xl font-bold tracking-tight text-blue-600 sm:text-3xl dark:text-blue-400">
                                {stats.in_progress}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-border/80 shadow-xs">
                        <CardContent className="p-4 sm:p-5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
                                    Resolved
                                </span>
                                <CheckCircle2 className="size-4 text-emerald-500" />
                            </div>
                            <div className="mt-2 text-2xl font-bold tracking-tight text-emerald-600 sm:text-3xl dark:text-emerald-400">
                                {stats.resolved}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* Status Tabs */}
                    <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-border/80 bg-muted/40 p-1">
                        {[
                            { key: 'all', label: 'All Inquiries' },
                            { key: 'pending', label: 'Pending' },
                            { key: 'in_progress', label: 'In Progress' },
                            { key: 'resolved', label: 'Resolved' },
                            { key: 'spam', label: 'Spam' },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => {
                                    setStatusFilter(tab.key);
                                    applyFilters(tab.key);
                                }}
                                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                                    statusFilter === tab.key
                                        ? 'bg-background text-foreground shadow-xs'
                                        : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Search Form */}
                    <form
                        onSubmit={handleSearchSubmit}
                        className="relative w-full sm:w-72"
                    >
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search name, email, subject..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pr-8 pl-9 text-sm"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="size-3.5" />
                            </button>
                        )}
                    </form>
                </div>

                {/* Inquiries List */}
                <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
                    {inquiries.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                                <Inbox className="size-6 text-muted-foreground" />
                            </div>
                            <h3 className="mt-4 text-base font-semibold text-foreground">
                                No inquiries found
                            </h3>
                            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                                {search || statusFilter !== 'all'
                                    ? 'No citizen inquiries match your active search and filter criteria.'
                                    : 'There are currently no public messages or inquiries submitted from the portal.'}
                            </p>
                            {(search || statusFilter !== 'all') && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setSearch('');
                                        setStatusFilter('all');
                                        router.get('/admin/inquiries');
                                    }}
                                    className="mt-4"
                                >
                                    Reset Filters
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {inquiries.data.map((inquiry) => (
                                <div
                                    key={inquiry.id}
                                    className="flex flex-col gap-3 p-4 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5"
                                >
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="truncate font-semibold text-foreground">
                                                {inquiry.subject}
                                            </span>
                                            {getStatusBadge(inquiry.status)}
                                        </div>

                                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                            {inquiry.message}
                                        </p>

                                        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1 font-medium text-foreground/80">
                                                <User className="size-3.5" />
                                                {inquiry.name}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Mail className="size-3.5" />
                                                {inquiry.email}
                                            </span>
                                            <span>
                                                Submitted{' '}
                                                {inquiry.created_at_formatted}
                                            </span>
                                            {inquiry.resolved_by && (
                                                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                                    Resolved by{' '}
                                                    {inquiry.resolved_by.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 self-start sm:self-center">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                handleOpenInquiry(inquiry)
                                            }
                                            className="h-8 gap-1.5 text-xs"
                                        >
                                            <MessageSquare className="size-3.5" />
                                            View & Respond
                                        </Button>

                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() =>
                                                setDeleteTarget(inquiry)
                                            }
                                            className="size-8 text-muted-foreground hover:text-destructive"
                                            title="Delete inquiry"
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {inquiries.last_page > 1 && (
                    <div className="flex flex-wrap items-center justify-between gap-4 py-2">
                        <div className="text-xs text-muted-foreground">
                            Showing page{' '}
                            <span className="font-medium text-foreground">
                                {inquiries.current_page}
                            </span>{' '}
                            of{' '}
                            <span className="font-medium text-foreground">
                                {inquiries.last_page}
                            </span>{' '}
                            ({inquiries.total} total)
                        </div>

                        <div className="flex items-center gap-1">
                            {inquiries.links.map((link, idx) => {
                                return (
                                    <button
                                        key={idx}
                                        disabled={!link.url}
                                        onClick={() =>
                                            link.url &&
                                            router.get(
                                                link.url,
                                                {},
                                                { preserveState: true },
                                            )
                                        }
                                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                                            link.active
                                                ? 'bg-primary text-primary-foreground'
                                                : link.url
                                                  ? 'border border-border bg-background text-foreground hover:bg-muted'
                                                  : 'cursor-not-allowed text-muted-foreground/40'
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* View & Update Status Dialog */}
            <Dialog
                open={Boolean(selectedInquiry)}
                onOpenChange={(open) => !open && setSelectedInquiry(null)}
            >
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <div className="flex items-center justify-between gap-2 pr-6">
                            <DialogTitle className="text-xl font-bold">
                                {selectedInquiry?.subject}
                            </DialogTitle>
                        </div>
                        <DialogDescription>
                            Submitted on {selectedInquiry?.created_at_full}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedInquiry && (
                        <div className="flex flex-col gap-4 py-2">
                            {/* Resident Details Card */}
                            <div className="rounded-xl border border-border/80 bg-muted/40 p-4 text-sm">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-3">
                                        <div>
                                            <span className="block text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                                Sender Name
                                            </span>
                                            <span className="mt-0.5 block text-base font-semibold text-foreground">
                                                {selectedInquiry.name}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                                Current Status
                                            </span>
                                            <div className="mt-1">
                                                {getStatusBadge(
                                                    selectedInquiry.status,
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <span className="block text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                                Email Address
                                            </span>
                                            <span className="mt-0.5 block text-sm font-semibold break-all text-foreground">
                                                {selectedInquiry.email}
                                            </span>
                                            <a
                                                href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(selectedInquiry.subject)}`}
                                                className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <Mail className="size-3.5" />
                                                Reply via Email
                                                <ExternalLink className="size-3 opacity-70" />
                                            </a>
                                        </div>

                                        {selectedInquiry.ip_address && (
                                            <div>
                                                <span className="block text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                                    IP Address
                                                </span>
                                                <span className="mt-0.5 block font-mono text-xs text-muted-foreground">
                                                    {selectedInquiry.ip_address}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Inquiry Message */}
                            <div>
                                <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                    Message
                                </Label>
                                <div className="mt-1.5 rounded-lg border border-border bg-background p-4 text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                                    {selectedInquiry.message}
                                </div>
                            </div>

                            {/* Status Update Form */}
                            <form
                                onSubmit={handleSaveStatus}
                                className="flex flex-col gap-3 pt-2"
                            >
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <div>
                                        <Label
                                            htmlFor="statusSelect"
                                            className="text-xs font-medium"
                                        >
                                            Update Status
                                        </Label>
                                        <Select
                                            value={statusToUpdate}
                                            onValueChange={(
                                                val:
                                                    | 'pending'
                                                    | 'in_progress'
                                                    | 'resolved'
                                                    | 'spam',
                                            ) => setStatusToUpdate(val)}
                                        >
                                            <SelectTrigger
                                                id="statusSelect"
                                                className="mt-1.5 w-full"
                                            >
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">
                                                    <span className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                                                        <Clock className="size-3.5" />
                                                        <span>Pending</span>
                                                    </span>
                                                </SelectItem>
                                                <SelectItem value="in_progress">
                                                    <span className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                                                        <AlertCircle className="size-3.5" />
                                                        <span>In Progress</span>
                                                    </span>
                                                </SelectItem>
                                                <SelectItem value="resolved">
                                                    <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                                        <CheckCircle2 className="size-3.5" />
                                                        <span>Resolved</span>
                                                    </span>
                                                </SelectItem>
                                                <SelectItem value="spam">
                                                    <span className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                                                        <Archive className="size-3.5" />
                                                        <span>
                                                            Spam / Archived
                                                        </span>
                                                    </span>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {selectedInquiry.resolved_by && (
                                        <div>
                                            <span className="block text-xs font-medium text-muted-foreground">
                                                Resolution Details
                                            </span>
                                            <span className="mt-2 block text-xs text-foreground">
                                                By{' '}
                                                {
                                                    selectedInquiry.resolved_by
                                                        .name
                                                }{' '}
                                                (
                                                {
                                                    selectedInquiry.resolved_at_formatted
                                                }
                                                )
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <Label
                                        htmlFor="adminNotes"
                                        className="text-xs font-medium"
                                    >
                                        Internal Admin Notes (Optional)
                                    </Label>
                                    <Textarea
                                        id="adminNotes"
                                        placeholder="Add notes about actions taken, phone calls, or resident contact details..."
                                        value={adminNotes}
                                        onChange={(e) =>
                                            setAdminNotes(e.target.value)
                                        }
                                        rows={3}
                                        className="mt-1.5 text-sm"
                                    />
                                </div>

                                <DialogFooter className="mt-2 gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setSelectedInquiry(null)}
                                        disabled={isUpdating}
                                    >
                                        Close
                                    </Button>
                                    <Button type="submit" disabled={isUpdating}>
                                        {isUpdating
                                            ? 'Saving...'
                                            : 'Save Updates'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={Boolean(deleteTarget)}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Citizen Inquiry</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the inquiry from{' '}
                            <span className="font-semibold text-foreground">
                                {deleteTarget?.name}
                            </span>{' '}
                            regarding &quot;{deleteTarget?.subject}&quot;? This
                            record will be permanently removed.
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
                            onClick={handleConfirmDelete}
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
