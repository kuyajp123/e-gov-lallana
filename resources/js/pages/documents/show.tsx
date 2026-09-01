import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    ExternalLink,
    FileText,
    RotateCcw,
    XCircle,
} from 'lucide-react';
import { CancelRequestDialog } from '@/features/documents/components/cancel-request-dialog';
import { RequestSummaryCard } from '@/features/documents/components/request-summary-card';
import { StatusBadge } from '@/features/documents/components/status-badge';
import type { TimelineEntry } from '@/features/documents/components/status-timeline';
import { StatusTimeline } from '@/features/documents/components/status-timeline';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/shared/components/ui/alert';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card';

interface AttachedFile {
    id: number;
    file_type: string;
    purpose?: string | null;
    file_name: string;
    size_bytes?: number | null;
    url: string;
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
    can_be_cancelled: boolean;
    can_be_edited: boolean;
    document_type: {
        id: number;
        name: string;
        slug: string;
        description?: string | null;
        requirements?: string[];
        form_schema?: any[];
    };
    files: AttachedFile[];
    status_timeline: TimelineEntry[];
}

interface DocumentShowProps {
    documentRequest: DocumentRequestDetails;
    cancellationReasons: Array<{ value: string; label: string }>;
}

export default function DocumentShow({
    documentRequest,
    cancellationReasons = [],
}: DocumentShowProps) {
    const isReadyForPickup =
        documentRequest.current_status === 'ready_for_pickup';
    const isReturned = documentRequest.current_status === 'returned';
    const isRejected = documentRequest.current_status === 'rejected';

    return (
        <>
            <Head title={`Request ${documentRequest.reference_code}`} />

            <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 p-4 md:p-8">
                {/* Top Navigation & Action Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                        <Button
                            asChild
                            variant="outline"
                            size="icon"
                            className="size-9 rounded-xl"
                        >
                            <Link href="/documents">
                                <ArrowLeft className="size-4" />
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold tracking-tight text-foreground">
                                    Request {documentRequest.reference_code}
                                </h1>
                                <StatusBadge
                                    status={documentRequest.current_status}
                                    label={documentRequest.status_label}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {documentRequest.document_type.name} • Submitted{' '}
                                {documentRequest.submitted_at
                                    ? new Date(
                                          documentRequest.submitted_at,
                                      ).toLocaleDateString()
                                    : '—'}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons: Cancel, Edit */}
                    <div className="flex items-center gap-2">
                        {documentRequest.can_be_edited && (
                            <Button
                                asChild
                                size="sm"
                                className="gap-1.5 bg-amber-600 hover:bg-amber-700"
                            >
                                <Link
                                    href={`/documents/${documentRequest.id}/edit`}
                                >
                                    <RotateCcw className="size-3.5" />
                                    <span>Correct & Resubmit</span>
                                </Link>
                            </Button>
                        )}

                        {documentRequest.can_be_cancelled && (
                            <CancelRequestDialog
                                requestId={documentRequest.id}
                                referenceCode={documentRequest.reference_code}
                                reasons={cancellationReasons}
                            />
                        )}
                    </div>
                </div>

                {/* Ready For Pickup Notification Banner */}
                {isReadyForPickup && (
                    <Alert className="rounded-2xl border-emerald-500/50 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100">
                        <Building2 className="size-5 text-emerald-600 dark:text-emerald-400" />
                        <div>
                            <AlertTitle className="font-bold">
                                Ready for Physical Pickup!
                            </AlertTitle>
                            <AlertDescription className="mt-1 text-xs text-emerald-900/90 dark:text-emerald-200">
                                Your{' '}
                                <strong>
                                    {documentRequest.document_type.name}
                                </strong>{' '}
                                has been officially prepared, signed, and is
                                ready for pickup at the Barangay Lallana Hall
                                during regular office hours (Monday – Friday,
                                8:00 AM – 5:00 PM). Please present your
                                reference code and settle the fee (
                                {documentRequest.formatted_fee}) upon claiming.
                            </AlertDescription>
                        </div>
                    </Alert>
                )}

                {/* Returned for Correction Alert */}
                {isReturned && (
                    <Alert
                        variant="destructive"
                        className="rounded-2xl border-amber-500/50 bg-amber-500/10 text-amber-950 dark:text-amber-100"
                    >
                        <RotateCcw className="size-5 text-amber-600 dark:text-amber-400" />
                        <div className="flex w-full flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            <div>
                                <AlertTitle className="font-bold">
                                    Action Required: Returned for Correction
                                </AlertTitle>
                                <AlertDescription className="mt-1 text-xs text-amber-900/90 dark:text-amber-200">
                                    The Barangay Administrator reviewed your
                                    request and requested changes before it can
                                    be processed. Click below to review remarks
                                    and resubmit.
                                </AlertDescription>
                            </div>
                            <Button
                                asChild
                                size="sm"
                                className="shrink-0 bg-amber-600 text-white hover:bg-amber-700"
                            >
                                <Link
                                    href={`/documents/${documentRequest.id}/edit`}
                                >
                                    Edit & Resubmit →
                                </Link>
                            </Button>
                        </div>
                    </Alert>
                )}

                {/* Rejection Alert */}
                {isRejected && (
                    <Alert variant="destructive" className="rounded-2xl">
                        <XCircle className="size-5" />
                        <div>
                            <AlertTitle className="font-bold">
                                Request Rejected
                            </AlertTitle>
                            <AlertDescription className="mt-1 text-xs">
                                This document request was officially rejected by
                                the Barangay Administration. See the timeline
                                below for detailed remarks.
                            </AlertDescription>
                        </div>
                    </Alert>
                )}

                {/* Request Overview Summary Card */}
                <RequestSummaryCard
                    referenceCode={documentRequest.reference_code}
                    documentName={documentRequest.document_type.name}
                    currentStatus={documentRequest.current_status}
                    statusLabel={documentRequest.status_label}
                    feeFormatted={documentRequest.formatted_fee}
                    paymentStatus={documentRequest.payment_status}
                    paymentLabel={documentRequest.payment_label}
                    purpose={documentRequest.purpose}
                    submittedAt={documentRequest.submitted_at}
                    submittedAtFormatted={
                        documentRequest.submitted_at_formatted
                    }
                />

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left 2 Columns: Dynamic Form Data & Uploaded Files */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Dynamic Submitted Form Data */}
                        {documentRequest.submitted_data &&
                            Object.keys(documentRequest.submitted_data).length >
                                0 && (
                                <Card className="rounded-2xl border-border">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base font-bold">
                                            Submitted Form Details
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            Information supplied specifically
                                            for this document type.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="grid gap-3 rounded-xl bg-muted/40 p-4 sm:grid-cols-2">
                                            {Object.entries(
                                                documentRequest.submitted_data,
                                            ).map(([key, val]) => (
                                                <div key={key}>
                                                    <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                                                        {key.replace(/_/g, ' ')}
                                                    </span>
                                                    <p className="mt-0.5 text-xs font-semibold text-foreground">
                                                        {typeof val === 'object'
                                                            ? JSON.stringify(
                                                                  val,
                                                              )
                                                            : String(val)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                        {/* Uploaded Documents & ID */}
                        <Card className="rounded-2xl border-border">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-bold">
                                    Attached Documents (
                                    {documentRequest.files.length})
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Identification and supporting files attached
                                    to this request.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                                {documentRequest.files.length > 0 ? (
                                    <div className="space-y-2.5">
                                        {documentRequest.files.map((file) => (
                                            <div
                                                key={file.id}
                                                className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 p-3"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                        <FileText className="size-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-foreground">
                                                            {file.file_name}
                                                        </p>
                                                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                                            <Badge
                                                                variant="outline"
                                                                className="text-[9px] capitalize"
                                                            >
                                                                {file.file_type.replace(
                                                                    '_',
                                                                    ' ',
                                                                )}
                                                            </Badge>
                                                            {file.purpose && (
                                                                <span>
                                                                    •{' '}
                                                                    {
                                                                        file.purpose
                                                                    }
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 gap-1.5 text-xs"
                                                >
                                                    <a
                                                        href={file.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <ExternalLink className="size-3.5" />
                                                        <span>View</span>
                                                    </a>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-muted-foreground">
                                        No files attached.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Status Timeline & Audit Trail */}
                    <div>
                        <Card className="rounded-2xl border-border">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-bold">
                                    Status Timeline
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Chronological activity and staff remarks.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <StatusTimeline
                                    entries={documentRequest.status_timeline}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
