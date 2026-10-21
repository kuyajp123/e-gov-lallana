import { Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    Building2,
    Calendar,
    CheckCircle2,
    Eye,
    FileCheck,
    Mail,
    PauseCircle,
    Phone,
    PlayCircle,
    Save,
    Undo2,
    User,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import type { TransitionActionType } from './status-transition-modal';

export interface AdminDocumentRequestItem {
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
    submitted_at?: string | null;
    submitted_at_formatted: string;
    completed_at?: string | null;
    user: {
        id: number;
        name: string;
        email: string;
        phone_number?: string | null;
        avatar_url?: string | null;
    };
    document_type: {
        id: number;
        name: string;
        slug: string;
    };
}

export interface DocumentRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    request: AdminDocumentRequestItem | null;
    onTriggerAction: (
        type: TransitionActionType,
        request: AdminDocumentRequestItem,
    ) => void;
}

export type DocumentRequestDrawerProps = DocumentRequestModalProps;

export function DocumentRequestModal({
    isOpen,
    onClose,
    request,
    onTriggerAction,
}: DocumentRequestModalProps) {
    const [notes, setNotes] = useState(request?.admin_notes || '');
    const [isSavingNotes, setIsSavingNotes] = useState(false);
    const [notesSaved, setNotesSaved] = useState(false);
    const [prevRequest, setPrevRequest] = useState(request);

    if (request !== prevRequest) {
        setPrevRequest(request);
        setNotes(request?.admin_notes || '');
        setNotesSaved(false);
    }

    if (!request) {
        return null;
    }

    const handleSaveNotes = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingNotes(true);
        setNotesSaved(false);

        router.patch(
            `/admin/document-requests/${request.id}/notes`,
            { admin_notes: notes },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSavingNotes(false);
                    setNotesSaved(true);
                    setTimeout(() => setNotesSaved(false), 3000);
                },
                onError: () => {
                    setIsSavingNotes(false);
                },
            },
        );
    };

    const handleTogglePayment = (newStatus: 'unpaid' | 'paid' | 'waived') => {
        router.patch(
            `/admin/document-requests/${request.id}/payment`,
            { payment_status: newStatus },
            { preserveScroll: true },
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="flex max-h-[88vh] w-full max-w-2xl flex-col overflow-y-auto rounded-none border border-border bg-card p-0 shadow-none sm:max-w-3xl">
                {/* Header */}
                <DialogHeader className="border-b border-border bg-muted/20 p-6 pr-12 text-left">
                    <div className="flex items-center justify-between gap-2">
                        <Badge
                            variant="outline"
                            className="rounded-none border border-border px-2.5 py-1 font-mono text-xs"
                        >
                            {request.reference_code}
                        </Badge>
                        <div className="flex items-center gap-2">
                            <span
                                className={`inline-flex items-center rounded-none px-2.5 py-0.5 text-xs font-semibold ${
                                    request.status_color === 'success'
                                        ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                        : request.status_color === 'danger'
                                          ? 'border border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400'
                                          : request.status_color === 'info'
                                            ? 'border border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-400'
                                            : 'border border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400'
                                }`}
                            >
                                {request.status_label}
                            </span>
                        </div>
                    </div>
                    <DialogTitle className="mt-3 text-xl font-bold tracking-tight text-foreground">
                        {request.document_type.name}
                    </DialogTitle>
                    <DialogDescription className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="size-3.5" />
                        Submitted on {request.submitted_at_formatted}
                    </DialogDescription>
                </DialogHeader>

                {/* Body Content */}
                <div className="flex-1 space-y-6 p-6">
                    {/* Action Bar based on status */}
                    <div className="space-y-3 rounded-none border border-border bg-card p-4">
                        <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            Processing Actions
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {request.current_status === 'pending' && (
                                <Button
                                    size="sm"
                                    onClick={() =>
                                        onTriggerAction(
                                            'start_processing',
                                            request,
                                        )
                                    }
                                    className="gap-1.5 rounded-none bg-sky-600 text-xs text-white hover:bg-sky-700"
                                >
                                    <PlayCircle className="size-3.5" />
                                    Start Processing
                                </Button>
                            )}

                            {request.current_status === 'processing' && (
                                <>
                                    <Button
                                        size="sm"
                                        onClick={() =>
                                            onTriggerAction(
                                                'ready_for_pickup',
                                                request,
                                            )
                                        }
                                        className="gap-1.5 rounded-none bg-emerald-600 text-xs text-white hover:bg-emerald-700"
                                    >
                                        <Building2 className="size-3.5" />
                                        Ready for Pickup
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                            onTriggerAction(
                                                'put_on_hold',
                                                request,
                                            )
                                        }
                                        className="gap-1.5 rounded-none text-xs"
                                    >
                                        <PauseCircle className="size-3.5" />
                                        Put On Hold
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                            onTriggerAction(
                                                'return_correction',
                                                request,
                                            )
                                        }
                                        className="gap-1.5 rounded-none border-amber-500/40 text-xs text-amber-700 dark:text-amber-400"
                                    >
                                        <Undo2 className="size-3.5" />
                                        Return
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                            onTriggerAction('reject', request)
                                        }
                                        className="gap-1.5 rounded-none border-rose-500/40 text-xs text-rose-700 dark:text-rose-400"
                                    >
                                        <XCircle className="size-3.5" />
                                        Reject
                                    </Button>
                                </>
                            )}

                            {request.current_status === 'on_hold' && (
                                <Button
                                    size="sm"
                                    onClick={() =>
                                        onTriggerAction(
                                            'resume_processing',
                                            request,
                                        )
                                    }
                                    className="gap-1.5 rounded-none bg-sky-600 text-xs text-white hover:bg-sky-700"
                                >
                                    <PlayCircle className="size-3.5" />
                                    Resume Processing
                                </Button>
                            )}

                            {request.current_status === 'ready_for_pickup' && (
                                <Button
                                    size="sm"
                                    onClick={() =>
                                        onTriggerAction(
                                            'mark_completed',
                                            request,
                                        )
                                    }
                                    className="gap-1.5 rounded-none bg-emerald-600 text-xs text-white hover:bg-emerald-700"
                                >
                                    <CheckCircle2 className="size-3.5" />
                                    Mark as Claimed / Completed
                                </Button>
                            )}

                            <Button
                                asChild
                                size="sm"
                                variant="ghost"
                                className="ml-auto gap-1 rounded-none text-xs"
                            >
                                <Link
                                    href={`/admin/document-requests/${request.id}`}
                                >
                                    Full Inspection
                                    <ArrowRight className="size-3.5" />
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Applicant Card */}
                    <div className="space-y-3 rounded-none border border-border bg-card p-4">
                        <h4 className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            <User className="size-3.5" />
                            Applicant Information
                        </h4>
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-none border border-border bg-primary/10 text-sm font-bold text-primary">
                                {request.user.name.charAt(0)}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-foreground">
                                    {request.user.name}
                                </p>
                                <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Mail className="size-3" />
                                        {request.user.email}
                                    </span>
                                    {request.user.phone_number && (
                                        <span className="flex items-center gap-1">
                                            <Phone className="size-3" />
                                            {request.user.phone_number}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Purpose & Fee */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1 rounded-none border border-border bg-card p-4">
                            <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                Stated Purpose
                            </p>
                            <p className="text-xs font-medium text-foreground">
                                {request.purpose || 'None provided'}
                            </p>
                        </div>
                        <div className="space-y-2 rounded-none border border-border bg-card p-4">
                            <div className="flex items-center justify-between">
                                <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                    Fee & Payment
                                </p>
                                <span className="text-sm font-semibold text-foreground">
                                    {request.formatted_fee}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 pt-1">
                                <Button
                                    size="sm"
                                    variant={
                                        request.payment_status === 'paid'
                                            ? 'default'
                                            : 'outline'
                                    }
                                    className="h-6 rounded-none px-2 text-[10px]"
                                    onClick={() => handleTogglePayment('paid')}
                                >
                                    Paid
                                </Button>
                                <Button
                                    size="sm"
                                    variant={
                                        request.payment_status === 'unpaid'
                                            ? 'default'
                                            : 'outline'
                                    }
                                    className="h-6 rounded-none px-2 text-[10px]"
                                    onClick={() =>
                                        handleTogglePayment('unpaid')
                                    }
                                >
                                    Unpaid
                                </Button>
                                <Button
                                    size="sm"
                                    variant={
                                        request.payment_status === 'waived'
                                            ? 'default'
                                            : 'outline'
                                    }
                                    className="h-6 rounded-none px-2 text-[10px]"
                                    onClick={() =>
                                        handleTogglePayment('waived')
                                    }
                                >
                                    Waived
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Staff Internal Notes */}
                    <form
                        onSubmit={handleSaveNotes}
                        className="space-y-3 rounded-none border border-border bg-card p-4"
                    >
                        <div className="flex items-center justify-between">
                            <Label
                                htmlFor="modal-admin-notes"
                                className="text-xs font-semibold text-foreground"
                            >
                                Internal Staff Notes
                            </Label>
                            {notesSaved && (
                                <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                                    Saved!
                                </span>
                            )}
                        </div>
                        <Textarea
                            id="modal-admin-notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add private staff notes, verification results, or remarks..."
                            rows={3}
                            className="resize-none rounded-none text-xs"
                        />
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                size="sm"
                                variant="outline"
                                disabled={isSavingNotes}
                                className="h-7 gap-1 rounded-none text-xs"
                            >
                                <Save className="size-3" />
                                {isSavingNotes ? 'Saving...' : 'Save Notes'}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Footer link to full details */}
                <div className="flex items-center justify-between border-t border-border bg-muted/10 p-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="rounded-none text-xs"
                    >
                        Close
                    </Button>
                    <div className="flex items-center gap-2">
                        {[
                            'processing',
                            'ready_for_pickup',
                            'completed',
                        ].includes(request.current_status) && (
                            <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="gap-1.5 rounded-none border-emerald-500/40 text-xs text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400"
                            >
                                <a
                                    href={`/admin/document-requests/${request.id}/pdf`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <FileCheck className="size-3.5" />
                                    Certificate PDF
                                </a>
                            </Button>
                        )}
                        <Button
                            asChild
                            size="sm"
                            className="gap-1.5 rounded-none text-xs"
                        >
                            <Link
                                href={`/admin/document-requests/${request.id}`}
                            >
                                <Eye className="size-3.5" />
                                Open Full Details
                            </Link>
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export const DocumentRequestDrawer = DocumentRequestModal;
