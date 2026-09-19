import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    CheckCircle2,
    Clock,
    CreditCard,
    ExternalLink,
    FileText,
    Image,
    PauseCircle,
    PlayCircle,
    Printer,
    Save,
    Undo2,
    User,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { StatusTransitionModal } from '@/features/admin/document-requests/components/status-transition-modal';
import type { TransitionActionType } from '@/features/admin/document-requests/components/status-transition-modal';
import { Button } from '@/shared/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';

interface AttachedFile {
    id: number;
    file_name: string;
    mime_type: string;
    size_bytes?: number | null;
    file_type: string;
    purpose?: string | null;
    url: string;
}

interface TimelineEntry {
    id: number;
    status: string;
    label: string;
    color: string;
    remarks?: string | null;
    changed_by: string;
    created_at: string;
    created_at_formatted: string;
    created_at_human: string;
}

interface DocumentRequestDetails {
    id: number;
    reference_code: string;
    current_status: string;
    status_label: string;
    status_color: string;
    fee_cents: number;
    formatted_fee: string;
    payment_status: string;
    payment_label: string;
    payment_color: string;
    purpose?: string | null;
    admin_notes?: string | null;
    cancellation_reason?: string | null;
    cancellation_reason_label?: string | null;
    cancellation_notes?: string | null;
    submitted_data: Record<string, any>;
    submitted_at?: string | null;
    submitted_at_formatted?: string | null;
    completed_at?: string | null;
    cancelled_at?: string | null;
    user: {
        id: number;
        name: string;
        email: string;
        phone_number?: string | null;
        avatar_url?: string | null;
        civil_status?: string | null;
        address: string;
    };
    document_type: {
        id: number;
        name: string;
        slug: string;
        description?: string | null;
        requirements?: string[];
    };
    files: AttachedFile[];
    timeline: TimelineEntry[];
}

interface AdminDocumentShowProps {
    documentRequest: DocumentRequestDetails;
}

export default function AdminDocumentShow({
    documentRequest,
}: AdminDocumentShowProps) {
    const [notes, setNotes] = useState(documentRequest.admin_notes || '');
    const [isSavingNotes, setIsSavingNotes] = useState(false);
    const [notesSaved, setNotesSaved] = useState(false);

    // Modal state for actions
    const [modalAction, setModalAction] = useState<TransitionActionType | null>(
        null,
    );
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleTriggerAction = (type: TransitionActionType) => {
        setModalAction(type);
        setIsModalOpen(true);
    };

    const handleSaveNotes = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingNotes(true);
        setNotesSaved(false);

        router.patch(
            `/admin/document-requests/${documentRequest.id}/notes`,
            { admin_notes: notes },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSavingNotes(false);
                    setNotesSaved(true);
                    setTimeout(() => setNotesSaved(false), 3000);
                },
                onError: () => setIsSavingNotes(false),
            },
        );
    };

    const handleUpdatePayment = (newPaymentStatus: string) => {
        router.patch(
            `/admin/document-requests/${documentRequest.id}/payment`,
            { payment_status: newPaymentStatus },
            { preserveScroll: true },
        );
    };

    const isPending = documentRequest.current_status === 'pending';
    const isProcessing = documentRequest.current_status === 'processing';
    const isOnHold = documentRequest.current_status === 'on_hold';
    const isReadyForPickup =
        documentRequest.current_status === 'ready_for_pickup';

    return (
        <>
            <Head
                title={`Request ${documentRequest.reference_code} - Document Queue`}
            />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
                {/* Top Action Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                        <Button
                            asChild
                            variant="outline"
                            size="icon"
                            className="size-9 rounded-xl border-border/70"
                        >
                            <Link href="/admin/document-requests">
                                <ArrowLeft className="size-4" />
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-sm font-bold text-primary">
                                    {documentRequest.reference_code}
                                </span>
                                <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                        documentRequest.status_color ===
                                        'success'
                                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                            : documentRequest.status_color ===
                                                'danger'
                                              ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400'
                                              : documentRequest.status_color ===
                                                  'info'
                                                ? 'bg-sky-500/10 text-sky-700 dark:text-sky-400'
                                                : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                                    }`}
                                >
                                    {documentRequest.status_label}
                                </span>
                            </div>
                            <h1 className="mt-0.5 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                                {documentRequest.document_type.name}
                            </h1>
                        </div>
                    </div>

                    {/* Action Buttons Bar */}
                    <div className="flex flex-wrap items-center gap-2">
                        {isPending && (
                            <Button
                                size="sm"
                                onClick={() =>
                                    handleTriggerAction('start_processing')
                                }
                                className="gap-1.5 bg-sky-600 text-xs text-white hover:bg-sky-700"
                            >
                                <PlayCircle className="size-3.5" />
                                Start Processing
                            </Button>
                        )}

                        {isProcessing && (
                            <>
                                <Button
                                    size="sm"
                                    onClick={() =>
                                        handleTriggerAction('ready_for_pickup')
                                    }
                                    className="gap-1.5 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
                                >
                                    <Building2 className="size-3.5" />
                                    Ready for Pickup
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                        handleTriggerAction('put_on_hold')
                                    }
                                    className="gap-1.5 text-xs"
                                >
                                    <PauseCircle className="size-3.5" />
                                    On Hold
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                        handleTriggerAction('return_correction')
                                    }
                                    className="gap-1.5 border-amber-500/40 text-xs text-amber-700 dark:text-amber-400"
                                >
                                    <Undo2 className="size-3.5" />
                                    Return
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                        handleTriggerAction('reject')
                                    }
                                    className="gap-1.5 border-rose-500/40 text-xs text-rose-700 dark:text-rose-400"
                                >
                                    <XCircle className="size-3.5" />
                                    Reject
                                </Button>
                            </>
                        )}

                        {isOnHold && (
                            <Button
                                size="sm"
                                onClick={() =>
                                    handleTriggerAction('resume_processing')
                                }
                                className="gap-1.5 bg-sky-600 text-xs text-white hover:bg-sky-700"
                            >
                                <PlayCircle className="size-3.5" />
                                Resume Processing
                            </Button>
                        )}

                        {isReadyForPickup && (
                            <Button
                                size="sm"
                                onClick={() =>
                                    handleTriggerAction('mark_completed')
                                }
                                className="gap-1.5 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
                            >
                                <CheckCircle2 className="size-3.5" />
                                Mark as Claimed
                            </Button>
                        )}

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.print()}
                            className="gap-1.5 text-xs"
                        >
                            <Printer className="size-3.5" />
                            Print Summary
                        </Button>
                    </div>
                </div>

                {/* Main Content Bento Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Left Column: Details, Dynamic Answers, Attachments, Notes (8 cols) */}
                    <div className="space-y-6 lg:col-span-8">
                        {/* Overview Card */}
                        <Card className="rounded-2xl border-border/70 shadow-sm">
                            <CardHeader className="border-b border-border/50 bg-muted/20 px-6 py-3.5">
                                <CardTitle className="text-sm font-semibold text-foreground">
                                    Request Overview & Stated Purpose
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 p-6">
                                <div>
                                    <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                        Stated Purpose
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-foreground">
                                        {documentRequest.purpose ||
                                            'No purpose stated.'}
                                    </p>
                                </div>

                                {documentRequest.cancellation_reason && (
                                    <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4">
                                        <p className="text-xs font-semibold text-rose-800 dark:text-rose-300">
                                            Cancellation Reason:{' '}
                                            {
                                                documentRequest.cancellation_reason_label
                                            }
                                        </p>
                                        {documentRequest.cancellation_notes && (
                                            <p className="mt-1 text-xs text-rose-700 dark:text-rose-400">
                                                Notes:{' '}
                                                {
                                                    documentRequest.cancellation_notes
                                                }
                                            </p>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Dynamic Form Submissions */}
                        <Card className="rounded-2xl border-border/70 shadow-sm">
                            <CardHeader className="border-b border-border/50 bg-muted/20 px-6 py-3.5">
                                <CardTitle className="text-sm font-semibold text-foreground">
                                    Dynamic Form Submissions
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Specific questions and custom form fields
                                    filled out by the resident.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                {Object.keys(
                                    documentRequest.submitted_data || {},
                                ).length > 0 ? (
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        {Object.entries(
                                            documentRequest.submitted_data,
                                        ).map(([key, val]) => (
                                            <div
                                                key={key}
                                                className="rounded-xl border border-border/60 bg-muted/20 p-3"
                                            >
                                                <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                                    {key.replace(/_/g, ' ')}
                                                </p>
                                                <p className="mt-1 text-xs font-medium break-words text-foreground">
                                                    {typeof val === 'object' &&
                                                    val !== null
                                                        ? JSON.stringify(val)
                                                        : String(val)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-muted-foreground italic">
                                        No custom dynamic form fields required
                                        for this document type.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Attached Proof of Residency & Government ID */}
                        <Card className="rounded-2xl border-border/70 shadow-sm">
                            <CardHeader className="border-b border-border/50 bg-muted/20 px-6 py-3.5">
                                <CardTitle className="text-sm font-semibold text-foreground">
                                    Uploaded Documents & Proofs (
                                    {documentRequest.files.length})
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Official identification and supporting proof
                                    documents attached to this application.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                {documentRequest.files.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        {documentRequest.files.map((file) => (
                                            <div
                                                key={file.id}
                                                className="flex items-center justify-between rounded-xl border border-border/60 bg-card p-3 shadow-sm transition-colors hover:bg-muted/20"
                                            >
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                        {file.mime_type.startsWith(
                                                            'image/',
                                                        ) ? (
                                                            <Image className="size-4" />
                                                        ) : (
                                                            <FileText className="size-4" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="truncate text-xs font-semibold text-foreground">
                                                            {file.file_name}
                                                        </p>
                                                        <p className="text-[10px] text-muted-foreground capitalize">
                                                            {file.file_type.replace(
                                                                /_/g,
                                                                ' ',
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    size="sm"
                                                    className="ml-2 h-7 shrink-0 gap-1 text-xs"
                                                >
                                                    <a
                                                        href={file.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <ExternalLink className="size-3" />
                                                        View
                                                    </a>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-muted-foreground italic">
                                        No separate files were uploaded for this
                                        request.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Internal Staff Notes */}
                        <Card className="rounded-2xl border-border/70 shadow-sm">
                            <CardHeader className="border-b border-border/50 bg-muted/20 px-6 py-3.5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-sm font-semibold text-foreground">
                                            Internal Staff Notes
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            Confidential internal notes only
                                            visible to barangay staff and
                                            administrators.
                                        </CardDescription>
                                    </div>
                                    {notesSaved && (
                                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                            Saved!
                                        </span>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <form
                                    onSubmit={handleSaveNotes}
                                    className="space-y-3"
                                >
                                    <Textarea
                                        value={notes}
                                        onChange={(e) =>
                                            setNotes(e.target.value)
                                        }
                                        placeholder="Record verification findings, notes from captain or secretary, or special instructions..."
                                        rows={4}
                                        className="text-xs"
                                    />
                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            size="sm"
                                            disabled={isSavingNotes}
                                            className="gap-1.5 text-xs"
                                        >
                                            <Save className="size-3.5" />
                                            {isSavingNotes
                                                ? 'Saving...'
                                                : 'Save Internal Notes'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Citizen Info, Fee/Payment Box, Audit Timeline (4 cols) */}
                    <div className="space-y-6 lg:col-span-4">
                        {/* Resident Card */}
                        <Card className="rounded-2xl border-border/70 shadow-sm">
                            <CardHeader className="border-b border-border/50 bg-muted/20 px-4 py-3.5">
                                <CardTitle className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-foreground uppercase">
                                    <User className="size-3.5 text-primary" />
                                    Citizen Applicant
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary">
                                        {documentRequest.user.name.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-bold text-foreground">
                                            {documentRequest.user.name}
                                        </p>
                                        <p className="truncate text-xs text-muted-foreground">
                                            {documentRequest.user.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-1.5 border-t border-border/50 pt-2 text-xs">
                                    <div className="flex items-center justify-between text-muted-foreground">
                                        <span>Phone:</span>
                                        <span className="font-medium text-foreground">
                                            {documentRequest.user
                                                .phone_number || '—'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-muted-foreground">
                                        <span>Civil Status:</span>
                                        <span className="font-medium text-foreground capitalize">
                                            {documentRequest.user
                                                .civil_status || '—'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-muted-foreground">
                                        <span>Address:</span>
                                        <span className="font-medium text-foreground">
                                            {documentRequest.user.address}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Fee & Payment Update Box */}
                        <Card className="rounded-2xl border-border/70 shadow-sm">
                            <CardHeader className="border-b border-border/50 bg-muted/20 px-4 py-3.5">
                                <CardTitle className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-foreground uppercase">
                                    <CreditCard className="size-3.5 text-primary" />
                                    Fee & Payment
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">
                                        Required Fee:
                                    </span>
                                    <span className="text-base font-bold text-foreground">
                                        {documentRequest.formatted_fee}
                                    </span>
                                </div>

                                <div className="space-y-1.5 border-t border-border/50 pt-2">
                                    <Label className="text-xs font-semibold text-muted-foreground">
                                        Update Payment Status
                                    </Label>
                                    <Select
                                        value={documentRequest.payment_status}
                                        onValueChange={handleUpdatePayment}
                                    >
                                        <SelectTrigger className="h-8 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="unpaid">
                                                Unpaid
                                            </SelectItem>
                                            <SelectItem value="paid">
                                                Paid
                                            </SelectItem>
                                            <SelectItem value="waived">
                                                Waived / Free
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Audit Timeline / Status History */}
                        <Card className="rounded-2xl border-border/70 shadow-sm">
                            <CardHeader className="border-b border-border/50 bg-muted/20 px-4 py-3.5">
                                <CardTitle className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-foreground uppercase">
                                    <Clock className="size-3.5 text-primary" />
                                    Status Transition Log
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="relative space-y-4 pl-4 before:absolute before:top-2 before:bottom-2 before:left-1.5 before:w-0.5 before:bg-border">
                                    {documentRequest.timeline.map((entry) => (
                                        <div
                                            key={entry.id}
                                            className="relative text-xs"
                                        >
                                            <div className="absolute top-1 -left-[17px] size-2 rounded-full bg-primary ring-4 ring-background" />
                                            <div>
                                                <div className="flex items-center justify-between">
                                                    <span className="font-semibold text-foreground">
                                                        {entry.label}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground">
                                                        {entry.created_at_human}
                                                    </span>
                                                </div>
                                                <p className="mt-0.5 text-[11px] text-muted-foreground">
                                                    By:{' '}
                                                    <span className="font-medium text-foreground">
                                                        {entry.changed_by}
                                                    </span>
                                                </p>
                                                {entry.remarks && (
                                                    <p className="mt-1 rounded-lg bg-muted/40 p-2 text-[11px] text-foreground">
                                                        "{entry.remarks}"
                                                    </p>
                                                )}
                                                <p className="mt-1 text-[10px] text-muted-foreground/70">
                                                    {entry.created_at_formatted}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Status Transition Modal */}
            <StatusTransitionModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setModalAction(null);
                }}
                requestId={documentRequest.id}
                referenceCode={documentRequest.reference_code}
                actionType={modalAction}
            />
        </>
    );
}

AdminDocumentShow.layout = {
    breadcrumbs: [
        { title: 'Admin Console', href: '/admin' },
        { title: 'Document Queue', href: '/admin/document-requests' },
    ],
};
