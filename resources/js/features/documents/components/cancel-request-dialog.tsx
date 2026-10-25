import { useForm } from '@inertiajs/react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Label } from '@/shared/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';
import { useTranslation } from '@/shared/hooks/use-translation';

interface CancellationReasonOption {
    value: string;
    label: string;
}

interface CancelRequestDialogProps {
    requestId: number;
    referenceCode: string;
    reasons: CancellationReasonOption[];
}

export function CancelRequestDialog({
    requestId,
    referenceCode,
    reasons,
}: CancelRequestDialogProps) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        cancellation_reason: '',
        cancellation_notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/documents/${requestId}/cancel`, {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="rounded-none border-destructive/40 text-destructive shadow-none hover:bg-destructive/10"
                >
                    {t('documents.cancel_request', 'Cancel Request')}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md rounded-none shadow-none">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <div className="flex size-10 items-center justify-center rounded-none bg-destructive/10 text-destructive">
                            <AlertTriangle className="size-5" />
                        </div>
                        <DialogTitle className="mt-2 text-base font-bold">
                            {t(
                                'documents.cancel_request',
                                'Cancel Document Request',
                            )}
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            {t(
                                'documents.cancel_confirm',
                                'Are you sure you want to cancel request',
                            )}{' '}
                            <span className="font-semibold text-foreground">
                                {referenceCode}
                            </span>
                            ?{' '}
                            {t(
                                'documents.cancel_undone',
                                'This action cannot be undone.',
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="my-4 space-y-4">
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="cancellation_reason"
                                className="text-xs font-semibold"
                            >
                                {t(
                                    'documents.cancel_reason',
                                    'Reason for Cancellation',
                                )}{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={data.cancellation_reason}
                                onValueChange={(val) =>
                                    setData('cancellation_reason', val)
                                }
                            >
                                <SelectTrigger
                                    id="cancellation_reason"
                                    className={`rounded-none ${
                                        errors.cancellation_reason
                                            ? 'border-destructive'
                                            : ''
                                    }`}
                                >
                                    <SelectValue
                                        placeholder={t(
                                            'documents.select_reason',
                                            'Select cancellation reason',
                                        )}
                                    />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    {reasons.map((r) => (
                                        <SelectItem
                                            key={r.value}
                                            value={r.value}
                                            className="rounded-none"
                                        >
                                            {r.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.cancellation_reason && (
                                <p className="text-[11px] font-medium text-destructive">
                                    {errors.cancellation_reason}
                                </p>
                            )}
                        </div>

                        {data.cancellation_reason === 'other' && (
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="cancellation_notes"
                                    className="text-xs font-semibold"
                                >
                                    Additional Explanation{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Textarea
                                    id="cancellation_notes"
                                    value={data.cancellation_notes}
                                    onChange={(e) =>
                                        setData(
                                            'cancellation_notes',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Please explain why you are cancelling this request..."
                                    rows={3}
                                    className={`rounded-none shadow-none ${
                                        errors.cancellation_notes
                                            ? 'border-destructive'
                                            : ''
                                    }`}
                                />
                                {errors.cancellation_notes && (
                                    <p className="text-[11px] font-medium text-destructive">
                                        {errors.cancellation_notes}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="rounded-none shadow-none"
                            onClick={() => setOpen(false)}
                            disabled={processing}
                        >
                            {t('common.cancel', 'Keep Request')}
                        </Button>
                        <Button
                            type="submit"
                            variant="destructive"
                            size="sm"
                            className="rounded-none shadow-none"
                            disabled={processing || !data.cancellation_reason}
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                                    {t('common.please_wait', 'Cancelling...')}
                                </>
                            ) : (
                                t(
                                    'documents.cancel_request',
                                    'Confirm Cancellation',
                                )
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
