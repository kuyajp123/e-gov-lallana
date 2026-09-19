import { router } from '@inertiajs/react';
import { ArrowRightLeft } from 'lucide-react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';

export interface SuccessorOption {
    id: number;
    name: string;
    is_spouse: boolean;
    is_adult: boolean;
}

interface TransferHeadModalProps {
    isOpen: boolean;
    onClose: () => void;
    householdId: number | null;
    householdCode: string;
    successors: SuccessorOption[];
    onSuccess?: () => void;
}

export function TransferHeadModal({
    isOpen,
    onClose,
    householdId,
    householdCode,
    successors,
    onSuccess,
}: TransferHeadModalProps) {
    const [selectedMemberId, setSelectedMemberId] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!householdId) {
        return null;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedMemberId) {
            return;
        }

        setIsSubmitting(true);

        router.post(
            `/admin/households/${householdId}/transfer-head`,
            {
                new_family_head_member_id: Number(selectedMemberId),
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSubmitting(false);
                    setSelectedMemberId('');
                    onClose();
                    onSuccess?.();
                },
                onError: () => {
                    setIsSubmitting(false);
                },
            },
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                                <ArrowRightLeft className="size-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-base font-semibold text-foreground">
                                    Transfer Family Head Authority
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
                            Select an eligible adult member to assume the role
                            of Family Head. By succession priority, spouses and
                            verified adults are listed first.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-2 pt-1">
                        <Label
                            htmlFor="successor-select"
                            className="text-xs font-semibold text-foreground"
                        >
                            Designate New Family Head{' '}
                            <span className="text-rose-500">*</span>
                        </Label>
                        <Select
                            value={selectedMemberId}
                            onValueChange={setSelectedMemberId}
                        >
                            <SelectTrigger
                                id="successor-select"
                                className="h-9 text-xs"
                            >
                                <SelectValue placeholder="Select eligible household member..." />
                            </SelectTrigger>
                            <SelectContent>
                                {successors.map((member) => (
                                    <SelectItem
                                        key={member.id}
                                        value={String(member.id)}
                                        className="text-xs"
                                    >
                                        {member.name}{' '}
                                        {member.is_spouse
                                            ? '★ Priority: Spouse'
                                            : member.is_adult
                                              ? '• Adult'
                                              : ''}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="gap-2 pt-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="text-xs"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            size="sm"
                            disabled={isSubmitting || !selectedMemberId}
                            className="gap-1.5 text-xs"
                        >
                            {isSubmitting
                                ? 'Transferring...'
                                : 'Transfer Head Authority'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
