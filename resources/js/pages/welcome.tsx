import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    FileText,
    Users,
    Home as HomeIcon,
    ShieldCheck,
    Building2,
    MapPin,
    Phone,
    Mail,
    Clock,
    Send,
    ChevronRight,
    Award,
    CheckCircle2,
    Calendar,
    Menu,
    X,
    Sparkles,
    FileCheck2,
    ExternalLink,
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
    const { auth, flash } = usePage<{
        auth: { user?: { name: string } };
        flash: { success?: string; error?: string };
    }>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Inquiry Contact Form
    const { data, setData, post, processing, errors, reset } = useForm({
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
        <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 selection:bg-violet-500 selection:text-white dark:bg-neutral-950 dark:text-neutral-100">
            <Head title="Barangay Lallana — E-Government Web Portal" />

            {/* Navigation Topbar */}
            <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/80 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/80">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* Logo & Identity */}
                    <a href="#home" className="group flex items-center gap-3">
                        <img
                            src="/lallana-icon.png"
                            alt="Barangay Lallana Logo"
                            className="h-12 w-12 rounded-xl object-contain shadow-xs transition-transform group-hover:scale-105"
                        />
                        <div>
                            <span className="block text-lg leading-none font-bold tracking-tight text-neutral-950 dark:text-white">
                                BARANGAY LALLANA
                            </span>
                            <span className="text-xs font-medium text-violet-600 dark:text-violet-400">
                                Trece Martires City, Cavite
                            </span>
                        </div>
                    </a>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden items-center gap-6 text-sm font-medium text-neutral-600 lg:flex dark:text-neutral-300">
                        <a
                            href="#home"
                            className="transition-colors hover:text-violet-600 dark:hover:text-violet-400"
                        >
                            {t.nav?.home || 'Home'}
                        </a>
                        <a
                            href="#about"
                            className="transition-colors hover:text-violet-600 dark:hover:text-violet-400"
                        >
                            {t.nav?.about || 'About'}
                        </a>
                        <a
                            href="#leadership"
                            className="transition-colors hover:text-violet-600 dark:hover:text-violet-400"
                        >
                            {t.nav?.leadership || 'Leadership'}
                        </a>
                        <a
                            href="#services"
                            className="transition-colors hover:text-violet-600 dark:hover:text-violet-400"
                        >
                            {t.nav?.services || 'Services'}
                        </a>
                        <a
                            href="#statistics"
                            className="transition-colors hover:text-violet-600 dark:hover:text-violet-400"
                        >
                            {t.nav?.statistics || 'Stats'}
                        </a>
                        <a
                            href="#announcements"
                            className="transition-colors hover:text-violet-600 dark:hover:text-violet-400"
                        >
                            {t.nav?.announcements || 'Announcements'}
                        </a>
                        <a
                            href="#contact"
                            className="transition-colors hover:text-violet-600 dark:hover:text-violet-400"
                        >
                            {t.nav?.contact || 'Contact'}
                        </a>
                    </nav>

                    {/* Right Actions: Locale + Auth */}
                    <div className="hidden items-center gap-3 lg:flex">
                        {/* Language Switcher */}
                        <div className="flex items-center rounded-lg bg-neutral-100 p-1 text-xs font-semibold dark:bg-neutral-800">
                            <button
                                type="button"
                                onClick={() => handleLocaleSwitch('en')}
                                className={`cursor-pointer rounded-md px-2.5 py-1 transition-all ${
                                    locale === 'en'
                                        ? 'bg-white text-violet-600 shadow-xs dark:bg-neutral-700 dark:text-violet-300'
                                        : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                                }`}
                            >
                                EN
                            </button>
                            <button
                                type="button"
                                onClick={() => handleLocaleSwitch('fil')}
                                className={`cursor-pointer rounded-md px-2.5 py-1 transition-all ${
                                    locale === 'fil'
                                        ? 'bg-white text-violet-600 shadow-xs dark:bg-neutral-700 dark:text-violet-300'
                                        : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                                }`}
                            >
                                FIL
                            </button>
                        </div>

                        {auth.user ? (
                            <Link href="/dashboard">
                                <Button
                                    size="sm"
                                    className="bg-violet-600 text-white shadow-xs hover:bg-violet-700"
                                >
                                    Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-neutral-700 dark:text-neutral-200"
                                    >
                                        {t.nav?.login || 'Sign In'}
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button
                                        size="sm"
                                        className="bg-violet-600 text-white shadow-xs hover:bg-violet-700"
                                    >
                                        {t.nav?.register || 'Create Account'}
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center gap-2 lg:hidden">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown */}
                {mobileMenuOpen && (
                    <div className="space-y-3 border-b border-neutral-200 bg-white px-4 py-4 lg:hidden dark:border-neutral-800 dark:bg-neutral-900">
                        <nav className="flex flex-col gap-2 text-sm font-medium">
                            <a
                                href="#home"
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-md px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            >
                                {t.nav?.home || 'Home'}
                            </a>
                            <a
                                href="#about"
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-md px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            >
                                {t.nav?.about || 'About'}
                            </a>
                            <a
                                href="#leadership"
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-md px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            >
                                {t.nav?.leadership || 'Leadership'}
                            </a>
                            <a
                                href="#services"
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-md px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            >
                                {t.nav?.services || 'Services'}
                            </a>
                            <a
                                href="#statistics"
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-md px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            >
                                {t.nav?.statistics || 'Stats'}
                            </a>
                            <a
                                href="#announcements"
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-md px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            >
                                {t.nav?.announcements || 'Announcements'}
                            </a>
                            <a
                                href="#contact"
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-md px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            >
                                {t.nav?.contact || 'Contact'}
                            </a>
                        </nav>

                        <div className="flex items-center justify-between border-t border-neutral-200 pt-3 dark:border-neutral-800">
                            <div className="flex items-center rounded-lg bg-neutral-100 p-1 text-xs font-semibold dark:bg-neutral-800">
                                <button
                                    type="button"
                                    onClick={() => handleLocaleSwitch('en')}
                                    className={`rounded-md px-3 py-1 ${locale === 'en' ? 'bg-white text-violet-600 dark:bg-neutral-700' : ''}`}
                                >
                                    EN
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleLocaleSwitch('fil')}
                                    className={`rounded-md px-3 py-1 ${locale === 'fil' ? 'bg-white text-violet-600 dark:bg-neutral-700' : ''}`}
                                >
                                    FIL
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <Link href="/login">
                                    <Button variant="outline" size="sm">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button
                                        size="sm"
                                        className="bg-violet-600 text-white"
                                    >
                                        Register
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Section 1: Hero Section */}
            <section
                id="home"
                className="relative isolate overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32"
            >
                {/* Background Image Container with Balanced Scrim */}
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                    <img
                        src="/hero-bg.jpg"
                        alt="Barangay Lallana Community"
                        className="h-full w-full object-cover object-center"
                    />
                    {/* Semi-transparent scrim overlay to balance image visibility with text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/50 to-neutral-50 dark:from-neutral-950/80 dark:via-neutral-950/65 dark:to-neutral-950" />
                    <div className="absolute inset-0 bg-violet-600/5 mix-blend-multiply dark:mix-blend-color-dodge" />
                </div>

                <div className="relative z-10 mx-auto max-w-7xl space-y-8 px-4 text-center sm:px-6 lg:px-8">
                    <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-100/80 px-4 py-1.5 text-xs font-semibold text-violet-800 shadow-xs md:text-sm dark:border-violet-800 dark:bg-violet-950/60 dark:text-violet-300">
                        <Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                        {t.hero?.badge || 'Official E-Government Portal'}
                    </div>

                    <h1 className="mx-auto max-w-5xl text-4xl leading-[1.1] font-extrabold tracking-tight text-neutral-950 sm:text-5xl md:text-6xl lg:text-7xl dark:text-white">
                        {t.hero?.title ||
                            'Barangay Lallana E-Government Services'}
                    </h1>

                    <p className="mx-auto max-w-3xl text-lg leading-relaxed text-neutral-600 md:text-xl dark:text-neutral-300">
                        {t.hero?.subtitle ||
                            'Convenient, fast, and transparent digital public services for all residents of Barangay Lallana, Trece Martires City, Cavite.'}
                    </p>

                    <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
                        <Link
                            href="/login?intent=request"
                            className="w-full sm:w-auto"
                        >
                            <Button
                                size="lg"
                                className="w-full cursor-pointer rounded-xl bg-violet-600 px-8 py-6 text-base font-semibold text-white shadow-lg shadow-violet-500/25 hover:bg-violet-700"
                            >
                                <FileText className="mr-2.5 h-5 w-5" />
                                {t.hero?.cta_request || 'Request Document'}
                            </Button>
                        </Link>
                        <Link
                            href="/register?intent=household"
                            className="w-full sm:w-auto"
                        >
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full cursor-pointer rounded-xl border-neutral-300 px-8 py-6 text-base font-semibold hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                            >
                                <HomeIcon className="mr-2.5 h-5 w-5 text-violet-600 dark:text-violet-400" />
                                {t.hero?.cta_household || 'Register Household'}
                            </Button>
                        </Link>
                    </div>

                    <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 pt-12 text-left sm:grid-cols-3">
                        <div className="flex items-start gap-3.5 rounded-xl border border-neutral-200/60 bg-white/60 p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/60">
                            <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-violet-600 dark:text-violet-400" />
                            <div>
                                <h4 className="text-sm font-semibold">
                                    Official QR Verification
                                </h4>
                                <p className="mt-0.5 text-xs text-neutral-500">
                                    Tamper-proof digital certificates with
                                    instant cryptographic verification.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3.5 rounded-xl border border-neutral-200/60 bg-white/60 p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/60">
                            <Phone className="mt-0.5 h-6 w-6 shrink-0 text-violet-600 dark:text-violet-400" />
                            <div>
                                <h4 className="text-sm font-semibold">
                                    SMS & Email Status Alerts
                                </h4>
                                <p className="mt-0.5 text-xs text-neutral-500">
                                    Receive real-time text updates as your
                                    documents are reviewed and approved.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3.5 rounded-xl border border-neutral-200/60 bg-white/60 p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/60">
                            <Clock className="mt-0.5 h-6 w-6 shrink-0 text-violet-600 dark:text-violet-400" />
                            <div>
                                <h4 className="text-sm font-semibold">
                                    Fast Pick-up or PDF
                                </h4>
                                <p className="mt-0.5 text-xs text-neutral-500">
                                    Skip long queues and collect your certified
                                    documents at your convenience.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2: About Section */}
            <section
                id="about"
                className="border-y border-neutral-200 bg-white py-20 dark:border-neutral-800 dark:bg-neutral-900"
            >
                <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl space-y-3 text-center">
                        <span className="text-xs font-bold tracking-wider text-violet-600 uppercase dark:text-violet-400">
                            Community Background
                        </span>
                        <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                            {t.about?.title || 'About Barangay Lallana'}
                        </h2>
                        <p className="text-base text-neutral-600 dark:text-neutral-300">
                            {t.about?.subtitle ||
                                'A progressive and hospitable community in the heart of Trece Martires City, Cavite.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
                        <div className="space-y-6 text-sm leading-relaxed text-neutral-700 md:text-base dark:text-neutral-300">
                            <div className="space-y-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-950">
                                <h3 className="flex items-center gap-2 text-lg font-bold text-neutral-950 dark:text-white">
                                    <Building2 className="h-5 w-5 text-violet-600" />
                                    {t.about?.history_title ||
                                        'Historical Background & Community Profile'}
                                </h3>
                                <p>{t.about?.history_p1}</p>
                                <p>{t.about?.history_p2}</p>
                            </div>

                            <div className="space-y-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-950">
                                <h3 className="flex items-center gap-2 text-lg font-bold text-neutral-950 dark:text-white">
                                    <MapPin className="h-5 w-5 text-violet-600" />
                                    {t.about?.city_title ||
                                        'Trece Martires City Context'}
                                </h3>
                                <p>{t.about?.city_p1}</p>
                            </div>
                        </div>

                        <div className="relative flex min-h-[380px] flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-900 p-8 text-white shadow-xl md:p-12">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                                    <Award className="h-4 w-4 text-amber-300" />
                                    Pioneering Digital Governance
                                </div>
                                <h3 className="text-2xl leading-snug font-bold md:text-3xl">
                                    Empowering Citizens through Modern
                                    E-Government.
                                </h3>
                                <p className="text-sm leading-relaxed text-violet-100">
                                    Barangay Lallana is committed to
                                    streamlining public records, eliminating
                                    unnecessary bureaucratic delays, and
                                    ensuring every resident receives
                                    compassionate, transparent service.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-6 text-xs">
                                <div>
                                    <span className="block text-lg font-bold text-white">
                                        6 Puroks
                                    </span>
                                    <span className="text-violet-200">
                                        Active Community Zones
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-lg font-bold text-white">
                                        100% Online
                                    </span>
                                    <span className="text-violet-200">
                                        Document Request Tracking
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3: Leadership & Governance Section */}
            <section
                id="leadership"
                className="bg-neutral-50 py-20 dark:bg-neutral-950"
            >
                <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl space-y-3 text-center">
                        <span className="text-xs font-bold tracking-wider text-violet-600 uppercase dark:text-violet-400">
                            Public Servants
                        </span>
                        <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                            {t.leadership?.title ||
                                'Barangay Leadership & Governance'}
                        </h2>
                        <p className="text-base text-neutral-600 dark:text-neutral-300">
                            {t.leadership?.subtitle ||
                                'Dedicated public servants serving with transparency, discipline, and compassion.'}
                        </p>
                    </div>

                    <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-neutral-200 bg-white p-8 shadow-xs md:p-12 dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="absolute top-0 right-0 -z-10 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

                        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
                            <div className="flex h-36 w-36 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-700 text-5xl font-black text-white shadow-lg md:h-44 md:w-44">
                                CMD
                            </div>

                            <div className="space-y-4 text-center md:text-left">
                                <div>
                                    <span className="text-xs font-bold tracking-wider text-violet-600 uppercase dark:text-violet-400">
                                        {t.leadership?.captain_title ||
                                            'Punong Barangay / Barangay Captain'}
                                    </span>
                                    <h3 className="mt-0.5 text-2xl font-extrabold text-neutral-950 md:text-3xl dark:text-white">
                                        {t.leadership?.captain_name ||
                                            'HON. CECILIA M. DECILLO'}
                                    </h3>
                                </div>

                                <blockquote className="rounded-r-xl border-l-4 border-violet-600 bg-violet-50/50 py-1 pl-4 text-base leading-relaxed text-neutral-700 italic md:text-lg dark:bg-violet-950/20 dark:text-neutral-300">
                                    "{t.leadership?.captain_quote}"
                                </blockquote>

                                <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-semibold text-neutral-600 md:justify-start dark:text-neutral-400">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 dark:bg-neutral-800">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />{' '}
                                        Accountable Leadership
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 dark:bg-neutral-800">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />{' '}
                                        Citizen Welfare
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mx-auto max-w-5xl space-y-6 pt-6">
                        <h4 className="text-center text-sm font-bold tracking-wide text-neutral-700 uppercase dark:text-neutral-300">
                            {t.leadership?.officials_title ||
                                'Barangay Officials & Staff'}
                        </h4>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {[1, 2, 3, 4].map((num) => (
                                <div
                                    key={num}
                                    className="space-y-2 rounded-2xl border border-dashed border-neutral-300 bg-white p-5 text-center transition-colors hover:border-violet-400 dark:border-neutral-800 dark:bg-neutral-900"
                                >
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-sm font-bold text-neutral-400 dark:bg-neutral-800">
                                        BK {num}
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                            {t.leadership?.placeholder_name}{' '}
                                            {num}
                                        </div>
                                        <div className="text-xs text-neutral-500">
                                            {t.leadership?.placeholder_role}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 4: Confirmed Services */}
            <section
                id="services"
                className="border-t border-neutral-200 bg-white py-20 dark:border-neutral-800 dark:bg-neutral-900"
            >
                <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl space-y-3 text-center">
                        <span className="text-xs font-bold tracking-wider text-violet-600 uppercase dark:text-violet-400">
                            Available Online
                        </span>
                        <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                            {t.services?.title || 'Barangay Digital Services'}
                        </h2>
                        <p className="text-base text-neutral-600 dark:text-neutral-300">
                            {t.services?.subtitle ||
                                'Fast, verified, and secure online document requests with SMS and email status notifications.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className="flex flex-col justify-between space-y-6 rounded-3xl border border-neutral-200 bg-neutral-50 p-8 shadow-xs transition-all hover:border-violet-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-violet-800"
                            >
                                <div className="space-y-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 shadow-xs dark:bg-violet-950/80 dark:text-violet-400">
                                        <FileCheck2 className="h-6 w-6" />
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="text-xl font-bold text-neutral-950 dark:text-white">
                                                {service.name}
                                            </h3>
                                            <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-bold text-violet-800 dark:bg-violet-950 dark:text-violet-300">
                                                {service.fee}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                                            {service.description}
                                        </p>
                                    </div>

                                    {service.requirements &&
                                        service.requirements.length > 0 && (
                                            <div className="space-y-2 border-t border-neutral-200 pt-4 dark:border-neutral-800">
                                                <span className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                                                    {t.services
                                                        ?.requirements_label ||
                                                        'Requirements'}
                                                    :
                                                </span>
                                                <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                                                    {service.requirements.map(
                                                        (req, idx) => (
                                                            <li
                                                                key={idx}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                                                                <span>
                                                                    {req}
                                                                </span>
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            </div>
                                        )}
                                </div>

                                <Link
                                    href={`/login?document=${service.slug}`}
                                    className="w-full"
                                >
                                    <Button className="w-full cursor-pointer rounded-xl bg-violet-600 text-white hover:bg-violet-700">
                                        {t.services?.request_now ||
                                            'Request Online'}
                                        <ChevronRight className="ml-1.5 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 5: Real-time System Statistics */}
            <section
                id="statistics"
                className="border-t border-neutral-200 bg-gradient-to-b from-neutral-50 to-neutral-100 py-20 dark:border-neutral-800 dark:from-neutral-950 dark:to-neutral-900"
            >
                <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl space-y-3 text-center">
                        <span className="text-xs font-bold tracking-wider text-violet-600 uppercase dark:text-violet-400">
                            Registry Transparency
                        </span>
                        <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                            {t.statistics?.title || 'Community by the Numbers'}
                        </h2>
                        <p className="text-base text-neutral-600 dark:text-neutral-300">
                            {t.statistics?.subtitle ||
                                'Real-time aggregate data from the Barangay Lallana E-Government Registry.'}
                        </p>
                    </div>

                    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-3">
                        <div className="space-y-3 rounded-3xl border border-neutral-200 bg-white p-8 text-center shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-950/80 dark:text-violet-400">
                                <Users className="h-7 w-7" />
                            </div>
                            <div className="text-4xl font-black tracking-tight text-neutral-950 md:text-5xl dark:text-white">
                                {statistics.total_residents.toLocaleString()}+
                            </div>
                            <div className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
                                {t.statistics?.total_residents ||
                                    'Active Residents'}
                            </div>
                        </div>

                        <div className="space-y-3 rounded-3xl border border-neutral-200 bg-white p-8 text-center shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
                                <HomeIcon className="h-7 w-7" />
                            </div>
                            <div className="text-4xl font-black tracking-tight text-neutral-950 md:text-5xl dark:text-white">
                                {statistics.total_households.toLocaleString()}+
                            </div>
                            <div className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
                                {t.statistics?.total_households ||
                                    'Registered Households'}
                            </div>
                        </div>

                        <div className="space-y-3 rounded-3xl border border-neutral-200 bg-white p-8 text-center shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-950/80 dark:text-purple-400">
                                <Building2 className="h-7 w-7" />
                            </div>
                            <div className="text-4xl font-black tracking-tight text-neutral-950 md:text-5xl dark:text-white">
                                {statistics.total_officials.toLocaleString()}
                            </div>
                            <div className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
                                {t.statistics?.total_officials ||
                                    'Barangay Personnel'}
                            </div>
                        </div>
                    </div>

                    <p className="mx-auto max-w-xl text-center text-xs text-neutral-500">
                        {t.statistics?.transparency_note ||
                            'Only verified aggregate statistical counts are shown to protect resident privacy.'}
                    </p>
                </div>
            </section>

            {/* Section 6: Dynamic Announcements Feed */}
            <section
                id="announcements"
                className="border-t border-neutral-200 bg-white py-20 dark:border-neutral-800 dark:bg-neutral-900"
            >
                <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl space-y-3 text-center">
                        <span className="text-xs font-bold tracking-wider text-violet-600 uppercase dark:text-violet-400">
                            Community Board
                        </span>
                        <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                            {t.announcements?.title ||
                                'Official Announcements & Advisories'}
                        </h2>
                        <p className="text-base text-neutral-600 dark:text-neutral-300">
                            {t.announcements?.subtitle ||
                                'Stay updated with the latest community news, public notices, and upcoming events.'}
                        </p>
                    </div>

                    {announcements.length === 0 ? (
                        <div className="mx-auto max-w-2xl space-y-3 rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center dark:border-neutral-800 dark:bg-neutral-950">
                            <Calendar className="mx-auto h-12 w-12 text-neutral-400" />
                            <h3 className="font-semibold text-neutral-700 dark:text-neutral-300">
                                {t.announcements?.empty_state ||
                                    'No active announcements published at this time.'}
                            </h3>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            {announcements.map((item) => (
                                <article
                                    key={item.id}
                                    className="flex flex-col justify-between space-y-6 rounded-3xl border border-neutral-200 bg-neutral-50 p-7 shadow-xs transition-all hover:border-violet-300 dark:border-neutral-800 dark:bg-neutral-950"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-800 dark:bg-violet-950 dark:text-violet-300">
                                                {item.category}
                                            </span>
                                            <span className="text-xs text-neutral-500">
                                                {item.published_at}
                                            </span>
                                        </div>

                                        <h3 className="text-lg leading-snug font-bold text-neutral-950 dark:text-white">
                                            {item.title}
                                        </h3>

                                        <p className="line-clamp-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                                            {item.excerpt}
                                        </p>
                                    </div>

                                    <div className="border-t border-neutral-200/80 pt-2 dark:border-neutral-800/80">
                                        <span className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-violet-600 hover:underline dark:text-violet-400">
                                            {t.announcements?.read_more ||
                                                'Read Advisory'}{' '}
                                            <ChevronRight className="h-3.5 w-3.5" />
                                        </span>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Section 7 & 8: Contact & Public Inquiry Form */}
            <section
                id="contact"
                className="border-t border-neutral-200 bg-neutral-50 py-20 dark:border-neutral-800 dark:bg-neutral-950"
            >
                <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl space-y-3 text-center">
                        <span className="text-xs font-bold tracking-wider text-violet-600 uppercase dark:text-violet-400">
                            Get In Touch
                        </span>
                        <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                            {t.contact?.title || 'Contact & Location'}
                        </h2>
                        <p className="text-base text-neutral-600 dark:text-neutral-300">
                            {t.contact?.subtitle ||
                                'Reach out to our Barangay Hall for assistance, inquiries, or emergency services.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                        {/* Left: Contact Info & Static Map Card */}
                        <div className="space-y-6 lg:col-span-5">
                            <div className="space-y-6 rounded-3xl border border-neutral-200 bg-white p-8 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                                <h3 className="flex items-center gap-2 text-xl font-bold text-neutral-950 dark:text-white">
                                    <Building2 className="h-5 w-5 text-violet-600" />
                                    {t.contact?.hall_title ||
                                        'Barangay Lallana Hall'}
                                </h3>

                                <div className="space-y-4 text-sm">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />
                                        <div>
                                            <div className="font-semibold">
                                                {t.contact?.address_label ||
                                                    'Address'}
                                            </div>
                                            <div className="text-neutral-600 dark:text-neutral-400">
                                                {t.contact?.address_val}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Phone className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />
                                        <div>
                                            <div className="font-semibold">
                                                {t.contact?.phone_label ||
                                                    'Hotlines'}
                                            </div>
                                            <div className="text-neutral-600 dark:text-neutral-400">
                                                {t.contact?.phone_val}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Mail className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />
                                        <div>
                                            <div className="font-semibold">
                                                {t.contact?.email_label ||
                                                    'Official Email'}
                                            </div>
                                            <div className="text-neutral-600 dark:text-neutral-400">
                                                {t.contact?.email_val}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Clock className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />
                                        <div>
                                            <div className="font-semibold">
                                                Office Hours
                                            </div>
                                            <div className="text-neutral-600 dark:text-neutral-400">
                                                {t.contact?.operating_hours}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Static Location Image Container */}
                            <div className="space-y-3 rounded-3xl border border-neutral-200 bg-white p-6 text-center shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                                <div className="flex aspect-video w-full flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-100 p-4 dark:border-neutral-700 dark:bg-neutral-800">
                                    <MapPin className="mb-2 h-10 w-10 animate-bounce text-violet-600" />
                                    <span className="text-sm font-bold">
                                        Barangay Lallana Location Map
                                    </span>
                                    <span className="text-xs text-neutral-500">
                                        Trece Martires City, Cavite
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Public Inquiry Form with Turnstile */}
                        <div className="lg:col-span-7">
                            <div className="space-y-6 rounded-3xl border border-neutral-200 bg-white p-8 shadow-xs md:p-10 dark:border-neutral-800 dark:bg-neutral-900">
                                <div>
                                    <h3 className="text-2xl font-bold text-neutral-950 dark:text-white">
                                        {t.contact?.inquiry_title ||
                                            'Send Us an Inquiry'}
                                    </h3>
                                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                                        {t.contact?.inquiry_desc ||
                                            'Fill out the form below and our staff will respond via email.'}
                                    </p>
                                </div>

                                {flash.success && (
                                    <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                        <CheckCircle2 className="h-5 w-5 shrink-0" />
                                        <span>{flash.success}</span>
                                    </div>
                                )}

                                <form
                                    onSubmit={handleInquirySubmit}
                                    className="space-y-4"
                                >
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
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
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>,
                                                ) =>
                                                    setData(
                                                        'name',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Juan Dela Cruz"
                                                required
                                                className="mt-1"
                                            />
                                            {errors.name && (
                                                <p className="mt-1 text-xs text-rose-600">
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>

                                        <div>
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
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>,
                                                ) =>
                                                    setData(
                                                        'email',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="juan@example.com"
                                                required
                                                className="mt-1"
                                            />
                                            {errors.email && (
                                                <p className="mt-1 text-xs text-rose-600">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
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
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>,
                                            ) =>
                                                setData(
                                                    'subject',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Request for Document Clarification / Assistance"
                                            required
                                            className="mt-1"
                                        />
                                        {errors.subject && (
                                            <p className="mt-1 text-xs text-rose-600">
                                                {errors.subject}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label
                                            htmlFor="message"
                                            className="text-xs font-semibold"
                                        >
                                            {t.contact?.form_message ||
                                                'Message'}
                                        </Label>
                                        <Textarea
                                            id="message"
                                            rows={4}
                                            value={data.message}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLTextAreaElement>,
                                            ) =>
                                                setData(
                                                    'message',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Write your detailed inquiry or question here..."
                                            required
                                            className="mt-1"
                                        />
                                        {errors.message && (
                                            <p className="mt-1 text-xs text-rose-600">
                                                {errors.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Cloudflare Turnstile Bot Challenge */}
                                    <div>
                                        <TurnstileWidget
                                            onSuccess={(token) =>
                                                setData(
                                                    'cf-turnstile-response',
                                                    token,
                                                )
                                            }
                                            onError={() =>
                                                setData(
                                                    'cf-turnstile-response',
                                                    '',
                                                )
                                            }
                                            onExpire={() =>
                                                setData(
                                                    'cf-turnstile-response',
                                                    '',
                                                )
                                            }
                                        />
                                        {errors['cf-turnstile-response'] && (
                                            <p className="mt-1 text-center text-xs text-rose-600">
                                                {
                                                    errors[
                                                        'cf-turnstile-response'
                                                    ]
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full cursor-pointer rounded-xl bg-violet-600 py-6 text-base font-semibold text-white shadow-xs hover:bg-violet-700"
                                    >
                                        <Send className="mr-2 h-4 w-4" />
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
            </section>

            {/* Footer */}
            <footer className="border-t border-neutral-800 bg-neutral-900 py-12 text-sm text-neutral-400">
                <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                        <div className="flex items-center gap-3">
                            <img
                                src="/lallana-icon.png"
                                alt="Barangay Logo"
                                className="h-10 w-10 rounded-lg object-contain"
                            />
                            <div>
                                <span className="block font-bold text-white">
                                    Barangay Lallana E-Government
                                </span>
                                <span className="text-xs text-neutral-500">
                                    Trece Martires City, Cavite
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium">
                            <a
                                href="#home"
                                className="transition-colors hover:text-white"
                            >
                                {t.nav?.home || 'Home'}
                            </a>
                            <a
                                href="#about"
                                className="transition-colors hover:text-white"
                            >
                                {t.nav?.about || 'About'}
                            </a>
                            <a
                                href="#services"
                                className="transition-colors hover:text-white"
                            >
                                {t.nav?.services || 'Services'}
                            </a>
                            <a
                                href="#announcements"
                                className="transition-colors hover:text-white"
                            >
                                {t.nav?.announcements || 'Announcements'}
                            </a>
                            <a
                                href="#contact"
                                className="transition-colors hover:text-white"
                            >
                                {t.nav?.contact || 'Contact'}
                            </a>
                            <Link
                                href="/login"
                                className="text-violet-400 hover:underline"
                            >
                                Resident Portal
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-between gap-4 border-t border-neutral-800/80 pt-6 text-xs text-neutral-500 sm:flex-row">
                        <p>
                            © {new Date().getFullYear()} Barangay Lallana, Trece
                            Martires City. All rights reserved.
                        </p>
                        <p className="flex items-center gap-2">
                            <span>Powered by Modern E-Gov Platform</span>
                            <span>•</span>
                            <a
                                href="https://trecemartirescity.gov.ph"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 hover:text-neutral-300"
                            >
                                Trece Martires City{' '}
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
