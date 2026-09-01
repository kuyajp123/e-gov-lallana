import { useForm } from '@inertiajs/react';
import { ArrowRightLeft, ShieldAlert } from 'lucide-react';
import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Button } from '@/shared/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import { Spinner } from '@/shared/components/ui/spinner';

interface MemberOption {
    id: number;
    full_name: string;
    relationship_to_head: string;
    is_family_head: boolean;
}

interface TransferHeadDialogProps {
    members: MemberOption[];
}

export function TransferHeadDialog({ members }: TransferHeadDialogProps) {
    const [open, setOpen] = useState(false);
    const eligibleMembers = members.filter((m) => !m.is_family_head);

    const { data, setData, post, processing, errors, reset } = useForm({
        new_family_head_member_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/household/transfer-head', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    };

    if (eligibleMembers.length === 0) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-muted-foreground hover:text-foreground"
                >
                    <ArrowRightLeft className="size-3.5" />
                    Transfer Head Authority
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md rounded-2xl">
                <DialogHeader>
                    <DialogTitle>Transfer Family Head Authority</DialogTitle>
                    <DialogDescription>
                        Designate another registered household member as the
                        primary Family Head.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <Alert className="rounded-xl border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200">
                        <ShieldAlert className="size-4 text-amber-600 dark:text-amber-400" />
                        <AlertDescription className="text-xs">
                            Transferring Family Head authority will grant full
                            household member management and official
                            administrative representation to the designated
                            member.
                        </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                        <Label htmlFor="new_head">
                            Select New Family Head{' '}
                            <span className="text-destructive">*</span>
                        </Label>
                        <Select
                            value={data.new_family_head_member_id}
                            onValueChange={(val) =>
                                setData('new_family_head_member_id', val)
                            }
                        >
                            <SelectTrigger id="new_head">
                                <SelectValue placeholder="Choose a household member" />
                            </SelectTrigger>
                            <SelectContent>
                                {eligibleMembers.map((member) => (
                                    <SelectItem
                                        key={member.id}
                                        value={member.id.toString()}
                                    >
                                        {member.full_name} (
                                        {member.relationship_to_head})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.new_family_head_member_id && (
                            <p className="text-xs text-destructive">
                                {errors.new_family_head_member_id}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 border-t border-border pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={
                                processing || !data.new_family_head_member_id
                            }
                        >
                            {processing ? (
                                <div className="flex items-center gap-1.5">
                                    <Spinner className="size-4" />
                                    <span>Transferring...</span>
                                </div>
                            ) : (
                                'Confirm Transfer'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
