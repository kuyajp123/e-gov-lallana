import { router } from '@inertiajs/react';
import {
    AlertCircle,
    Archive,
    CheckCircle2,
    ShieldAlert,
    ShieldCheck,
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

export type HouseholdActionType =
    'approve' | 'return' | 'reject' | 'restrict' | 'unrestrict' | 'archive';

interface HouseholdVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    householdId: number | null;
    householdCode: string;
    actionType: HouseholdActionType | null;
    onSuccess?: () => void;
}

const ACTION_CONFIGS: Record<
    HouseholdActionType,
    {
        title: string;
        description: string;
        endpoint: (id: number) => string;
        actionParam: string;
        icon: typeof CheckCircle2;
        iconColor: string;
        confirmLabel: string;
        confirmVariant: 'default' | 'destructive' | 'outline';
        requiresRemarks: boolean;
        remarksLabel?: string;
        remarksPlaceholder?: string;
    }
> = {
    approve: {
        title: 'Approve Household Registration',
        description:
            'Officially verify this household record. The family head and all associated members will be marked as officially verified barangay residents.',
        endpoint: (id) => `/admin/households/${id}/verify`,
        actionParam: 'approve',
        icon: CheckCircle2,
        iconColor: 'text-emerald-500',
        confirmLabel: 'Approve & Verify',
        confirmVariant: 'default',
        requiresRemarks: false,
    },
    return: {
        title: 'Return Household for Correction',
        description:
            'Return this registration to the applicant. Specify the missing requirements or corrections needed so they can update their application.',
        endpoint: (id) => `/admin/households/${id}/verify`,
        actionParam: 'return',
        icon: Undo2,
        iconColor: 'text-amber-500',
        confirmLabel: 'Return to Applicant',
        confirmVariant: 'outline',
        requiresRemarks: true,
        remarksLabel: 'Correction Remarks for Applicant',
        remarksPlaceholder:
            'e.g. Please upload a clearer utility bill for address proof...',
    },
    reject: {
        title: 'Reject Household Registration',
        description:
            'Reject this registration. The family head will be notified with the official reason provided below.',
        endpoint: (id) => `/admin/households/${id}/verify`,
        actionParam: 'reject',
        icon: XCircle,
        iconColor: 'text-rose-500',
        confirmLabel: 'Reject Registration',
        confirmVariant: 'destructive',
        requiresRemarks: true,
        remarksLabel: 'Official Reason for Rejection',
        remarksPlaceholder: 'State official grounds for rejection...',
    },
    restrict: {
        title: 'Place Household Under Administrative Restriction',
        description:
            'Restrict this household registration. Members of restricted households will be temporarily barred from filing document requests.',
        endpoint: (id) => `/admin/households/${id}/restrict`,
        actionParam: 'restrict',
        icon: ShieldAlert,
        iconColor: 'text-rose-500',
        confirmLabel: 'Place Under Restriction',
        confirmVariant: 'destructive',
        requiresRemarks: true,
        remarksLabel: 'Administrative Reason for Restriction',
        remarksPlaceholder: 'e.g. Boundary dispute pending lupon mediation...',
    },
    unrestrict: {
        title: 'Lift Administrative Restriction',
        description:
            'Lift restriction and restore this household to full verified status.',
        endpoint: (id) => `/admin/households/${id}/restrict`,
        actionParam: 'unrestrict',
        icon: ShieldCheck,
        iconColor: 'text-emerald-500',
        confirmLabel: 'Lift Restriction',
        confirmVariant: 'default',
        requiresRemarks: false,
    },
    archive: {
        title: 'Archive Household Record',
        description:
            'Archive this household record. Archived records are inactive and hidden from the standard active queue.',
        endpoint: (id) => `/admin/households/${id}/archive`,
        actionParam: 'archive',
        icon: Archive,
        iconColor: 'text-zinc-500',
        confirmLabel: 'Archive Record',
        confirmVariant: 'outline',
        requiresRemarks: false,
    },
};

export function HouseholdVerificationModal({
    isOpen,
    onClose,
    householdId,
    householdCode,
    actionType,
    onSuccess,
}: HouseholdVerificationModalProps) {
    const [remarks, setRemarks] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!actionType || !householdId) {
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

        const payload: Record<string, any> = {
            action: config.actionParam,
        };

        if (actionType === 'restrict' || actionType === 'unrestrict') {
            payload.reason = remarks.trim() || undefined;
        } else {
            payload.review_notes = remarks.trim() || undefined;
        }

        router.post(config.endpoint(householdId), payload, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmitting(false);
                setRemarks('');
                onClose();
                onSuccess?.();
            },
            onError: (errs) => {
                setIsSubmitting(false);

                if (errs.review_notes) {
                    setError(errs.review_notes);
                } else if (errs.reason) {
                    setError(errs.reason);
                } else {
                    setError('Failed to process request. Please try again.');
                }
            },
        });
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
                                    Household:{' '}
                                    <span className="font-mono font-medium text-foreground">
                                        {householdCode}
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
                                htmlFor="verification-remarks"
                                className="text-xs font-semibold text-foreground"
                            >
                                {config.remarksLabel}{' '}
                                <span className="text-rose-500">*</span>
                            </Label>
                            <Textarea
                                id="verification-remarks"
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
