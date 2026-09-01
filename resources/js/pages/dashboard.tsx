import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Bell,
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
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card';
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
    const { auth } = usePage().props;
    const user = auth.user;
    const isAdminUser =
        user.role?.slug === 'admin' || user.role?.slug === 'sub_admin';

    return (
        <>
            <Head title="Resident Dashboard" />

            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 md:p-8">
                {/* Welcome Greeting Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Welcome back, {user.name}!
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Barangay Lallana E-Government Portal • Trece
                            Martires City
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {isAdminUser && (
                            <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="border-primary/40 text-primary"
                            >
                                <a href="/admin">
                                    <ShieldCheck className="mr-1.5 size-4" />
                                    Access Admin Portal
                                </a>
                            </Button>
                        )}
                        <Badge
                            variant="secondary"
                            className="text-xs capitalize"
                        >
                            {user.role?.name || 'Resident'}
                        </Badge>
                    </div>
                </div>

                {/* Profile Completion Alert Banner if Incomplete */}
                {!isProfileComplete && (
                    <Alert variant="destructive" className="rounded-2xl">
                        <ShieldAlert className="size-5" />
                        <div className="flex w-full flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            <div>
                                <AlertTitle className="font-semibold">
                                    Resident Profile Incomplete
                                </AlertTitle>
                                <AlertDescription className="mt-1 text-xs">
                                    Your demographic and KYC profile must be
                                    completed with valid ID before you can
                                    register a household or request barangay
                                    documents.
                                </AlertDescription>
                            </div>
                            <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="shrink-0 bg-background text-foreground hover:bg-muted"
                            >
                                <Link href="/resident/profile/edit">
                                    Complete Profile →
                                </Link>
                            </Button>
                        </div>
                    </Alert>
                )}

                {/* Ready for Pickup Banner if any */}
                {documentStats.ready_for_pickup > 0 && (
                    <Alert className="rounded-2xl border-emerald-500/50 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200">
                        <PackageCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
                        <div className="flex w-full flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            <div>
                                <AlertTitle className="font-semibold text-emerald-950 dark:text-emerald-100">
                                    Document Ready for Pickup!
                                </AlertTitle>
                                <AlertDescription className="mt-1 text-xs text-emerald-800 dark:text-emerald-300">
                                    You have {documentStats.ready_for_pickup}{' '}
                                    document{' '}
                                    {documentStats.ready_for_pickup === 1
                                        ? 'request'
                                        : 'requests'}{' '}
                                    waiting for physical pickup at the Barangay
                                    Hall.
                                </AlertDescription>
                            </div>
                            <Button
                                asChild
                                size="sm"
                                className="shrink-0 bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-gray-950"
                            >
                                <Link href="/documents">View Requests →</Link>
                            </Button>
                        </div>
                    </Alert>
                )}

                {/* Main Cards Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Household Status Card */}
                    <Card className="flex flex-col justify-between rounded-2xl border-border">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2 text-base font-bold">
                                    <Home className="size-4 text-primary" />
                                    Household Record
                                </CardTitle>
                                {household && (
                                    <Badge
                                        variant={
                                            household.status === 'verified'
                                                ? 'default'
                                                : 'outline'
                                        }
                                        className="text-[10px] capitalize"
                                    >
                                        {household.status}
                                    </Badge>
                                )}
                            </div>
                            <CardDescription className="text-xs">
                                {household
                                    ? `${household.household_code} • ${household.purok_sitio}`
                                    : 'No registered family household record.'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-0">
                            {household ? (
                                <div className="space-y-2">
                                    <div className="flex justify-between border-b border-border/50 py-1 text-xs">
                                        <span className="text-muted-foreground">
                                            Members:
                                        </span>
                                        <span className="font-medium">
                                            {household.members_count} registered
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-b border-border/50 py-1 text-xs">
                                        <span className="text-muted-foreground">
                                            Role:
                                        </span>
                                        <span className="font-medium">
                                            {household.is_family_head
                                                ? 'Family Head'
                                                : 'Member'}
                                        </span>
                                    </div>
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="sm"
                                        className="mt-2 w-full"
                                    >
                                        <Link href="/household">
                                            View Household Details →
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3 pt-2">
                                    <p className="text-xs text-muted-foreground">
                                        Establish your official household record
                                        to unlock barangay clearance,
                                        certificates, and family management.
                                    </p>
                                    <Button
                                        asChild
                                        size="sm"
                                        className="w-full"
                                    >
                                        <Link href="/household/register">
                                            Register Household
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Resident KYC Card */}
                    <Card className="flex flex-col justify-between rounded-2xl border-border">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2 text-base font-bold">
                                    <User className="size-4 text-primary" />
                                    Resident KYC Profile
                                </CardTitle>
                                <Badge
                                    variant={
                                        isProfileComplete
                                            ? 'default'
                                            : 'destructive'
                                    }
                                    className="text-[10px]"
                                >
                                    {isProfileComplete ? 'Complete' : 'Pending'}
                                </Badge>
                            </div>
                            <CardDescription className="text-xs">
                                Official demographic and identification data.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-0">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 border-b border-border/50 py-1 text-xs text-muted-foreground">
                                    <UserCheck className="size-3.5 text-emerald-600" />
                                    <span>Demographics & Civil Status</span>
                                </div>
                                <div className="flex items-center gap-2 border-b border-border/50 py-1 text-xs text-muted-foreground">
                                    <FileText className="size-3.5 text-emerald-600" />
                                    <span>Government ID Document</span>
                                </div>
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="mt-2 w-full"
                                >
                                    <Link href="/resident/profile">
                                        Manage Profile →
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Document Requests Quick CTA */}
                    <Card className="flex flex-col justify-between rounded-2xl border-border md:col-span-2 lg:col-span-1">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2 text-base font-bold">
                                    <FileText className="size-4 text-primary" />
                                    Document Services
                                </CardTitle>
                                {documentStats.total_requests > 0 && (
                                    <Badge
                                        variant="secondary"
                                        className="text-[10px]"
                                    >
                                        {documentStats.total_requests} Requests
                                    </Badge>
                                )}
                            </div>
                            <CardDescription className="text-xs">
                                Barangay Clearance & Certifications
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-0">
                            {isHouseholdVerified ? (
                                <div className="space-y-2">
                                    <div className="flex justify-between border-b border-border/50 py-1 text-xs">
                                        <span className="text-muted-foreground">
                                            Active Requests:
                                        </span>
                                        <span className="font-medium">
                                            {documentStats.active_requests}
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-b border-border/50 py-1 text-xs">
                                        <span className="text-muted-foreground">
                                            Ready for Pickup:
                                        </span>
                                        <span
                                            className={`font-medium ${documentStats.ready_for_pickup > 0 ? 'font-bold text-emerald-600' : ''}`}
                                        >
                                            {documentStats.ready_for_pickup}
                                        </span>
                                    </div>
                                    <Button
                                        asChild
                                        size="sm"
                                        className="mt-2 w-full"
                                    >
                                        <Link href="/documents">
                                            Request & Track Documents →
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3 pt-2">
                                    <div className="rounded-lg bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-200">
                                        🔒 Document requesting requires an
                                        approved and verified household record.
                                    </div>
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                    >
                                        <Link href="/household">
                                            Check Household Status
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Latest Announcements Section */}
                <Card className="rounded-2xl border-border">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-base font-bold">
                                <Bell className="size-4 text-primary" />
                                Official Barangay Advisories
                            </CardTitle>
                            <Link
                                href="/#announcements"
                                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                            >
                                View all <ArrowRight className="size-3" />
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-0">
                        {announcements.length > 0 ? (
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {announcements.map((announcement) => (
                                    <div
                                        key={announcement.id}
                                        className="flex flex-col justify-between rounded-xl border border-border/60 bg-muted/20 p-4 transition-all hover:bg-muted/40"
                                    >
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <Badge
                                                    variant="outline"
                                                    className="text-[10px] font-bold uppercase"
                                                >
                                                    {announcement.category}
                                                </Badge>
                                                {announcement.published_at && (
                                                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                        <Clock className="size-2.5" />
                                                        {new Date(
                                                            announcement.published_at,
                                                        ).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                            <h4 className="line-clamp-1 text-sm font-semibold">
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
                            <p className="py-2 text-xs text-muted-foreground">
                                No active announcements posted at this time.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs,
};
