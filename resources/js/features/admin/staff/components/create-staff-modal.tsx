import { useForm } from '@inertiajs/react';
import { KeyRound, UserPlus } from 'lucide-react';
import React from 'react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';

interface CreateStaffModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateStaffModal({
    open,
    onOpenChange,
}: CreateStaffModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone_number: '',
        role_slug: 'sub_admin',
        password: '',
        status: 'active',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/staff', {
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
                                <UserPlus className="h-4 w-4" />
                            </div>
                            <DialogTitle>
                                Provision New Staff Account
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-xs">
                            Directly create a new administrative staff account
                            with credentials.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3.5 py-4">
                        <div className="space-y-1">
                            <Label
                                htmlFor="name"
                                className="text-xs font-medium"
                            >
                                Full Name{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                placeholder="e.g. Maria Santos"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                className="h-8 text-xs"
                                required
                            />
                            {errors.name && (
                                <p className="text-[11px] text-destructive">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Label
                                htmlFor="email"
                                className="text-xs font-medium"
                            >
                                Official Email Address{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="e.g. maria.santos@lallana.gov.ph"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                className="h-8 text-xs"
                                required
                            />
                            {errors.email && (
                                <p className="text-[11px] text-destructive">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label
                                    htmlFor="phone_number"
                                    className="text-xs font-medium"
                                >
                                    Phone Number
                                </Label>
                                <Input
                                    id="phone_number"
                                    placeholder="+639171234567"
                                    value={data.phone_number}
                                    onChange={(e) =>
                                        setData('phone_number', e.target.value)
                                    }
                                    className="h-8 text-xs"
                                />
                                {errors.phone_number && (
                                    <p className="text-[11px] text-destructive">
                                        {errors.phone_number}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs font-medium">
                                    System Role{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={data.role_slug}
                                    onValueChange={(val) =>
                                        setData('role_slug', val)
                                    }
                                >
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem
                                            value="sub_admin"
                                            className="text-xs"
                                        >
                                            Sub-admin / Staff
                                        </SelectItem>
                                        <SelectItem
                                            value="admin"
                                            className="text-xs"
                                        >
                                            Barangay Administrator
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.role_slug && (
                                    <p className="text-[11px] text-destructive">
                                        {errors.role_slug}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label
                                htmlFor="password"
                                className="text-xs font-medium"
                            >
                                Temporary Password{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                                <KeyRound className="absolute top-2.5 left-2.5 h-3.5 w-3.5 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Minimum 8 characters..."
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    className="h-8 pl-8 text-xs"
                                    required
                                    minLength={8}
                                />
                            </div>
                            {errors.password && (
                                <p className="text-[11px] text-destructive">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Label className="text-xs font-medium">
                                Initial Account Status
                            </Label>
                            <Select
                                value={data.status}
                                onValueChange={(val) => setData('status', val)}
                            >
                                <SelectTrigger className="h-8 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem
                                        value="active"
                                        className="text-xs"
                                    >
                                        Active (Can sign in immediately)
                                    </SelectItem>
                                    <SelectItem
                                        value="inactive"
                                        className="text-xs"
                                    >
                                        Inactive (Access suspended)
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-[11px] text-destructive">
                                    {errors.status}
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
                            disabled={processing}
                            className="h-8 gap-1.5 text-xs shadow-xs"
                        >
                            <UserPlus className="h-3.5 w-3.5" />
                            {processing
                                ? 'Creating...'
                                : 'Create Staff Account'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
