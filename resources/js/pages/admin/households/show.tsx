import { Head, Link } from '@inertiajs/react';
import {
    Archive,
    ArrowLeft,
    ArrowRightLeft,
    CheckCircle2,
    Clock,
    ShieldAlert,
    ShieldCheck,
    Undo2,
    User,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { HouseholdVerificationModal } from '@/features/admin/households/components/household-verification-modal';
import type { HouseholdActionType } from '@/features/admin/households/components/household-verification-modal';
import { TransferHeadModal } from '@/features/admin/households/components/transfer-head-modal';
import type { SuccessorOption } from '@/features/admin/households/components/transfer-head-modal';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card';

interface MemberItem {
    id: number;
    user_id?: number | null;
    first_name: string;
    last_name: string;
    full_name: string;
    relationship_to_head: string;
    is_family_head: boolean;
    birthdate?: string | null;
    birthdate_formatted?: string | null;
    age?: number | null;
    gender: string;
    civil_status: string;
    residency_status: string;
    occupation: string;
    is_voter: boolean;
    senior_citizen_status: boolean;
    pwd_status: boolean;
    solo_parent_status: boolean;
    avatar_url?: string | null;
    is_eligible_successor: boolean;
}

interface HouseholdShowProps {
    household: {
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
        verified_at?: string | null;
        verified_at_formatted?: string | null;
        family_head: {
            id: number;
            name: string;
            email: string;
            phone_number?: string | null;
            avatar_url?: string | null;
            civil_status?: string | null;
            occupation?: string | null;
            voter_id?: string | null;
        } | null;
        verification: {
            status: string;
            reviewer_name: string;
            reviewed_at_formatted: string;
            review_notes?: string | null;
        };
        members: MemberItem[];
        successors: SuccessorOption[];
    };
    membersTitle?: string;
    canManageRestrictions: boolean;
}

export default function AdminHouseholdShow({
    household,
    membersTitle = 'Household Members',
    canManageRestrictions,
}: HouseholdShowProps) {
    const [modalAction, setModalAction] = useState<HouseholdActionType | null>(
        null,
    );
    const [isVerificationModalOpen, setIsVerificationModalOpen] =
        useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

    const isPending =
        household.status === 'unverified' || household.status === 'pending';
    const isVerified = household.status === 'verified';
    const isRestricted = household.status === 'restricted';

    const handleTriggerAction = (type: HouseholdActionType) => {
        setModalAction(type);
        setIsVerificationModalOpen(true);
    };

    return (
        <>
            <Head
                title={`Household ${household.household_code} - Barangay Admin`}
            />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
                {/* Top Action Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                        <Button
                            asChild
                            variant="outline"
                            size="icon"
                            className="size-9 rounded-xl border-border/70"
                        >
                            <Link href="/admin/households">
                                <ArrowLeft className="size-4" />
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-sm font-bold text-primary">
                                    {household.household_code}
                                </span>
                                <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                        household.status_color === 'success'
                                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                            : household.status_color ===
                                                'danger'
                                              ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400'
                                              : household.status_color ===
                                                  'info'
                                                ? 'bg-sky-500/10 text-sky-700 dark:text-sky-400'
                                                : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                                    }`}
                                >
                                    {household.status_label}
                                </span>
                            </div>
                            <h1 className="mt-0.5 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                                {household.purok_sitio} — {household.address}
                            </h1>
                        </div>
                    </div>

                    {/* Action Buttons Bar */}
                    <div className="flex flex-wrap items-center gap-2">
                        {isPending && (
                            <>
                                <Button
                                    size="sm"
                                    onClick={() =>
                                        handleTriggerAction('approve')
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
                                        handleTriggerAction('return')
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
                                        handleTriggerAction('reject')
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
                                onClick={() => handleTriggerAction('restrict')}
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
                                        handleTriggerAction('unrestrict')
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
                                        handleTriggerAction('archive')
                                    }
                                    className="gap-1.5 text-xs"
                                >
                                    <Archive className="size-3.5" />
                                    Archive Record
                                </Button>
                            </>
                        )}

                        {household.successors.length > 0 && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setIsTransferModalOpen(true)}
                                className="gap-1.5 text-xs"
                            >
                                <ArrowRightLeft className="size-3.5 text-primary" />
                                Transfer Head
                            </Button>
                        )}
                    </div>
                </div>

                {/* Main Content Bento Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Left Column: Members & Overview (8 cols) */}
                    <div className="space-y-6 lg:col-span-8">
                        {/* Household Members Table Card */}
                        <Card className="overflow-hidden rounded-2xl border-border/70 shadow-sm">
                            <CardHeader className="border-b border-border/50 bg-muted/20 px-6 py-3.5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-sm font-semibold text-foreground">
                                            {membersTitle}
                                        </CardTitle>
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            {household.members.length} members
                                        </Badge>
                                    </div>
                                    {household.successors.length > 0 && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() =>
                                                setIsTransferModalOpen(true)
                                            }
                                            className="h-7 gap-1 text-xs text-primary hover:text-primary"
                                        >
                                            <ArrowRightLeft className="size-3" />
                                            Succession
                                        </Button>
                                    )}
                                </div>
                                <CardDescription className="text-xs">
                                    Official roster of family members registered
                                    under this household record.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead>
                                            <tr className="border-b border-border/60 bg-muted/10 text-muted-foreground">
                                                <th className="px-4 py-3 font-semibold">
                                                    Full Name
                                                </th>
                                                <th className="px-4 py-3 font-semibold">
                                                    Relationship
                                                </th>
                                                <th className="px-4 py-3 font-semibold">
                                                    Age / Sex
                                                </th>
                                                <th className="px-4 py-3 font-semibold">
                                                    Civil Status
                                                </th>
                                                <th className="px-4 py-3 font-semibold">
                                                    Special Classifications
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/40">
                                            {household.members.map((member) => (
                                                <tr
                                                    key={member.id}
                                                    className="transition-colors hover:bg-muted/20"
                                                >
                                                    {/* Name */}
                                                    <td className="px-4 py-3.5 font-semibold text-foreground">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                                                {member.first_name.charAt(
                                                                    0,
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-foreground">
                                                                    {
                                                                        member.full_name
                                                                    }
                                                                </p>
                                                                {member.occupation && (
                                                                    <p className="text-[10px] text-muted-foreground">
                                                                        {
                                                                            member.occupation
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Relationship */}
                                                    <td className="px-4 py-3.5">
                                                        <span
                                                            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                                                                member.is_family_head
                                                                    ? 'border border-primary/20 bg-primary/10 text-primary'
                                                                    : 'bg-muted text-muted-foreground'
                                                            }`}
                                                        >
                                                            {
                                                                member.relationship_to_head
                                                            }
                                                        </span>
                                                    </td>

                                                    {/* Age & Sex */}
                                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                                        <span className="font-medium text-foreground">
                                                            {member.age
                                                                ? `${member.age} yrs`
                                                                : '—'}
                                                        </span>
                                                        <span className="ml-1 text-muted-foreground">
                                                            • {member.gender}
                                                        </span>
                                                    </td>

                                                    {/* Civil Status */}
                                                    <td className="px-4 py-3.5 whitespace-nowrap text-muted-foreground">
                                                        {member.civil_status}
                                                    </td>

                                                    {/* Sector Badges */}
                                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                                        <div className="flex flex-wrap items-center gap-1">
                                                            {member.is_voter && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="border-emerald-500/30 text-[10px] text-emerald-700 dark:text-emerald-400"
                                                                >
                                                                    Voter
                                                                </Badge>
                                                            )}
                                                            {member.senior_citizen_status && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="border-amber-500/30 text-[10px] text-amber-700 dark:text-amber-400"
                                                                >
                                                                    Senior
                                                                </Badge>
                                                            )}
                                                            {member.pwd_status && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="border-indigo-500/30 text-[10px] text-indigo-700 dark:text-indigo-400"
                                                                >
                                                                    PWD
                                                                </Badge>
                                                            )}
                                                            {member.solo_parent_status && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="border-rose-500/30 text-[10px] text-rose-700 dark:text-rose-400"
                                                                >
                                                                    Solo Parent
                                                                </Badge>
                                                            )}
                                                            {!member.is_voter &&
                                                                !member.senior_citizen_status &&
                                                                !member.pwd_status &&
                                                                !member.solo_parent_status && (
                                                                    <span className="text-[10px] text-muted-foreground">
                                                                        —
                                                                    </span>
                                                                )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stated Notes / Applicant Remarks */}
                        {household.notes && (
                            <Card className="rounded-2xl border-border/70 shadow-sm">
                                <CardHeader className="border-b border-border/50 bg-muted/20 px-6 py-3.5">
                                    <CardTitle className="text-sm font-semibold text-foreground">
                                        Applicant Remarks / Internal Notes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <p className="text-xs leading-relaxed text-foreground">
                                        {household.notes}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column: Family Head & Verification Trail (4 cols) */}
                    <div className="space-y-6 lg:col-span-4">
                        {/* Family Head Card */}
                        <Card className="rounded-2xl border-border/70 shadow-sm">
                            <CardHeader className="border-b border-border/50 bg-muted/20 px-4 py-3.5">
                                <CardTitle className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-foreground uppercase">
                                    <User className="size-3.5 text-primary" />
                                    Head of Household
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 p-4">
                                {household.family_head ? (
                                    <>
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary">
                                                {household.family_head.name.charAt(
                                                    0,
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-bold text-foreground">
                                                    {household.family_head.name}
                                                </p>
                                                <p className="truncate text-xs text-muted-foreground">
                                                    {
                                                        household.family_head
                                                            .email
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5 border-t border-border/50 pt-2 text-xs">
                                            <div className="flex items-center justify-between text-muted-foreground">
                                                <span>Contact:</span>
                                                <span className="font-medium text-foreground">
                                                    {household.family_head
                                                        .phone_number || '—'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-muted-foreground">
                                                <span>Civil Status:</span>
                                                <span className="font-medium text-foreground capitalize">
                                                    {household.family_head
                                                        .civil_status || '—'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-muted-foreground">
                                                <span>Occupation:</span>
                                                <span className="font-medium text-foreground">
                                                    {household.family_head
                                                        .occupation || '—'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-muted-foreground">
                                                <span>Voter ID:</span>
                                                <span className="font-medium text-foreground">
                                                    {household.family_head
                                                        .voter_id ||
                                                        'Non-voter'}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-xs text-muted-foreground italic">
                                        No head of household assigned.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Verification Status Card */}
                        <Card className="rounded-2xl border-border/70 shadow-sm">
                            <CardHeader className="border-b border-border/50 bg-muted/20 px-4 py-3.5">
                                <CardTitle className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-foreground uppercase">
                                    <Clock className="size-3.5 text-primary" />
                                    Verification & Review History
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 p-4 text-xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                        Status:
                                    </span>
                                    <span className="font-semibold text-foreground capitalize">
                                        {household.verification.status}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                        Reviewer:
                                    </span>
                                    <span className="font-medium text-foreground">
                                        {household.verification.reviewer_name}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                        Reviewed At:
                                    </span>
                                    <span className="font-medium text-foreground">
                                        {
                                            household.verification
                                                .reviewed_at_formatted
                                        }
                                    </span>
                                </div>

                                {household.verification.review_notes && (
                                    <div className="space-y-1 border-t border-border/50 pt-2">
                                        <span className="font-semibold text-muted-foreground">
                                            Review Remarks:
                                        </span>
                                        <p className="rounded-lg bg-muted/40 p-2 text-foreground italic">
                                            "
                                            {
                                                household.verification
                                                    .review_notes
                                            }
                                            "
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Verification Modal */}
            <HouseholdVerificationModal
                isOpen={isVerificationModalOpen}
                onClose={() => {
                    setIsVerificationModalOpen(false);
                    setModalAction(null);
                }}
                householdId={household.id}
                householdCode={household.household_code}
                actionType={modalAction}
            />

            {/* Succession Modal */}
            <TransferHeadModal
                isOpen={isTransferModalOpen}
                onClose={() => setIsTransferModalOpen(false)}
                householdId={household.id}
                householdCode={household.household_code}
                successors={household.successors}
            />
        </>
    );
}

AdminHouseholdShow.layout = {
    breadcrumbs: [
        { title: 'Admin Console', href: '/admin' },
        { title: 'Households', href: '/admin/households' },
    ],
};
