import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Bell,
    CheckCircle2,
    Clock,
    FileCheck,
    FileText,
    Home,
    PackageCheck,
    QrCode,
    ShieldAlert,
    ShieldCheck,
    Sparkles,
    User,
    UserCheck,
    Users,
} from 'lucide-react';
import { dashboard } from '@/routes';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/shared/components/ui/alert';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
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
            <Head title="Resident Dashboard — Barangay Lallana" />

            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 md:p-8">
                {/* Citizen Header & Verification Badge Banner */}
                <div className="bezel-outer">
                    <div className="bezel-inner flex flex-col justify-between gap-6 p-6 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-4">
                            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-violet-600/10 text-violet-700 ring-1 ring-violet-600/20 dark:bg-violet-400/10 dark:text-violet-300">
                                <UserCheck className="size-7" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                                        Mabuhay, {user.name}!
                                    </h1>
                                    <Badge
                                        variant="secondary"
                                        className="border-violet-200/60 bg-violet-50 text-[11px] font-bold text-violet-800 dark:border-violet-800/60 dark:bg-violet-950/60 dark:text-violet-300"
                                    >
                                        {user.role?.name || 'Resident'}
                                    </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground sm:text-sm">
                                    Barangay Lallana E-Government Portal • Trece Martires City, Cavite
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                            {isAdminUser && (
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="h-9 rounded-xl border-violet-300 text-xs font-semibold text-violet-700 hover:bg-violet-50 dark:border-violet-700 dark:text-violet-300 dark:hover:bg-violet-950/50"
                                >
                                    <a href="/admin">
                                        <ShieldCheck className="mr-1.5 size-4" />
                                        Admin Management Panel
                                    </a>
                                </Button>
                            )}
                            <Link href="/settings/profile">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-9 rounded-xl text-xs text-muted-foreground hover:text-foreground"
                                >
                                    Profile Settings
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Profile Completion Alert Banner if Incomplete */}
                {!isProfileComplete && (
                    <Alert variant="destructive" className="rounded-2xl border-destructive/30 bg-destructive/5 p-5">
                        <ShieldAlert className="size-5 text-destructive" />
                        <div className="flex w-full flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            <div>
                                <AlertTitle className="font-semibold">
                                    Resident KYC Profile Incomplete
                                </AlertTitle>
                                <AlertDescription className="mt-1 text-xs text-muted-foreground">
                                    Please complete your demographic profile and upload a valid government ID to unlock official document requesting and household registration.
                                </AlertDescription>
                            </div>
                            <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="shrink-0 rounded-xl bg-card text-xs font-semibold text-foreground hover:bg-muted"
                            >
                                <Link href="/settings/profile">
                                    Complete Profile Now →
                                </Link>
                            </Button>
                        </div>
                    </Alert>
                )}

                {/* Ready for Pickup Alert Banner */}
                {documentStats.ready_for_pickup > 0 && (
                    <div className="bezel-outer">
                        <div className="bezel-inner flex flex-col justify-between gap-4 border-emerald-500/30 bg-emerald-500/5 p-5 sm:flex-row sm:items-center dark:bg-emerald-950/20">
                            <div className="flex items-start gap-3.5">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                                    <PackageCheck className="size-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
                                        Official Document Ready for Pickup!
                                    </h4>
                                    <p className="mt-0.5 text-xs text-emerald-800 dark:text-emerald-300">
                                        You have {documentStats.ready_for_pickup}{' '}
                                        {documentStats.ready_for_pickup === 1 ? 'document' : 'documents'} ready for claiming at the Barangay Lallana Hall (Claiming Window 1).
                                    </p>
                                </div>
                            </div>
                            <Button
                                asChild
                                size="sm"
                                className="shrink-0 rounded-xl bg-emerald-600 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 active:scale-[0.98]"
                            >
                                <Link href="/documents">
                                    View Claim Details →
                                </Link>
                            </Button>
                        </div>
                    </div>
                )}

                {/* Asymmetrical Bento Grid: Operations & Services */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Left Column: Live Document Request Queue & Fast Actions (8 Cols) */}
                    <div className="space-y-6 lg:col-span-8">
                        {/* Latest Request Tracker Card */}
                        <div className="bezel-outer">
                            <div className="bezel-inner p-6 space-y-5">
                                <div className="flex items-center justify-between border-b border-border/70 pb-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex size-9 items-center justify-center rounded-xl bg-violet-600/10 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300">
                                            <FileText className="size-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-foreground">
                                                Active Document Request Tracker
                                            </h3>
                                            <span className="text-[11px] text-muted-foreground">
                                                Real-time processing queue & status progression
                                            </span>
                                        </div>
                                    </div>
                                    <Link href="/documents">
                                        <Button variant="ghost" size="sm" className="h-8 rounded-lg text-xs font-medium text-violet-700 hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-950/50">
                                            All Requests ({documentStats.total_requests})
                                            <ArrowRight className="ml-1 size-3.5" />
                                        </Button>
                                    </Link>
                                </div>

                                {documentStats.latest_request ? (
                                    <div className="space-y-4 rounded-xl border border-border/80 bg-muted/20 p-5">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div>
                                                <span className="font-mono text-xs font-bold text-violet-700 dark:text-violet-300">
                                                    {documentStats.latest_request.reference_code}
                                                </span>
                                                <h4 className="text-base font-extrabold text-foreground">
                                                    {documentStats.latest_request.document_name}
                                                </h4>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className="border-violet-300 bg-violet-50 text-xs font-semibold capitalize text-violet-800 dark:border-violet-700 dark:bg-violet-950/60 dark:text-violet-300"
                                            >
                                                {documentStats.latest_request.status_label || documentStats.latest_request.status}
                                            </Badge>
                                        </div>

                                        {/* Status Progression Stepper */}
                                        <div className="pt-2">
                                            <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-semibold">
                                                {['Submitted', 'Under Review', 'Processing', 'Ready'].map((step, idx) => {
                                                    const stepStatus = documentStats.latest_request?.status;
                                                    const isCompleted =
                                                        idx === 0 ||
                                                        (idx === 1 && ['under_review', 'processing', 'ready_for_pickup', 'completed'].includes(stepStatus || '')) ||
                                                        (idx === 2 && ['processing', 'ready_for_pickup', 'completed'].includes(stepStatus || '')) ||
                                                        (idx === 3 && ['ready_for_pickup', 'completed'].includes(stepStatus || ''));
                                                    return (
                                                        <div key={step} className="space-y-1.5">
                                                            <div
                                                                className={`h-1.5 rounded-full transition-all ${
                                                                    isCompleted
                                                                        ? 'bg-violet-600 dark:bg-violet-400'
                                                                        : 'bg-border'
                                                                }`}
                                                            />
                                                            <span
                                                                className={
                                                                    isCompleted
                                                                        ? 'text-foreground'
                                                                        : 'text-muted-foreground'
                                                                }
                                                            >
                                                                {step}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-border/70 pt-3 text-[11px] text-muted-foreground">
                                            <span className="flex items-center gap-1.5">
                                                <Clock className="size-3.5" />
                                                Submitted:{' '}
                                                <strong className="font-mono text-foreground font-semibold">
                                                    {documentStats.latest_request.submitted_at || 'Recently'}
                                                </strong>
                                            </span>
                                            <Link
                                                href={`/documents/${documentStats.latest_request.id}`}
                                                className="font-medium text-violet-700 hover:underline dark:text-violet-400"
                                            >
                                                View Tracking Details →
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-dashed border-border/90 p-8 text-center space-y-3">
                                        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                                            <FileText className="size-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-foreground">
                                                No Pending Document Requests
                                            </h4>
                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                Need a Barangay Clearance, Certificate of Indigency, or Residency? Submit an online request in seconds.
                                            </p>
                                        </div>
                                        {isHouseholdVerified ? (
                                            <Button asChild size="sm" className="mt-2 rounded-xl bg-violet-600 text-xs font-semibold text-white shadow-xs hover:bg-violet-700">
                                                <Link href="/documents/create">
                                                    Request a Document Now
                                                </Link>
                                            </Button>
                                        ) : (
                                            <p className="text-[11px] font-medium text-amber-700 dark:text-amber-400">
                                                🔒 Requires a verified household registration.
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Fast Service Action Tiles */}
                                <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-3">
                                    <Link
                                        href="/documents/create"
                                        className="group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-4 transition-all hover:border-violet-300 hover:shadow-xs dark:hover:border-violet-700"
                                    >
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-violet-700 uppercase dark:text-violet-400">
                                                Fast Request
                                            </span>
                                            <h4 className="text-xs font-bold text-foreground">
                                                Barangay Clearance
                                            </h4>
                                            <p className="text-[11px] text-muted-foreground">
                                                For employment & postal IDs
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between pt-3 text-xs font-semibold text-violet-700 dark:text-violet-400">
                                            <span>Apply Online</span>
                                            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </Link>

                                    <Link
                                        href="/documents/create"
                                        className="group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-4 transition-all hover:border-violet-300 hover:shadow-xs dark:hover:border-violet-700"
                                    >
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-violet-700 uppercase dark:text-violet-400">
                                                Assistance
                                            </span>
                                            <h4 className="text-xs font-bold text-foreground">
                                                Certificate of Indigency
                                            </h4>
                                            <p className="text-[11px] text-muted-foreground">
                                                Medical & educational assistance
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between pt-3 text-xs font-semibold text-violet-700 dark:text-violet-400">
                                            <span>Apply Online</span>
                                            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </Link>

                                    <Link
                                        href="/documents/create"
                                        className="group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-4 transition-all hover:border-violet-300 hover:shadow-xs dark:hover:border-violet-700"
                                    >
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-violet-700 uppercase dark:text-violet-400">
                                                Verification
                                            </span>
                                            <h4 className="text-xs font-bold text-foreground">
                                                Certificate of Residency
                                            </h4>
                                            <p className="text-[11px] text-muted-foreground">
                                                Official proof of local residence
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between pt-3 text-xs font-semibold text-violet-700 dark:text-violet-400">
                                            <span>Apply Online</span>
                                            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Household Registry & KYC Status (4 Cols) */}
                    <div className="space-y-6 lg:col-span-4">
                        {/* Household Record Card */}
                        <div className="bezel-outer">
                            <div className="bezel-inner p-6 space-y-4">
                                <div className="flex items-center justify-between border-b border-border/70 pb-3">
                                    <div className="flex items-center gap-2">
                                        <Home className="size-4 text-violet-600 dark:text-violet-400" />
                                        <h3 className="text-sm font-bold text-foreground">
                                            Household Record
                                        </h3>
                                    </div>
                                    {household && (
                                        <Badge
                                            variant={
                                                household.status === 'verified'
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            className={`text-[10px] font-bold uppercase ${
                                                household.status === 'verified'
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'text-amber-700 border-amber-300'
                                            }`}
                                        >
                                            {household.status}
                                        </Badge>
                                    )}
                                </div>

                                {household ? (
                                    <div className="space-y-3">
                                        <div className="rounded-xl bg-muted/40 p-3 space-y-1">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase">
                                                Official Household Code
                                            </span>
                                            <span className="block font-mono text-sm font-extrabold text-foreground">
                                                {household.household_code}
                                            </span>
                                            <span className="block text-xs text-muted-foreground">
                                                {household.purok_sitio} • {household.address}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="rounded-lg border border-border/70 p-2.5">
                                                <span className="text-[10px] text-muted-foreground">
                                                    Registered Members
                                                </span>
                                                <span className="block font-mono text-base font-bold text-foreground">
                                                    {household.members_count}
                                                </span>
                                            </div>
                                            <div className="rounded-lg border border-border/70 p-2.5">
                                                <span className="text-[10px] text-muted-foreground">
                                                    Your Role
                                                </span>
                                                <span className="block text-xs font-bold text-foreground">
                                                    {household.is_family_head ? 'Family Head' : 'Member'}
                                                </span>
                                            </div>
                                        </div>

                                        <Button asChild variant="outline" size="sm" className="w-full rounded-xl text-xs font-semibold hover:bg-muted">
                                            <Link href="/household">
                                                Manage Household & Members →
                                            </Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-3 pt-1">
                                        <p className="text-xs leading-relaxed text-muted-foreground">
                                            Establish your registered family household unit to enable certificate requesting and community benefits.
                                        </p>
                                        <Button asChild size="sm" className="w-full rounded-xl bg-violet-600 text-xs font-semibold text-white shadow-xs hover:bg-violet-700">
                                            <Link href="/household/register">
                                                Register Family Household
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Resident KYC Demographics Card */}
                        <div className="bezel-outer">
                            <div className="bezel-inner p-6 space-y-3.5">
                                <div className="flex items-center justify-between border-b border-border/70 pb-3">
                                    <div className="flex items-center gap-2">
                                        <User className="size-4 text-violet-600 dark:text-violet-400" />
                                        <h3 className="text-sm font-bold text-foreground">
                                            Resident KYC Profile
                                        </h3>
                                    </div>
                                    <Badge
                                        variant={isProfileComplete ? 'default' : 'destructive'}
                                        className="text-[10px] font-bold uppercase"
                                    >
                                        {isProfileComplete ? 'Verified' : 'Pending ID'}
                                    </Badge>
                                </div>

                                <div className="space-y-2 text-xs">
                                    <div className="flex items-center justify-between border-b border-border/50 py-1.5 text-muted-foreground">
                                        <span>Full Legal Name:</span>
                                        <span className="font-semibold text-foreground">{user.name}</span>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-border/50 py-1.5 text-muted-foreground">
                                        <span>Official Email:</span>
                                        <span className="font-mono text-foreground">{user.email}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-1 text-muted-foreground">
                                        <span>Citizen Verification:</span>
                                        <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                                            <CheckCircle2 className="size-3.5" />
                                            {isProfileComplete ? 'Complete' : 'Action Required'}
                                        </span>
                                    </div>
                                </div>

                                <Button asChild variant="outline" size="sm" className="w-full rounded-xl text-xs font-semibold hover:bg-muted">
                                    <Link href="/settings/profile">
                                        View Identity Details →
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section: Official Barangay Advisories & Bulletins */}
                <div className="bezel-outer">
                    <div className="bezel-inner p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-border/70 pb-3">
                            <div className="flex items-center gap-2">
                                <Bell className="size-4 text-violet-600 dark:text-violet-400" />
                                <h3 className="text-sm font-bold text-foreground">
                                    Official Barangay Advisories
                                </h3>
                            </div>
                            <a
                                href="/#announcements"
                                className="flex items-center gap-1 text-xs font-semibold text-violet-700 hover:underline dark:text-violet-400"
                            >
                                Public Bulletin Board <ArrowRight className="size-3" />
                            </a>
                        </div>

                        {announcements.length > 0 ? (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {announcements.map((announcement) => (
                                    <div
                                        key={announcement.id}
                                        className="flex flex-col justify-between rounded-xl border border-border/70 bg-muted/20 p-4 transition-all hover:bg-muted/40 hover:border-violet-200 dark:hover:border-violet-800"
                                    >
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <Badge
                                                    variant="outline"
                                                    className="border-violet-200 bg-violet-50 text-[10px] font-bold text-violet-800 uppercase dark:border-violet-800 dark:bg-violet-950/60 dark:text-violet-300"
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
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="py-4 text-center text-xs text-muted-foreground">
                                No active municipal advisories posted at this time.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs,
};
