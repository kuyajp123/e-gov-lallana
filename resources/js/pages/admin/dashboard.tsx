import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    Award,
    Building2,
    Clock,
    FileCheck,
    FileText,
    Home,
    PackageCheck,
    ShieldCheck,
    TrendingUp,
    UserCheck,
    Users,
} from 'lucide-react';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/shared/components/ui/alert';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import type { BreadcrumbItem } from '@/shared/types';

interface DemographicsCohort {
    label: string;
    count: number;
    color: string;
    textColor: string;
}

interface MonthlyTrend {
    month: string;
    year: string;
    submitted: number;
    completed: number;
}

interface RecentDocRequest {
    id: number;
    reference_code: string;
    applicant_name: string;
    document_name: string;
    document_slug: string;
    status: string;
    status_label: string;
    status_color: string;
    fee_cents: number;
    submitted_at: string;
}

interface RecentHousehold {
    id: number;
    household_code: string;
    head_name: string;
    purok_sitio: string;
    address: string;
    status: string;
    created_at: string;
}

interface AdminDashboardProps {
    metrics: {
        totalResidents: number;
        thisMonthResidents: number;
        totalHouseholds: number;
        verifiedHouseholds: number;
        verifiedPct: number;
        pendingHouseholds: number;
        totalDocRequests: number;
        activeDocRequests: number;
        readyForPickup: number;
        completedDocRequests: number;
        activeStaff: number;
    };
    demographics: DemographicsCohort[];
    specialSectors: {
        seniors: number;
        pwds: number;
        soloParents: number;
        voters: number;
    };
    monthlyTrends: MonthlyTrend[];
    recentDocRequests: RecentDocRequest[];
    recentHouseholds: RecentHousehold[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Console',
        href: '/admin',
    },
];

export default function AdminDashboard({
    metrics,
    demographics,
    specialSectors,
    monthlyTrends,
    recentDocRequests,
}: AdminDashboardProps) {
    const { auth } = usePage<{
        auth: {
            user: {
                name: string;
                email: string;
                role?: { name: string; slug: string };
            };
        };
    }>().props;
    const user = auth.user;

    const maxMonthlyVolume = Math.max(
        ...monthlyTrends.map((t) => Math.max(t.submitted, t.completed, 1)),
    );

    return (
        <>
            <Head title="Admin Console — Barangay Lallana" />

            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 md:p-8">
                {/* Staff Header & Admin Banner */}
                <div className="bezel-outer">
                    <div className="bezel-inner flex flex-col justify-between gap-6 p-6 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-4">
                            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-violet-600/10 text-violet-700 ring-1 ring-violet-600/20 dark:bg-violet-400/10 dark:text-violet-300">
                                <ShieldCheck className="size-7" />
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
                                        {user.role?.name || 'Administrator'}
                                    </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground sm:text-sm">
                                    Barangay Lallana E-Government Portal •
                                    Administrative Console • Trece Martires
                                    City, Cavite
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                            <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="h-9 rounded-xl border-violet-300 text-xs font-semibold text-violet-700 hover:bg-violet-50 dark:border-violet-700 dark:text-violet-300 dark:hover:bg-violet-950/50"
                            >
                                <Link href="/dashboard">
                                    <Home className="mr-1.5 size-3.5" />
                                    Resident Portal
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="sm"
                                className="h-9 rounded-xl bg-violet-600 text-xs font-semibold text-white shadow-xs hover:bg-violet-700"
                            >
                                <a href="/admin/document-requests">
                                    <FileCheck className="mr-1.5 size-3.5" />
                                    Document Queue ({metrics.activeDocRequests})
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Verification Alert Banner if Pending Households Exist */}
                {metrics.pendingHouseholds > 0 && (
                    <Alert className="rounded-2xl border-amber-500/30 bg-amber-500/5 p-5 dark:bg-amber-950/20">
                        <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400" />
                        <div className="flex w-full flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            <div>
                                <AlertTitle className="font-semibold text-amber-950 dark:text-amber-200">
                                    Household Verifications Pending Review
                                </AlertTitle>
                                <AlertDescription className="mt-1 text-xs text-amber-800 dark:text-amber-300">
                                    There are {metrics.pendingHouseholds}{' '}
                                    registered household unit(s) awaiting
                                    official verification or compliance review.
                                </AlertDescription>
                            </div>
                            <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="shrink-0 rounded-xl border-amber-300 bg-card text-xs font-semibold text-amber-800 hover:bg-amber-100/50 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-950/50"
                            >
                                <a href="/admin/households">
                                    Review Households →
                                </a>
                            </Button>
                        </div>
                    </Alert>
                )}

                {/* Top Executive Bento Metric Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Card 1: Total Residents */}
                    <div className="bezel-outer">
                        <div className="bezel-inner space-y-3 p-5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-muted-foreground">
                                    Total Registered Residents
                                </span>
                                <div className="flex size-9 items-center justify-center rounded-xl bg-violet-600/10 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300">
                                    <Users className="size-4" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="font-mono text-2xl font-extrabold tracking-tight text-foreground tabular-nums sm:text-3xl">
                                    {metrics.totalResidents.toLocaleString()}
                                </div>
                                <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                    <TrendingUp className="size-3.5" />+
                                    {metrics.thisMonthResidents} registered this
                                    month
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Household Coverage */}
                    <div className="bezel-outer">
                        <div className="bezel-inner space-y-3 p-5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-muted-foreground">
                                    Household Registry Coverage
                                </span>
                                <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                                    <Home className="size-4" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <div className="font-mono text-2xl font-extrabold tracking-tight text-foreground tabular-nums sm:text-3xl">
                                    {metrics.verifiedHouseholds}{' '}
                                    <span className="text-sm font-normal text-muted-foreground">
                                        / {metrics.totalHouseholds}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                                        <div
                                            className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                                            style={{
                                                width: `${metrics.verifiedPct}%`,
                                            }}
                                        />
                                    </div>
                                    <span className="text-[11px] font-medium text-muted-foreground">
                                        {metrics.verifiedPct}% verified
                                        households
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Pending Verifications */}
                    <div className="bezel-outer">
                        <div className="bezel-inner space-y-3 p-5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-muted-foreground">
                                    Pending Verifications
                                </span>
                                <div className="flex size-9 items-center justify-center rounded-xl bg-amber-600/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400">
                                    <Clock className="size-4" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="font-mono text-2xl font-extrabold tracking-tight text-foreground tabular-nums sm:text-3xl">
                                    {metrics.pendingHouseholds}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {metrics.pendingHouseholds > 0
                                        ? 'Requires administrative action'
                                        : 'All households up to date'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Active Document Requests */}
                    <div className="bezel-outer">
                        <div className="bezel-inner space-y-3 p-5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-muted-foreground">
                                    Active Document Requests
                                </span>
                                <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-400">
                                    <FileText className="size-4" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="font-mono text-2xl font-extrabold tracking-tight text-foreground tabular-nums sm:text-3xl">
                                    {metrics.activeDocRequests}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {metrics.readyForPickup} ready for pickup at
                                    hall
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Operations Bento Grid (8 cols / 4 cols) */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Left Column: Processing Queue & Monthly Volume (8 cols) */}
                    <div className="space-y-6 lg:col-span-8">
                        {/* Live Processing Queue Card */}
                        <div className="bezel-outer">
                            <div className="bezel-inner space-y-5 p-6">
                                <div className="flex items-center justify-between border-b border-border/70 pb-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex size-9 items-center justify-center rounded-xl bg-violet-600/10 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300">
                                            <FileCheck className="size-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-foreground">
                                                Active Document Processing Queue
                                            </h3>
                                            <span className="text-[11px] text-muted-foreground">
                                                Latest citizen applications
                                                requiring staff action
                                            </span>
                                        </div>
                                    </div>
                                    <Button
                                        asChild
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 rounded-lg text-xs font-medium text-violet-700 hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-950/50"
                                    >
                                        <a href="/admin/document-requests">
                                            Manage All (
                                            {metrics.totalDocRequests})
                                            <ArrowRight className="ml-1 size-3.5" />
                                        </a>
                                    </Button>
                                </div>

                                {recentDocRequests.length > 0 ? (
                                    <div className="divide-y divide-border/60 rounded-xl border border-border/70 bg-muted/20">
                                        {recentDocRequests.map((req) => (
                                            <div
                                                key={req.id}
                                                className="flex flex-col justify-between gap-3 p-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center"
                                            >
                                                <div className="space-y-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="font-mono text-xs font-bold text-violet-700 dark:text-violet-300">
                                                            {req.reference_code}
                                                        </span>
                                                        <Badge
                                                            variant="outline"
                                                            className="border-violet-200 bg-violet-50 text-[10px] font-bold text-violet-800 capitalize dark:border-violet-800 dark:bg-violet-950/60 dark:text-violet-300"
                                                        >
                                                            {req.status_label ||
                                                                req.status}
                                                        </Badge>
                                                    </div>
                                                    <h4 className="text-sm font-bold text-foreground">
                                                        {req.document_name}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground">
                                                        Applicant:{' '}
                                                        <strong className="text-foreground">
                                                            {req.applicant_name}
                                                        </strong>{' '}
                                                        • Submitted:{' '}
                                                        {req.submitted_at}
                                                    </p>
                                                </div>

                                                <Button
                                                    asChild
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 shrink-0 rounded-lg text-xs font-semibold hover:bg-muted"
                                                >
                                                    <a
                                                        href={`/admin/document-requests/${req.id}`}
                                                    >
                                                        Inspect Application →
                                                    </a>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-2 rounded-xl border border-dashed border-border/90 p-8 text-center">
                                        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                                            <PackageCheck className="size-6" />
                                        </div>
                                        <h4 className="text-sm font-semibold text-foreground">
                                            All Document Queues Cleared
                                        </h4>
                                        <p className="text-xs text-muted-foreground">
                                            There are currently no active
                                            document applications awaiting staff
                                            review.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 6-Month Document Fulfillment Volume Trends */}
                        <div className="bezel-outer">
                            <div className="bezel-inner space-y-5 p-6">
                                <div className="flex items-center justify-between border-b border-border/70 pb-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex size-9 items-center justify-center rounded-xl bg-violet-600/10 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300">
                                            <TrendingUp className="size-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-foreground">
                                                Document Request Trends (Last 6
                                                Months)
                                            </h3>
                                            <span className="text-[11px] text-muted-foreground">
                                                Monthly submissions versus
                                                completed certificate releases
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <span className="size-2.5 rounded-sm bg-violet-600" />
                                            <span className="text-muted-foreground">
                                                Submitted
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="size-2.5 rounded-sm bg-emerald-500" />
                                            <span className="text-muted-foreground">
                                                Fulfilled
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-6 gap-3 pt-2">
                                    {monthlyTrends.map((trend) => {
                                        const submittedHeight = Math.round(
                                            (trend.submitted /
                                                maxMonthlyVolume) *
                                                100,
                                        );
                                        const completedHeight = Math.round(
                                            (trend.completed /
                                                maxMonthlyVolume) *
                                                100,
                                        );

                                        return (
                                            <div
                                                key={`${trend.month}-${trend.year}`}
                                                className="flex flex-col items-center gap-2"
                                            >
                                                <div className="flex h-36 w-full items-end justify-center gap-1.5 rounded-lg bg-muted/30 p-2">
                                                    {/* Submitted bar */}
                                                    <div
                                                        className="w-3 rounded-t-sm bg-violet-600 transition-all duration-500"
                                                        style={{
                                                            height: `${Math.max(submittedHeight, 6)}%`,
                                                        }}
                                                        title={`Submitted: ${trend.submitted}`}
                                                    />
                                                    {/* Fulfilled bar */}
                                                    <div
                                                        className="w-3 rounded-t-sm bg-emerald-500 transition-all duration-500"
                                                        style={{
                                                            height: `${Math.max(completedHeight, 6)}%`,
                                                        }}
                                                        title={`Fulfilled: ${trend.completed}`}
                                                    />
                                                </div>
                                                <div className="text-center">
                                                    <span className="block text-[11px] font-bold text-foreground">
                                                        {trend.month}
                                                    </span>
                                                    <span className="block font-mono text-[10px] text-muted-foreground">
                                                        {trend.submitted}/
                                                        {trend.completed}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Demographics, Sectors & Quick Modules (4 cols) */}
                    <div className="space-y-6 lg:col-span-4">
                        {/* Demographics Age Cohorts Card */}
                        <div className="bezel-outer">
                            <div className="bezel-inner space-y-4 p-6">
                                <div className="flex items-center justify-between border-b border-border/70 pb-3">
                                    <div className="flex items-center gap-2">
                                        <Users className="size-4 text-violet-600 dark:text-violet-400" />
                                        <h3 className="text-sm font-bold text-foreground">
                                            Demographics (Age Cohorts)
                                        </h3>
                                    </div>
                                    <span className="font-mono text-xs font-semibold text-muted-foreground tabular-nums">
                                        {metrics.totalResidents} total
                                    </span>
                                </div>

                                <div className="space-y-3.5">
                                    {demographics.map((cohort) => {
                                        const pct =
                                            metrics.totalResidents > 0
                                                ? Math.round(
                                                      (cohort.count /
                                                          metrics.totalResidents) *
                                                          100,
                                                  )
                                                : 0;

                                        return (
                                            <div
                                                key={cohort.label}
                                                className="space-y-1.5"
                                            >
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="font-medium text-foreground">
                                                        {cohort.label}
                                                    </span>
                                                    <span className="font-mono font-bold text-muted-foreground tabular-nums">
                                                        {cohort.count.toLocaleString()}{' '}
                                                        ({pct}%)
                                                    </span>
                                                </div>
                                                <div className="h-2 w-full overflow-hidden rounded-full bg-border/80">
                                                    <div
                                                        className={`h-full rounded-full ${cohort.color} transition-all duration-500`}
                                                        style={{
                                                            width: `${Math.max(pct, 2)}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Special Sectors & Voter Registry */}
                        <div className="bezel-outer">
                            <div className="bezel-inner space-y-4 p-6">
                                <div className="flex items-center justify-between border-b border-border/70 pb-3">
                                    <div className="flex items-center gap-2">
                                        <Award className="size-4 text-violet-600 dark:text-violet-400" />
                                        <h3 className="text-sm font-bold text-foreground">
                                            Special Sectors & Registry
                                        </h3>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2.5">
                                    <div className="space-y-1 rounded-xl border border-border/70 bg-muted/20 p-3">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">
                                            Senior Citizens
                                        </span>
                                        <span className="block font-mono text-lg font-extrabold text-amber-600 tabular-nums dark:text-amber-400">
                                            {specialSectors.seniors.toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="space-y-1 rounded-xl border border-border/70 bg-muted/20 p-3">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">
                                            PWDs
                                        </span>
                                        <span className="block font-mono text-lg font-extrabold text-purple-600 tabular-nums dark:text-purple-400">
                                            {specialSectors.pwds.toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="space-y-1 rounded-xl border border-border/70 bg-muted/20 p-3">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">
                                            Solo Parents
                                        </span>
                                        <span className="block font-mono text-lg font-extrabold text-pink-600 tabular-nums dark:text-pink-400">
                                            {specialSectors.soloParents.toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="space-y-1 rounded-xl border border-border/70 bg-muted/20 p-3">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">
                                            Registered Voters
                                        </span>
                                        <span className="block font-mono text-lg font-extrabold text-blue-600 tabular-nums dark:text-blue-400">
                                            {specialSectors.voters.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Fast Management Portals */}
                        <div className="bezel-outer">
                            <div className="bezel-inner space-y-3 p-6">
                                <h3 className="border-b border-border/70 pb-3 text-sm font-bold text-foreground">
                                    Administration Portals
                                </h3>

                                <div className="space-y-2">
                                    <a
                                        href="/admin/households"
                                        className="group flex items-center justify-between rounded-xl border border-border/70 p-3 transition-colors hover:border-violet-300 hover:bg-muted/40 dark:hover:border-violet-700"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <Building2 className="size-4 text-violet-600 dark:text-violet-400" />
                                            <span className="text-xs font-semibold text-foreground">
                                                Household Registry &
                                                Verification
                                            </span>
                                        </div>
                                        <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                                    </a>

                                    <a
                                        href="/admin/resident-profiles"
                                        className="group flex items-center justify-between rounded-xl border border-border/70 p-3 transition-colors hover:border-violet-300 hover:bg-muted/40 dark:hover:border-violet-700"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <UserCheck className="size-4 text-violet-600 dark:text-violet-400" />
                                            <span className="text-xs font-semibold text-foreground">
                                                Resident KYC Profiles & IDs
                                            </span>
                                        </div>
                                        <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                                    </a>

                                    <a
                                        href="/admin/staff"
                                        className="group flex items-center justify-between rounded-xl border border-border/70 p-3 transition-colors hover:border-violet-300 hover:bg-muted/40 dark:hover:border-violet-700"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <ShieldCheck className="size-4 text-violet-600 dark:text-violet-400" />
                                            <span className="text-xs font-semibold text-foreground">
                                                Staff Accounts & Roles (
                                                {metrics.activeStaff})
                                            </span>
                                        </div>
                                        <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs,
};
