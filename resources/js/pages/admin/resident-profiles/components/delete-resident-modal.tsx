import { router } from '@inertiajs/react';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
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

interface DeleteResidentModalProps {
    isOpen: boolean;
    onClose: () => void;
    residentId: number;
    fullName: string;
    householdCode?: string | null;
    isSoleMember?: boolean;
    hasHousehold?: boolean;
    activeRequestsCount?: number;
}

export function DeleteResidentModal({
    isOpen,
    onClose,
    residentId,
    fullName,
    householdCode,
    isSoleMember = false,
    hasHousehold = false,
    activeRequestsCount = 0,
}: DeleteResidentModalProps) {
    const [typedName, setTypedName] = useState('');
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const isNameMatched =
        typedName.trim().toLowerCase() === fullName.trim().toLowerCase();
    const canDelete = isNameMatched && isConfirmed && !isSubmitting;

    const handleClose = () => {
        if (isSubmitting) {
            return;
        }

        setTypedName('');
        setIsConfirmed(false);
        setErrorMessage(null);
        onClose();
    };

    const handleDelete = (e: React.FormEvent) => {
        e.preventDefault();

        if (!canDelete) {
            return;
        }

        setIsSubmitting(true);
        setErrorMessage(null);

        router.delete(`/admin/resident-profiles/${residentId}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmitting(false);
                handleClose();
            },
            onError: (errors) => {
                setIsSubmitting(false);
                setErrorMessage(
                    errors.deletion ||
                        errors.error ||
                        'Failed to delete resident profile. Please try again.',
                );
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-lg">
                <form onSubmit={handleDelete}>
                    <DialogHeader className="gap-2">
                        <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                            <Trash2 className="size-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold text-foreground">
                                Delete Resident Profile
                            </DialogTitle>
                            <DialogDescription className="mt-1 text-xs text-muted-foreground">
                                Permanently purge this citizen from the civil
                                registry. This action cannot be reversed.
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <div className="space-y-4 py-4 text-xs">
                        {/* Error Alert */}
                        {errorMessage && (
                            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-destructive">
                                {errorMessage}
                            </div>
                        )}

                        {/* Impact Warnings Card */}
                        <div className="space-y-2.5 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3.5 text-amber-900 dark:text-amber-200">
                            <div className="flex items-center gap-2 font-semibold">
                                <AlertTriangle className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                                <span>Impact Summary & Actions</span>
                            </div>
                            <ul className="list-inside list-disc space-y-1.5 pl-1 text-[11px] leading-relaxed text-muted-foreground">
                                <li>
                                    <strong className="text-foreground">
                                        Civil Registry & Auth:
                                    </strong>{' '}
                                    The user login account and civil dossier
                                    will be erased.
                                </li>
                                <li>
                                    <strong className="text-foreground">
                                        Cloud Storage Purge:
                                    </strong>{' '}
                                    Uploaded government IDs, avatars, and
                                    verification files will be deleted from
                                    storage.
                                </li>
                                {hasHousehold && isSoleMember && (
                                    <li className="text-destructive dark:text-destructive">
                                        <strong>
                                            Sole-Occupant Household:
                                        </strong>{' '}
                                        Resident is the only member in Household{' '}
                                        <strong>{householdCode}</strong>. The
                                        entire household record will be{' '}
                                        <strong>permanently deleted</strong> to
                                        prevent ghost households.
                                    </li>
                                )}
                                {hasHousehold && !isSoleMember && (
                                    <li>
                                        <strong>Household Detachment:</strong>{' '}
                                        Resident will be removed from Household{' '}
                                        <strong>{householdCode}</strong>.
                                        Remaining family members will stay
                                        intact.
                                    </li>
                                )}
                                {activeRequestsCount > 0 && (
                                    <li className="text-destructive dark:text-destructive">
                                        <strong>
                                            Active Document Requests:
                                        </strong>{' '}
                                        {activeRequestsCount} active request(s)
                                        will be immediately cancelled.
                                    </li>
                                )}
                            </ul>
                        </div>

                        {/* Step 1: Type-to-confirm input */}
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="type-resident-name"
                                className="text-xs font-semibold text-foreground"
                            >
                                1. Type the resident's full name to confirm:
                            </Label>
                            <p className="text-[11px] text-muted-foreground">
                                Please type{' '}
                                <code className="rounded bg-muted px-1.5 py-0.5 font-bold text-foreground">
                                    {fullName}
                                </code>{' '}
                                below:
                            </p>
                            <Input
                                id="type-resident-name"
                                value={typedName}
                                onChange={(e) => setTypedName(e.target.value)}
                                placeholder={fullName}
                                disabled={isSubmitting}
                                className="h-9 text-xs"
                                autoComplete="off"
                            />
                        </div>

                        {/* Step 2: Interactive Confirmation Action */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-foreground">
                                2. Action confirmation:
                            </Label>
                            <div className="flex items-start gap-2.5 rounded-lg border border-border bg-muted/40 p-3 transition-colors hover:bg-muted/60">
                                <Checkbox
                                    id="confirm-action-checkbox"
                                    checked={isConfirmed}
                                    onCheckedChange={(checked) =>
                                        setIsConfirmed(Boolean(checked))
                                    }
                                    disabled={isSubmitting}
                                    className="mt-0.5"
                                />
                                <Label
                                    htmlFor="confirm-action-checkbox"
                                    className="cursor-pointer text-[11px] leading-relaxed font-normal text-muted-foreground select-none"
                                >
                                    I confirm the cancellation of any active
                                    requests, authorize the permanent purge of
                                    all stored files, and acknowledge that{' '}
                                    {isSoleMember ? (
                                        <span className="font-semibold text-destructive">
                                            Household {householdCode} will be
                                            deleted entirely.
                                        </span>
                                    ) : (
                                        'this resident will be permanently removed.'
                                    )}
                                </Label>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="text-xs"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={!canDelete}
                            className="gap-1.5 text-xs"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="size-3.5 animate-spin" />
                                    <span>Deleting...</span>
                                </>
                            ) : (
                                <>
                                    <Trash2 className="size-3.5" />
                                    <span>Permanently Delete Resident</span>
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
