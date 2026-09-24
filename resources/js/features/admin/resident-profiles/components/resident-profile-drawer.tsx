import { Link } from '@inertiajs/react';
import { ArrowRight, Mail, Phone } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
} from '@/shared/components/ui/sheet';
import { cn } from '@/shared/lib/utils';

export interface AdminResidentProfileItem {
    id: number;
    full_name: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string | null;
    avatar_url?: string | null;
    birthdate?: string | null;
    birthdate_formatted?: string | null;
    age?: number | null;
    gender: string;
    civil_status: string;
    citizenship: string;
    residency_status: string;
    occupation: string;
    is_voter: boolean;
    voter_id_number?: string | null;
    senior_citizen_status: boolean;
    pwd_status: boolean;
    solo_parent_status: boolean;
    is_admin?: boolean;
    is_sub_admin?: boolean;
    is_super_admin?: boolean;
    role_name?: string | null;
    created_at_formatted: string;
}

export function AdminRoleBadge({
    isAdmin,
    isSubAdmin,
    isSuperAdmin,
    className,
}: {
    isAdmin?: boolean;
    isSubAdmin?: boolean;
    isSuperAdmin?: boolean;
    className?: string;
}) {
    if (isSuperAdmin) {
        return (
            <Badge
                variant="secondary"
                className={cn(
                    'border-purple-500/30 bg-purple-500/10 font-semibold text-purple-600 dark:text-purple-400',
                    className,
                )}
            >
                Super Admin
            </Badge>
        );
    }

    if (isAdmin) {
        return (
            <Badge
                variant="secondary"
                className={cn(
                    'border-primary/30 bg-primary/10 font-semibold text-primary',
                    className,
                )}
            >
                Admin
            </Badge>
        );
    }

    if (isSubAdmin) {
        return (
            <Badge
                variant="secondary"
                className={cn(
                    'border-sky-500/30 bg-sky-500/10 font-semibold text-sky-600 dark:text-sky-400',
                    className,
                )}
            >
                Sub-admin
            </Badge>
        );
    }

    return null;
}

interface ResidentProfileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    resident: AdminResidentProfileItem | null;
}

export function ResidentProfileDrawer({
    isOpen,
    onClose,
    resident,
}: ResidentProfileDrawerProps) {
    if (!resident) {
        return null;
    }

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="flex w-full flex-col overflow-y-auto p-0 sm:max-w-xl">
                {/* Header */}
                <div className="border-b border-border/70 bg-muted/20 p-6">
                    <div className="flex items-center justify-between gap-2">
                        <Badge variant="outline" className="text-xs">
                            {resident.residency_status}
                        </Badge>
                        <div className="flex items-center gap-1">
                            {resident.is_voter && (
                                <Badge
                                    variant="outline"
                                    className="border-emerald-500/30 text-[10px] text-emerald-700 dark:text-emerald-400"
                                >
                                    Voter
                                </Badge>
                            )}
                            {resident.senior_citizen_status && (
                                <Badge
                                    variant="outline"
                                    className="border-amber-500/30 text-[10px] text-amber-700 dark:text-amber-400"
                                >
                                    Senior
                                </Badge>
                            )}
                            {resident.pwd_status && (
                                <Badge
                                    variant="outline"
                                    className="border-indigo-500/30 text-[10px] text-indigo-700 dark:text-indigo-400"
                                >
                                    PWD
                                </Badge>
                            )}
                            {resident.solo_parent_status && (
                                <Badge
                                    variant="outline"
                                    className="border-rose-500/30 text-[10px] text-rose-700 dark:text-rose-400"
                                >
                                    Solo Parent
                                </Badge>
                            )}
                        </div>
                    </div>
                    <SheetTitle className="mt-3 flex flex-wrap items-center gap-2.5 text-xl font-bold tracking-tight text-foreground">
                        <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                            {resident.first_name.charAt(0)}
                        </div>
                        <span>{resident.full_name}</span>
                        <AdminRoleBadge
                            isAdmin={resident.is_admin}
                            isSubAdmin={resident.is_sub_admin}
                            isSuperAdmin={resident.is_super_admin}
                            className="px-2 py-0.5 text-xs font-semibold"
                        />
                    </SheetTitle>
                    <SheetDescription className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Mail className="size-3.5" />
                        {resident.email}
                        {resident.phone_number && (
                            <>
                                <span className="mx-1">•</span>
                                <Phone className="size-3.5" />
                                {resident.phone_number}
                            </>
                        )}
                    </SheetDescription>
                </div>

                {/* Body Content */}
                <div className="flex-1 space-y-6 p-6">
                    {/* Demographics Grid */}
                    <div className="space-y-3 rounded-xl border border-border/60 bg-card p-4 shadow-sm">
                        <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            Personal & Demographic Details
                        </h4>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                                <span className="text-muted-foreground">
                                    Age:
                                </span>
                                <p className="mt-0.5 font-semibold text-foreground">
                                    {resident.age
                                        ? `${resident.age} years old`
                                        : '—'}
                                </p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">
                                    Sex:
                                </span>
                                <p className="mt-0.5 font-semibold text-foreground">
                                    {resident.gender}
                                </p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">
                                    Civil Status:
                                </span>
                                <p className="mt-0.5 font-semibold text-foreground">
                                    {resident.civil_status}
                                </p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">
                                    Citizenship:
                                </span>
                                <p className="mt-0.5 font-semibold text-foreground">
                                    {resident.citizenship}
                                </p>
                            </div>
                            <div className="col-span-2">
                                <span className="text-muted-foreground">
                                    Occupation:
                                </span>
                                <p className="mt-0.5 font-semibold text-foreground">
                                    {resident.occupation}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sectoral Classification Details */}
                    <div className="space-y-3 rounded-xl border border-border/60 bg-card p-4 shadow-sm">
                        <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            Special Sector Affiliations
                        </h4>
                        <div className="space-y-2 text-xs">
                            <div className="flex items-center justify-between border-b border-border/40 py-1">
                                <span className="text-muted-foreground">
                                    Registered Voter:
                                </span>
                                <span className="font-medium text-foreground">
                                    {resident.is_voter
                                        ? `Yes (Voter ID: ${resident.voter_id_number || 'Registered'})`
                                        : 'No'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between border-b border-border/40 py-1">
                                <span className="text-muted-foreground">
                                    Senior Citizen:
                                </span>
                                <span className="font-medium text-foreground">
                                    {resident.senior_citizen_status
                                        ? 'Yes'
                                        : 'No'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between border-b border-border/40 py-1">
                                <span className="text-muted-foreground">
                                    Person with Disability (PWD):
                                </span>
                                <span className="font-medium text-foreground">
                                    {resident.pwd_status ? 'Yes' : 'No'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-1">
                                <span className="text-muted-foreground">
                                    Solo Parent:
                                </span>
                                <span className="font-medium text-foreground">
                                    {resident.solo_parent_status ? 'Yes' : 'No'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Registration Date */}
                    <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
                        <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                            Registry Registration Date
                        </span>
                        <p className="mt-1 text-xs font-medium text-foreground">
                            {resident.created_at_formatted}
                        </p>
                    </div>
                </div>

                {/* Footer link to full details */}
                <div className="flex items-center justify-between border-t border-border/70 bg-muted/10 p-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="text-xs"
                    >
                        Close Drawer
                    </Button>
                    <Button asChild size="sm" className="gap-1.5 text-xs">
                        <Link href={`/admin/resident-profiles/${resident.id}`}>
                            View Full Civil Dossier
                            <ArrowRight className="size-3.5" />
                        </Link>
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
