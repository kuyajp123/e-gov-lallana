import { Head, router } from '@inertiajs/react';
import {
    CheckCircle2,
    MoreHorizontal,
    Pencil,
    Search,
    Shield,
    ShieldAlert,
    ShieldCheck,
    ToggleLeft,
    ToggleRight,
    UserCheck,
    UserMinus,
    UserPlus,
    Users,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import { CreateStaffModal } from '@/features/admin/staff/components/create-staff-modal';
import { DesignateResidentModal } from '@/features/admin/staff/components/designate-resident-modal';
import { EditStaffModal } from '@/features/admin/staff/components/edit-staff-modal';
import type { StaffMember } from '@/features/admin/staff/components/edit-staff-modal';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Input } from '@/shared/components/ui/input';

interface StaffIndexProps {
    staff: {
        data: StaffMember[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    stats: {
        total: number;
        active: number;
        admins: number;
        sub_admins: number;
    };
    residentCandidates: Array<{ id: number; name: string; email: string }>;
    currentUserId: number;
    isSuperAdmin: boolean;
    filters: {
        search: string;
        role: string;
        status: string;
    };
}

export default function StaffIndex({
    staff,
    stats,
    residentCandidates,
    filters,
}: StaffIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || 'all');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    // Modals state
    const [createOpen, setCreateOpen] = useState(false);
    const [designateOpen, setDesignateOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

    // Confirmation dialogs
    const [toggleTarget, setToggleTarget] = useState<StaffMember | null>(null);
    const [revokeTarget, setRevokeTarget] = useState<StaffMember | null>(null);

    const handleApplyFilters = (newRole?: string, newStatus?: string) => {
        const r = newRole !== undefined ? newRole : roleFilter;
        const s = newStatus !== undefined ? newStatus : statusFilter;

        router.get(
            '/admin/staff',
            {
                search: search || undefined,
                role: r !== 'all' ? r : undefined,
                status: s !== 'all' ? s : undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleClearFilters = () => {
        setSearch('');
        setRoleFilter('all');
        setStatusFilter('all');
        router.get('/admin/staff', {}, { preserveState: true, replace: true });
    };

    const confirmToggleStatus = () => {
        if (!toggleTarget) {
            return;
        }

        router.post(
            `/admin/staff/${toggleTarget.id}/toggle-status`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => setToggleTarget(null),
            },
        );
    };

    const confirmRevoke = () => {
        if (!revokeTarget) {
            return;
        }

        router.post(
            `/admin/staff/${revokeTarget.id}/revoke`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => setRevokeTarget(null),
            },
        );
    };

    return (
        <>
            <Head title="Staff & Privilege Management | Admin Console" />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <div className="rounded-lg bg-primary/10 p-2 text-primary">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                                    Administrative Staff & Privileges
                                </h1>
                                <p className="text-xs text-muted-foreground">
                                    Manage barangay officials, administrators,
                                    desk staff, and system access rights.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDesignateOpen(true)}
                            className="h-9 gap-1.5 text-xs shadow-2xs"
                        >
                            <Users className="h-3.5 w-3.5" />
                            Designate Resident
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => setCreateOpen(true)}
                            className="h-9 gap-1.5 text-xs shadow-xs"
                        >
                            <UserPlus className="h-3.5 w-3.5" />
                            Provision Staff Account
                        </Button>
                    </div>
                </div>

                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <Card className="border-border/70 shadow-2xs">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-medium text-muted-foreground">
                                    Total Staff
                                </p>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                                {stats.total}
                            </p>
                            <p className="mt-0.5 text-[11px] text-muted-foreground">
                                Authorized personnel
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/70 shadow-2xs">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                    Active Accounts
                                </p>
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            </div>
                            <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                                {stats.active}
                            </p>
                            <p className="mt-0.5 text-[11px] text-muted-foreground">
                                Current system access
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/70 shadow-2xs">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-medium text-primary">
                                    Administrators
                                </p>
                                <Shield className="h-4 w-4 text-primary" />
                            </div>
                            <p className="mt-2 text-2xl font-bold tracking-tight text-primary">
                                {stats.admins}
                            </p>
                            <p className="mt-0.5 text-[11px] text-muted-foreground">
                                Full policy control
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/70 shadow-2xs">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-medium text-sky-600 dark:text-sky-400">
                                    Sub-admin / Staff
                                </p>
                                <UserCheck className="h-4 w-4 text-sky-500" />
                            </div>
                            <p className="mt-2 text-2xl font-bold tracking-tight text-sky-600 dark:text-sky-400">
                                {stats.sub_admins}
                            </p>
                            <p className="mt-0.5 text-[11px] text-muted-foreground">
                                Desk operations
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* Role Filter Tabs */}
                    <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-border/70 bg-muted/30 p-1">
                        {[
                            { id: 'all', label: 'All Roles' },
                            { id: 'admin', label: 'Administrators' },
                            { id: 'sub_admin', label: 'Sub-admins / Staff' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => {
                                    setRoleFilter(tab.id);
                                    handleApplyFilters(tab.id, undefined);
                                }}
                                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                                    roleFilter === tab.id
                                        ? 'bg-card font-semibold text-foreground shadow-2xs'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Search and Reset */}
                    <div className="flex items-center gap-2">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute top-2.5 left-2.5 h-3.5 w-3.5 text-muted-foreground" />
                            <Input
                                placeholder="Search name, email, or phone..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === 'Enter' && handleApplyFilters()
                                }
                                className="h-8 pl-8 text-xs"
                            />
                            {search && (
                                <button
                                    onClick={() => {
                                        setSearch('');
                                        router.get(
                                            '/admin/staff',
                                            {
                                                role:
                                                    roleFilter !== 'all'
                                                        ? roleFilter
                                                        : undefined,
                                            },
                                            { preserveState: true },
                                        );
                                    }}
                                    className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>

                        {(search ||
                            roleFilter !== 'all' ||
                            statusFilter !== 'all') && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClearFilters}
                                className="h-8 text-xs text-muted-foreground"
                            >
                                Reset
                            </Button>
                        )}
                    </div>
                </div>

                {/* Staff Data Table */}
                <Card className="overflow-hidden border-border/70 shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-border bg-muted/40 font-medium text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3">Staff Member</th>
                                    <th className="px-4 py-3">
                                        Contact Information
                                    </th>
                                    <th className="px-4 py-3">System Role</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Created</th>
                                    <th className="px-4 py-3 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                                {staff.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-4 py-12 text-center"
                                        >
                                            <ShieldAlert className="mx-auto h-8 w-8 text-muted-foreground/40" />
                                            <p className="mt-2 text-sm font-medium text-foreground">
                                                No staff members found
                                            </p>
                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                Try adjusting your search
                                                criteria or active role filters.
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    staff.data.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="transition-colors hover:bg-muted/30"
                                        >
                                            {/* Member Name and Avatar */}
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8 border border-border">
                                                        <AvatarImage
                                                            src={
                                                                user.avatar_url ||
                                                                undefined
                                                            }
                                                            alt={user.name}
                                                        />
                                                        <AvatarFallback className="bg-primary/10 text-[11px] font-semibold text-primary">
                                                            {user.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-sm font-semibold text-foreground">
                                                                {user.name}
                                                            </span>
                                                            {user.is_self && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="border-primary/30 px-1 py-0 text-[9px] text-primary"
                                                                >
                                                                    You
                                                                </Badge>
                                                            )}
                                                            {user.is_super_admin && (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="border-purple-500/20 bg-purple-500/10 px-1 py-0 text-[9px] text-purple-600"
                                                                >
                                                                    Super Admin
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <span className="text-[11px] text-muted-foreground">
                                                            ID #{user.id}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Contact */}
                                            <td className="px-4 py-3.5">
                                                <div className="flex flex-col">
                                                    <span className="text-foreground">
                                                        {user.email}
                                                    </span>
                                                    <span className="text-[11px] text-muted-foreground">
                                                        {user.phone_number ||
                                                            'No phone set'}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* System Role */}
                                            <td className="px-4 py-3.5">
                                                <Badge
                                                    variant={
                                                        user.is_admin
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                    className={`text-[11px] font-medium ${
                                                        user.is_admin
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400'
                                                    }`}
                                                >
                                                    {user.role.name}
                                                </Badge>
                                            </td>

                                            {/* Status */}
                                            <td className="px-4 py-3.5">
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                                        user.is_active
                                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                            : 'bg-destructive/10 text-destructive'
                                                    }`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${
                                                            user.is_active
                                                                ? 'bg-emerald-500'
                                                                : 'bg-destructive'
                                                        }`}
                                                    />
                                                    {user.is_active
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </span>
                                            </td>

                                            {/* Created */}
                                            <td className="px-4 py-3.5 text-[11px] text-muted-foreground">
                                                {user.created_at_formatted}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-4 py-3.5 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="w-44 text-xs"
                                                    >
                                                        {user.can_edit && (
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    setEditingStaff(
                                                                        user,
                                                                    )
                                                                }
                                                                className="cursor-pointer gap-2"
                                                            >
                                                                <Pencil className="h-3.5 w-3.5" />
                                                                Edit Account
                                                            </DropdownMenuItem>
                                                        )}

                                                        {user.can_toggle && (
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    setToggleTarget(
                                                                        user,
                                                                    )
                                                                }
                                                                className="cursor-pointer gap-2"
                                                            >
                                                                {user.is_active ? (
                                                                    <>
                                                                        <ToggleLeft className="h-3.5 w-3.5 text-amber-500" />
                                                                        Deactivate
                                                                        Account
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <ToggleRight className="h-3.5 w-3.5 text-emerald-500" />
                                                                        Reactivate
                                                                        Account
                                                                    </>
                                                                )}
                                                            </DropdownMenuItem>
                                                        )}

                                                        {user.can_revoke && (
                                                            <>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        setRevokeTarget(
                                                                            user,
                                                                        )
                                                                    }
                                                                    className="cursor-pointer gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
                                                                >
                                                                    <UserMinus className="h-3.5 w-3.5" />
                                                                    Revoke Staff
                                                                    Access
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* Modals */}
            <CreateStaffModal open={createOpen} onOpenChange={setCreateOpen} />
            <DesignateResidentModal
                open={designateOpen}
                onOpenChange={setDesignateOpen}
                candidates={residentCandidates}
            />
            <EditStaffModal
                staff={editingStaff}
                open={editingStaff !== null}
                onOpenChange={(open) => !open && setEditingStaff(null)}
            />

            {/* Toggle Status Confirmation Dialog */}
            <Dialog
                open={toggleTarget !== null}
                onOpenChange={(open) => !open && setToggleTarget(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {toggleTarget?.is_active
                                ? 'Deactivate Staff Account'
                                : 'Reactivate Staff Account'}
                        </DialogTitle>
                        <DialogDescription>
                            {toggleTarget?.is_active ? (
                                <>
                                    Are you sure you want to deactivate{' '}
                                    <span className="font-semibold text-foreground">
                                        {toggleTarget?.name}
                                    </span>
                                    ? They will immediately lose access to the
                                    administrative console until reactivated.
                                </>
                            ) : (
                                <>
                                    Reactivating{' '}
                                    <span className="font-semibold text-foreground">
                                        {toggleTarget?.name}
                                    </span>{' '}
                                    will restore their operational access to the
                                    administrative console.
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setToggleTarget(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant={
                                toggleTarget?.is_active
                                    ? 'destructive'
                                    : 'default'
                            }
                            size="sm"
                            onClick={confirmToggleStatus}
                        >
                            {toggleTarget?.is_active
                                ? 'Deactivate Staff'
                                : 'Reactivate Staff'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Revoke Access Confirmation Dialog */}
            <Dialog
                open={revokeTarget !== null}
                onOpenChange={(open) => !open && setRevokeTarget(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Revoke Staff Privileges</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to revoke staff privileges for{' '}
                            <span className="font-semibold text-foreground">
                                {revokeTarget?.name}
                            </span>{' '}
                            ({revokeTarget?.email})? They will be immediately
                            demoted back to a standard citizen/resident account.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setRevokeTarget(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={confirmRevoke}
                        >
                            Revoke Privileges
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
