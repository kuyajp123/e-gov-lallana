import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import { TurnstileWidget } from '@/shared/components/turnstile-widget';
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

export default function Welcome({ t, locale, statistics, services, announcements }: LandingProps) {
    const { auth, flash } = usePage<{ auth: { user?: { name: string } }; flash: { success?: string; error?: string } }>().props;
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
            router.post('/locale', { locale: newLocale }, { preserveScroll: true });
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans selection:bg-violet-500 selection:text-white">
            <Head title="Barangay Lallana — E-Government Web Portal" />

            {/* Navigation Topbar */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    {/* Logo & Identity */}
                    <a href="#home" className="flex items-center gap-3 group">
                        <img
                            src="/lallana-icon.png"
                            alt="Barangay Lallana Logo"
                            className="w-12 h-12 rounded-xl object-contain shadow-xs group-hover:scale-105 transition-transform"
                        />
                        <div>
                            <span className="block text-lg font-bold tracking-tight text-neutral-950 dark:text-white leading-none">
                                BARANGAY LALLANA
                            </span>
                            <span className="text-xs font-medium text-violet-600 dark:text-violet-400">
                                Trece Martires City, Cavite
                            </span>
                        </div>
                    </a>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-300">
                        <a href="#home" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{t.nav?.home || 'Home'}</a>
                        <a href="#about" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{t.nav?.about || 'About'}</a>
                        <a href="#leadership" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{t.nav?.leadership || 'Leadership'}</a>
                        <a href="#services" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{t.nav?.services || 'Services'}</a>
                        <a href="#statistics" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{t.nav?.statistics || 'Stats'}</a>
                        <a href="#announcements" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{t.nav?.announcements || 'Announcements'}</a>
                        <a href="#contact" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{t.nav?.contact || 'Contact'}</a>
                    </nav>

                    {/* Right Actions: Locale + Auth */}
                    <div className="hidden lg:flex items-center gap-3">
                        {/* Language Switcher */}
                        <div className="flex items-center rounded-lg bg-neutral-100 dark:bg-neutral-800 p-1 text-xs font-semibold">
                            <button
                                type="button"
                                onClick={() => handleLocaleSwitch('en')}
                                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                                    locale === 'en'
                                        ? 'bg-white dark:bg-neutral-700 text-violet-600 dark:text-violet-300 shadow-xs'
                                        : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                                }`}
                            >
                                EN
                            </button>
                            <button
                                type="button"
                                onClick={() => handleLocaleSwitch('fil')}
                                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                                    locale === 'fil'
                                        ? 'bg-white dark:bg-neutral-700 text-violet-600 dark:text-violet-300 shadow-xs'
                                        : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                                }`}
                            >
                                FIL
                            </button>
                        </div>

                        {auth.user ? (
                            <Link href="/dashboard">
                                <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white shadow-xs">
                                    Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" size="sm" className="text-neutral-700 dark:text-neutral-200">
                                        {t.nav?.login || 'Sign In'}
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white shadow-xs">
                                        {t.nav?.register || 'Create Account'}
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown */}
                {mobileMenuOpen && (
                    <div className="lg:hidden border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-4 space-y-3">
                        <nav className="flex flex-col gap-2 text-sm font-medium">
                            <a href="#home" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800">{t.nav?.home || 'Home'}</a>
                            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800">{t.nav?.about || 'About'}</a>
                            <a href="#leadership" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800">{t.nav?.leadership || 'Leadership'}</a>
                            <a href="#services" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800">{t.nav?.services || 'Services'}</a>
                            <a href="#statistics" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800">{t.nav?.statistics || 'Stats'}</a>
                            <a href="#announcements" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800">{t.nav?.announcements || 'Announcements'}</a>
                            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800">{t.nav?.contact || 'Contact'}</a>
                        </nav>

                        <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                            <div className="flex items-center rounded-lg bg-neutral-100 dark:bg-neutral-800 p-1 text-xs font-semibold">
                                <button type="button" onClick={() => handleLocaleSwitch('en')} className={`px-3 py-1 rounded-md ${locale === 'en' ? 'bg-white dark:bg-neutral-700 text-violet-600' : ''}`}>EN</button>
                                <button type="button" onClick={() => handleLocaleSwitch('fil')} className={`px-3 py-1 rounded-md ${locale === 'fil' ? 'bg-white dark:bg-neutral-700 text-violet-600' : ''}`}>FIL</button>
                            </div>
                            <div className="flex gap-2">
                                <Link href="/login"><Button variant="outline" size="sm">Sign In</Button></Link>
                                <Link href="/register"><Button size="sm" className="bg-violet-600 text-white">Register</Button></Link>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Section 1: Hero Section */}
            <section id="home" className="relative isolate pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden">
                {/* Background Image Container with Balanced Scrim */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <img
                        src="/hero-bg.jpg"
                        alt="Barangay Lallana Community"
                        className="w-full h-full object-cover object-center"
                    />
                    {/* Semi-transparent scrim overlay to balance image visibility with text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/50 to-neutral-50 dark:from-neutral-950/80 dark:via-neutral-950/65 dark:to-neutral-950" />
                    <div className="absolute inset-0 bg-violet-600/5 mix-blend-multiply dark:mix-blend-color-dodge" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100/80 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800 text-xs md:text-sm font-semibold text-violet-800 dark:text-violet-300 shadow-xs">
                        <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                        {t.hero?.badge || 'Official E-Government Portal'}
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-neutral-950 dark:text-white max-w-5xl mx-auto leading-[1.1]">
                        {t.hero?.title || 'Barangay Lallana E-Government Services'}
                    </h1>

                    <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto leading-relaxed">
                        {t.hero?.subtitle || 'Convenient, fast, and transparent digital public services for all residents of Barangay Lallana, Trece Martires City, Cavite.'}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link href="/login?intent=request" className="w-full sm:w-auto">
                            <Button size="lg" className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow-lg shadow-violet-500/25 px-8 py-6 text-base rounded-xl cursor-pointer">
                                <FileText className="w-5 h-5 mr-2.5" />
                                {t.hero?.cta_request || 'Request Document'}
                            </Button>
                        </Link>
                        <Link href="/register?intent=household" className="w-full sm:w-auto">
                            <Button variant="outline" size="lg" className="w-full border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 px-8 py-6 text-base font-semibold rounded-xl cursor-pointer">
                                <HomeIcon className="w-5 h-5 mr-2.5 text-violet-600 dark:text-violet-400" />
                                {t.hero?.cta_household || 'Register Household'}
                            </Button>
                        </Link>
                    </div>

                    <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
                        <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white/60 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800 shadow-xs">
                            <ShieldCheck className="w-6 h-6 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-sm">Official QR Verification</h4>
                                <p className="text-xs text-neutral-500 mt-0.5">Tamper-proof digital certificates with instant cryptographic verification.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white/60 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800 shadow-xs">
                            <Phone className="w-6 h-6 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-sm">SMS & Email Status Alerts</h4>
                                <p className="text-xs text-neutral-500 mt-0.5">Receive real-time text updates as your documents are reviewed and approved.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white/60 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800 shadow-xs">
                            <Clock className="w-6 h-6 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-sm">Fast Pick-up or PDF</h4>
                                <p className="text-xs text-neutral-500 mt-0.5">Skip long queues and collect your certified documents at your convenience.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2: About Section */}
            <section id="about" className="py-20 bg-white dark:bg-neutral-900 border-y border-neutral-200 dark:border-neutral-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="text-center max-w-3xl mx-auto space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                            Community Background
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                            {t.about?.title || 'About Barangay Lallana'}
                        </h2>
                        <p className="text-base text-neutral-600 dark:text-neutral-300">
                            {t.about?.subtitle || 'A progressive and hospitable community in the heart of Trece Martires City, Cavite.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        <div className="space-y-6 text-neutral-700 dark:text-neutral-300 leading-relaxed text-sm md:text-base">
                            <div className="bg-neutral-50 dark:bg-neutral-950 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-3">
                                <h3 className="text-lg font-bold text-neutral-950 dark:text-white flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-violet-600" />
                                    {t.about?.history_title || 'Historical Background & Community Profile'}
                                </h3>
                                <p>{t.about?.history_p1}</p>
                                <p>{t.about?.history_p2}</p>
                            </div>

                            <div className="bg-neutral-50 dark:bg-neutral-950 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-3">
                                <h3 className="text-lg font-bold text-neutral-950 dark:text-white flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-violet-600" />
                                    {t.about?.city_title || 'Trece Martires City Context'}
                                </h3>
                                <p>{t.about?.city_p1}</p>
                            </div>
                        </div>

                        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-violet-600 to-indigo-900 p-8 md:p-12 text-white shadow-xl flex flex-col justify-between min-h-[380px]">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold">
                                    <Award className="w-4 h-4 text-amber-300" />
                                    Pioneering Digital Governance
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold leading-snug">
                                    Empowering Citizens through Modern E-Government.
                                </h3>
                                <p className="text-violet-100 text-sm leading-relaxed">
                                    Barangay Lallana is committed to streamlining public records, eliminating unnecessary bureaucratic delays, and ensuring every resident receives compassionate, transparent service.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/20 text-xs">
                                <div>
                                    <span className="block font-bold text-lg text-white">6 Puroks</span>
                                    <span className="text-violet-200">Active Community Zones</span>
                                </div>
                                <div>
                                    <span className="block font-bold text-lg text-white">100% Online</span>
                                    <span className="text-violet-200">Document Request Tracking</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3: Leadership & Governance Section */}
            <section id="leadership" className="py-20 bg-neutral-50 dark:bg-neutral-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="text-center max-w-3xl mx-auto space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                            Public Servants
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                            {t.leadership?.title || 'Barangay Leadership & Governance'}
                        </h2>
                        <p className="text-base text-neutral-600 dark:text-neutral-300">
                            {t.leadership?.subtitle || 'Dedicated public servants serving with transparency, discipline, and compassion.'}
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 md:p-12 shadow-xs relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -z-10" />

                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                            <div className="w-36 h-36 md:w-44 md:h-44 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-700 flex items-center justify-center text-white text-5xl font-black shrink-0 shadow-lg">
                                CMD
                            </div>

                            <div className="space-y-4 text-center md:text-left">
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                                        {t.leadership?.captain_title || 'Punong Barangay / Barangay Captain'}
                                    </span>
                                    <h3 className="text-2xl md:text-3xl font-extrabold text-neutral-950 dark:text-white mt-0.5">
                                        {t.leadership?.captain_name || 'HON. CECILIA M. DECILLO'}
                                    </h3>
                                </div>

                                <blockquote className="text-base md:text-lg italic text-neutral-700 dark:text-neutral-300 border-l-4 border-violet-600 pl-4 py-1 leading-relaxed bg-violet-50/50 dark:bg-violet-950/20 rounded-r-xl">
                                    "{t.leadership?.captain_quote}"
                                </blockquote>

                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Accountable Leadership
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Citizen Welfare
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 max-w-5xl mx-auto pt-6">
                        <h4 className="text-center font-bold text-neutral-700 dark:text-neutral-300 text-sm tracking-wide uppercase">
                            {t.leadership?.officials_title || 'Barangay Officials & Staff'}
                        </h4>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((num) => (
                                <div
                                    key={num}
                                    className="bg-white dark:bg-neutral-900 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl p-5 text-center space-y-2 hover:border-violet-400 transition-colors"
                                >
                                    <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 mx-auto flex items-center justify-center font-bold text-sm">
                                        BK {num}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                                            {t.leadership?.placeholder_name} {num}
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
            <section id="services" className="py-20 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="text-center max-w-3xl mx-auto space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                            Available Online
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                            {t.services?.title || 'Barangay Digital Services'}
                        </h2>
                        <p className="text-base text-neutral-600 dark:text-neutral-300">
                            {t.services?.subtitle || 'Fast, verified, and secure online document requests with SMS and email status notifications.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-xs flex flex-col justify-between space-y-6 hover:shadow-md hover:border-violet-300 dark:hover:border-violet-800 transition-all"
                            >
                                <div className="space-y-4">
                                    <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 flex items-center justify-center shadow-xs">
                                        <FileCheck2 className="w-6 h-6" />
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="text-xl font-bold text-neutral-950 dark:text-white">
                                                {service.name}
                                            </h3>
                                            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300">
                                                {service.fee}
                                            </span>
                                        </div>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
                                            {service.description}
                                        </p>
                                    </div>

                                    {service.requirements && service.requirements.length > 0 && (
                                        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
                                            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                                                {t.services?.requirements_label || 'Requirements'}:
                                            </span>
                                            <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                                                {service.requirements.map((req, idx) => (
                                                    <li key={idx} className="flex items-center gap-2">
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                                        <span>{req}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <Link href={`/login?document=${service.slug}`} className="w-full">
                                    <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl cursor-pointer">
                                        {t.services?.request_now || 'Request Online'}
                                        <ChevronRight className="w-4 h-4 ml-1.5" />
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 5: Real-time System Statistics */}
            <section id="statistics" className="py-20 bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="text-center max-w-3xl mx-auto space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                            Registry Transparency
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                            {t.statistics?.title || 'Community by the Numbers'}
                        </h2>
                        <p className="text-base text-neutral-600 dark:text-neutral-300">
                            {t.statistics?.subtitle || 'Real-time aggregate data from the Barangay Lallana E-Government Registry.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 text-center space-y-3 shadow-xs">
                            <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 mx-auto flex items-center justify-center">
                                <Users className="w-7 h-7" />
                            </div>
                            <div className="text-4xl md:text-5xl font-black text-neutral-950 dark:text-white tracking-tight">
                                {statistics.total_residents.toLocaleString()}+
                            </div>
                            <div className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
                                {t.statistics?.total_residents || 'Active Residents'}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 text-center space-y-3 shadow-xs">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
                                <HomeIcon className="w-7 h-7" />
                            </div>
                            <div className="text-4xl md:text-5xl font-black text-neutral-950 dark:text-white tracking-tight">
                                {statistics.total_households.toLocaleString()}+
                            </div>
                            <div className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
                                {t.statistics?.total_households || 'Registered Households'}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 text-center space-y-3 shadow-xs">
                            <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 mx-auto flex items-center justify-center">
                                <Building2 className="w-7 h-7" />
                            </div>
                            <div className="text-4xl md:text-5xl font-black text-neutral-950 dark:text-white tracking-tight">
                                {statistics.total_officials.toLocaleString()}
                            </div>
                            <div className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
                                {t.statistics?.total_officials || 'Barangay Personnel'}
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-xs text-neutral-500 max-w-xl mx-auto">
                        {t.statistics?.transparency_note || 'Only verified aggregate statistical counts are shown to protect resident privacy.'}
                    </p>
                </div>
            </section>

            {/* Section 6: Dynamic Announcements Feed */}
            <section id="announcements" className="py-20 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="text-center max-w-3xl mx-auto space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                            Community Board
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                            {t.announcements?.title || 'Official Announcements & Advisories'}
                        </h2>
                        <p className="text-base text-neutral-600 dark:text-neutral-300">
                            {t.announcements?.subtitle || 'Stay updated with the latest community news, public notices, and upcoming events.'}
                        </p>
                    </div>

                    {announcements.length === 0 ? (
                        <div className="max-w-2xl mx-auto p-12 text-center bg-neutral-50 dark:bg-neutral-950 rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800 space-y-3">
                            <Calendar className="w-12 h-12 text-neutral-400 mx-auto" />
                            <h3 className="font-semibold text-neutral-700 dark:text-neutral-300">
                                {t.announcements?.empty_state || 'No active announcements published at this time.'}
                            </h3>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {announcements.map((item) => (
                                <article
                                    key={item.id}
                                    className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-7 flex flex-col justify-between space-y-6 shadow-xs hover:border-violet-300 transition-all"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300">
                                                {item.category}
                                            </span>
                                            <span className="text-xs text-neutral-500">
                                                {item.published_at}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-neutral-950 dark:text-white leading-snug">
                                            {item.title}
                                        </h3>

                                        <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                                            {item.excerpt}
                                        </p>
                                    </div>

                                    <div className="pt-2 border-t border-neutral-200/80 dark:border-neutral-800/80">
                                        <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline inline-flex items-center gap-1 cursor-pointer">
                                            {t.announcements?.read_more || 'Read Advisory'} <ChevronRight className="w-3.5 h-3.5" />
                                        </span>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Section 7 & 8: Contact & Public Inquiry Form */}
            <section id="contact" className="py-20 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="text-center max-w-3xl mx-auto space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                            Get In Touch
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                            {t.contact?.title || 'Contact & Location'}
                        </h2>
                        <p className="text-base text-neutral-600 dark:text-neutral-300">
                            {t.contact?.subtitle || 'Reach out to our Barangay Hall for assistance, inquiries, or emergency services.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Left: Contact Info & Static Map Card */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-xs space-y-6">
                                <h3 className="text-xl font-bold text-neutral-950 dark:text-white flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-violet-600" />
                                    {t.contact?.hall_title || 'Barangay Lallana Hall'}
                                </h3>

                                <div className="space-y-4 text-sm">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
                                        <div>
                                            <div className="font-semibold">{t.contact?.address_label || 'Address'}</div>
                                            <div className="text-neutral-600 dark:text-neutral-400">{t.contact?.address_val}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Phone className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
                                        <div>
                                            <div className="font-semibold">{t.contact?.phone_label || 'Hotlines'}</div>
                                            <div className="text-neutral-600 dark:text-neutral-400">{t.contact?.phone_val}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Mail className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
                                        <div>
                                            <div className="font-semibold">{t.contact?.email_label || 'Official Email'}</div>
                                            <div className="text-neutral-600 dark:text-neutral-400">{t.contact?.email_val}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Clock className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
                                        <div>
                                            <div className="font-semibold">Office Hours</div>
                                            <div className="text-neutral-600 dark:text-neutral-400">{t.contact?.operating_hours}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Static Location Image Container */}
                            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-xs text-center space-y-3">
                                <div className="aspect-video w-full rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex flex-col items-center justify-center p-4 border border-dashed border-neutral-300 dark:border-neutral-700">
                                    <MapPin className="w-10 h-10 text-violet-600 mb-2 animate-bounce" />
                                    <span className="font-bold text-sm">Barangay Lallana Location Map</span>
                                    <span className="text-xs text-neutral-500">Trece Martires City, Cavite</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Public Inquiry Form with Turnstile */}
                        <div className="lg:col-span-7">
                            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 md:p-10 shadow-xs space-y-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-neutral-950 dark:text-white">
                                        {t.contact?.inquiry_title || 'Send Us an Inquiry'}
                                    </h3>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                                        {t.contact?.inquiry_desc || 'Fill out the form below and our staff will respond via email.'}
                                    </p>
                                </div>

                                {flash.success && (
                                    <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-sm flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                                        <span>{flash.success}</span>
                                    </div>
                                )}

                                <form onSubmit={handleInquirySubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="name" className="text-xs font-semibold">{t.contact?.form_name || 'Full Name'}</Label>
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('name', e.target.value)}
                                                placeholder="Juan Dela Cruz"
                                                required
                                                className="mt-1"
                                            />
                                            {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="email" className="text-xs font-semibold">{t.contact?.form_email || 'Email Address'}</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('email', e.target.value)}
                                                placeholder="juan@example.com"
                                                required
                                                className="mt-1"
                                            />
                                            {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="subject" className="text-xs font-semibold">{t.contact?.form_subject || 'Subject'}</Label>
                                        <Input
                                            id="subject"
                                            value={data.subject}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('subject', e.target.value)}
                                            placeholder="Request for Document Clarification / Assistance"
                                            required
                                            className="mt-1"
                                        />
                                        {errors.subject && <p className="text-xs text-rose-600 mt-1">{errors.subject}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="message" className="text-xs font-semibold">{t.contact?.form_message || 'Message'}</Label>
                                        <Textarea
                                            id="message"
                                            rows={4}
                                            value={data.message}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('message', e.target.value)}
                                            placeholder="Write your detailed inquiry or question here..."
                                            required
                                            className="mt-1"
                                        />
                                        {errors.message && <p className="text-xs text-rose-600 mt-1">{errors.message}</p>}
                                    </div>

                                    {/* Cloudflare Turnstile Bot Challenge */}
                                    <div>
                                        <TurnstileWidget
                                            onSuccess={(token) => setData('cf-turnstile-response', token)}
                                            onError={() => setData('cf-turnstile-response', '')}
                                            onExpire={() => setData('cf-turnstile-response', '')}
                                        />
                                        {errors['cf-turnstile-response'] && (
                                            <p className="text-xs text-rose-600 text-center mt-1">
                                                {errors['cf-turnstile-response']}
                                            </p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-6 rounded-xl shadow-xs text-base cursor-pointer"
                                    >
                                        <Send className="w-4 h-4 mr-2" />
                                        {processing ? (t.contact?.form_sending || 'Sending...') : (t.contact?.form_submit || 'Send Inquiry')}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-neutral-900 text-neutral-400 py-12 border-t border-neutral-800 text-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <img src="/lallana-icon.png" alt="Barangay Logo" className="w-10 h-10 rounded-lg object-contain" />
                            <div>
                                <span className="font-bold text-white block">Barangay Lallana E-Government</span>
                                <span className="text-xs text-neutral-500">Trece Martires City, Cavite</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium">
                            <a href="#home" className="hover:text-white transition-colors">{t.nav?.home || 'Home'}</a>
                            <a href="#about" className="hover:text-white transition-colors">{t.nav?.about || 'About'}</a>
                            <a href="#services" className="hover:text-white transition-colors">{t.nav?.services || 'Services'}</a>
                            <a href="#announcements" className="hover:text-white transition-colors">{t.nav?.announcements || 'Announcements'}</a>
                            <a href="#contact" className="hover:text-white transition-colors">{t.nav?.contact || 'Contact'}</a>
                            <Link href="/login" className="text-violet-400 hover:underline">Resident Portal</Link>
                        </div>
                    </div>

                    <div className="border-t border-neutral-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
                        <p>© {new Date().getFullYear()} Barangay Lallana, Trece Martires City. All rights reserved.</p>
                        <p className="flex items-center gap-2">
                            <span>Powered by Modern E-Gov Platform</span>
                            <span>•</span>
                            <a href="https://trecemartirescity.gov.ph" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300 inline-flex items-center gap-1">
                                Trece Martires City <ExternalLink className="w-3 h-3" />
                            </a>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
