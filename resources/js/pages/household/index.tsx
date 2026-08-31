import { Head, Link } from '@inertiajs/react';
import { FileText, Home, MapPin, Plus, UserCheck, Users } from 'lucide-react';
import { AddMemberDialog } from '@/features/household/components/add-member-dialog';
import { LockedModuleCard } from '@/features/household/components/locked-module-card';
import { MemberListTable } from '@/features/household/components/member-list-table';
import type { MemberItem } from '@/features/household/components/member-list-table';
import { TransferHeadDialog } from '@/features/household/components/transfer-head-dialog';
import { VerificationStatusBanner } from '@/features/household/components/verification-status-banner';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card';
import type { BreadcrumbItem } from '@/shared/types';

interface HouseholdData {
    id: number;
    household_code: string;
    address: string;
    purok_sitio: string;
    status: string;
    notes?: string | null;
    submitted_at?: string | null;
    verified_at?: string | null;
    family_head: {
        id: number;
        name: string;
        email: string;
        phone_number?: string | null;
        avatar_url?: string | null;
    };
    verification?: {
        status: string;
        review_notes?: string | null;
        reviewed_at?: string | null;
        reviewer_name?: string | null;
    } | null;
    members: MemberItem[];
}

interface HouseholdIndexProps {
    household: HouseholdData | null;
    isFamilyHead: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'My Household', href: '/household' },
];

export default function HouseholdIndex({
    household,
    isFamilyHead,
}: HouseholdIndexProps) {
    return (
        <>
            <Head title="My Household" />

            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 md:p-8">
                {!household ? (
                    // Empty State: Not Registered
                    <Card className="mx-auto max-w-2xl rounded-2xl border-border p-8 text-center">
                        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <Home className="size-7" />
                        </div>
                        <CardTitle className="text-xl font-bold">
                            No Household Registered
                        </CardTitle>
                        <CardDescription className="mt-2 text-sm">
                            You are not yet registered under an official
                            Barangay Lallana household record. Establish your
                            family household as Family Head to unlock clearance
                            issuance, certifications, and household management.
                        </CardDescription>
                        <div className="mt-6 flex justify-center">
                            <Button asChild size="lg" className="gap-2">
                                <Link href="/household/register">
                                    <Plus className="size-4" />
                                    Register New Household
                                </Link>
                            </Button>
                        </div>
                    </Card>
                ) : (
                    // Registered Household View
                    <div className="space-y-6">
                        {/* Verification Status Banner */}
                        <VerificationStatusBanner
                            status={household.status}
                            householdCode={household.household_code}
                            reviewNotes={household.verification?.review_notes}
                            isFamilyHead={isFamilyHead}
                        />

                        {/* Household Summary Card */}
                        <Card className="rounded-2xl border-border">
                            <CardHeader className="pb-4">
                                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                    <div>
                                        <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                            <Home className="size-5 text-primary" />
                                            Household {household.household_code}
                                        </CardTitle>
                                        <CardDescription className="mt-1 flex items-center gap-1.5 text-xs">
                                            <MapPin className="size-3.5 text-muted-foreground" />
                                            {household.address},{' '}
                                            {household.purok_sitio}, Barangay
                                            Lallana
                                        </CardDescription>
                                    </div>

                                    <Badge
                                        variant={
                                            household.status === 'verified'
                                                ? 'default'
                                                : 'outline'
                                        }
                                        className="self-start capitalize sm:self-auto"
                                    >
                                        {household.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-0">
                                <div className="grid gap-3 rounded-xl bg-muted/40 p-4 text-xs sm:grid-cols-3">
                                    <div>
                                        <span className="block text-muted-foreground">
                                            Designated Family Head
                                        </span>
                                        <span className="text-sm font-semibold text-foreground">
                                            {household.family_head.name}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-muted-foreground">
                                            Submitted On
                                        </span>
                                        <span className="font-semibold text-foreground">
                                            {household.submitted_at
                                                ? new Date(
                                                      household.submitted_at,
                                                  ).toLocaleDateString()
                                                : '—'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-muted-foreground">
                                            Total Family Members
                                        </span>
                                        <span className="text-sm font-semibold text-foreground">
                                            {household.members.length}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Family Members Section */}
                        <Card className="rounded-2xl border-border">
                            <CardHeader className="pb-4">
                                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                    <div>
                                        <CardTitle className="flex items-center gap-2 text-base font-bold">
                                            <Users className="size-5 text-primary" />
                                            Household Members (
                                            {household.members.length})
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            Registered family members and
                                            dependents under this household.
                                        </CardDescription>
                                    </div>

                                    {isFamilyHead &&
                                        household.status === 'verified' && (
                                            <div className="flex flex-wrap items-center gap-2">
                                                <TransferHeadDialog
                                                    members={household.members}
                                                />
                                                <AddMemberDialog />
                                            </div>
                                        )}
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <MemberListTable
                                    members={household.members}
                                    isFamilyHead={isFamilyHead}
                                    householdStatus={household.status}
                                />
                            </CardContent>
                        </Card>

                        {/* Locked Modules if unverified */}
                        {household.status !== 'verified' && (
                            <div className="grid gap-4 pt-2 md:grid-cols-2">
                                <LockedModuleCard
                                    title="Barangay Document Requests"
                                    description="Request official Barangay Clearance, Barangay Certificate, and Certificate of Indigency."
                                    icon={<FileText className="size-6" />}
                                    reason="Requires verified household status."
                                />
                                <LockedModuleCard
                                    title="Add Family Members"
                                    description="Add immediate family members and dependents to this household record."
                                    icon={<UserCheck className="size-6" />}
                                    reason="Available after initial household approval."
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

HouseholdIndex.layout = {
    breadcrumbs,
};
