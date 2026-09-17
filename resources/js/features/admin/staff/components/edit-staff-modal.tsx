import { useForm } from '@inertiajs/react';
import { KeyRound, Pencil } from 'lucide-react';
import React, { useEffect } from 'react';
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

export interface StaffMember {
    id: number;
    name: string;
    email: string;
    phone_number: string | null;
    avatar_url: string | null;
    role: { id: number; name: string; slug: string };
    status: string;
    is_active: boolean;
    is_admin: boolean;
    is_sub_admin: boolean;
    is_super_admin: boolean;
    is_self: boolean;
    can_edit: boolean;
    can_toggle: boolean;
    can_revoke: boolean;
    created_at_formatted: string;
}

interface EditStaffModalProps {
    staff: StaffMember | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditStaffModal({
    staff,
    open,
    onOpenChange,
}: EditStaffModalProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone_number: '',
        role_slug: 'sub_admin',
        status: 'active',
        password: '',
    });

    useEffect(() => {
        if (staff) {
            setData({
                name: staff.name,
                email: staff.email,
                phone_number: staff.phone_number || '',
                role_slug: staff.role.slug,
                status: staff.status,
                password: '',
            });
        }
    }, [staff, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!staff) {
            return;
        }

        put(`/admin/staff/${staff.id}`, {
            onSuccess: () => {
                reset();
                onOpenChange(false);
            },
        });
    };

    if (!staff) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <div className="flex items-center gap-2 text-primary">
                            <div className="rounded-lg bg-primary/10 p-1.5">
                                <Pencil className="h-4 w-4" />
                            </div>
                            <DialogTitle>Edit Staff Member Details</DialogTitle>
                        </div>
                        <DialogDescription className="text-xs">
                            Update contact details, role privileges, or password
                            for {staff.name}.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3.5 py-4">
                        <div className="space-y-1">
                            <Label
                                htmlFor="edit-name"
                                className="text-xs font-medium"
                            >
                                Full Name{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="edit-name"
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
                                htmlFor="edit-email"
                                className="text-xs font-medium"
                            >
                                Email Address{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="edit-email"
                                type="email"
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
                                    htmlFor="edit-phone"
                                    className="text-xs font-medium"
                                >
                                    Phone Number
                                </Label>
                                <Input
                                    id="edit-phone"
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
                                    System Role
                                </Label>
                                <Select
                                    value={data.role_slug}
                                    onValueChange={(val) =>
                                        setData('role_slug', val)
                                    }
                                    disabled={staff.is_self}
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
                                {staff.is_self && (
                                    <p className="text-[10px] text-muted-foreground">
                                        Cannot modify your own role
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label
                                htmlFor="edit-password"
                                className="text-xs font-medium"
                            >
                                New Password (Optional)
                            </Label>
                            <div className="relative">
                                <KeyRound className="absolute top-2.5 left-2.5 h-3.5 w-3.5 text-muted-foreground" />
                                <Input
                                    id="edit-password"
                                    type="password"
                                    placeholder="Leave blank to keep existing password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    className="h-8 pl-8 text-xs"
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
                                Account Status
                            </Label>
                            <Select
                                value={data.status}
                                onValueChange={(val) => setData('status', val)}
                                disabled={staff.is_self}
                            >
                                <SelectTrigger className="h-8 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem
                                        value="active"
                                        className="text-xs"
                                    >
                                        Active
                                    </SelectItem>
                                    <SelectItem
                                        value="inactive"
                                        className="text-xs"
                                    >
                                        Inactive
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {staff.is_self && (
                                <p className="text-[10px] text-muted-foreground">
                                    Cannot deactivate yourself
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
                            className="h-8 text-xs shadow-xs"
                        >
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
