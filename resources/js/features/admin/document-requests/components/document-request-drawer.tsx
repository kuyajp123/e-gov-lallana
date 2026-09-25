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
import { Label } from '@/shared/components/ui/label';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
} from '@/shared/components/ui/sheet';
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

interface DocumentRequestDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    request: AdminDocumentRequestItem | null;
    onTriggerAction: (
        type: TransitionActionType,
        request: AdminDocumentRequestItem,
    ) => void;
}

export function DocumentRequestDrawer({
    isOpen,
    onClose,
    request,
    onTriggerAction,
}: DocumentRequestDrawerProps) {
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
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="flex w-full flex-col overflow-y-auto p-0 sm:max-w-xl">
                {/* Header */}
                <div className="border-b border-border/70 bg-muted/20 p-6">
                    <div className="flex items-center justify-between gap-2">
                        <Badge
                            variant="outline"
                            className="px-2.5 py-1 font-mono text-xs"
                        >
                            {request.reference_code}
                        </Badge>
                        <div className="flex items-center gap-2">
                            <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                    request.status_color === 'success'
                                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                        : request.status_color === 'danger'
                                          ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400'
                                          : request.status_color === 'info'
                                            ? 'bg-sky-500/10 text-sky-700 dark:text-sky-400'
                                            : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                                }`}
                            >
                                {request.status_label}
                            </span>
                        </div>
                    </div>
                    <SheetTitle className="mt-3 text-xl font-bold tracking-tight text-foreground">
                        {request.document_type.name}
                    </SheetTitle>
                    <SheetDescription className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="size-3.5" />
                        Submitted on {request.submitted_at_formatted}
                    </SheetDescription>
                </div>

                {/* Body Content */}
                <div className="flex-1 space-y-6 p-6">
                    {/* Action Bar based on status */}
                    <div className="space-y-3 rounded-xl border border-border/60 bg-card p-4 shadow-sm">
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
                                    className="gap-1.5 bg-sky-600 text-xs text-white hover:bg-sky-700"
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
                                        className="gap-1.5 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
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
                                        className="gap-1.5 text-xs"
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
                                        className="gap-1.5 border-amber-500/40 text-xs text-amber-700 dark:text-amber-400"
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
                                        className="gap-1.5 border-rose-500/40 text-xs text-rose-700 dark:text-rose-400"
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
                                    className="gap-1.5 bg-sky-600 text-xs text-white hover:bg-sky-700"
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
                                    className="gap-1.5 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
                                >
                                    <CheckCircle2 className="size-3.5" />
                                    Mark as Claimed / Completed
                                </Button>
                            )}

                            <Button
                                asChild
                                size="sm"
                                variant="ghost"
                                className="ml-auto gap-1 text-xs"
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
                    <div className="space-y-3 rounded-xl border border-border/60 bg-card p-4 shadow-sm">
                        <h4 className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            <User className="size-3.5" />
                            Applicant Information
                        </h4>
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
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
                        <div className="space-y-1 rounded-xl border border-border/60 bg-card p-4 shadow-sm">
                            <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                Stated Purpose
                            </p>
                            <p className="text-xs font-medium text-foreground">
                                {request.purpose || 'None provided'}
                            </p>
                        </div>
                        <div className="space-y-2 rounded-xl border border-border/60 bg-card p-4 shadow-sm">
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
                                    className="h-6 px-2 text-[10px]"
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
                                    className="h-6 px-2 text-[10px]"
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
                                    className="h-6 px-2 text-[10px]"
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
                        className="space-y-3 rounded-xl border border-border/60 bg-card p-4 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <Label
                                htmlFor="drawer-admin-notes"
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
                            id="drawer-admin-notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add private staff notes, verification results, or remarks..."
                            rows={3}
                            className="resize-none text-xs"
                        />
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                size="sm"
                                variant="outline"
                                disabled={isSavingNotes}
                                className="h-7 gap-1 text-xs"
                            >
                                <Save className="size-3" />
                                {isSavingNotes ? 'Saving...' : 'Save Notes'}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Footer link to full details */}
                <div className="flex items-center justify-between border-t border-border/70 bg-muted/10 p-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="text-xs"
                    >
                        Close Drawer
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
                                className="gap-1.5 border-emerald-500/40 text-xs text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400"
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
                        <Button asChild size="sm" className="gap-1.5 text-xs">
                            <Link
                                href={`/admin/document-requests/${request.id}`}
                            >
                                <Eye className="size-3.5" />
                                Open Full Details
                            </Link>
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
