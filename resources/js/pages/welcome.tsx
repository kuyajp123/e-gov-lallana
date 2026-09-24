import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Award,
    Building2,
    Calendar,
    CheckCircle2,
    ChevronRight,
    Clock,
    FileText,
    Home as HomeIcon,
    Landmark,
    MapPin,
    Menu,
    Phone,
    QrCode,
    Send,
    ShieldCheck,
    Users,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { TurnstileWidget } from '@/shared/components/turnstile-widget';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';

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
    };
    services: ServiceItem[];
    announcements: AnnouncementItem[];
}

export default function Welcome({
    t,
    locale,
    statistics,
    services,
    announcements,
}: LandingProps) {
    const { auth } = usePage<{
        auth: { user?: { name: string } };
    }>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <div className="border-b border-violet-200/50 bg-violet-50/70 px-4 py-2 text-xs text-violet-950 dark:border-violet-900/40 dark:bg-violet-950/40 dark:text-violet-200">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex size-2 animate-pulse rounded-full bg-emerald-500" />
                        <span className="font-semibold tracking-wide text-violet-800 uppercase dark:text-violet-300">
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
            </div>

            {/* Floating Island Navigation Header */}
            <div className="sticky top-3 z-50 px-4 sm:px-6 lg:px-8">
                <header className="mx-auto max-w-6xl rounded-2xl border border-border/80 bg-background/85 px-4 shadow-sm backdrop-blur-xl transition-all sm:px-6 dark:bg-card/85">
                    <div className="flex h-16 items-center justify-between gap-4">
                        {/* Logo & Municipal Identity */}
                        <a
                            href="#home"
                            className="group flex items-center gap-3"
                        >
                            <div className="relative flex size-10 items-center justify-center rounded-xl bg-violet-600/10 p-1 ring-1 ring-violet-600/20 transition-transform group-hover:scale-105 dark:bg-violet-400/10 dark:ring-violet-400/20">
                                <img
                                    src="/lallana-icon.png"
                                    alt="Barangay Lallana Official Seal"
                                    className="size-8 object-contain"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold tracking-tight text-foreground">
                                    BARANGAY LALLANA
                                </span>
                                <span className="text-[10px] font-medium tracking-wide text-violet-700 uppercase dark:text-violet-300">
                                    Trece Martires City • Cavite
                                </span>
                            </div>
                        </a>

                        {/* Desktop Navigation Links */}
                        <nav className="hidden items-center gap-1 text-xs font-medium lg:flex">
                            <a
                                href="#home"
                                className="rounded-lg px-3 py-1.5 text-muted-foreground transition-colors hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-950/50 dark:hover:text-violet-300"
                            >
                                {t.nav?.home || 'Home'}
                            </a>
                            <a
                                href="#about"
                                className="rounded-lg px-3 py-1.5 text-muted-foreground transition-colors hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-950/50 dark:hover:text-violet-300"
                            >
                                {t.nav?.about || 'About'}
                            </a>
                            <a
                                href="#leadership"
                                className="rounded-lg px-3 py-1.5 text-muted-foreground transition-colors hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-950/50 dark:hover:text-violet-300"
                            >
                                {t.nav?.leadership || 'Leadership'}
                            </a>
                            <a
                                href="#services"
                                className="rounded-lg px-3 py-1.5 text-muted-foreground transition-colors hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-950/50 dark:hover:text-violet-300"
                            >
                                {t.nav?.services || 'Services'}
                            </a>
                            <a
                                href="#statistics"
                                className="rounded-lg px-3 py-1.5 text-muted-foreground transition-colors hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-950/50 dark:hover:text-violet-300"
                            >
                                {t.nav?.statistics || 'Registry'}
                            </a>
                            <a
                                href="#announcements"
                                className="rounded-lg px-3 py-1.5 text-muted-foreground transition-colors hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-950/50 dark:hover:text-violet-300"
                            >
                                {t.nav?.announcements || 'Advisories'}
                            </a>
                            <a
                                href="#contact"
                                className="rounded-lg px-3 py-1.5 text-muted-foreground transition-colors hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-950/50 dark:hover:text-violet-300"
                            >
                                {t.nav?.contact || 'Contact'}
                            </a>
                        </nav>

                        {/* Right Section: Language Switcher & Auth Access */}
                        <div className="hidden items-center gap-2.5 lg:flex">
                            {/* Segmented Language Switcher */}
                            <div className="flex items-center rounded-full bg-muted/80 p-0.5 text-[11px] font-semibold">
                                <button
                                    type="button"
                                    onClick={() => handleLocaleSwitch('en')}
                                    className={`cursor-pointer rounded-full px-2.5 py-0.5 transition-all ${
                                        locale === 'en'
                                            ? 'bg-card text-violet-700 shadow-xs dark:bg-neutral-800 dark:text-violet-300'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    EN
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleLocaleSwitch('fil')}
                                    className={`cursor-pointer rounded-full px-2.5 py-0.5 transition-all ${
                                        locale === 'fil'
                                            ? 'bg-card text-violet-700 shadow-xs dark:bg-neutral-800 dark:text-violet-300'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    FIL
                                </button>
                            </div>

                            {auth.user ? (
                                <Link href="/dashboard">
                                    <Button
                                        size="sm"
                                        className="h-9 cursor-pointer rounded-xl bg-violet-600 px-4 text-xs font-semibold text-white shadow-xs hover:bg-violet-700"
                                    >
                                        Resident Dashboard
                                    </Button>
                                </Link>
                            ) : (
                                <div className="flex items-center gap-1.5">
                                    <Link href="/login">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 rounded-lg px-3 text-xs font-medium text-foreground hover:bg-muted"
                                        >
                                            {t.nav?.login || 'Sign In'}
                                        </Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button
                                            size="sm"
                                            className="h-8 cursor-pointer rounded-xl bg-violet-600 px-3.5 text-xs font-semibold text-white shadow-xs hover:bg-violet-700"
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
                                className="flex size-9 items-center justify-center rounded-xl border border-border bg-card text-foreground hover:bg-muted"
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
                        <div className="space-y-3 border-t border-border/80 px-2 py-4 lg:hidden">
                            <nav className="flex flex-col gap-1 text-sm font-medium">
                                <a
                                    href="#home"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-lg px-3 py-2 text-foreground hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-950/50"
                                >
                                    {t.nav?.home || 'Home'}
                                </a>
                                <a
                                    href="#about"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-lg px-3 py-2 text-foreground hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-950/50"
                                >
                                    {t.nav?.about || 'About'}
                                </a>
                                <a
                                    href="#leadership"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-lg px-3 py-2 text-foreground hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-950/50"
                                >
                                    {t.nav?.leadership || 'Leadership'}
                                </a>
                                <a
                                    href="#services"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-lg px-3 py-2 text-foreground hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-950/50"
                                >
                                    {t.nav?.services || 'Services'}
                                </a>
                                <a
                                    href="#statistics"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-lg px-3 py-2 text-foreground hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-950/50"
                                >
                                    {t.nav?.statistics || 'Registry'}
                                </a>
                                <a
                                    href="#announcements"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-lg px-3 py-2 text-foreground hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-950/50"
                                >
                                    {t.nav?.announcements || 'Advisories'}
                                </a>
                                <a
                                    href="#contact"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-lg px-3 py-2 text-foreground hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-950/50"
                                >
                                    {t.nav?.contact || 'Contact'}
                                </a>
                            </nav>

                            <div className="flex items-center justify-between border-t border-border pt-3">
                                <div className="flex items-center rounded-full bg-muted p-0.5 text-xs font-semibold">
                                    <button
                                        type="button"
                                        onClick={() => handleLocaleSwitch('en')}
                                        className={`rounded-full px-3 py-1 ${locale === 'en' ? 'bg-card text-violet-700 shadow-xs' : 'text-muted-foreground'}`}
                                    >
                                        EN
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleLocaleSwitch('fil')
                                        }
                                        className={`rounded-full px-3 py-1 ${locale === 'fil' ? 'bg-card text-violet-700 shadow-xs' : 'text-muted-foreground'}`}
                                    >
                                        FIL
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    <Link href="/login">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-xl text-xs"
                                        >
                                            Sign In
                                        </Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button
                                            size="sm"
                                            className="rounded-xl bg-violet-600 text-xs text-white hover:bg-violet-700"
                                        >
                                            Register
                                        </Button>
                                    </Link>
                                </div>
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
                        className="h-full w-full object-cover object-[center_30%] opacity-85 transition-opacity duration-700 dark:opacity-50"
                    />
                    {/* Horizontal directional scrim: clean opaque backing on left behind text, fading to transparent on right to reveal building */}
                    <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/70 to-transparent lg:bg-gradient-to-r lg:from-background/95 lg:via-background/75 lg:via-40% lg:to-transparent dark:from-background/95 dark:via-background/80 dark:to-transparent" />
                    {/* Top subtle feathering under navbar */}
                    <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-background/80 to-transparent" />
                    {/* Bottom feathering transition to the next section */}
                    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background via-background/60 to-transparent" />
                </div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
                        {/* Left Hero Column: Value Proposition & CTAs */}
                        <div className="space-y-6 lg:col-span-7">
                            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-violet-50/80 px-3.5 py-1 text-[11px] font-semibold tracking-wider text-violet-800 uppercase shadow-xs dark:border-violet-800/60 dark:bg-violet-950/60 dark:text-violet-300">
                                <span className="size-1.5 animate-ping rounded-full bg-violet-600" />
                                {t.hero?.badge ||
                                    'Official E-Government Portal'}
                            </div>

                            <h1 className="text-4xl leading-[1.08] font-extrabold tracking-tight text-balance text-foreground sm:text-5xl md:text-6xl">
                                {t.hero?.title ||
                                    'Barangay Lallana E-Government Services'}
                            </h1>

                            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                                {t.hero?.subtitle ||
                                    'Convenient, fast, and transparent digital public services for all residents of Barangay Lallana, Trece Martires City, Cavite.'}
                            </p>

                            {/* Nested CTA & Button-in-Button Architecture */}
                            <div className="flex flex-col gap-3.5 pt-2 sm:flex-row sm:items-center">
                                <Link
                                    href="/login?intent=request"
                                    className="group w-full sm:w-auto"
                                >
                                    <Button
                                        size="lg"
                                        className="h-12 w-full cursor-pointer rounded-full bg-violet-600 pr-2 pl-6 text-sm font-semibold text-white shadow-md shadow-violet-600/20 transition-all hover:bg-violet-700 active:scale-[0.98]"
                                    >
                                        <span>
                                            {t.hero?.cta_request ||
                                                'Request Document'}
                                        </span>
                                        <span className="ml-3 flex size-8 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:translate-x-0.5">
                                            <ArrowRight className="size-4" />
                                        </span>
                                    </Button>
                                </Link>

                                <Link
                                    href="/register?intent=household"
                                    className="w-full sm:w-auto"
                                >
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="h-12 w-full cursor-pointer rounded-full border-border bg-card px-6 text-sm font-semibold hover:bg-muted active:scale-[0.98]"
                                    >
                                        <HomeIcon className="mr-2 size-4 text-violet-600 dark:text-violet-400" />
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
                                        <QrCode className="size-3.5 text-violet-600 dark:text-violet-400" />
                                        QR Verified
                                    </span>
                                    <p className="text-[11px] text-muted-foreground">
                                        Tamper-proof certificates with digital
                                        seal
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                                        <Phone className="size-3.5 text-violet-600 dark:text-violet-400" />
                                        SMS Alerts
                                    </span>
                                    <p className="text-[11px] text-muted-foreground">
                                        Real-time status updates delivered to
                                        phone
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                                        <Clock className="size-3.5 text-violet-600 dark:text-violet-400" />
                                        Express Pick-up
                                    </span>
                                    <p className="text-[11px] text-muted-foreground">
                                        Skip lines with scheduled barangay claim
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Hero Column: Double-Bezel Interactive Certificate Showcase */}
                        <div className="lg:col-span-5">
                            <div className="bezel-outer relative">
                                <div className="bezel-inner relative overflow-hidden p-6 sm:p-8">
                                    {/* Republic Header Banner */}
                                    <div className="flex items-center justify-between border-b border-border/80 pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-11 rounded-xl bg-violet-600/10 p-1.5 ring-1 ring-violet-600/20">
                                                <img
                                                    src="/lallana-icon.png"
                                                    alt="Barangay Seal"
                                                    className="size-full object-contain"
                                                />
                                            </div>
                                            <div>
                                                <span className="block text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                                    Republic of the Philippines
                                                </span>
                                                <span className="block text-xs font-extrabold text-foreground">
                                                    BARANGAY LALLANA
                                                </span>
                                                <span className="text-[10px] font-medium text-violet-600 dark:text-violet-400">
                                                    Trece Martires City, Cavite
                                                </span>
                                            </div>
                                        </div>
                                        <div className="rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-950/40 dark:text-emerald-300">
                                            VERIFIED PORTAL
                                        </div>
                                    </div>

                                    {/* Document Simulation Preview */}
                                    <div className="my-6 space-y-3 rounded-xl border border-dashed border-border bg-muted/30 p-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-semibold text-foreground">
                                                Official Barangay Clearance
                                            </span>
                                            <span className="font-mono text-[10px] text-muted-foreground">
                                                LAL-2026-0842
                                            </span>
                                        </div>
                                        <div className="h-1.5 w-3/4 rounded-full bg-border" />
                                        <div className="h-1.5 w-1/2 rounded-full bg-border" />

                                        <div className="flex items-center justify-between pt-2">
                                            <div className="flex items-center gap-1.5">
                                                <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                                <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                                                    Seal & Signature
                                                    Authenticated
                                                </span>
                                            </div>
                                            <QrCode className="size-6 text-foreground/70" />
                                        </div>
                                    </div>

                                    {/* Live Registry Mini-Counters */}
                                    <div className="grid grid-cols-2 gap-3 pt-2">
                                        <div className="rounded-xl border border-border/70 bg-card p-3">
                                            <span className="block font-mono text-xl font-bold tracking-tight text-foreground tabular-nums">
                                                {statistics.total_residents.toLocaleString()}
                                                +
                                            </span>
                                            <span className="text-[11px] text-muted-foreground">
                                                Active Residents
                                            </span>
                                        </div>
                                        <div className="rounded-xl border border-border/70 bg-card p-3">
                                            <span className="block font-mono text-xl font-bold tracking-tight text-violet-700 tabular-nums dark:text-violet-300">
                                                {statistics.total_households.toLocaleString()}
                                                +
                                            </span>
                                            <span className="text-[11px] text-muted-foreground">
                                                Verified Households
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between rounded-lg bg-violet-50/80 px-3 py-2 text-[11px] text-violet-900 dark:bg-violet-950/40 dark:text-violet-200">
                                        <span className="flex items-center gap-1.5 font-medium">
                                            <ShieldCheck className="size-3.5 text-violet-700 dark:text-violet-400" />
                                            ISO-Aligned Data Privacy Act of 2012
                                        </span>
                                        <span className="font-semibold">
                                            Compliant
                                        </span>
                                    </div>
                                </div>
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
                        <span className="text-xs font-bold tracking-wider text-violet-700 uppercase dark:text-violet-400">
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
                            <div className="bezel-outer">
                                <div className="bezel-inner space-y-4 p-6">
                                    <h3 className="flex items-center gap-2.5 text-base font-bold text-foreground">
                                        <Building2 className="size-5 text-violet-600 dark:text-violet-400" />
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
                            </div>

                            <div className="bezel-outer">
                                <div className="bezel-inner space-y-3 p-6">
                                    <h3 className="flex items-center gap-2.5 text-base font-bold text-foreground">
                                        <Landmark className="size-5 text-violet-600 dark:text-violet-400" />
                                        {t.about?.city_title ||
                                            'Trece Martires City Context'}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        {t.about?.city_p1 ||
                                            'As part of Trece Martires City - the premier government and growth center of Cavite - Barangay Lallana contributes to peace and order, socio-economic progress, and community empowerment.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Civic Pillar Card */}
                        <div className="lg:col-span-5">
                            <div className="flex h-full flex-col justify-between rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-900 to-indigo-950 p-8 text-white shadow-lg dark:border-violet-800/50">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                                        <Award className="size-4 text-amber-300" />
                                        Pioneering Digital Governance
                                    </div>
                                    <h3 className="text-2xl leading-snug font-bold">
                                        Modern Public Records, Accessible to
                                        Every Family.
                                    </h3>
                                    <p className="text-sm leading-relaxed text-violet-200">
                                        Barangay Lallana is committed to
                                        streamlining public records, eliminating
                                        unnecessary bureaucratic delays, and
                                        ensuring every resident receives
                                        compassionate, transparent service.
                                    </p>
                                </div>

                                <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/15 pt-6 text-xs">
                                    <div>
                                        <span className="block font-mono text-2xl font-bold text-white">
                                            6 Puroks
                                        </span>
                                        <span className="text-violet-300">
                                            Active Community Zones
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block font-mono text-2xl font-bold text-white">
                                            100%
                                        </span>
                                        <span className="text-violet-300">
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
                        <span className="text-xs font-bold tracking-wider text-violet-700 uppercase dark:text-violet-400">
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

                    {/* Executive Captain Feature Card */}
                    <div className="mx-auto mt-12 max-w-4xl">
                        <div className="bezel-outer">
                            <div className="bezel-inner p-6 sm:p-10">
                                <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
                                    {/* Dignified Executive Badge Avatar */}
                                    <div className="relative flex size-36 shrink-0 flex-col items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-700 to-indigo-800 p-4 text-center text-white shadow-md ring-2 ring-violet-500/20 md:size-44">
                                        <img
                                            src="/lallana-icon.png"
                                            alt="Barangay Crest"
                                            className="mb-2 size-16 object-contain drop-shadow-md"
                                        />
                                        <span className="text-[10px] font-extrabold tracking-widest text-violet-200 uppercase">
                                            Punong Barangay
                                        </span>
                                        <span className="text-xs font-bold">
                                            DECILO
                                        </span>
                                    </div>

                                    <div className="space-y-4 text-center md:text-left">
                                        <div>
                                            <span className="text-xs font-bold tracking-wider text-violet-700 uppercase dark:text-violet-400">
                                                {t.leadership?.captain_title ||
                                                    'Punong Barangay / Barangay Captain'}
                                            </span>
                                            <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                                                {t.leadership?.captain_name ||
                                                    'HON. CECILIA M. DECILLO'}
                                            </h3>
                                        </div>

                                        <blockquote className="rounded-xl border-l-4 border-violet-600 bg-violet-50/50 p-4 text-sm leading-relaxed text-foreground italic md:text-base dark:bg-violet-950/20">
                                            "
                                            {t.leadership?.captain_quote ||
                                                'Good governance needs self-discipline. Only discipline within can ensure discipline without. We are committed to serving every family in Barangay Lallana with integrity and genuine care.'}
                                            "
                                        </blockquote>

                                        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1 text-xs font-semibold md:justify-start">
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-foreground">
                                                <CheckCircle2 className="size-3.5 text-emerald-600" />
                                                Accountable Leadership
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-foreground">
                                                <CheckCircle2 className="size-3.5 text-emerald-600" />
                                                Citizen Welfare First
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Council Kagawads Grid */}
                    <div className="mx-auto mt-10 max-w-5xl">
                        <h4 className="mb-6 text-center text-xs font-bold tracking-widest text-muted-foreground uppercase">
                            {t.leadership?.officials_title ||
                                'Barangay Council & Executive Staff'}
                        </h4>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {[
                                {
                                    name: 'Committee on Peace & Order',
                                    role: 'Barangay Kagawad',
                                },
                                {
                                    name: 'Committee on Health & Sanitation',
                                    role: 'Barangay Kagawad',
                                },
                                {
                                    name: 'Committee on Public Works',
                                    role: 'Barangay Kagawad',
                                },
                                {
                                    name: 'Committee on Education & Youth',
                                    role: 'SK Chairperson',
                                },
                            ].map((item, index) => (
                                <div key={index} className="bezel-outer">
                                    <div className="bezel-inner space-y-1.5 p-4 text-center">
                                        <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-violet-600/10 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300">
                                            <Users className="size-5" />
                                        </div>
                                        <h5 className="text-xs font-bold text-foreground">
                                            {item.name}
                                        </h5>
                                        <span className="block text-[10px] text-muted-foreground">
                                            {item.role}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 4: Services & Document Catalog */}
            <section
                id="services"
                className="border-y border-border/80 bg-card py-20"
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="text-xs font-bold tracking-wider text-violet-700 uppercase dark:text-violet-400">
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
                                    className="bezel-outer group"
                                >
                                    <div className="bezel-inner flex h-full flex-col justify-between p-6 transition-all hover:border-violet-300 dark:hover:border-violet-700">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex size-10 items-center justify-center rounded-xl bg-violet-600/10 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300">
                                                    <FileText className="size-5" />
                                                </div>
                                                <span className="font-mono text-xs font-bold text-violet-700 dark:text-violet-300">
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
                                                service.requirements.length >
                                                    0 && (
                                                    <div className="border-t border-border/70 pt-3">
                                                        <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                                                            Requirements:
                                                        </span>
                                                        <ul className="mt-1 space-y-1 text-xs text-foreground">
                                                            {service.requirements
                                                                .slice(0, 2)
                                                                .map(
                                                                    (
                                                                        req,
                                                                        idx,
                                                                    ) => (
                                                                        <li
                                                                            key={
                                                                                idx
                                                                            }
                                                                            className="flex items-center gap-1.5 text-[11px]"
                                                                        >
                                                                            <CheckCircle2 className="size-3 shrink-0 text-emerald-600" />
                                                                            <span className="truncate">
                                                                                {
                                                                                    req
                                                                                }
                                                                            </span>
                                                                        </li>
                                                                    ),
                                                                )}
                                                        </ul>
                                                    </div>
                                                )}
                                        </div>

                                        <div className="pt-5">
                                            <Link
                                                href="/login?intent=request"
                                                className="block"
                                            >
                                                <Button
                                                    size="sm"
                                                    className="w-full cursor-pointer rounded-xl bg-violet-600 text-xs font-semibold text-white shadow-xs hover:bg-violet-700 active:scale-[0.98]"
                                                >
                                                    {t.services?.request_now ||
                                                        'Request Online'}
                                                    <ArrowRight className="ml-1.5 size-3.5" />
                                                </Button>
                                            </Link>
                                        </div>
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

            {/* Section 5: Official Statistics Registry */}
            <section id="statistics" className="bg-background py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="text-xs font-bold tracking-wider text-violet-700 uppercase dark:text-violet-400">
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

                    <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
                        <div className="bezel-outer">
                            <div className="bezel-inner space-y-2 p-6 text-center">
                                <Users className="mx-auto size-6 text-violet-600 dark:text-violet-400" />
                                <span className="block font-mono text-3xl font-extrabold tracking-tight text-foreground tabular-nums">
                                    {statistics.total_residents.toLocaleString()}
                                </span>
                                <span className="block text-xs font-semibold text-muted-foreground">
                                    {t.statistics?.total_residents ||
                                        'Active Residents'}
                                </span>
                            </div>
                        </div>

                        <div className="bezel-outer">
                            <div className="bezel-inner space-y-2 p-6 text-center">
                                <HomeIcon className="mx-auto size-6 text-violet-600 dark:text-violet-400" />
                                <span className="block font-mono text-3xl font-extrabold tracking-tight text-violet-700 tabular-nums dark:text-violet-300">
                                    {statistics.total_households.toLocaleString()}
                                </span>
                                <span className="block text-xs font-semibold text-muted-foreground">
                                    {t.statistics?.total_households ||
                                        'Registered Households'}
                                </span>
                            </div>
                        </div>

                        <div className="bezel-outer">
                            <div className="bezel-inner space-y-2 p-6 text-center">
                                <ShieldCheck className="mx-auto size-6 text-violet-600 dark:text-violet-400" />
                                <span className="block font-mono text-3xl font-extrabold tracking-tight text-foreground tabular-nums">
                                    {statistics.total_officials.toLocaleString()}
                                </span>
                                <span className="block text-xs font-semibold text-muted-foreground">
                                    {t.statistics?.total_officials ||
                                        'Barangay Personnel'}
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

            {/* Section 6: Official Announcements */}
            <section
                id="announcements"
                className="border-t border-border/80 bg-card py-20"
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="text-xs font-bold tracking-wider text-violet-700 uppercase dark:text-violet-400">
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
                                <div key={item.id} className="bezel-outer">
                                    <div className="bezel-inner flex h-full flex-col justify-between space-y-4 p-6">
                                        <div className="space-y-2.5">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-violet-800 uppercase dark:bg-violet-950/60 dark:text-violet-300">
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

                                        <div className="border-t border-border/70 pt-3">
                                            <Link
                                                href={`/announcements/${item.slug}`}
                                                className="inline-flex cursor-pointer items-center text-xs font-semibold text-violet-700 hover:underline dark:text-violet-400"
                                            >
                                                {t.announcements?.read_more ||
                                                    'Read Advisory'}
                                                <ChevronRight className="ml-1 size-3.5" />
                                            </Link>
                                        </div>
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
                                className="rounded-xl border-violet-200 text-xs font-semibold text-violet-700 hover:bg-violet-50 dark:border-violet-800 dark:text-violet-300 dark:hover:bg-violet-950/50"
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

            {/* Section 7: Citizen Contact & Inquiry Form */}
            <section id="contact" className="bg-background py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                        {/* Contact Information & Office Details */}
                        <div className="space-y-6 lg:col-span-5">
                            <div>
                                <span className="text-xs font-bold tracking-wider text-violet-700 uppercase dark:text-violet-400">
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
                                <div className="flex items-start gap-3.5 rounded-xl border border-border/80 bg-card p-4">
                                    <MapPin className="mt-0.5 size-5 shrink-0 text-violet-600 dark:text-violet-400" />
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

                                <div className="flex items-start gap-3.5 rounded-xl border border-border/80 bg-card p-4">
                                    <Phone className="mt-0.5 size-5 shrink-0 text-violet-600 dark:text-violet-400" />
                                    <div>
                                        <h4 className="font-semibold text-foreground">
                                            Office Telephone & Hotlines
                                        </h4>
                                        <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                                            {t.contact?.phone_val ||
                                                '+63 (46) 419-0000 / 0917-000-0000'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5 rounded-xl border border-border/80 bg-card p-4">
                                    <Clock className="mt-0.5 size-5 shrink-0 text-violet-600 dark:text-violet-400" />
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
                            <div className="bezel-outer">
                                <div className="bezel-inner p-6 sm:p-8">
                                    <h3 className="text-lg font-bold text-foreground">
                                        {t.contact?.inquiry_title ||
                                            'Send Us an Inquiry'}
                                    </h3>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {t.contact?.inquiry_desc ||
                                            'Have a question or request assistance? Fill out the form below and our staff will respond via email.'}
                                    </p>

                                    {recentlySuccessful && (
                                        <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
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
                                                    className="rounded-xl"
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
                                                    className="rounded-xl"
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
                                                className="rounded-xl"
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
                                                className="rounded-xl"
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
                                            className="h-11 w-full cursor-pointer rounded-xl bg-violet-600 font-semibold text-white shadow-xs hover:bg-violet-700 active:scale-[0.98]"
                                        >
                                            <Send className="mr-2 size-4" />
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
                                    <span className="text-[11px] font-semibold text-violet-700 dark:text-violet-300">
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
                            <div className="flex items-center gap-2 pt-2 text-[11px]">
                                <span className="inline-block size-2 rounded-full bg-emerald-500" />
                                <span>
                                    Philippine Standard Time (PST): Active
                                </span>
                            </div>
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
                                        className="hover:text-violet-700 dark:hover:text-violet-300"
                                    >
                                        Document Requests
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#about"
                                        className="hover:text-violet-700 dark:hover:text-violet-300"
                                    >
                                        Community Profile
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#leadership"
                                        className="hover:text-violet-700 dark:hover:text-violet-300"
                                    >
                                        Barangay Officials
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#announcements"
                                        className="hover:text-violet-700 dark:hover:text-violet-300"
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
