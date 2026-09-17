import { router } from '@inertiajs/react';
import {
    AlertCircle,
    CheckCircle2,
    PauseCircle,
    PlayCircle,
    Undo2,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';

export type TransitionActionType =
    | 'start_processing'
    | 'ready_for_pickup'
    | 'mark_completed'
    | 'put_on_hold'
    | 'resume_processing'
    | 'return_correction'
    | 'reject';

interface StatusTransitionModalProps {
    isOpen: boolean;
    onClose: () => void;
    requestId: number | null;
    referenceCode: string;
    actionType: TransitionActionType | null;
    onSuccess?: () => void;
}

const ACTION_CONFIGS: Record<
    TransitionActionType,
    {
        title: string;
        description: string;
        targetStatus: string;
        icon: typeof CheckCircle2;
        iconColor: string;
        confirmLabel: string;
        confirmVariant: 'default' | 'destructive' | 'outline';
        requiresRemarks: boolean;
        remarksLabel?: string;
        remarksPlaceholder?: string;
    }
> = {
    start_processing: {
        title: 'Start Processing Request',
        description:
            'Mark this request as being processed by barangay staff. The resident will see that work on their document has begun.',
        targetStatus: 'processing',
        icon: PlayCircle,
        iconColor: 'text-sky-500',
        confirmLabel: 'Start Processing',
        confirmVariant: 'default',
        requiresRemarks: false,
    },
    resume_processing: {
        title: 'Resume Processing',
        description:
            'Remove this request from hold and resume normal processing.',
        targetStatus: 'processing',
        icon: PlayCircle,
        iconColor: 'text-sky-500',
        confirmLabel: 'Resume Processing',
        confirmVariant: 'default',
        requiresRemarks: false,
    },
    ready_for_pickup: {
        title: 'Mark Ready for Pickup',
        description:
            'Confirm that this document is printed, signed, and ready for claiming at the Barangay Hall counter. An automated notification will be sent to the resident.',
        targetStatus: 'ready_for_pickup',
        icon: CheckCircle2,
        iconColor: 'text-emerald-500',
        confirmLabel: 'Confirm Ready for Pickup',
        confirmVariant: 'default',
        requiresRemarks: false,
    },
    mark_completed: {
        title: 'Mark as Completed',
        description:
            'Confirm that this document request has been fully processed, printed, and signed.',
        targetStatus: 'completed',
        icon: CheckCircle2,
        iconColor: 'text-emerald-500',
        confirmLabel: 'Mark Completed',
        confirmVariant: 'default',
        requiresRemarks: false,
    },
    put_on_hold: {
        title: 'Put Request On Hold',
        description:
            'Temporarily pause processing. Please state the operational reason so staff are aligned.',
        targetStatus: 'on_hold',
        icon: PauseCircle,
        iconColor: 'text-amber-500',
        confirmLabel: 'Place On Hold',
        confirmVariant: 'outline',
        requiresRemarks: true,
        remarksLabel: 'Reason for Holding',
        remarksPlaceholder:
            'e.g. Awaiting Barangay Captain signature, waiting for clearance validation...',
    },
    return_correction: {
        title: 'Return for Correction',
        description:
            'Return this request to the resident so they can modify details or re-upload clearer supporting documents.',
        targetStatus: 'returned',
        icon: Undo2,
        iconColor: 'text-amber-500',
        confirmLabel: 'Return to Resident',
        confirmVariant: 'outline',
        requiresRemarks: true,
        remarksLabel: 'Correction Instructions for Resident',
        remarksPlaceholder:
            'Specify clearly what the resident needs to correct or re-upload...',
    },
    reject: {
        title: 'Reject Document Request',
        description:
            'Reject this request. This is a final action and will notify the resident with the official reason provided below.',
        targetStatus: 'rejected',
        icon: XCircle,
        iconColor: 'text-rose-500',
        confirmLabel: 'Reject Request',
        confirmVariant: 'destructive',
        requiresRemarks: true,
        remarksLabel: 'Official Reason for Rejection',
        remarksPlaceholder:
            'State the official reason why this document request cannot be granted...',
    },
};

export function StatusTransitionModal({
    isOpen,
    onClose,
    requestId,
    referenceCode,
    actionType,
    onSuccess,
}: StatusTransitionModalProps) {
    const [remarks, setRemarks] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!actionType || !requestId) {
        return null;
    }

    const config = ACTION_CONFIGS[actionType];
    const Icon = config.icon;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (config.requiresRemarks && !remarks.trim()) {
            setError(
                config.remarksLabel
                    ? `${config.remarksLabel} is required.`
                    : 'Please provide remarks.',
            );

            return;
        }

        setError(null);
        setIsSubmitting(true);

        router.patch(
            `/admin/document-requests/${requestId}/status`,
            {
                status: config.targetStatus,
                remarks: remarks.trim() || undefined,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitting(false);
                    setRemarks('');
                    onClose();
                    onSuccess?.();
                },
                onError: (errs) => {
                    setIsSubmitting(false);

                    if (errs.remarks) {
                        setError(errs.remarks);
                    } else if (errs.status) {
                        setError(errs.status);
                    } else {
                        setError('Failed to update status. Please try again.');
                    }
                },
            },
        );
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setRemarks('');
            setError(null);
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
                                <Icon
                                    className={`size-5 ${config.iconColor}`}
                                />
                            </div>
                            <div>
                                <DialogTitle className="text-base font-semibold text-foreground">
                                    {config.title}
                                </DialogTitle>
                                <p className="text-xs text-muted-foreground">
                                    Ref:{' '}
                                    <span className="font-mono font-medium text-foreground">
                                        {referenceCode}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <DialogDescription className="pt-2 text-xs leading-relaxed text-muted-foreground">
                            {config.description}
                        </DialogDescription>
                    </DialogHeader>

                    {config.requiresRemarks && (
                        <div className="space-y-2 pt-1">
                            <Label
                                htmlFor="transition-remarks"
                                className="text-xs font-semibold text-foreground"
                            >
                                {config.remarksLabel}{' '}
                                <span className="text-rose-500">*</span>
                            </Label>
                            <Textarea
                                id="transition-remarks"
                                value={remarks}
                                onChange={(e) => {
                                    setRemarks(e.target.value);

                                    if (error) {
                                        setError(null);
                                    }
                                }}
                                placeholder={config.remarksPlaceholder}
                                rows={4}
                                className="resize-none text-xs"
                                required
                            />
                            {error && (
                                <p className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400">
                                    <AlertCircle className="size-3.5" />
                                    {error}
                                </p>
                            )}
                        </div>
                    )}

                    <DialogFooter className="gap-2 pt-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="text-xs"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant={config.confirmVariant}
                            size="sm"
                            disabled={isSubmitting}
                            className="gap-1.5 text-xs"
                        >
                            {isSubmitting ? 'Saving...' : config.confirmLabel}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
