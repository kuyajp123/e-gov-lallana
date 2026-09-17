import { useForm } from '@inertiajs/react';
import { Search, UserCheck2, Users } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
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

interface ResidentCandidate {
    id: number;
    name: string;
    email: string;
}

interface DesignateResidentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    candidates: ResidentCandidate[];
}

export function DesignateResidentModal({
    open,
    onOpenChange,
    candidates,
}: DesignateResidentModalProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: '',
    });

    const filteredCandidates = candidates.filter(
        (c) =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/staff/designate', {
            onSuccess: () => {
                reset();
                onOpenChange(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <div className="flex items-center gap-2 text-primary">
                            <div className="rounded-lg bg-primary/10 p-1.5">
                                <Users className="h-4 w-4" />
                            </div>
                            <DialogTitle>
                                Designate Resident as Staff
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-xs">
                            Select an existing registered resident to grant them
                            Barangay Sub-admin / Staff privileges.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3.5 py-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium">
                                Search Registered Residents
                            </Label>
                            <div className="relative">
                                <Search className="absolute top-2.5 left-2.5 h-3.5 w-3.5 text-muted-foreground" />
                                <Input
                                    placeholder="Filter by resident name or email..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="h-8 pl-8 text-xs"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium">
                                Select Resident{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <div className="max-h-52 divide-y divide-border/60 overflow-y-auto rounded-lg border border-border/70">
                                {filteredCandidates.length === 0 ? (
                                    <p className="py-6 text-center text-xs text-muted-foreground italic">
                                        No matching registered residents found.
                                    </p>
                                ) : (
                                    filteredCandidates.map((resident) => (
                                        <label
                                            key={resident.id}
                                            className={`flex cursor-pointer items-center justify-between p-2.5 text-xs transition-colors hover:bg-muted/40 ${
                                                String(data.user_id) ===
                                                String(resident.id)
                                                    ? 'bg-primary/5 font-medium text-primary'
                                                    : 'text-foreground'
                                            }`}
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-semibold">
                                                    {resident.name}
                                                </span>
                                                <span className="text-[11px] text-muted-foreground">
                                                    {resident.email}
                                                </span>
                                            </div>
                                            <input
                                                type="radio"
                                                name="user_id"
                                                value={resident.id}
                                                checked={
                                                    String(data.user_id) ===
                                                    String(resident.id)
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        'user_id',
                                                        e.target.value,
                                                    )
                                                }
                                                className="text-primary focus:ring-primary"
                                            />
                                        </label>
                                    ))
                                )}
                            </div>
                            {errors.user_id && (
                                <p className="text-[11px] text-destructive">
                                    {errors.user_id}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onOpenChange(false)}
                            className="h-8 text-xs"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            size="sm"
                            disabled={processing || !data.user_id}
                            className="h-8 gap-1.5 text-xs shadow-xs"
                        >
                            <UserCheck2 className="h-3.5 w-3.5" />
                            {processing
                                ? 'Designating...'
                                : 'Grant Staff Access'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
