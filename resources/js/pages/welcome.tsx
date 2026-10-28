import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Award,
    Building2,
    Calendar,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    Clock,
    Copy,
    FileText,
    Flame,
    HeartPulse,
    Home as HomeIcon,
    Landmark,
    MapPin,
    Megaphone,
    Menu,
    Phone,
    QrCode,
    Send,
    ShieldAlert,
    ShieldCheck,
    Siren,
    UserCheck,
    Users,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { TurnstileWidget } from '@/shared/components/turnstile-widget';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import type { Auth } from '@/shared/types/auth';

interface ServiceItem {
    id: number;
    name: string;
    slug: string;
    description: string;
    fee: string;
    requirements: string[];
}

interface AnnouncementItem {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    published_at: string;
}

interface LandingProps {
    t: {
        hero: Record<string, string>;
        nav: Record<string, string>;
        about: Record<string, string>;
        leadership: Record<string, string>;
        services: Record<string, string>;
        statistics: Record<string, string>;
        announcements: Record<string, string>;
        contact: Record<string, string>;
    };
    locale: string;
    statistics: {
        total_residents: number;
        total_households: number;
        total_officials: number;
        total_population?: number;
        actual_population?: number;
        personnel_breakdown?: {
            officials: number;
            sk: number;
            office: number;
            tanod: number;
            utility: number;
        };
    };
    services: ServiceItem[];
    announcements: AnnouncementItem[];
}

const emergencyHotlines = [
    {
        agency: 'BARANGAY HALL',
        dept: 'Barangay Lallana Operations',
        icon: Building2,
        numbers: [{ tel: '0956-811-8583', network: 'Barangay Hotline' }],
    },
    {
        agency: 'BDRRMC / BHERT',
        dept: 'Disaster & Health Emergency Team',
        icon: ShieldAlert,
        numbers: [{ tel: '0965-054-3893', network: 'Emergency Desk' }],
    },
    {
        agency: 'PNP (POLICE)',
        dept: 'Philippine National Police',
        icon: Siren,
        numbers: [
            { tel: '0998-967-3354', network: 'SMART' },
            { tel: '0917-901-4619', network: 'GLOBE' },
        ],
    },
    {
        agency: 'CDRRMO',
        dept: 'City Disaster Risk Reduction',
        icon: ShieldCheck,
        numbers: [
            { tel: '0977-676-3491', network: 'GLOBE' },
            { tel: '0949-629-8026', network: 'SMART' },
        ],
    },
    {
        agency: 'BFP (FIRE STATION)',
        dept: 'Bureau of Fire Protection',
        icon: Flame,
        numbers: [{ tel: '0945-238-8226', network: 'GLOBE / TM' }],
    },
    {
        agency: 'CSWDO',
        dept: 'Social Welfare & Development',
        icon: Users,
        numbers: [{ tel: '0954-983-6056', network: 'GLOBE' }],
    },
    {
        agency: 'CHO (CITY HEALTH)',
        dept: 'City Health Office',
        icon: HeartPulse,
        numbers: [{ tel: '0921-451-9099', network: 'Health Line' }],
    },
];

export default function Welcome({
    t,
    locale,
    statistics,
    services,
    announcements,
}: LandingProps) {
    const { auth } = usePage<{
        auth: Auth;
    }>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

    const handleCopyNumber = (tel: string) => {
        if (
            typeof navigator !== 'undefined' &&
            navigator.clipboard?.writeText
        ) {
            navigator.clipboard.writeText(tel);
            setCopiedNumber(tel);
            setTimeout(() => {
                setCopiedNumber((current) =>
                    current === tel ? null : current,
                );
            }, 2000);
        }
    };

    const isAdmin =
        auth?.user?.role?.slug === 'admin' ||
        auth?.user?.role?.slug === 'super_admin' ||
        auth?.user?.can_access_admin === true;

    const dashboardUrl = isAdmin ? '/admin/overview' : '/dashboard';
    const dashboardLabel = isAdmin ? 'Admin Dashboard' : 'Resident Dashboard';

    const requestDocumentHref = !auth?.user
        ? '/login?intent=request'
        : isAdmin
          ? '/admin/document-requests'
          : '/documents';

    const registerHouseholdHref = !auth?.user
        ? '/register?intent=household'
        : isAdmin
          ? '/admin/households'
          : '/household/register';

    // Inquiry Contact Form
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        recentlySuccessful,
    } = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
        'cf-turnstile-response': '',
    });

    const handleInquirySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/inquiry', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const handleLocaleSwitch = (newLocale: string) => {
        if (newLocale !== locale) {
            router.post(
                '/locale',
                { locale: newLocale },
                { preserveScroll: true },
            );
        }
    };

    return (
        <div className="min-h-screen bg-background font-sans text-foreground selection:bg-violet-600 selection:text-white">
            <Head title="Barangay Lallana — Official E-Government Web Portal" />

            {/* Emergency Hotline Alert Strip */}
            {/* <div className="border-b border-violet-200/50 bg-violet-50/70 px-4 py-2 text-xs text-violet-950">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex size-2 bg-emerald-500" />
                        <span className="font-semibold tracking-wide text-violet-800 uppercase">
                            Barangay Hall Active Desk:
                        </span>
                        <span className="font-mono font-medium">
                            (046) 419-0000
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground">
                        <span className="hidden sm:inline">
                            Trece Martires PNP:{' '}
                            <strong className="font-mono font-semibold text-foreground">
                                0998-598-5606
                            </strong>
                        </span>
                        <span>
                            BFP Fire:{' '}
                            <strong className="font-mono font-semibold text-foreground">
                                (046) 419-0352
                            </strong>
                        </span>
                        <span className="hidden md:inline">
                            CDRRMO Emergency:{' '}
                            <strong className="font-mono font-semibold text-foreground">
                                (046) 419-1234
                            </strong>
                        </span>
                    </div>
                </div>
            </div> */}

            {/* Solid Sharp Navigation Header */}
            <div className="sticky top-0 z-50 px-4 pt-3 sm:px-6 lg:px-8">
                <header className="mx-auto max-w-6xl rounded-none border border-border bg-card px-4 shadow-none sm:px-6">
                    <div className="flex h-16 items-center justify-between gap-4">
                        {/* Logo & Municipal Identity */}
                        <a
                            href="#home"
                            className="group flex items-center gap-3"
                        >
                            <div className="relative flex size-10 items-center justify-center">
                                <img
                                    src="/lallana-icon.png"
                                    alt="Barangay Lallana Official Seal"
                                    className="size-15 object-contain"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold tracking-tight text-foreground">
                                    BARANGAY LALLANA
                                </span>
                                <span className="text-[10px] font-medium tracking-wide text-violet-700 uppercase">
                                    Trece Martires City • Cavite
                                </span>
                            </div>
                        </a>

                        {/* Desktop Navigation Links */}
                        <nav className="hidden items-center gap-1 text-xs font-medium lg:flex">
                            <a
                                href="#home"
                                className="rounded-none px-3 py-1.5 text-muted-foreground transition-colors hover:bg-violet-50 hover:text-violet-700"
                            >
                                {t.nav?.home || 'Home'}
                            </a>
                            <a
                                href="#about"
                                className="rounded-none px-3 py-1.5 text-muted-foreground transition-colors hover:bg-violet-50 hover:text-violet-700"
                            >
                                {t.nav?.about || 'About'}
                            </a>
                            <a
                                href="#leadership"
                                className="rounded-none px-3 py-1.5 text-muted-foreground transition-colors hover:bg-violet-50 hover:text-violet-700"
                            >
                                {t.nav?.leadership || 'Leadership'}
                            </a>
                            <a
                                href="#services"
                                className="rounded-none px-3 py-1.5 text-muted-foreground transition-colors hover:bg-violet-50 hover:text-violet-700"
                            >
                                {t.nav?.services || 'Services'}
                            </a>
                            <a
                                href="#statistics"
                                className="rounded-none px-3 py-1.5 text-muted-foreground transition-colors hover:bg-violet-50 hover:text-violet-700"
                            >
                                {t.nav?.statistics || 'Registry'}
                            </a>
                            <a
                                href="#announcements"
                                className="rounded-none px-3 py-1.5 text-muted-foreground transition-colors hover:bg-violet-50 hover:text-violet-700"
                            >
                                {t.nav?.announcements || 'Advisories'}
                            </a>
                            <a
                                href="#contact"
                                className="rounded-none px-3 py-1.5 text-muted-foreground transition-colors hover:bg-violet-50 hover:text-violet-700"
                            >
                                {t.nav?.contact || 'Contact'}
                            </a>
                        </nav>

                        {/* Right Section: Native Language Selection Dropdown & Auth Access */}
                        <div className="hidden items-center gap-3 lg:flex">
                            {/* Native Selection in Dropdown */}
                            <div className="relative">
                                <select
                                    value={locale}
                                    onChange={(e) =>
                                        handleLocaleSwitch(e.target.value)
                                    }
                                    className="h-8 cursor-pointer appearance-none rounded-none border border-border bg-background py-1 pr-6 pl-2.5 text-xs font-semibold text-foreground shadow-none outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600"
                                    aria-label="Language selection"
                                >
                                    <option value="en">EN — English</option>
                                    <option value="fil">FIL — Filipino</option>
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-1.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                            </div>

                            {auth?.user ? (
                                <Link href={dashboardUrl}>
                                    <Button
                                        size="sm"
                                        className="h-8 cursor-pointer rounded-none bg-violet-600 px-4 text-xs font-semibold text-white shadow-none hover:bg-violet-700"
                                    >
                                        {dashboardLabel}
                                    </Button>
                                </Link>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link href="/login">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 rounded-none px-3 text-xs font-medium text-foreground hover:bg-muted"
                                        >
                                            {t.nav?.login || 'Sign In'}
                                        </Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button
                                            size="sm"
                                            className="h-8 cursor-pointer rounded-none bg-violet-600 px-3.5 text-xs font-semibold text-white shadow-none hover:bg-violet-700"
                                        >
                                            {t.nav?.register || 'Register'}
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <div className="flex items-center gap-2 lg:hidden">
                            <button
                                type="button"
                                onClick={() =>
                                    setMobileMenuOpen(!mobileMenuOpen)
                                }
                                className="flex size-9 items-center justify-center rounded-none border border-border bg-card text-foreground hover:bg-muted"
                                aria-label="Toggle Navigation Menu"
                            >
                                {mobileMenuOpen ? (
                                    <X className="size-5" />
                                ) : (
                                    <Menu className="size-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Drawer */}
                    {mobileMenuOpen && (
                        <div className="space-y-3 border-t border-border px-2 py-4 lg:hidden">
                            <nav className="flex flex-col gap-1 text-sm font-medium">
                                <a
                                    href="#home"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-none px-3 py-2 text-foreground hover:bg-violet-50 hover:text-violet-700"
                                >
                                    {t.nav?.home || 'Home'}
                                </a>
                                <a
                                    href="#about"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-none px-3 py-2 text-foreground hover:bg-violet-50 hover:text-violet-700"
                                >
                                    {t.nav?.about || 'About'}
                                </a>
                                <a
                                    href="#leadership"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-none px-3 py-2 text-foreground hover:bg-violet-50 hover:text-violet-700"
                                >
                                    {t.nav?.leadership || 'Leadership'}
                                </a>
                                <a
                                    href="#services"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-none px-3 py-2 text-foreground hover:bg-violet-50 hover:text-violet-700"
                                >
                                    {t.nav?.services || 'Services'}
                                </a>
                                <a
                                    href="#statistics"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-none px-3 py-2 text-foreground hover:bg-violet-50 hover:text-violet-700"
                                >
                                    {t.nav?.statistics || 'Registry'}
                                </a>
                                <a
                                    href="#announcements"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-none px-3 py-2 text-foreground hover:bg-violet-50 hover:text-violet-700"
                                >
                                    {t.nav?.announcements || 'Advisories'}
                                </a>
                                <a
                                    href="#contact"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-none px-3 py-2 text-foreground hover:bg-violet-50 hover:text-violet-700"
                                >
                                    {t.nav?.contact || 'Contact'}
                                </a>
                            </nav>

                            <div className="flex items-center justify-between border-t border-border pt-3">
                                {/* Native selection in dropdown for mobile */}
                                <div className="relative">
                                    <select
                                        value={locale}
                                        onChange={(e) =>
                                            handleLocaleSwitch(e.target.value)
                                        }
                                        className="h-8 cursor-pointer appearance-none rounded-none border border-border bg-background py-1 pr-6 pl-2.5 text-xs font-semibold text-foreground shadow-none outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600"
                                        aria-label="Language selection"
                                    >
                                        <option value="en">EN — English</option>
                                        <option value="fil">
                                            FIL — Filipino
                                        </option>
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-1.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                                </div>
                                {auth?.user ? (
                                    <Link
                                        href={dashboardUrl}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <Button
                                            size="sm"
                                            className="h-8 cursor-pointer rounded-none bg-violet-600 px-3.5 text-xs font-semibold text-white shadow-none hover:bg-violet-700"
                                        >
                                            {dashboardLabel}
                                        </Button>
                                    </Link>
                                ) : (
                                    <div className="flex gap-2">
                                        <Link href="/login">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="rounded-none text-xs shadow-none"
                                            >
                                                {t.nav?.login || 'Sign In'}
                                            </Button>
                                        </Link>
                                        <Link href="/register">
                                            <Button
                                                size="sm"
                                                className="rounded-none bg-violet-600 text-xs text-white shadow-none hover:bg-violet-700"
                                            >
                                                {t.nav?.register || 'Register'}
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </header>
            </div>

            {/* Section 1: Asymmetric Hero Section */}
            <section
                id="home"
                className="relative isolate overflow-hidden pt-8 pb-20 md:pt-14 md:pb-28"
            >
                {/* Municipal Architecture Background */}
                <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                    <img
                        src="/hero-bg.jpg"
                        alt="Barangay Lallana Government Center"
                        className="h-full w-full object-cover object-[center_30%] opacity-85 transition-opacity duration-700"
                    />
                    {/* Horizontal directional scrim: clean opaque backing on left behind text, fading to transparent on right to reveal building */}
                    <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/70 to-transparent lg:bg-gradient-to-r lg:from-background/95 lg:via-background/75 lg:via-40% lg:to-transparent" />
                    {/* Top subtle feathering under navbar */}
                    <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-background/80 to-transparent" />
                    {/* Bottom feathering transition to the next section */}
                    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background via-background/60 to-transparent" />
                </div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
                        {/* Left Hero Column: Value Proposition & CTAs */}
                        <div className="space-y-6 lg:col-span-7">
                            <h1 className="text-4xl leading-[1.08] font-extrabold tracking-tight text-balance text-foreground sm:text-5xl md:text-6xl">
                                {t.hero?.title ||
                                    'Barangay Lallana E-Government Services'}
                            </h1>

                            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                                {t.hero?.subtitle ||
                                    'Convenient, fast, and transparent digital public services for all residents of Barangay Lallana, Trece Martires City, Cavite.'}
                            </p>

                            {/* Solid Sharp CTAs */}
                            <div className="flex flex-col gap-3.5 pt-2 sm:flex-row sm:items-center">
                                <Link
                                    href={requestDocumentHref}
                                    className="group w-full sm:w-auto"
                                >
                                    <Button
                                        size="lg"
                                        className="h-12 w-full cursor-pointer rounded-none bg-violet-600 px-6 text-sm font-semibold text-white shadow-none hover:bg-violet-700"
                                    >
                                        <span>
                                            {t.hero?.cta_request ||
                                                'Request Document'}
                                        </span>
                                        <ArrowRight className="ml-2 size-4" />
                                    </Button>
                                </Link>

                                <Link
                                    href={registerHouseholdHref}
                                    className="w-full sm:w-auto"
                                >
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="h-12 w-full cursor-pointer rounded-none border-border bg-card px-6 text-sm font-semibold shadow-none hover:bg-muted"
                                    >
                                        <HomeIcon className="mr-2 size-4 text-violet-600" />
                                        <span>
                                            {t.hero?.cta_household ||
                                                'Register Household'}
                                        </span>
                                    </Button>
                                </Link>
                            </div>

                            {/* Trust Signals & Service Guarantee */}
                            <div className="grid grid-cols-3 gap-4 border-t border-border/80 pt-6">
                                <div className="space-y-1">
                                    <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                                        <QrCode className="size-3.5 text-violet-600" />
                                        QR Verified
                                    </span>
                                    <p className="text-[11px] text-muted-foreground">
                                        Tamper-proof certificates with digital
                                        seal
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                                        <Phone className="size-3.5 text-violet-600" />
                                        SMS Alerts
                                    </span>
                                    <p className="text-[11px] text-muted-foreground">
                                        Real-time status updates delivered to
                                        phone
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                                        <Clock className="size-3.5 text-violet-600" />
                                        Express Pick-up
                                    </span>
                                    <p className="text-[11px] text-muted-foreground">
                                        Skip lines with scheduled barangay claim
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Hero Column: Latest Community Announcement Showcase */}
                        <div className="lg:col-span-5">
                            <div className="relative flex flex-col justify-between overflow-hidden rounded-none border border-border bg-card p-6 shadow-none sm:p-7">
                                {/* Header / Category & Date */}
                                <div className="flex items-center justify-between border-b border-border/80 pb-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex size-9 items-center justify-center text-violet-700">
                                            <Megaphone className="size-4" />
                                        </div>
                                        <div>
                                            <span className="block text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                Community Bulletin
                                            </span>
                                            <span className="block text-xs font-extrabold text-foreground">
                                                Latest Announcement
                                            </span>
                                        </div>
                                    </div>
                                    {announcements &&
                                        announcements.length > 0 && (
                                            <span className="rounded-none border border-violet-200 bg-violet-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-violet-800 uppercase">
                                                {announcements[0].category}
                                            </span>
                                        )}
                                </div>

                                {/* Main Announcement Content */}
                                {announcements && announcements.length > 0 ? (
                                    <div className="space-y-3 py-5">
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <Calendar className="size-3.5 text-violet-600" />
                                            <span>
                                                {announcements[0].published_at}
                                            </span>
                                        </div>

                                        <Link
                                            href={`/announcements/${announcements[0].slug}`}
                                            className="group block"
                                        >
                                            <h3 className="line-clamp-2 text-base font-bold tracking-tight text-foreground transition-colors group-hover:text-violet-700 sm:text-lg">
                                                {announcements[0].title}
                                            </h3>
                                        </Link>

                                        <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                                            {announcements[0].excerpt}
                                        </p>

                                        <div className="pt-1">
                                            <Link
                                                href={`/announcements/${announcements[0].slug}`}
                                                className="inline-flex cursor-pointer items-center text-xs font-semibold text-violet-700 hover:text-violet-800 hover:underline"
                                            >
                                                <span>Read Full Advisory</span>
                                                <ChevronRight className="ml-1 size-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-1.5 py-8 text-center">
                                        <p className="text-xs font-medium text-foreground">
                                            No active announcements published at
                                            this time.
                                        </p>
                                        <p className="text-[11px] text-muted-foreground">
                                            Check back soon for official
                                            community advisories and public
                                            notices.
                                        </p>
                                    </div>
                                )}

                                {/* Bottom Action: View All Announcements if multiple exist */}
                                {announcements && announcements.length > 1 && (
                                    <div className="flex flex-col gap-2.5 border-t border-border/80 pt-4 sm:flex-row sm:items-center sm:justify-between">
                                        <span className="text-[11px] text-muted-foreground">
                                            +{announcements.length - 1} more{' '}
                                            {announcements.length - 1 === 1
                                                ? 'advisory'
                                                : 'advisories'}{' '}
                                            available
                                        </span>
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                            className="h-8 cursor-pointer rounded-none border-border bg-background px-3 text-xs font-semibold text-foreground shadow-none hover:bg-muted hover:text-violet-700"
                                        >
                                            <Link href="/announcements">
                                                <span>
                                                    View All Announcements
                                                </span>
                                                <ArrowRight className="ml-1.5 size-3.5" />
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2: About & Historical Background */}
            <section
                id="about"
                className="border-y border-border/80 bg-card py-20"
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="text-xs font-bold tracking-wider text-violet-700 uppercase">
                            Community Background
                        </span>
                        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
                            {t.about?.title || 'About Barangay Lallana'}
                        </h2>
                        <p className="mt-3 text-base text-muted-foreground">
                            {t.about?.subtitle ||
                                'A progressive and hospitable community in the heart of Trece Martires City, Cavite.'}
                        </p>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
                        {/* Historical Narrative */}
                        <div className="space-y-6 lg:col-span-7">
                            <div className="space-y-4 rounded-none border border-border bg-card p-6 shadow-none">
                                <h3 className="flex items-center gap-2.5 text-base font-bold text-foreground">
                                    <Building2 className="size-5 text-violet-600" />
                                    {t.about?.history_title ||
                                        'Historical Background & Community Profile'}
                                </h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {t.about?.history_p1 ||
                                        'Barangay Lallana is one of the thriving communities of Trece Martires City, the historical and administrative capital of Cavite. Dedicated to continuous development, the barangay serves its residents with honesty, integrity, and proactive public service.'}
                                </p>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {t.about?.history_p2 ||
                                        'With dedicated purok leaders, active community health programs, and modern infrastructure, Barangay Lallana is pioneering digital governance to make essential government documents and services accessible anytime, anywhere.'}
                                </p>
                            </div>

                            <div className="space-y-3 rounded-none border border-border bg-card p-6 shadow-none">
                                <h3 className="flex items-center gap-2.5 text-base font-bold text-foreground">
                                    <Landmark className="size-5 text-violet-600" />
                                    {t.about?.city_title ||
                                        'Trece Martires City Context'}
                                </h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {t.about?.city_p1 ||
                                        'As part of Trece Martires City - the premier government and growth center of Cavite - Barangay Lallana contributes to peace and order, socio-economic progress, and community empowerment.'}
                                </p>
                            </div>
                        </div>

                        {/* Civic Pillar Card */}
                        <div className="lg:col-span-5">
                            <div className="flex h-full flex-col justify-between rounded-none border border-border bg-card p-8 text-foreground shadow-none">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-2 rounded-none border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-800">
                                        <Award className="size-4 text-violet-600" />
                                        Pioneering Digital Governance
                                    </div>
                                    <h3 className="text-2xl leading-snug font-bold text-foreground">
                                        Modern Public Records, Accessible to
                                        Every Family.
                                    </h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        Barangay Lallana is committed to
                                        streamlining public records, eliminating
                                        unnecessary bureaucratic delays, and
                                        ensuring every resident receives
                                        compassionate, transparent service.
                                    </p>
                                </div>

                                <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border pt-6 text-xs">
                                    <div>
                                        <span className="block font-mono text-2xl font-bold text-foreground">
                                            6 Puroks
                                        </span>
                                        <span className="text-muted-foreground">
                                            Active Community Zones
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">
                                            Online Request Tracking
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3: Leadership & Governance */}
            <section id="leadership" className="bg-background py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="text-xs font-bold tracking-wider text-violet-700 uppercase">
                            Public Servants
                        </span>
                        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
                            {t.leadership?.title ||
                                'Barangay Leadership & Governance'}
                        </h2>
                        <p className="mt-3 text-base text-muted-foreground">
                            {t.leadership?.subtitle ||
                                'Dedicated public servants serving with transparency, discipline, and compassion.'}
                        </p>
                    </div>

                    {/* Executive Captain Feature Card - Solid Sharp, No Icons, No Images */}
                    <div className="mx-auto mt-12 max-w-4xl">
                        <div className="rounded-none border border-border bg-card p-6 shadow-none sm:p-8">
                            <div className="space-y-3 text-left">
                                <span className="block text-xs font-bold tracking-widest text-violet-700 uppercase">
                                    PUNONG BRGY
                                </span>
                                <h3 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                                    Cecilia M. Decillo
                                </h3>

                                <blockquote className="rounded-none border-l-2 border-violet-600 bg-violet-50/50 p-4 text-sm leading-relaxed text-foreground italic">
                                    "
                                    {t.leadership?.captain_quote ||
                                        'Good governance needs self-discipline. Only discipline within can ensure discipline without. We are committed to serving every family in Barangay Lallana with integrity and genuine care.'}
                                    "
                                </blockquote>
                            </div>
                        </div>
                    </div>

                    {/* Barangay Officials Roster - Minimalist Solid Sharp Cards, Name and Position Only, No Icons, No Images */}
                    <div className="mx-auto mt-8 max-w-5xl">
                        <h4 className="mb-4 text-center text-xs font-bold tracking-widest text-muted-foreground uppercase">
                            Barangay Officials
                        </h4>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            {[
                                {
                                    position:
                                        'COMMITTEE & COMMISSION (I KAGAWAD)',
                                    name: 'Edrian C. Leachon',
                                },
                                {
                                    position: 'COMMITTEE & PEACE (II KAGAWAD)',
                                    name: 'Sammy C. Leachon',
                                },
                                {
                                    position: 'WOMEN & FAMILY (III KAGAWAD)',
                                    name: 'Edgar M. Martinez',
                                },
                                {
                                    position: 'HEALTH (IV KAGAWAD)',
                                    name: 'Teresita M. Siapco',
                                },
                                {
                                    position: 'PAGAWAIN (V KAGAWAD)',
                                    name: 'Celedonio B. Leachon',
                                },
                                {
                                    position:
                                        'ENVIRONMENT & DISASTER (VI KAGAWAD)',
                                    name: 'Francis Dennis A. Camerino',
                                },
                                {
                                    position: 'WASTE & MEANS (VII KAGAWAD)',
                                    name: 'Larry V. Adelante',
                                },
                                {
                                    position: 'SANGGUNIAN KABATAAN (SK)',
                                    name: 'Larah Draize E. Amparo',
                                },
                            ].map((official, idx) => (
                                <div
                                    key={idx}
                                    className="flex flex-col justify-between rounded-none border border-border bg-card p-4 shadow-none transition-colors hover:border-violet-600"
                                >
                                    <span className="block text-[10px] font-bold tracking-wider text-violet-700 uppercase">
                                        {official.position}
                                    </span>
                                    <h5 className="mt-2 text-sm font-bold text-foreground">
                                        {official.name}
                                    </h5>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 4: Official Announcements */}
            <section
                id="announcements"
                className="border-t border-border bg-card py-20"
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="text-xs font-bold tracking-wider text-violet-700 uppercase">
                            Community Notices
                        </span>
                        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
                            {t.announcements?.title ||
                                'Official Announcements & Advisories'}
                        </h2>
                        <p className="mt-3 text-base text-muted-foreground">
                            {t.announcements?.subtitle ||
                                'Stay updated with the latest community news, public notices, and upcoming events.'}
                        </p>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                        {announcements && announcements.length > 0 ? (
                            announcements.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex h-full flex-col justify-between space-y-4 rounded-none border border-border bg-card p-6 shadow-none"
                                >
                                    <div className="space-y-2.5">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="rounded-none border border-violet-200 bg-violet-100 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-violet-800 uppercase">
                                                {item.category}
                                            </span>
                                            <span className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                                                <Calendar className="size-3" />
                                                {item.published_at}
                                            </span>
                                        </div>

                                        <h3 className="line-clamp-2 text-base font-bold text-foreground">
                                            {item.title}
                                        </h3>

                                        <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                                            {item.excerpt}
                                        </p>
                                    </div>

                                    <div className="border-t border-border pt-3">
                                        <Link
                                            href={`/announcements/${item.slug}`}
                                            className="inline-flex cursor-pointer items-center text-xs font-semibold text-violet-700 hover:underline"
                                        >
                                            {t.announcements?.read_more ||
                                                'Read Advisory'}
                                            <ChevronRight className="ml-1 size-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-8 text-center text-sm text-muted-foreground">
                                {t.announcements?.empty_state ||
                                    'No active announcements published at this time.'}
                            </div>
                        )}
                    </div>

                    {announcements && announcements.length > 0 && (
                        <div className="mt-10 text-center">
                            <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="rounded-none border-violet-200 text-xs font-semibold text-violet-700 shadow-none hover:bg-violet-50"
                            >
                                <Link href="/announcements">
                                    View All Announcements & Advisories
                                    <ChevronRight className="ml-1 size-3.5" />
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Section 5: Official Statistics Registry */}
            <section id="statistics" className="bg-background py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="text-xs font-bold tracking-wider text-violet-700 uppercase">
                            Transparency Registry
                        </span>
                        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
                            {t.statistics?.title || 'Community by the Numbers'}
                        </h2>
                        <p className="mt-3 text-base text-muted-foreground">
                            {t.statistics?.subtitle ||
                                'Real-time aggregate data from the Barangay Lallana E-Government Registry.'}
                        </p>
                    </div>

                    {/* Primary Aggregate Statistics */}
                    <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
                        <div className="space-y-2 rounded-none border border-border bg-card p-6 text-center shadow-none">
                            <Users className="mx-auto size-6 text-violet-600" />
                            <span className="block font-mono text-3xl font-extrabold tracking-tight text-foreground tabular-nums">
                                {(
                                    statistics.total_population ?? 5253
                                ).toLocaleString()}
                            </span>
                            <span className="block text-xs font-semibold text-foreground">
                                {t.statistics?.total_population ||
                                    'Total Population'}
                            </span>
                            <span className="block text-[11px] text-muted-foreground">
                                {t.statistics?.total_population_sub ||
                                    'Official Census'}
                            </span>
                        </div>

                        <div className="space-y-2 rounded-none border border-border bg-card p-6 text-center shadow-none">
                            <UserCheck className="mx-auto size-6 text-violet-600" />
                            <span className="block font-mono text-3xl font-extrabold tracking-tight text-foreground tabular-nums">
                                {(
                                    statistics.actual_population ?? 4180
                                ).toLocaleString()}
                            </span>
                            <span className="block text-xs font-semibold text-foreground">
                                {t.statistics?.actual_population ||
                                    'Actual Population'}
                            </span>
                            <span className="block text-[11px] text-muted-foreground">
                                {t.statistics?.actual_population_sub ||
                                    'On-ground Recorded'}
                            </span>
                        </div>

                        <div className="space-y-2 rounded-none border border-border bg-card p-6 text-center shadow-none">
                            <ShieldCheck className="mx-auto size-6 text-violet-600" />
                            <span className="block font-mono text-3xl font-extrabold tracking-tight text-foreground tabular-nums">
                                {(
                                    statistics.total_officials ?? 34
                                ).toLocaleString()}
                            </span>
                            <span className="block text-xs font-semibold text-foreground">
                                {t.statistics?.total_officials ||
                                    'Barangay Personnel'}
                            </span>
                            <span className="block text-[11px] text-muted-foreground">
                                {t.statistics?.total_officials_sub ||
                                    'Active Public Servants'}
                            </span>
                        </div>
                    </div>

                    {/* Personnel Distribution Registry */}
                    <div className="mx-auto mt-6 max-w-4xl rounded-none border border-border bg-card p-5 shadow-none sm:p-6">
                        <div className="flex flex-col gap-1 border-b border-border pb-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-xs font-bold tracking-wider text-foreground uppercase">
                                    {t.statistics?.breakdown_title ||
                                        'Barangay Personnel Breakdown'}
                                </h3>
                                <p className="text-[11px] text-muted-foreground">
                                    {t.statistics?.breakdown_subtitle ||
                                        'Dedicated public servants serving Barangay Lallana'}
                                </p>
                            </div>
                            <span className="w-fit rounded-none border border-violet-200 bg-violet-50 px-2.5 py-1 font-mono text-xs font-bold text-violet-700 dark:border-violet-900/60 dark:bg-violet-950/40 dark:text-violet-300">
                                Total: {statistics.total_officials ?? 34}{' '}
                                Personnel
                            </span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3 text-center sm:grid-cols-5">
                            <div className="space-y-1 rounded-none border border-border/70 bg-background/50 p-3">
                                <span className="block font-mono text-2xl font-extrabold text-foreground tabular-nums">
                                    {statistics.personnel_breakdown
                                        ?.officials ?? 8}
                                </span>
                                <span className="block text-xs font-semibold text-foreground">
                                    {t.statistics?.personnel_officials ||
                                        'Barangay Officials'}
                                </span>
                                <span className="block text-[10px] text-muted-foreground">
                                    {t.statistics?.personnel_officials_sub ||
                                        'Sangguniang Barangay'}
                                </span>
                            </div>

                            <div className="space-y-1 rounded-none border border-border/70 bg-background/50 p-3">
                                <span className="block font-mono text-2xl font-extrabold text-foreground tabular-nums">
                                    {statistics.personnel_breakdown?.sk ?? 8}
                                </span>
                                <span className="block text-xs font-semibold text-foreground">
                                    {t.statistics?.personnel_sk ||
                                        'SK Officials'}
                                </span>
                                <span className="block text-[10px] text-muted-foreground">
                                    {t.statistics?.personnel_sk_sub ||
                                        'Sangguniang Kabataan'}
                                </span>
                            </div>

                            <div className="space-y-1 rounded-none border border-border/70 bg-background/50 p-3">
                                <span className="block font-mono text-2xl font-extrabold text-foreground tabular-nums">
                                    {statistics.personnel_breakdown?.office ??
                                        5}
                                </span>
                                <span className="block text-xs font-semibold text-foreground">
                                    {t.statistics?.personnel_office ||
                                        'Office Staff'}
                                </span>
                                <span className="block text-[10px] text-muted-foreground">
                                    {t.statistics?.personnel_office_sub ||
                                        'Administrative & Desk'}
                                </span>
                            </div>

                            <div className="space-y-1 rounded-none border border-border/70 bg-background/50 p-3">
                                <span className="block font-mono text-2xl font-extrabold text-foreground tabular-nums">
                                    {statistics.personnel_breakdown?.tanod ?? 8}
                                </span>
                                <span className="block text-xs font-semibold text-foreground">
                                    {t.statistics?.personnel_tanod ||
                                        'Barangay Tanod'}
                                </span>
                                <span className="block text-[10px] text-muted-foreground">
                                    {t.statistics?.personnel_tanod_sub ||
                                        'Peace & Order'}
                                </span>
                            </div>

                            <div className="col-span-2 space-y-1 rounded-none border border-border/70 bg-background/50 p-3 sm:col-span-1">
                                <span className="block font-mono text-2xl font-extrabold text-foreground tabular-nums">
                                    {statistics.personnel_breakdown?.utility ??
                                        5}
                                </span>
                                <span className="block text-xs font-semibold text-foreground">
                                    {t.statistics?.personnel_utility ||
                                        'Utility Personnel'}
                                </span>
                                <span className="block text-[10px] text-muted-foreground">
                                    {t.statistics?.personnel_utility_sub ||
                                        'Maintenance & Facilities'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <p className="mx-auto mt-8 max-w-xl text-center text-xs text-muted-foreground">
                        {t.statistics?.transparency_note ||
                            'Only verified aggregate statistical counts are shown to protect resident privacy.'}
                    </p>
                </div>
            </section>

            {/* Section 6: Services & Document Catalog */}
            <section
                id="services"
                className="border-y border-border bg-card py-20"
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="text-xs font-bold tracking-wider text-violet-700 uppercase">
                            Civic E-Services
                        </span>
                        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
                            {t.services?.title || 'Barangay Digital Services'}
                        </h2>
                        <p className="mt-3 text-base text-muted-foreground">
                            {t.services?.subtitle ||
                                'Fast, verified, and secure online document requests with SMS and email status notifications.'}
                        </p>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {services && services.length > 0 ? (
                            services.map((service) => (
                                <div
                                    key={service.id}
                                    className="group flex h-full flex-col justify-between rounded-none border border-border bg-card p-6 shadow-none transition-all hover:border-violet-600"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex size-10 items-center justify-center rounded-none border border-violet-200 bg-violet-600/10 text-violet-700">
                                                <FileText className="size-5" />
                                            </div>
                                            <span className="font-mono text-xs font-bold text-violet-700">
                                                {service.fee || 'FREE'}
                                            </span>
                                        </div>

                                        <h3 className="text-base font-bold text-foreground">
                                            {service.name}
                                        </h3>

                                        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                                            {service.description}
                                        </p>

                                        {service.requirements &&
                                            service.requirements.length > 0 && (
                                                <div className="border-t border-border pt-3">
                                                    <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                                                        Requirements:
                                                    </span>
                                                    <ul className="mt-1 space-y-1 text-xs text-foreground">
                                                        {service.requirements
                                                            .slice(0, 2)
                                                            .map((req, idx) => (
                                                                <li
                                                                    key={idx}
                                                                    className="flex items-center gap-1.5 text-[11px]"
                                                                >
                                                                    <CheckCircle2 className="size-3 shrink-0 text-emerald-600" />
                                                                    <span className="truncate">
                                                                        {req}
                                                                    </span>
                                                                </li>
                                                            ))}
                                                    </ul>
                                                </div>
                                            )}
                                    </div>

                                    <div className="pt-5">
                                        <Link
                                            href={
                                                !auth?.user
                                                    ? '/login?intent=request'
                                                    : isAdmin
                                                      ? '/admin/document-requests'
                                                      : `/documents/create/${service.slug}`
                                            }
                                            className="block"
                                        >
                                            <Button
                                                size="sm"
                                                className="w-full cursor-pointer rounded-none bg-violet-600 text-xs font-semibold text-white shadow-none hover:bg-violet-700"
                                            >
                                                {t.services?.request_now ||
                                                    'Request Online'}
                                                <ArrowRight className="ml-1.5 size-3.5" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-8 text-center text-sm text-muted-foreground">
                                No active services configured at this time.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Section 7: Citizen Contact & Inquiry Form */}
            <section id="contact" className="bg-background py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                        {/* Contact Information & Office Details */}
                        <div className="space-y-6 lg:col-span-5">
                            <div>
                                <span className="text-xs font-bold tracking-wider text-violet-700 uppercase">
                                    Civic Assistance
                                </span>
                                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground">
                                    {t.contact?.title || 'Contact & Location'}
                                </h2>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {t.contact?.subtitle ||
                                        'Reach out to our Barangay Hall for assistance, inquiries, or emergency services.'}
                                </p>
                            </div>

                            <div className="space-y-4 text-sm">
                                <div className="flex items-start gap-3.5 rounded-none border border-border bg-card p-4 shadow-none">
                                    <MapPin className="mt-0.5 size-5 shrink-0 text-violet-600" />
                                    <div>
                                        <h4 className="font-semibold text-foreground">
                                            Barangay Hall
                                        </h4>
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            {t.contact?.address_val ||
                                                'Barangay Lallana Hall, Trece Martires City, Cavite 4109'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5 rounded-none border border-border bg-card p-4 shadow-none">
                                    <Phone className="mt-0.5 size-5 shrink-0 text-violet-600" />
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-semibold text-foreground">
                                            Office Telephone & Hotlines
                                        </h4>
                                        <div className="mt-0.5 flex items-center justify-between gap-2">
                                            <p className="font-mono text-xs text-muted-foreground">
                                                {t.contact?.phone_val ||
                                                    '0956-811-8583'}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleCopyNumber(
                                                        t.contact?.phone_val ||
                                                            '0956-811-8583',
                                                    )
                                                }
                                                className="inline-flex cursor-pointer items-center gap-1 rounded-none border border-border bg-background/60 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground transition-colors hover:border-violet-600 hover:text-violet-700"
                                                title="Copy hotline"
                                            >
                                                {copiedNumber ===
                                                (t.contact?.phone_val ||
                                                    '0956-811-8583') ? (
                                                    <>
                                                        <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                                                        <span className="text-emerald-600 dark:text-emerald-400">
                                                            Copied!
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="size-3" />
                                                        <span>Copy</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5 rounded-none border border-border bg-card p-4 shadow-none">
                                    <Clock className="mt-0.5 size-5 shrink-0 text-violet-600" />
                                    <div>
                                        <h4 className="font-semibold text-foreground">
                                            Operating Schedule
                                        </h4>
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            {t.contact?.operating_hours ||
                                                'Monday - Friday: 8:00 AM - 5:00 PM'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Inquiry Form */}
                        <div className="lg:col-span-7">
                            <div className="rounded-none border border-border bg-card p-6 shadow-none sm:p-8">
                                <h3 className="text-lg font-bold text-foreground">
                                    {t.contact?.inquiry_title ||
                                        'Send Us an Inquiry'}
                                </h3>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {t.contact?.inquiry_desc ||
                                        'Have a question or request assistance? Fill out the form below and our staff will respond via email.'}
                                </p>

                                {recentlySuccessful && (
                                    <div className="mt-4 flex items-center gap-2 rounded-none border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800">
                                        <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                                        <span>
                                            {t.contact?.form_success ||
                                                'Thank you! Your inquiry has been sent successfully. We will get back to you shortly.'}
                                        </span>
                                    </div>
                                )}

                                <form
                                    onSubmit={handleInquirySubmit}
                                    className="mt-6 space-y-4"
                                >
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="space-y-1.5">
                                            <Label
                                                htmlFor="name"
                                                className="text-xs font-semibold"
                                            >
                                                {t.contact?.form_name ||
                                                    'Full Name'}
                                            </Label>
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData(
                                                        'name',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                                className="rounded-none"
                                                placeholder="Juan Dela Cruz"
                                            />
                                            {errors.name && (
                                                <p className="text-[11px] text-destructive">
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label
                                                htmlFor="email"
                                                className="text-xs font-semibold"
                                            >
                                                {t.contact?.form_email ||
                                                    'Email Address'}
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        'email',
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                                className="rounded-none"
                                                placeholder="juan@example.com"
                                            />
                                            {errors.email && (
                                                <p className="text-[11px] text-destructive">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label
                                            htmlFor="subject"
                                            className="text-xs font-semibold"
                                        >
                                            {t.contact?.form_subject ||
                                                'Subject'}
                                        </Label>
                                        <Input
                                            id="subject"
                                            value={data.subject}
                                            onChange={(e) =>
                                                setData(
                                                    'subject',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                            className="rounded-none"
                                            placeholder="Document requirement inquiry..."
                                        />
                                        {errors.subject && (
                                            <p className="text-[11px] text-destructive">
                                                {errors.subject}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label
                                            htmlFor="message"
                                            className="text-xs font-semibold"
                                        >
                                            {t.contact?.form_message ||
                                                'Message / Inquiry Details'}
                                        </Label>
                                        <Textarea
                                            id="message"
                                            rows={4}
                                            value={data.message}
                                            onChange={(e) =>
                                                setData(
                                                    'message',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                            className="rounded-none"
                                            placeholder="Please state your inquiry or request details clearly..."
                                        />
                                        {errors.message && (
                                            <p className="text-[11px] text-destructive">
                                                {errors.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="pt-1">
                                        <TurnstileWidget
                                            onSuccess={(token: string) =>
                                                setData(
                                                    'cf-turnstile-response',
                                                    token,
                                                )
                                            }
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        loading={processing}
                                        className="h-11 w-full cursor-pointer rounded-none bg-violet-600 font-semibold text-white shadow-none hover:bg-violet-700"
                                    >
                                        {!processing && (
                                            <Send className="mr-2 size-4" />
                                        )}
                                        {processing
                                            ? t.contact?.form_sending ||
                                              'Sending...'
                                            : t.contact?.form_submit ||
                                              'Send Inquiry'}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Emergency & Public Assistance Directory */}
                    <div className="mt-14 border-t border-border pt-12">
                        <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                            <div>
                                <span className="text-xs font-bold tracking-wider text-rose-600 uppercase dark:text-rose-400">
                                    {t.contact?.emergency_tag ||
                                        'Emergency & Public Assistance Directory'}
                                </span>
                                <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground">
                                    {t.contact?.hotlines_title ||
                                        'Emergency Hotlines & Agency Contacts'}
                                </h3>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {t.contact?.hotlines_subtitle ||
                                        'Official emergency hotlines serving Barangay Lallana and Trece Martires City residents.'}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {emergencyHotlines.map((item) => {
                                const IconComponent = item.icon;

                                return (
                                    <div
                                        key={item.agency}
                                        className="flex flex-col justify-between rounded-none border border-border bg-card p-4 shadow-none transition-colors hover:border-violet-600"
                                    >
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <div className="flex size-8 items-center justify-center rounded-none border border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900/60 dark:bg-violet-950/40 dark:text-violet-300">
                                                    <IconComponent className="size-4" />
                                                </div>
                                                <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                                    Priority
                                                </span>
                                            </div>
                                            <h4 className="text-sm font-bold text-foreground">
                                                {item.agency}
                                            </h4>
                                            <p className="text-[11px] text-muted-foreground">
                                                {item.dept}
                                            </p>
                                        </div>

                                        <div className="mt-3 space-y-2 border-t border-border pt-3">
                                            {item.numbers.map((num) => (
                                                <button
                                                    key={num.tel}
                                                    type="button"
                                                    onClick={() =>
                                                        handleCopyNumber(
                                                            num.tel,
                                                        )
                                                    }
                                                    className="group flex w-full cursor-pointer items-center justify-between rounded-none border border-border/80 bg-background/60 px-2.5 py-1.5 text-left transition-colors hover:border-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/30"
                                                    title={`Copy ${num.tel}`}
                                                >
                                                    <div className="flex items-center gap-1.5">
                                                        {copiedNumber ===
                                                        num.tel ? (
                                                            <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                                                        ) : (
                                                            <Copy className="size-3 text-muted-foreground transition-colors group-hover:text-violet-600" />
                                                        )}
                                                        <span className="font-mono text-xs font-bold text-foreground transition-colors group-hover:text-violet-700">
                                                            {num.tel}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        {copiedNumber ===
                                                        num.tel ? (
                                                            <span className="rounded-none border border-emerald-300 bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                                                                Copied!
                                                            </span>
                                                        ) : (
                                                            <span className="rounded-none border border-border bg-muted/60 px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground group-hover:border-violet-200 group-hover:text-violet-700">
                                                                {num.network}
                                                            </span>
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Official Civic Footer */}
            <footer className="border-t border-border bg-card py-12 text-xs text-muted-foreground">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                        {/* Col 1: Barangay Seal & Identity */}
                        <div className="space-y-3 md:col-span-2">
                            <div className="flex items-center gap-3">
                                <img
                                    src="/lallana-icon.png"
                                    alt="Barangay Lallana Seal"
                                    className="size-10 object-contain"
                                />
                                <div>
                                    <span className="block text-sm font-bold text-foreground">
                                        BARANGAY LALLANA
                                    </span>
                                    <span className="text-[11px] font-semibold text-violet-700">
                                        Trece Martires City, Cavite
                                    </span>
                                </div>
                            </div>
                            <p className="max-w-md text-xs leading-relaxed">
                                The official e-government web portal of Barangay
                                Lallana, empowering residents with secure,
                                digital document processing, household
                                management, and municipal transparency.
                            </p>
                        </div>

                        {/* Col 2: Quick Links */}
                        <div className="space-y-2.5">
                            <h5 className="text-xs font-bold tracking-wider text-foreground uppercase">
                                Citizen Navigation
                            </h5>
                            <ul className="space-y-1.5 text-xs">
                                <li>
                                    <a
                                        href="#services"
                                        className="hover:text-violet-700"
                                    >
                                        Document Requests
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#about"
                                        className="hover:text-violet-700"
                                    >
                                        Community Profile
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#leadership"
                                        className="hover:text-violet-700"
                                    >
                                        Barangay Officials
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#announcements"
                                        className="hover:text-violet-700"
                                    >
                                        Public Advisories
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Col 3: Government Transparency */}
                        <div className="space-y-2.5">
                            <h5 className="text-xs font-bold tracking-wider text-foreground uppercase">
                                Republic of the Philippines
                            </h5>
                            <ul className="space-y-1.5 text-xs">
                                <li>Republic Act No. 10173 (DPA 2012)</li>
                                <li>Ease of Doing Business Act (RA 11032)</li>
                                <li>Barangay Citizen's Charter</li>
                                <li>City of Trece Martires Official Portal</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/80 pt-6 text-[11px] sm:flex-row">
                        <p>
                            © {new Date().getFullYear()} Barangay Lallana, Trece
                            Martires City, Cavite. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="hover:text-foreground">
                                Privacy Policy
                            </a>
                            <span>•</span>
                            <a href="#" className="hover:text-foreground">
                                Terms of Service
                            </a>
                            <span>•</span>
                            <a href="#" className="hover:text-foreground">
                                Accessibility
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
