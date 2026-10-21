import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Bell,
    CheckCircle2,
    Clock,
    FileText,
    Home,
    PackageCheck,
    ShieldAlert,
    ShieldCheck,
    User,
    UserCheck,
} from 'lucide-react';
import { dashboard } from '@/routes';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/shared/components/ui/alert';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { useTranslation } from '@/shared/hooks/use-translation';
import type { BreadcrumbItem } from '@/shared/types';

interface DashboardProps {
    isProfileComplete: boolean;
    isHouseholdVerified: boolean;
    household: {
        id: number;
        household_code: string;
        purok_sitio: string;
        address: string;
        status: string;
        verification_notes?: string | null;
        members_count: number;
        is_family_head: boolean;
    } | null;
    documentStats: {
        total_requests: number;
        active_requests: number;
        ready_for_pickup: number;
        latest_request: {
            id: number;
            reference_code: string;
            document_name: string;
            status: string;
            status_label: string;
            status_color: string;
            submitted_at?: string | null;
        } | null;
    };
    announcements: Array<{
        id: number;
        title: string;
        slug: string;
        excerpt?: string | null;
        category: string;
        published_at?: string | null;
    }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

export default function Dashboard({
    isProfileComplete = false,
    isHouseholdVerified = false,
    household = null,
    documentStats = {
        total_requests: 0,
        active_requests: 0,
        ready_for_pickup: 0,
        latest_request: null,
    },
    announcements = [],
}: DashboardProps) {
    const { t } = useTranslation();
    const { auth } = usePage<{
        auth: {
            user: {
                name: string;
                email: string;
                can_access_admin?: boolean;
                role?: { name: string; slug: string };
            };
        };
    }>().props;
    const user = auth.user;
    const isAdminUser = Boolean(
        user.can_access_admin ??
        (user.role?.slug === 'admin' ||
            user.role?.slug === 'sub_admin' ||
            user.role?.slug === 'super_admin'),
    );

    return (
        <>
            <Head
                title={t(
                    'dashboard.title',
                    'Resident Dashboard — Barangay Lallana',
                )}
            />

            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 md:p-8">
                {/* Citizen Header & Verification Badge Banner */}
                <div className="rounded-none border border-border bg-card p-6 shadow-none">
                    <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-4">
                            <div className="flex size-14 shrink-0 items-center justify-center rounded-none bg-violet-600/10 text-violet-700 ring-1 ring-violet-600/20">
                                <UserCheck className="size-7" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                                        {t(
                                            'dashboard.greeting',
                                            { name: user.name },
                                            `Welcome, ${user.name}!`,
                                        )}
                                    </h1>
                                    <Badge
                                        variant="secondary"
                                        className="rounded-none border-violet-200/60 bg-violet-50 text-[11px] font-bold text-violet-800"
                                    >
                                        {user.role?.name ||
                                            t(
                                                'dashboard.role_resident',
                                                'Resident',
                                            )}
                                    </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground sm:text-sm">
                                    {t(
                                        'dashboard.subtitle',
                                        'Barangay Lallana E-Government Portal • Trece Martires City, Cavite',
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                            {isAdminUser && (
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="h-9 rounded-none border-violet-300 text-xs font-semibold text-violet-700 shadow-none hover:bg-violet-50"
                                >
                                    <a href="/admin">
                                        <ShieldCheck className="mr-1.5 size-4" />
                                        {t(
                                            'dashboard.admin_panel_btn',
                                            'Admin Management Panel',
                                        )}
                                    </a>
                                </Button>
                            )}
                            <Link href="/settings/profile">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-9 rounded-none text-xs text-muted-foreground hover:text-foreground"
                                >
                                    {t(
                                        'dashboard.profile_settings',
                                        'Profile Settings',
                                    )}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Profile Completion Alert Banner if Incomplete */}
                {!isProfileComplete && (
                    <Alert
                        variant="destructive"
                        className="rounded-none border-destructive/30 bg-destructive/5 p-5 shadow-none"
                    >
                        <ShieldAlert className="size-5" color="#ef4444" />
                        <div className="flex w-full flex-col justify-between gap-3 text-black sm:flex-row sm:items-center">
                            <div>
                                <AlertTitle className="font-semibold">
                                    {t(
                                        'dashboard.kyc_incomplete_title',
                                        'Resident KYC Profile Incomplete',
                                    )}
                                </AlertTitle>
                                <AlertDescription className="mt-1 text-xs text-muted-foreground">
                                    {t(
                                        'dashboard.kyc_incomplete_desc',
                                        'Please complete your demographic profile and upload a valid government ID to unlock official document requesting and household registration.',
                                    )}
                                </AlertDescription>
                            </div>
                            <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="shrink-0 rounded-none bg-card text-xs font-semibold text-foreground shadow-none hover:bg-muted"
                            >
                                <Link href="/settings/profile">
                                    {t(
                                        'dashboard.complete_profile_btn',
                                        'Complete Profile Now →',
                                    )}
                                </Link>
                            </Button>
                        </div>
                    </Alert>
                )}

                {/* Ready for Pickup Alert Banner */}
                {documentStats.ready_for_pickup > 0 && (
                    <div className="flex flex-col justify-between gap-4 rounded-none border border-emerald-500/30 bg-emerald-500/5 p-5 shadow-none sm:flex-row sm:items-center">
                        <div className="flex items-start gap-3.5">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-none bg-emerald-600/10 text-emerald-600">
                                <PackageCheck className="size-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-emerald-950">
                                    {t(
                                        'dashboard.ready_pickup',
                                        'Official Document Ready for Pickup!',
                                    )}
                                </h4>
                                <p className="mt-0.5 text-xs text-emerald-800">
                                    {documentStats.ready_for_pickup === 1
                                        ? 'Mayroon kang 1 dokumentong handa nang kunin sa Barangay Lallana Hall.'
                                        : `Mayroon kang ${documentStats.ready_for_pickup} mga dokumentong handa nang kunin sa Barangay Lallana Hall.`}
                                </p>
                            </div>
                        </div>
                        <Button
                            asChild
                            size="sm"
                            className="shrink-0 rounded-none bg-emerald-600 text-xs font-semibold text-white shadow-none hover:bg-emerald-700"
                        >
                            <Link href="/documents">
                                {t(
                                    'documents.view_details',
                                    'View Claim Details →',
                                )}
                            </Link>
                        </Button>
                    </div>
                )}

                {/* Asymmetrical Bento Grid: Operations & Services */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Left Column: Live Document Request Queue & Fast Actions (8 Cols) */}
                    <div className="space-y-6 lg:col-span-8">
                        {/* Latest Request Tracker Card */}
                        <div className="space-y-5 rounded-none border border-border bg-card p-6 shadow-none">
                            <div className="flex items-center justify-between border-b border-border/70 pb-4">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex size-9 items-center justify-center rounded-none bg-violet-600/10 text-violet-700">
                                        <FileText className="size-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-foreground">
                                            {t(
                                                'dashboard.active_requests_title',
                                                'Active Document Requests',
                                            )}
                                        </h3>
                                        <span className="text-[11px] text-muted-foreground">
                                            {t(
                                                'dashboard.quick_actions_subtitle',
                                                'Real-time processing queue & status progression',
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <Link href="/documents">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 rounded-none text-xs font-medium text-violet-700 hover:bg-violet-50"
                                    >
                                        {t(
                                            'dashboard.view_all_requests',
                                            'All Requests',
                                        )}{' '}
                                        ({documentStats.total_requests})
                                        <ArrowRight className="ml-1 size-3.5" />
                                    </Button>
                                </Link>
                            </div>

                            {documentStats.latest_request ? (
                                <div className="space-y-4 rounded-none border border-border bg-muted/20 p-5">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div>
                                            <span className="font-mono text-xs font-bold text-violet-700">
                                                {
                                                    documentStats.latest_request
                                                        .reference_code
                                                }
                                            </span>
                                            <h4 className="text-base font-extrabold text-foreground">
                                                {
                                                    documentStats.latest_request
                                                        .document_name
                                                }
                                            </h4>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className="rounded-none border-violet-300 bg-violet-50 text-xs font-semibold text-violet-800 capitalize"
                                        >
                                            {documentStats.latest_request
                                                .status_label ||
                                                documentStats.latest_request
                                                    .status}
                                        </Badge>
                                    </div>

                                    {/* Status Progression Stepper */}
                                    <div className="pt-2">
                                        <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-semibold">
                                            {[
                                                {
                                                    label: 'Submitted',
                                                    key: 'submitted',
                                                },
                                                {
                                                    label: 'Review',
                                                    key: 'review',
                                                },
                                                {
                                                    label: 'Processing',
                                                    key: 'processing',
                                                },
                                                {
                                                    label: 'Ready',
                                                    key: 'ready',
                                                },
                                            ].map((step, idx) => {
                                                const stepStatus =
                                                    documentStats.latest_request
                                                        ?.status;
                                                const isCompleted =
                                                    idx === 0 ||
                                                    (idx === 1 &&
                                                        [
                                                            'under_review',
                                                            'processing',
                                                            'ready_for_pickup',
                                                            'completed',
                                                        ].includes(
                                                            stepStatus || '',
                                                        )) ||
                                                    (idx === 2 &&
                                                        [
                                                            'processing',
                                                            'ready_for_pickup',
                                                            'completed',
                                                        ].includes(
                                                            stepStatus || '',
                                                        )) ||
                                                    (idx === 3 &&
                                                        [
                                                            'ready_for_pickup',
                                                            'completed',
                                                        ].includes(
                                                            stepStatus || '',
                                                        ));

                                                return (
                                                    <div
                                                        key={step.key}
                                                        className="space-y-1.5"
                                                    >
                                                        <div
                                                            className={`h-1.5 rounded-none transition-all ${
                                                                isCompleted
                                                                    ? 'bg-violet-600'
                                                                    : 'bg-border'
                                                            }`}
                                                        />
                                                        <span
                                                            className={
                                                                isCompleted
                                                                    ? 'font-semibold text-foreground'
                                                                    : 'text-muted-foreground'
                                                            }
                                                        >
                                                            {step.label}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-border/70 pt-3 text-[11px] text-muted-foreground">
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="size-3.5" />
                                            {t(
                                                'dashboard.submitted_on',
                                                'Submitted:',
                                            )}{' '}
                                            <strong className="font-mono font-semibold text-foreground">
                                                {documentStats.latest_request
                                                    .submitted_at || 'Recently'}
                                            </strong>
                                        </span>
                                        <Link
                                            href={`/documents/${documentStats.latest_request.id}`}
                                            className="font-medium text-violet-700 hover:underline"
                                        >
                                            {t(
                                                'dashboard.track_status',
                                                'View Tracking Details →',
                                            )}
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3 rounded-none border border-dashed border-border p-8 text-center">
                                    <div className="mx-auto flex size-12 items-center justify-center rounded-none bg-muted text-muted-foreground">
                                        <FileText className="size-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-foreground">
                                            {t(
                                                'dashboard.no_requests_title',
                                                'No Pending Document Requests',
                                            )}
                                        </h4>
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            {t(
                                                'dashboard.no_requests_desc',
                                                'Need a Barangay Clearance, Certificate of Indigency, or Residency? Submit an online request in seconds.',
                                            )}
                                        </p>
                                    </div>
                                    {isHouseholdVerified ? (
                                        <Button
                                            asChild
                                            size="sm"
                                            className="mt-2 rounded-none bg-violet-600 text-xs font-semibold text-white shadow-none hover:bg-violet-700"
                                        >
                                            <Link href="/documents/create">
                                                {t(
                                                    'dashboard.new_request_btn',
                                                    'Request a Document Now',
                                                )}
                                            </Link>
                                        </Button>
                                    ) : (
                                        <p className="text-[11px] font-medium text-amber-700">
                                            🔒{' '}
                                            {t(
                                                'dashboard.unregistered_household_desc',
                                                'Requires a verified household registration.',
                                            )}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Fast Service Action Tiles */}
                            <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-3">
                                <Link
                                    href="/documents/create"
                                    className="group flex flex-col justify-between rounded-none border border-border bg-card p-4 shadow-none transition-all hover:border-violet-600"
                                >
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-violet-700 uppercase">
                                            {t(
                                                'dashboard.action_request_doc',
                                                'Fast Request',
                                            )}
                                        </span>
                                        <h4 className="text-xs font-bold text-foreground">
                                            Barangay Clearance
                                        </h4>
                                        <p className="text-[11px] text-muted-foreground">
                                            For employment & postal IDs
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 text-xs font-semibold text-violet-700">
                                        <span>
                                            {t(
                                                'landing.services.request_now',
                                                'Apply Online',
                                            )}
                                        </span>
                                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </Link>

                                <Link
                                    href="/documents/create"
                                    className="group flex flex-col justify-between rounded-none border border-border bg-card p-4 shadow-none transition-all hover:border-violet-600"
                                >
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-violet-700 uppercase">
                                            {t(
                                                'dashboard.action_request_doc',
                                                'Assistance',
                                            )}
                                        </span>
                                        <h4 className="text-xs font-bold text-foreground">
                                            Certificate of Indigency
                                        </h4>
                                        <p className="text-[11px] text-muted-foreground">
                                            Medical & educational assistance
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 text-xs font-semibold text-violet-700">
                                        <span>
                                            {t(
                                                'landing.services.request_now',
                                                'Apply Online',
                                            )}
                                        </span>
                                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </Link>

                                <Link
                                    href="/documents/create"
                                    className="group flex flex-col justify-between rounded-none border border-border bg-card p-4 shadow-none transition-all hover:border-violet-600"
                                >
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-violet-700 uppercase">
                                            {t(
                                                'dashboard.action_verify',
                                                'Verification',
                                            )}
                                        </span>
                                        <h4 className="text-xs font-bold text-foreground">
                                            Certificate of Residency
                                        </h4>
                                        <p className="text-[11px] text-muted-foreground">
                                            Official proof of local residence
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 text-xs font-semibold text-violet-700">
                                        <span>
                                            {t(
                                                'landing.services.request_now',
                                                'Apply Online',
                                            )}
                                        </span>
                                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Household Registry & KYC Status (4 Cols) */}
                    <div className="space-y-6 lg:col-span-4">
                        {/* Household Record Card */}
                        <div className="space-y-4 rounded-none border border-border bg-card p-6 shadow-none">
                            <div className="flex items-center justify-between border-b border-border/70 pb-3">
                                <div className="flex items-center gap-2">
                                    <Home className="size-4 text-violet-600" />
                                    <h3 className="text-sm font-bold text-foreground">
                                        {t(
                                            'dashboard.household_title',
                                            'Household Record',
                                        )}
                                    </h3>
                                </div>
                                {household && (
                                    <Badge
                                        variant={
                                            household.status === 'verified'
                                                ? 'default'
                                                : 'outline'
                                        }
                                        className={`rounded-none text-[10px] font-bold uppercase ${
                                            household.status === 'verified'
                                                ? 'bg-emerald-600 text-white'
                                                : 'border-amber-300 text-amber-700'
                                        }`}
                                    >
                                        {household.status === 'verified'
                                            ? t('common.verified', 'Verified')
                                            : t('common.pending', 'Pending')}
                                    </Badge>
                                )}
                            </div>

                            {household ? (
                                <div className="space-y-3">
                                    <div className="space-y-1 rounded-none bg-muted/40 p-3">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">
                                            {t(
                                                'dashboard.household_code',
                                                'Official Household Code',
                                            )}
                                        </span>
                                        <span className="block font-mono text-sm font-extrabold text-foreground">
                                            {household.household_code}
                                        </span>
                                        <span className="block text-xs text-muted-foreground">
                                            {household.purok_sitio} •{' '}
                                            {household.address}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="rounded-none border border-border p-2.5">
                                            <span className="text-[10px] text-muted-foreground">
                                                {t(
                                                    'dashboard.members_count',
                                                    'Registered Members',
                                                )}
                                            </span>
                                            <span className="block font-mono text-base font-bold text-foreground">
                                                {household.members_count}
                                            </span>
                                        </div>
                                        <div className="rounded-none border border-border p-2.5">
                                            <span className="text-[10px] text-muted-foreground">
                                                {t(
                                                    'dashboard.family_head',
                                                    'Your Role',
                                                )}
                                            </span>
                                            <span className="block text-xs font-bold text-foreground">
                                                {household.is_family_head
                                                    ? t(
                                                          'dashboard.family_head',
                                                          'Family Head',
                                                      )
                                                    : 'Member'}
                                            </span>
                                        </div>
                                    </div>

                                    <Button
                                        asChild
                                        variant="outline"
                                        size="sm"
                                        className="w-full rounded-none text-xs font-semibold shadow-none hover:bg-muted"
                                    >
                                        <Link href="/household">
                                            {t(
                                                'dashboard.view_household_btn',
                                                'Manage Household & Members →',
                                            )}
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3 pt-1">
                                    <p className="text-xs leading-relaxed text-muted-foreground">
                                        {t(
                                            'dashboard.unregistered_household_desc',
                                            'Establish your registered family household unit to enable certificate requesting and community benefits.',
                                        )}
                                    </p>
                                    <Button
                                        asChild
                                        size="sm"
                                        className="w-full rounded-none bg-violet-600 text-xs font-semibold text-white shadow-none hover:bg-violet-700"
                                    >
                                        <Link href="/household/register">
                                            {t(
                                                'dashboard.register_household_btn',
                                                'Register Family Household',
                                            )}
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Resident KYC Demographics Card */}
                        <div className="space-y-3.5 rounded-none border border-border bg-card p-6 shadow-none">
                            <div className="flex items-center justify-between border-b border-border/70 pb-3">
                                <div className="flex items-center gap-2">
                                    <User className="size-4 text-violet-600" />
                                    <h3 className="text-sm font-bold text-foreground">
                                        Resident KYC Profile
                                    </h3>
                                </div>
                                <Badge
                                    variant={
                                        isProfileComplete
                                            ? 'default'
                                            : 'destructive'
                                    }
                                    className="rounded-none text-[10px] font-bold uppercase"
                                >
                                    {isProfileComplete
                                        ? t('common.verified', 'Verified')
                                        : t('common.pending', 'Pending ID')}
                                </Badge>
                            </div>

                            <div className="space-y-2 text-xs">
                                <div className="flex items-center justify-between border-b border-border/50 py-1.5 text-muted-foreground">
                                    <span>Full Legal Name:</span>
                                    <span className="font-semibold text-foreground">
                                        {user.name}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-b border-border/50 py-1.5 text-muted-foreground">
                                    <span>Official Email:</span>
                                    <span className="font-mono text-foreground">
                                        {user.email}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-1 text-muted-foreground">
                                    <span>Citizen Verification:</span>
                                    <span className="flex items-center gap-1 font-semibold text-emerald-600">
                                        <CheckCircle2 className="size-3.5" />
                                        {isProfileComplete
                                            ? t('common.verified', 'Complete')
                                            : 'Action Required'}
                                    </span>
                                </div>
                            </div>

                            <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="w-full rounded-none text-xs font-semibold shadow-none hover:bg-muted"
                            >
                                <Link href="/settings/profile">
                                    {t(
                                        'dashboard.profile_settings',
                                        'View Identity Details →',
                                    )}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Section: Official Barangay Advisories & Bulletins */}
                <div className="space-y-4 rounded-none border border-border bg-card p-6 shadow-none">
                    <div className="flex items-center justify-between border-b border-border/70 pb-3">
                        <div className="flex items-center gap-2">
                            <Bell className="size-4 text-violet-600" />
                            <h3 className="text-sm font-bold text-foreground">
                                {t(
                                    'dashboard.recent_announcements',
                                    'Official Barangay Advisories',
                                )}
                            </h3>
                        </div>
                        <Link
                            href="/announcements"
                            className="flex items-center gap-1 text-xs font-semibold text-violet-700 hover:underline"
                        >
                            {t(
                                'dashboard.view_all_announcements',
                                'Public Bulletin Board',
                            )}{' '}
                            <ArrowRight className="size-3" />
                        </Link>
                    </div>

                    {announcements.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {announcements.map((announcement) => (
                                <Link
                                    key={announcement.id}
                                    href={`/announcements/${announcement.slug}`}
                                    className="group flex flex-col justify-between rounded-none border border-border bg-card p-4 shadow-none transition-all hover:border-violet-600"
                                >
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <Badge
                                                variant="outline"
                                                className="rounded-none border-violet-200 bg-violet-50 text-[10px] font-bold text-violet-800 uppercase"
                                            >
                                                {announcement.category}
                                            </Badge>
                                            {announcement.published_at && (
                                                <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                                                    <Clock className="size-2.5" />
                                                    {new Date(
                                                        announcement.published_at,
                                                    ).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="line-clamp-1 text-sm font-bold text-foreground">
                                            {announcement.title}
                                        </h4>
                                        {announcement.excerpt && (
                                            <p className="line-clamp-2 text-xs text-muted-foreground">
                                                {announcement.excerpt}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="py-4 text-center text-xs text-muted-foreground">
                            {t(
                                'dashboard.no_announcements',
                                'No active municipal advisories posted at this time.',
                            )}
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs,
};
