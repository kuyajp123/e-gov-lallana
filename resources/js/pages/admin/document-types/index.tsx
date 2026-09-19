import { Head, Link, router } from '@inertiajs/react';
import {
    CheckCircle2,
    FileCheck2,
    FileCode2,
    FileText,
    MoreHorizontal,
    Pencil,
    Plus,
    Search,
    ToggleLeft,
    ToggleRight,
    Trash2,
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Input } from '@/shared/components/ui/input';

interface DocumentTypeItem {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    fee_cents: number;
    formatted_fee: string;
    is_free: boolean;
    requirements: string[];
    requirements_count: number;
    form_schema: Array<{
        name: string;
        label: string;
        type: string;
        required: boolean;
    }>;
    form_fields_count: number;
    is_active: boolean;
    document_requests_count: number;
    created_at_formatted: string;
    updated_at_formatted: string;
}

interface DocumentTypesIndexProps {
    documentTypes: {
        data: DocumentTypeItem[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    stats: {
        total: number;
        active: number;
        inactive: number;
        free: number;
    };
    filters: {
        search: string;
        status: string;
    };
}

export default function DocumentTypesIndex({
    documentTypes,
    stats,
    filters,
}: DocumentTypesIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [deleteTarget, setDeleteTarget] = useState<DocumentTypeItem | null>(
        null,
    );

    const handleApplyFilters = (newStatus?: string) => {
        const targetStatus = newStatus !== undefined ? newStatus : statusFilter;
        router.get(
            '/admin/document-types',
            {
                search: search || undefined,
                status: targetStatus !== 'all' ? targetStatus : undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleStatusTabClick = (st: string) => {
        setStatusFilter(st);
        handleApplyFilters(st);
    };

    const handleClearFilters = () => {
        setSearch('');
        setStatusFilter('all');
        router.get(
            '/admin/document-types',
            {},
            { preserveState: true, replace: true },
        );
    };

    const handleToggleActive = (id: number) => {
        router.post(
            `/admin/document-types/${id}/toggle`,
            {},
            { preserveScroll: true },
        );
    };

    const confirmDelete = () => {
        if (!deleteTarget) {
            return;
        }

        router.delete(`/admin/document-types/${deleteTarget.id}`, {
            onSuccess: () => setDeleteTarget(null),
        });
    };

    return (
        <>
            <Head title="Document Services Configuration | Admin Console" />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
                {/* Header with Title and Create Action */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <div className="rounded-lg bg-primary/10 p-2 text-primary">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                                    Document Services Catalog
                                </h1>
                                <p className="text-xs text-muted-foreground">
                                    Configure barangay certificates, clearances,
                                    processing fees, and citizen application
                                    questions.
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
                            <Link href="/admin/document-types/create">
                                <Plus className="h-4 w-4" />
                                Add Document Type
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
                                    Total Services
                                </p>
                                <FileCheck2 className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                                {stats.total}
                            </p>
                            <p className="mt-0.5 text-[11px] text-muted-foreground">
                                Configured in system
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/70 shadow-2xs">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                    Active Services
                                </p>
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            </div>
                            <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                                {stats.active}
                            </p>
                            <p className="mt-0.5 text-[11px] text-muted-foreground">
                                Available to residents
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/70 shadow-2xs">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
                                    Inactive / Draft
                                </p>
                                <ToggleLeft className="h-4 w-4 text-amber-500" />
                            </div>
                            <p className="mt-2 text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                                {stats.inactive}
                            </p>
                            <p className="mt-0.5 text-[11px] text-muted-foreground">
                                Hidden from public
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/70 shadow-2xs">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                    Free / Libre Services
                                </p>
                                <Badge
                                    variant="secondary"
                                    className="h-4 px-1 text-[10px]"
                                >
                                    ₱0
                                </Badge>
                            </div>
                            <p className="mt-2 text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
                                {stats.free}
                            </p>
                            <p className="mt-0.5 text-[11px] text-muted-foreground">
                                Zero fee clearances
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* Status Tabs */}
                    <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-border/70 bg-muted/30 p-1">
                        {[
                            {
                                id: 'all',
                                label: 'All Services',
                                count: stats.total,
                            },
                            {
                                id: 'active',
                                label: 'Active',
                                count: stats.active,
                            },
                            {
                                id: 'inactive',
                                label: 'Inactive',
                                count: stats.inactive,
                            },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => handleStatusTabClick(tab.id)}
                                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                                    statusFilter === tab.id
                                        ? 'bg-card font-semibold text-foreground shadow-2xs'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                {tab.label}
                                <span
                                    className={`py-0.2 rounded-full px-1.5 text-[10px] ${
                                        statusFilter === tab.id
                                            ? 'bg-primary/10 font-semibold text-primary'
                                            : 'bg-muted text-muted-foreground'
                                    }`}
                                >
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Search and Reset */}
                    <div className="flex items-center gap-2">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute top-2.5 left-2.5 h-3.5 w-3.5 text-muted-foreground" />
                            <Input
                                placeholder="Search name or slug..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === 'Enter' && handleApplyFilters()
                                }
                                className="h-8 pl-8 text-xs"
                            />
                            {search && (
                                <button
                                    onClick={() => {
                                        setSearch('');
                                        router.get(
                                            '/admin/document-types',
                                            {
                                                status:
                                                    statusFilter !== 'all'
                                                        ? statusFilter
                                                        : undefined,
                                            },
                                            { preserveState: true },
                                        );
                                    }}
                                    className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>

                        {(search || statusFilter !== 'all') && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClearFilters}
                                className="h-8 text-xs text-muted-foreground"
                            >
                                Reset
                            </Button>
                        )}
                    </div>
                </div>

                {/* Document Types Table */}
                <Card className="overflow-hidden border-border/70 shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-border bg-muted/40 font-medium text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3">
                                        Document Service
                                    </th>
                                    <th className="px-4 py-3">Standard Fee</th>
                                    <th className="px-4 py-3">Requirements</th>
                                    <th className="px-4 py-3">
                                        Dynamic Schema
                                    </th>
                                    <th className="px-4 py-3">
                                        Requests Served
                                    </th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                                {documentTypes.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-4 py-12 text-center"
                                        >
                                            <FileCode2 className="mx-auto h-8 w-8 text-muted-foreground/40" />
                                            <p className="mt-2 text-sm font-medium text-foreground">
                                                No document types found
                                            </p>
                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                {search ||
                                                statusFilter !== 'all'
                                                    ? 'Try adjusting your search criteria or active filters.'
                                                    : 'Get started by configuring your first barangay document service.'}
                                            </p>
                                            <Button
                                                asChild
                                                size="sm"
                                                className="mt-4 h-8 text-xs"
                                            >
                                                <Link href="/admin/document-types/create">
                                                    <Plus className="mr-1 h-3.5 w-3.5" />
                                                    Add Document Type
                                                </Link>
                                            </Button>
                                        </td>
                                    </tr>
                                ) : (
                                    documentTypes.data.map((doc) => (
                                        <tr
                                            key={doc.id}
                                            className="transition-colors hover:bg-muted/30"
                                        >
                                            {/* Name & Slug */}
                                            <td className="px-4 py-3.5">
                                                <div className="flex flex-col">
                                                    <Link
                                                        href={`/admin/document-types/${doc.id}/edit`}
                                                        className="text-sm font-semibold text-foreground transition-colors hover:text-primary"
                                                    >
                                                        {doc.name}
                                                    </Link>
                                                    <span className="font-mono text-[11px] text-muted-foreground">
                                                        /{doc.slug}
                                                    </span>
                                                    {doc.description && (
                                                        <span className="mt-0.5 line-clamp-1 max-w-xs text-[11px] text-muted-foreground/80">
                                                            {doc.description}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Fee */}
                                            <td className="px-4 py-3.5 font-medium">
                                                {doc.is_free ? (
                                                    <Badge
                                                        variant="secondary"
                                                        className="border-emerald-500/20 bg-emerald-500/10 text-[11px] text-emerald-600"
                                                    >
                                                        Free / Libre
                                                    </Badge>
                                                ) : (
                                                    <span className="font-semibold text-foreground">
                                                        {doc.formatted_fee}
                                                    </span>
                                                )}
                                            </td>

                                            {/* Requirements */}
                                            <td className="px-4 py-3.5">
                                                {doc.requirements_count > 0 ? (
                                                    <Badge
                                                        variant="outline"
                                                        className="gap-1 border-border text-[11px] font-normal"
                                                        title={doc.requirements.join(
                                                            ', ',
                                                        )}
                                                    >
                                                        {doc.requirements_count}{' '}
                                                        required doc
                                                        {doc.requirements_count >
                                                        1
                                                            ? 's'
                                                            : ''}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-[11px] text-muted-foreground italic">
                                                        None specified
                                                    </span>
                                                )}
                                            </td>

                                            {/* Dynamic Schema */}
                                            <td className="px-4 py-3.5">
                                                {doc.form_fields_count > 0 ? (
                                                    <Badge
                                                        variant="secondary"
                                                        className="border-primary/20 bg-primary/10 text-[11px] text-primary"
                                                    >
                                                        {doc.form_fields_count}{' '}
                                                        custom question
                                                        {doc.form_fields_count >
                                                        1
                                                            ? 's'
                                                            : ''}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-[11px] text-muted-foreground">
                                                        Standard form
                                                    </span>
                                                )}
                                            </td>

                                            {/* Total Requests */}
                                            <td className="px-4 py-3.5 font-medium">
                                                <span className="rounded-md bg-muted px-2 py-1 text-xs">
                                                    {
                                                        doc.document_requests_count
                                                    }{' '}
                                                    request
                                                    {doc.document_requests_count ===
                                                    1
                                                        ? ''
                                                        : 's'}
                                                </span>
                                            </td>

                                            {/* Active Status */}
                                            <td className="px-4 py-3.5">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleToggleActive(
                                                            doc.id,
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1.5 focus:outline-none"
                                                    title={
                                                        doc.is_active
                                                            ? 'Click to deactivate'
                                                            : 'Click to activate'
                                                    }
                                                >
                                                    <span
                                                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors ${
                                                            doc.is_active
                                                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                                : 'bg-muted text-muted-foreground'
                                                        }`}
                                                    >
                                                        <span
                                                            className={`h-1.5 w-1.5 rounded-full ${
                                                                doc.is_active
                                                                    ? 'bg-emerald-500'
                                                                    : 'bg-muted-foreground'
                                                            }`}
                                                        />
                                                        {doc.is_active
                                                            ? 'Active'
                                                            : 'Inactive'}
                                                    </span>
                                                </button>
                                            </td>

                                            {/* Action Menu */}
                                            <td className="px-4 py-3.5 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="w-40 text-xs"
                                                    >
                                                        <DropdownMenuItem
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/admin/document-types/${doc.id}/edit`}
                                                                className="cursor-pointer gap-2"
                                                            >
                                                                <Pencil className="h-3.5 w-3.5" />
                                                                Edit Service
                                                            </Link>
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleToggleActive(
                                                                    doc.id,
                                                                )
                                                            }
                                                            className="cursor-pointer gap-2"
                                                        >
                                                            {doc.is_active ? (
                                                                <>
                                                                    <ToggleLeft className="h-3.5 w-3.5 text-amber-500" />
                                                                    Deactivate
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <ToggleRight className="h-3.5 w-3.5 text-emerald-500" />
                                                                    Activate
                                                                </>
                                                            )}
                                                        </DropdownMenuItem>

                                                        <DropdownMenuSeparator />

                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                setDeleteTarget(
                                                                    doc,
                                                                )
                                                            }
                                                            className="cursor-pointer gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                            Delete Service
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {documentTypes.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
                            <span>
                                Showing page {documentTypes.current_page} of{' '}
                                {documentTypes.last_page} ({documentTypes.total}{' '}
                                total)
                            </span>
                            <div className="flex items-center gap-1">
                                {documentTypes.links.map((link, idx) => {
                                    if (!link.url) {
                                        return (
                                            <span
                                                key={idx}
                                                className="px-2 py-1 text-muted-foreground/50"
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        );
                                    }

                                    return (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            preserveState
                                            className={`rounded-md px-2.5 py-1 transition-colors ${
                                                link.active
                                                    ? 'bg-primary font-semibold text-primary-foreground'
                                                    : 'text-foreground hover:bg-muted'
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
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteTarget !== null}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Document Service</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete{' '}
                            <span className="font-semibold text-foreground">
                                {deleteTarget?.name}
                            </span>
                            ? This action cannot be undone. Services with
                            existing document requests cannot be deleted.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteTarget(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={confirmDelete}
                        >
                            Delete Document Type
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
