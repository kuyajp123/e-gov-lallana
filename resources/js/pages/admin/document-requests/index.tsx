import { Head, Link } from '@inertiajs/react';
import {
    Building2,
    CheckCircle2,
    Clock,
    ExternalLink,
    Eye,
    FileCheck,
    FileText,
    MoreHorizontal,
    PauseCircle,
    PlayCircle,
    Undo2,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { DocumentRequestDrawer } from '@/features/admin/document-requests/components/document-request-drawer';
import type { AdminDocumentRequestItem } from '@/features/admin/document-requests/components/document-request-drawer';
import { DocumentRequestFilters } from '@/features/admin/document-requests/components/document-request-filters';
import type {
    DocumentTypeOption,
    StatusCounts,
} from '@/features/admin/document-requests/components/document-request-filters';
import { StatusTransitionModal } from '@/features/admin/document-requests/components/status-transition-modal';
import type { TransitionActionType } from '@/features/admin/document-requests/components/status-transition-modal';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import type { BreadcrumbItem } from '@/shared/types';

interface PaginationLink {
    url?: string | null;
    label: string;
    active: boolean;
}

interface AdminDocumentIndexProps {
    requests: {
        data: AdminDocumentRequestItem[];
        links: PaginationLink[];
        total: number;
        from?: number;
        to?: number;
    };
    statusCounts: StatusCounts;
    documentTypes: DocumentTypeOption[];
    filters: {
        search: string;
        status: string;
        document_type_id: number | null;
        payment_status: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Console', href: '/admin' },
    { title: 'Document Queue', href: '/admin/document-requests' },
];

export default function AdminDocumentIndex({
    requests,
    statusCounts,
    documentTypes,
    filters,
}: AdminDocumentIndexProps) {
    const [selectedRequest, setSelectedRequest] =
        useState<AdminDocumentRequestItem | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Modal state for actions
    const [modalAction, setModalAction] = useState<TransitionActionType | null>(
        null,
    );
    const [modalRequestId, setModalRequestId] = useState<number | null>(null);
    const [modalRefCode, setModalRefCode] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenDrawer = (req: AdminDocumentRequestItem) => {
        setSelectedRequest(req);
        setIsDrawerOpen(true);
    };

    const handleTriggerAction = (
        type: TransitionActionType,
        req: AdminDocumentRequestItem,
    ) => {
        setModalAction(type);
        setModalRequestId(req.id);
        setModalRefCode(req.reference_code);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalAction(null);
        setModalRequestId(null);
        setModalRefCode('');
    };

    const requestList = requests?.data || [];

    return (
        <>
            <Head title="Document Requests Queue - Barangay Admin" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
                {/* Header Title Section */}
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                Document Requests Queue
                            </h1>
                            <Badge
                                variant="outline"
                                className="font-mono text-xs font-semibold"
                            >
                                {requests.total} total
                            </Badge>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Manage citizen document requests, verify
                            requirements, process certificates, and mark ready
                            for counter pickup.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1.5 text-xs"
                        >
                            <Link href="/admin">
                                <Building2 className="size-3.5" />
                                Admin Console
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Metric Strip */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-muted-foreground">
                                Pending Review
                            </p>
                            <span className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                <Clock className="size-4" />
                            </span>
                        </div>
                        <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                            {statusCounts.pending}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-muted-foreground">
                                Processing
                            </p>
                            <span className="flex size-7 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
                                <PlayCircle className="size-4" />
                            </span>
                        </div>
                        <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                            {statusCounts.processing}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-muted-foreground">
                                Ready for Pickup
                            </p>
                            <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <Building2 className="size-4" />
                            </span>
                        </div>
                        <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                            {statusCounts.ready_for_pickup}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-muted-foreground">
                                Completed
                            </p>
                            <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <FileCheck className="size-4" />
                            </span>
                        </div>
                        <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                            {statusCounts.completed}
                        </p>
                    </div>
                </div>

                {/* Filters Toolbar */}
                <DocumentRequestFilters
                    filters={filters}
                    statusCounts={statusCounts}
                    documentTypes={documentTypes}
                />

                {/* Queue Data Table Card */}
                <Card className="overflow-hidden rounded-2xl border-border/70 shadow-sm">
                    <CardHeader className="border-b border-border/50 bg-muted/20 px-4 py-3.5 sm:px-6">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-semibold text-foreground">
                                Active Queue Records
                            </CardTitle>
                            {requests.from && requests.to && (
                                <CardDescription className="text-xs">
                                    Showing {requests.from}–{requests.to} of{' '}
                                    {requests.total}
                                </CardDescription>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {requestList.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-border/60 bg-muted/10 text-muted-foreground">
                                            <th className="px-4 py-3 font-semibold">
                                                Reference
                                            </th>
                                            <th className="px-4 py-3 font-semibold">
                                                Resident
                                            </th>
                                            <th className="px-4 py-3 font-semibold">
                                                Document Type
                                            </th>
                                            <th className="px-4 py-3 font-semibold">
                                                Submitted
                                            </th>
                                            <th className="px-4 py-3 font-semibold">
                                                Fee & Payment
                                            </th>
                                            <th className="px-4 py-3 font-semibold">
                                                Status
                                            </th>
                                            <th className="px-4 py-3 text-right font-semibold">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40">
                                        {requestList.map((req) => (
                                            <tr
                                                key={req.id}
                                                className="cursor-pointer transition-colors hover:bg-muted/30"
                                                onClick={() =>
                                                    handleOpenDrawer(req)
                                                }
                                            >
                                                {/* Reference Code */}
                                                <td className="px-4 py-3.5 font-mono font-bold text-primary">
                                                    <span className="hover:underline">
                                                        {req.reference_code}
                                                    </span>
                                                </td>

                                                {/* Resident */}
                                                <td className="px-4 py-3.5">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                                            {req.user.name.charAt(
                                                                0,
                                                            )}
                                                        </div>
                                                        <div className="max-w-[160px] min-w-0">
                                                            <p className="truncate font-semibold text-foreground">
                                                                {req.user.name}
                                                            </p>
                                                            <p className="truncate text-[11px] text-muted-foreground">
                                                                {req.user.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Document Type */}
                                                <td className="px-4 py-3.5">
                                                    <span className="font-medium text-foreground">
                                                        {req.document_type.name}
                                                    </span>
                                                </td>

                                                {/* Submitted Date */}
                                                <td className="px-4 py-3.5 whitespace-nowrap text-muted-foreground">
                                                    {req.submitted_at_formatted}
                                                </td>

                                                {/* Fee & Payment */}
                                                <td className="px-4 py-3.5 whitespace-nowrap">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-medium text-foreground">
                                                            {req.formatted_fee}
                                                        </span>
                                                        <Badge
                                                            variant="outline"
                                                            className={`px-1.5 py-0 text-[10px] capitalize ${
                                                                req.payment_status ===
                                                                'paid'
                                                                    ? 'border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                                                                    : req.payment_status ===
                                                                        'waived'
                                                                      ? 'border-sky-500/30 text-sky-700 dark:text-sky-400'
                                                                      : 'border-amber-500/30 text-amber-700 dark:text-amber-400'
                                                            }`}
                                                        >
                                                            {req.payment_label}
                                                        </Badge>
                                                    </div>
                                                </td>

                                                {/* Current Status Badge */}
                                                <td className="px-4 py-3.5 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                            req.status_color ===
                                                            'success'
                                                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                                                : req.status_color ===
                                                                    'danger'
                                                                  ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400'
                                                                  : req.status_color ===
                                                                      'info'
                                                                    ? 'bg-sky-500/10 text-sky-700 dark:text-sky-400'
                                                                    : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                                                        }`}
                                                    >
                                                        {req.status_label}
                                                    </span>
                                                </td>

                                                {/* Row Actions */}
                                                <td
                                                    className="px-4 py-3.5 text-right whitespace-nowrap"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        {/* Primary Quick Button */}
                                                        {req.current_status ===
                                                            'pending' && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() =>
                                                                    handleTriggerAction(
                                                                        'start_processing',
                                                                        req,
                                                                    )
                                                                }
                                                                className="h-7 gap-1 border-sky-500/40 text-xs text-sky-700 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-950/30"
                                                            >
                                                                <PlayCircle className="size-3" />
                                                                Start
                                                            </Button>
                                                        )}

                                                        {req.current_status ===
                                                            'processing' && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() =>
                                                                    handleTriggerAction(
                                                                        'ready_for_pickup',
                                                                        req,
                                                                    )
                                                                }
                                                                className="h-7 gap-1 border-emerald-500/40 text-xs text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                                                            >
                                                                <Building2 className="size-3" />
                                                                Ready
                                                            </Button>
                                                        )}

                                                        {req.current_status ===
                                                            'ready_for_pickup' && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() =>
                                                                    handleTriggerAction(
                                                                        'mark_completed',
                                                                        req,
                                                                    )
                                                                }
                                                                className="h-7 gap-1 border-emerald-500/40 text-xs text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                                                            >
                                                                <CheckCircle2 className="size-3" />
                                                                Claimed
                                                            </Button>
                                                        )}

                                                        {/* More Menu */}
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-7 w-7 p-0"
                                                                >
                                                                    <MoreHorizontal className="size-3.5 text-muted-foreground" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent
                                                                align="end"
                                                                className="w-48 text-xs"
                                                            >
                                                                <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground">
                                                                    Queue
                                                                    Actions
                                                                </DropdownMenuLabel>
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        handleOpenDrawer(
                                                                            req,
                                                                        )
                                                                    }
                                                                >
                                                                    <Eye className="mr-2 size-3.5" />
                                                                    Quick Review
                                                                    Drawer
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    asChild
                                                                >
                                                                    <Link
                                                                        href={`/admin/document-requests/${req.id}`}
                                                                    >
                                                                        <ExternalLink className="mr-2 size-3.5" />
                                                                        Full
                                                                        Detail
                                                                        Page
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />

                                                                {/* Status Action Items */}
                                                                {req.current_status ===
                                                                    'pending' && (
                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            handleTriggerAction(
                                                                                'start_processing',
                                                                                req,
                                                                            )
                                                                        }
                                                                    >
                                                                        <PlayCircle className="mr-2 size-3.5 text-sky-500" />
                                                                        Start
                                                                        Processing
                                                                    </DropdownMenuItem>
                                                                )}

                                                                {req.current_status ===
                                                                    'processing' && (
                                                                    <>
                                                                        <DropdownMenuItem
                                                                            onClick={() =>
                                                                                handleTriggerAction(
                                                                                    'ready_for_pickup',
                                                                                    req,
                                                                                )
                                                                            }
                                                                        >
                                                                            <Building2 className="mr-2 size-3.5 text-emerald-500" />
                                                                            Mark
                                                                            Ready
                                                                            for
                                                                            Pickup
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            onClick={() =>
                                                                                handleTriggerAction(
                                                                                    'put_on_hold',
                                                                                    req,
                                                                                )
                                                                            }
                                                                        >
                                                                            <PauseCircle className="mr-2 size-3.5 text-amber-500" />
                                                                            Put
                                                                            On
                                                                            Hold
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            onClick={() =>
                                                                                handleTriggerAction(
                                                                                    'return_correction',
                                                                                    req,
                                                                                )
                                                                            }
                                                                        >
                                                                            <Undo2 className="mr-2 size-3.5 text-amber-500" />
                                                                            Return
                                                                            for
                                                                            Correction
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            onClick={() =>
                                                                                handleTriggerAction(
                                                                                    'reject',
                                                                                    req,
                                                                                )
                                                                            }
                                                                        >
                                                                            <XCircle className="mr-2 size-3.5 text-rose-500" />
                                                                            Reject
                                                                            Request
                                                                        </DropdownMenuItem>
                                                                    </>
                                                                )}

                                                                {req.current_status ===
                                                                    'on_hold' && (
                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            handleTriggerAction(
                                                                                'resume_processing',
                                                                                req,
                                                                            )
                                                                        }
                                                                    >
                                                                        <PlayCircle className="mr-2 size-3.5 text-sky-500" />
                                                                        Resume
                                                                        Processing
                                                                    </DropdownMenuItem>
                                                                )}

                                                                {req.current_status ===
                                                                    'ready_for_pickup' && (
                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            handleTriggerAction(
                                                                                'mark_completed',
                                                                                req,
                                                                            )
                                                                        }
                                                                    >
                                                                        <CheckCircle2 className="mr-2 size-3.5 text-emerald-500" />
                                                                        Mark as
                                                                        Claimed
                                                                    </DropdownMenuItem>
                                                                )}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <FileText className="mx-auto size-10 text-muted-foreground/40" />
                                <h3 className="mt-3 text-sm font-semibold text-foreground">
                                    No document requests found
                                </h3>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Try adjusting your search criteria or
                                    changing the status filter tab.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
                {requests.links && requests.links.length > 3 && (
                    <div className="flex items-center justify-between pt-2">
                        <p className="text-xs text-muted-foreground">
                            Page{' '}
                            {requests.from
                                ? Math.ceil((requests.from || 1) / 15)
                                : 1}
                        </p>
                        <div className="flex items-center gap-1">
                            {requests.links.map((link, i) => (
                                <Button
                                    key={i}
                                    asChild={!!link.url}
                                    disabled={!link.url}
                                    variant={
                                        link.active ? 'default' : 'outline'
                                    }
                                    size="sm"
                                    className="h-8 text-xs"
                                >
                                    {link.url ? (
                                        <Link
                                            href={link.url}
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

            {/* Slide-over Inspection Drawer */}
            <DocumentRequestDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                request={selectedRequest}
                onTriggerAction={handleTriggerAction}
            />

            {/* Status Transition Modal */}
            <StatusTransitionModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                requestId={modalRequestId}
                referenceCode={modalRefCode}
                actionType={modalAction}
                onSuccess={() => {
                    if (
                        selectedRequest &&
                        selectedRequest.id === modalRequestId
                    ) {
                        setIsDrawerOpen(false);
                    }
                }}
            />
        </>
    );
}

AdminDocumentIndex.layout = {
    breadcrumbs,
};
