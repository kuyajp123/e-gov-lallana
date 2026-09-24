import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ExternalLink,
    FileText,
    Home,
    Trash2,
    Vote,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card';
import { DeleteResidentModal } from './components/delete-resident-modal';

interface ResidentProfileDetails {
    id: number;
    full_name: string;
    first_name: string;
    middle_name?: string | null;
    last_name: string;
    suffix?: string | null;
    birthdate?: string | null;
    birthdate_formatted?: string | null;
    age?: number | null;
    gender: string;
    civil_status: string;
    citizenship: string;
    religion: string;
    residency_status: string;
    date_of_residency?: string | null;
    occupation: string;
    educational_attainment: string;
    employment_status: string;
    is_voter: boolean;
    voter_id_number?: string | null;
    senior_citizen_status: boolean;
    pwd_status: boolean;
    pwd_id_number?: string | null;
    solo_parent_status: boolean;
    solo_parent_id_number?: string | null;
    avatar_url?: string | null;
    government_id: {
        file_name: string;
        url: string;
        mime_type: string;
    } | null;
    user: {
        id: number;
        name: string;
        email: string;
        phone_number?: string | null;
        created_at_formatted?: string | null;
    };
    household: {
        id: number;
        household_code: string;
        address: string;
        purok_sitio: string;
        relationship_to_head: string;
        is_family_head: boolean;
        members_count?: number;
    } | null;
    active_requests_count?: number;
    is_staff?: boolean;
    can_delete?: boolean;
}

interface AdminResidentShowProps {
    residentProfile: ResidentProfileDetails;
    sections?: {
        personal: string;
        account: string;
    };
}

export default function AdminResidentShow({
    residentProfile,
    sections = {
        personal: 'Personal Information',
        account: 'Account & Contact Information',
    },
}: AdminResidentShowProps) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    return (
        <>
            <Head
                title={`Citizen Profile: ${residentProfile.full_name} - Barangay Admin`}
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
                            <Link href="/admin/resident-profiles">
                                <ArrowLeft className="size-4" />
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                    Citizen Civil Dossier
                                </span>
                                <Badge variant="outline" className="text-xs">
                                    {residentProfile.residency_status}
                                </Badge>
                                {residentProfile.is_staff && (
                                    <Badge
                                        variant="outline"
                                        className="border-amber-500/40 bg-amber-500/10 text-xs font-semibold text-amber-700 dark:text-amber-400"
                                    >
                                        Staff Account (Protected)
                                    </Badge>
                                )}
                            </div>
                            <h1 className="mt-0.5 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                                {residentProfile.full_name}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {residentProfile.household && (
                            <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="gap-1.5 text-xs"
                            >
                                <Link
                                    href={`/admin/households/${residentProfile.household.id}`}
                                >
                                    <Home className="size-3.5 text-primary" />
                                    Household{' '}
                                    {residentProfile.household.household_code}
                                </Link>
                            </Button>
                        )}

                        {residentProfile.can_delete && (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="gap-1.5 text-xs"
                            >
                                <Trash2 className="size-3.5" />
                                <span>Delete Resident</span>
                            </Button>
                        )}

                        {residentProfile.is_staff && (
                            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-2.5 py-1 text-[11px] text-amber-700 dark:text-amber-400">
                                Protected Staff Account
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Bento Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Left Column: Personal Info & Community (8 cols) */}
                    <div className="space-y-6 lg:col-span-8">
                        {/* Personal Information Card */}
                        <Card className="rounded-2xl border-border/70 shadow-sm">
                            <CardHeader className="border-b border-border/50 bg-muted/20 px-6 py-3.5">
                                <CardTitle className="text-sm font-semibold text-foreground">
                                    {sections.personal}
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Primary identity and demographic data
                                    recorded in official civil records.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 gap-6 text-xs sm:grid-cols-3">
                                    <div>
                                        <span className="text-muted-foreground">
                                            Full Legal Name
                                        </span>
                                        <p className="mt-0.5 text-sm font-bold text-foreground">
                                            {residentProfile.full_name}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">
                                            Date of Birth
                                        </span>
                                        <p className="mt-0.5 font-semibold text-foreground">
                                            {residentProfile.birthdate_formatted ||
                                                '—'}
                                            {residentProfile.age
                                                ? ` (${residentProfile.age} yrs)`
                                                : ''}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">
                                            Sex / Gender
                                        </span>
                                        <p className="mt-0.5 font-semibold text-foreground">
                                            {residentProfile.gender}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">
                                            Civil Status
                                        </span>
                                        <p className="mt-0.5 font-semibold text-foreground">
                                            {residentProfile.civil_status}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">
                                            Citizenship
                                        </span>
                                        <p className="mt-0.5 font-semibold text-foreground">
                                            {residentProfile.citizenship}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">
                                            Religion
                                        </span>
                                        <p className="mt-0.5 font-semibold text-foreground">
                                            {residentProfile.religion}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Account & Contact Information Card */}
                        <Card className="rounded-2xl border-border/70 shadow-sm">
                            <CardHeader className="border-b border-border/50 bg-muted/20 px-6 py-3.5">
                                <CardTitle className="text-sm font-semibold text-foreground">
                                    {sections.account}
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    System user account links and verified
                                    contact channels.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 gap-6 text-xs sm:grid-cols-3">
                                    <div>
                                        <span className="text-muted-foreground">
                                            User Account Name
                                        </span>
                                        <p className="mt-0.5 font-semibold text-foreground">
                                            {residentProfile.user.name}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">
                                            Email Address
                                        </span>
                                        <p className="mt-0.5 font-semibold text-foreground">
                                            {residentProfile.user.email}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">
                                            Phone Number
                                        </span>
                                        <p className="mt-0.5 font-semibold text-foreground">
                                            {residentProfile.user
                                                .phone_number ||
                                                'None registered'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Community & Residency Details Card */}
                        <Card className="rounded-2xl border-border/70 shadow-sm">
                            <CardHeader className="border-b border-border/50 bg-muted/20 px-6 py-3.5">
                                <CardTitle className="text-sm font-semibold text-foreground">
                                    Community & Residency Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 gap-6 text-xs sm:grid-cols-3">
                                    <div>
                                        <span className="text-muted-foreground">
                                            Residency Status
                                        </span>
                                        <p className="mt-0.5 font-semibold text-foreground">
                                            {residentProfile.residency_status}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">
                                            Resident Since
                                        </span>
                                        <p className="mt-0.5 font-semibold text-foreground">
                                            {residentProfile.date_of_residency ||
                                                '—'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">
                                            Educational Attainment
                                        </span>
                                        <p className="mt-0.5 font-semibold text-foreground">
                                            {
                                                residentProfile.educational_attainment
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">
                                            Primary Occupation
                                        </span>
                                        <p className="mt-0.5 font-semibold text-foreground">
                                            {residentProfile.occupation}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">
                                            Employment Status
                                        </span>
                                        <p className="mt-0.5 font-semibold text-foreground">
                                            {residentProfile.employment_status}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Government ID & Uploads */}
                        <Card className="rounded-2xl border-border/70 shadow-sm">
                            <CardHeader className="border-b border-border/50 bg-muted/20 px-6 py-3.5">
                                <CardTitle className="text-sm font-semibold text-foreground">
                                    Attached Government ID & Proof of Identity
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                {residentProfile.government_id ? (
                                    <div className="flex flex-col items-start gap-4 sm:flex-row">
                                        <div className="max-w-sm overflow-hidden rounded-xl border border-border/60 bg-muted/20">
                                            {residentProfile.government_id.mime_type.startsWith(
                                                'image/',
                                            ) ? (
                                                <img
                                                    src={
                                                        residentProfile
                                                            .government_id.url
                                                    }
                                                    alt="Government ID"
                                                    className="h-auto max-h-56 w-full object-cover"
                                                />
                                            ) : (
                                                <div className="p-8 text-center">
                                                    <FileText className="mx-auto size-10 text-primary" />
                                                    <p className="mt-2 text-xs font-semibold text-foreground">
                                                        {
                                                            residentProfile
                                                                .government_id
                                                                .file_name
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs font-semibold text-foreground">
                                                {
                                                    residentProfile
                                                        .government_id.file_name
                                                }
                                            </p>
                                            <p className="text-[11px] text-muted-foreground">
                                                Uploaded during citizen KYC
                                                verification.
                                            </p>
                                            <Button
                                                asChild
                                                size="sm"
                                                variant="outline"
                                                className="gap-1.5 text-xs"
                                            >
                                                <a
                                                    href={
                                                        residentProfile
                                                            .government_id.url
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <ExternalLink className="size-3.5" />
                                                    View Original Document
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-xs text-muted-foreground italic">
                                        No separate government ID image uploaded
                                        on this profile.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Special Statuses & Household Info (4 cols) */}
                    <div className="space-y-6 lg:col-span-4">
                        {/* Special Statuses & IDs Card */}
                        <Card className="rounded-2xl border-border/70 shadow-sm">
                            <CardHeader className="border-b border-border/50 bg-muted/20 px-4 py-3.5">
                                <CardTitle className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-foreground uppercase">
                                    <Vote className="size-3.5 text-primary" />
                                    Special Statuses & IDs
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 p-4 text-xs">
                                <div className="flex items-center justify-between border-b border-border/40 py-1.5">
                                    <span className="text-muted-foreground">
                                        Registered Voter:
                                    </span>
                                    <span className="font-semibold text-foreground">
                                        {residentProfile.is_voter ? (
                                            <span className="text-emerald-600 dark:text-emerald-400">
                                                Yes
                                            </span>
                                        ) : (
                                            'No'
                                        )}
                                    </span>
                                </div>
                                {residentProfile.is_voter && (
                                    <div className="flex items-center justify-between border-b border-border/40 py-1.5">
                                        <span className="text-muted-foreground">
                                            Voter ID Number:
                                        </span>
                                        <span className="font-mono font-medium text-foreground">
                                            {residentProfile.voter_id_number ||
                                                'Not recorded'}
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between border-b border-border/40 py-1.5">
                                    <span className="text-muted-foreground">
                                        Senior Citizen:
                                    </span>
                                    <span className="font-semibold text-foreground">
                                        {residentProfile.senior_citizen_status ? (
                                            <span className="text-amber-600 dark:text-amber-400">
                                                Yes
                                            </span>
                                        ) : (
                                            'No'
                                        )}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between border-b border-border/40 py-1.5">
                                    <span className="text-muted-foreground">
                                        Person with Disability (PWD):
                                    </span>
                                    <span className="font-semibold text-foreground">
                                        {residentProfile.pwd_status ? (
                                            <span className="text-indigo-600 dark:text-indigo-400">
                                                Yes
                                            </span>
                                        ) : (
                                            'No'
                                        )}
                                    </span>
                                </div>
                                {residentProfile.pwd_status &&
                                    residentProfile.pwd_id_number && (
                                        <div className="flex items-center justify-between border-b border-border/40 py-1.5">
                                            <span className="text-muted-foreground">
                                                PWD ID Number:
                                            </span>
                                            <span className="font-mono font-medium text-foreground">
                                                {residentProfile.pwd_id_number}
                                            </span>
                                        </div>
                                    )}

                                <div className="flex items-center justify-between py-1.5">
                                    <span className="text-muted-foreground">
                                        Solo Parent:
                                    </span>
                                    <span className="font-semibold text-foreground">
                                        {residentProfile.solo_parent_status ? (
                                            <span className="text-rose-600 dark:text-rose-400">
                                                Yes
                                            </span>
                                        ) : (
                                            'No'
                                        )}
                                    </span>
                                </div>
                                {residentProfile.solo_parent_status &&
                                    residentProfile.solo_parent_id_number && (
                                        <div className="flex items-center justify-between border-t border-border/40 py-1.5">
                                            <span className="text-muted-foreground">
                                                Solo Parent ID:
                                            </span>
                                            <span className="font-mono font-medium text-foreground">
                                                {
                                                    residentProfile.solo_parent_id_number
                                                }
                                            </span>
                                        </div>
                                    )}
                            </CardContent>
                        </Card>

                        {/* Household Association Card */}
                        <Card className="rounded-2xl border-border/70 shadow-sm">
                            <CardHeader className="border-b border-border/50 bg-muted/20 px-4 py-3.5">
                                <CardTitle className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-foreground uppercase">
                                    <Home className="size-3.5 text-primary" />
                                    Household Association
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 p-4 text-xs">
                                {residentProfile.household ? (
                                    <>
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">
                                                Household Code:
                                            </span>
                                            <Link
                                                href={`/admin/households/${residentProfile.household.id}`}
                                                className="font-mono font-bold text-primary hover:underline"
                                            >
                                                {
                                                    residentProfile.household
                                                        .household_code
                                                }
                                            </Link>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">
                                                Purok / Sitio:
                                            </span>
                                            <span className="font-medium text-foreground">
                                                {
                                                    residentProfile.household
                                                        .purok_sitio
                                                }
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">
                                                Address:
                                            </span>
                                            <span className="max-w-[150px] truncate font-medium text-foreground">
                                                {
                                                    residentProfile.household
                                                        .address
                                                }
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">
                                                Family Role:
                                            </span>
                                            <span className="font-semibold text-foreground">
                                                {
                                                    residentProfile.household
                                                        .relationship_to_head
                                                }
                                                {residentProfile.household
                                                    .is_family_head
                                                    ? ' (Head)'
                                                    : ''}
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-xs text-muted-foreground italic">
                                        This resident is not currently linked to
                                        a verified household.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {residentProfile.can_delete && (
                <DeleteResidentModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    residentId={residentProfile.id}
                    fullName={residentProfile.full_name}
                    householdCode={residentProfile.household?.household_code}
                    isSoleMember={
                        residentProfile.household
                            ? residentProfile.household.members_count === 1
                            : false
                    }
                    hasHousehold={Boolean(residentProfile.household)}
                    activeRequestsCount={
                        residentProfile.active_requests_count ?? 0
                    }
                />
            )}
        </>
    );
}

AdminResidentShow.layout = {
    breadcrumbs: [
        { title: 'Admin Console', href: '/admin' },
        { title: 'Resident Registry', href: '/admin/resident-profiles' },
    ],
};
