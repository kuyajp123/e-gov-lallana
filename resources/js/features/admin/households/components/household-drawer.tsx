import { Link } from '@inertiajs/react';
import {
    Archive,
    ArrowRight,
    CheckCircle2,
    Mail,
    MapPin,
    Phone,
    ShieldAlert,
    ShieldCheck,
    Undo2,
    User,
    Users,
    XCircle,
} from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
} from '@/shared/components/ui/sheet';
import type { HouseholdActionType } from './household-verification-modal';

export interface AdminHouseholdItem {
    id: number;
    household_code: string;
    status: string;
    status_label: string;
    status_color: string;
    purok_sitio: string;
    address: string;
    notes?: string | null;
    submitted_at?: string | null;
    submitted_at_formatted: string;
    verified_at_formatted?: string | null;
    members_count: number;
    adults_count: number;
    family_head: {
        id: number;
        name: string;
        email: string;
        phone_number?: string | null;
        avatar_url?: string | null;
    } | null;
}

interface HouseholdDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    household: AdminHouseholdItem | null;
    canManageRestrictions: boolean;
    onTriggerAction: (
        type: HouseholdActionType,
        hh: AdminHouseholdItem,
    ) => void;
}

export function HouseholdDrawer({
    isOpen,
    onClose,
    household,
    canManageRestrictions,
    onTriggerAction,
}: HouseholdDrawerProps) {
    if (!household) {
        return null;
    }

    const isPending =
        household.status === 'unverified' || household.status === 'pending';
    const isVerified = household.status === 'verified';
    const isRestricted = household.status === 'restricted';

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="flex w-full flex-col overflow-y-auto p-0 sm:max-w-xl">
                {/* Header */}
                <div className="border-b border-border/70 bg-muted/20 p-6">
                    <div className="flex items-center justify-between gap-2">
                        <Badge
                            variant="outline"
                            className="px-2.5 py-1 font-mono text-xs"
                        >
                            {household.household_code}
                        </Badge>
                        <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                household.status_color === 'success'
                                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                    : household.status_color === 'danger'
                                      ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400'
                                      : household.status_color === 'info'
                                        ? 'bg-sky-500/10 text-sky-700 dark:text-sky-400'
                                        : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                            }`}
                        >
                            {household.status_label}
                        </span>
                    </div>
                    <SheetTitle className="mt-3 text-xl font-bold tracking-tight text-foreground">
                        {household.purok_sitio}
                    </SheetTitle>
                    <SheetDescription className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="size-3.5 shrink-0" />
                        {household.address}
                    </SheetDescription>
                </div>

                {/* Body Content */}
                <div className="flex-1 space-y-6 p-6">
                    {/* Action Bar */}
                    <div className="space-y-3 rounded-xl border border-border/60 bg-card p-4 shadow-sm">
                        <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            Verification Actions
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {isPending && (
                                <>
                                    <Button
                                        size="sm"
                                        onClick={() =>
                                            onTriggerAction(
                                                'approve',
                                                household,
                                            )
                                        }
                                        className="gap-1.5 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
                                    >
                                        <CheckCircle2 className="size-3.5" />
                                        Approve & Verify
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                            onTriggerAction('return', household)
                                        }
                                        className="gap-1.5 border-amber-500/40 text-xs text-amber-700 dark:text-amber-400"
                                    >
                                        <Undo2 className="size-3.5" />
                                        Return for Correction
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                            onTriggerAction('reject', household)
                                        }
                                        className="gap-1.5 border-rose-500/40 text-xs text-rose-700 dark:text-rose-400"
                                    >
                                        <XCircle className="size-3.5" />
                                        Reject
                                    </Button>
                                </>
                            )}

                            {isVerified && canManageRestrictions && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                        onTriggerAction('restrict', household)
                                    }
                                    className="gap-1.5 border-rose-500/40 text-xs text-rose-700 dark:text-rose-400"
                                >
                                    <ShieldAlert className="size-3.5" />
                                    Place Under Restriction
                                </Button>
                            )}

                            {isRestricted && canManageRestrictions && (
                                <>
                                    <Button
                                        size="sm"
                                        onClick={() =>
                                            onTriggerAction(
                                                'unrestrict',
                                                household,
                                            )
                                        }
                                        className="gap-1.5 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
                                    >
                                        <ShieldCheck className="size-3.5" />
                                        Lift Restriction
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                            onTriggerAction(
                                                'archive',
                                                household,
                                            )
                                        }
                                        className="gap-1.5 text-xs"
                                    >
                                        <Archive className="size-3.5" />
                                        Archive
                                    </Button>
                                </>
                            )}

                            <Button
                                asChild
                                size="sm"
                                variant="ghost"
                                className="ml-auto gap-1 text-xs"
                            >
                                <Link
                                    href={`/admin/households/${household.id}`}
                                >
                                    Full Dossier
                                    <ArrowRight className="size-3.5" />
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Family Head Card */}
                    <div className="space-y-3 rounded-xl border border-border/60 bg-card p-4 shadow-sm">
                        <h4 className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            <User className="size-3.5" />
                            Head of Household
                        </h4>
                        {household.family_head ? (
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                    {household.family_head.name.charAt(0)}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-foreground">
                                        {household.family_head.name}
                                    </p>
                                    <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Mail className="size-3" />
                                            {household.family_head.email}
                                        </span>
                                        {household.family_head.phone_number && (
                                            <span className="flex items-center gap-1">
                                                <Phone className="size-3" />
                                                {
                                                    household.family_head
                                                        .phone_number
                                                }
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-xs text-muted-foreground italic">
                                No family head currently recorded.
                            </p>
                        )}
                    </div>

                    {/* Stats Summary */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-border/60 bg-card p-3 shadow-sm">
                            <p className="text-[11px] font-semibold text-muted-foreground uppercase">
                                Family Members
                            </p>
                            <p className="mt-1 flex items-center gap-1.5 text-lg font-bold text-foreground">
                                <Users className="size-4 text-primary" />
                                {household.members_count} residents
                            </p>
                        </div>
                        <div className="rounded-xl border border-border/60 bg-card p-3 shadow-sm">
                            <p className="text-[11px] font-semibold text-muted-foreground uppercase">
                                Submitted Date
                            </p>
                            <p className="mt-2 truncate text-xs font-medium text-foreground">
                                {household.submitted_at_formatted}
                            </p>
                        </div>
                    </div>

                    {/* Applicant Notes */}
                    {household.notes && (
                        <div className="space-y-1 rounded-xl border border-border/60 bg-card p-4 shadow-sm">
                            <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                Applicant / Internal Notes
                            </p>
                            <p className="text-xs leading-relaxed text-foreground">
                                {household.notes}
                            </p>
                        </div>
                    )}
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
                        <Link href={`/admin/households/${household.id}`}>
                            View Full Household Record
                            <ArrowRight className="size-3.5" />
                        </Link>
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
