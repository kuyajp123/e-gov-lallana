import { Head, Link, router, usePage } from '@inertiajs/react';
import { Megaphone, Search, X } from 'lucide-react';
import React, { useState } from 'react';
import { AnnouncementCard } from '@/shared/components/announcement-card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useTranslation } from '@/shared/hooks/use-translation';

interface AnnouncementItem {
    id: number;
    title: string;
    slug: string;
    category: string;
    excerpt: string | null;
    published_at_formatted: string;
    author_name: string;
    banner_url: string | null;
}

interface PublicAnnouncementsIndexProps {
    announcements: {
        data: AnnouncementItem[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    counts: {
        all: number;
        advisory: number;
        event: number;
        meeting: number;
        emergency: number;
    };
    categories: string[];
    filters: {
        search: string;
        category: string;
    };
}

export default function PublicAnnouncementsIndex({
    announcements,
    counts,
    categories,
    filters,
}: PublicAnnouncementsIndexProps) {
    const { auth } = usePage<{
        auth: { user?: { name: string } };
    }>().props;
    const { t } = useTranslation();

    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(
        filters.category || 'all',
    );

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/announcements',
            {
                search: search || undefined,
                category:
                    selectedCategory !== 'all' ? selectedCategory : undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleCategoryClick = (cat: string) => {
        setSelectedCategory(cat);
        router.get(
            '/announcements',
            {
                search: search || undefined,
                category: cat !== 'all' ? cat : undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleClearFilters = () => {
        setSearch('');
        setSelectedCategory('all');
        router.get(
            '/announcements',
            {},
            { preserveState: true, replace: true },
        );
    };

    return (
        <div className="min-h-screen bg-background font-sans text-foreground selection:bg-violet-600 selection:text-white">
            <Head title="Official Announcements & Public Advisories — Barangay Lallana" />

            {/* Sticky Navigation Header */}
            <div className="sticky top-3 z-50 px-4 sm:px-6 lg:px-8">
                <header className="mx-auto max-w-6xl rounded-none border border-border/80 bg-background/85 px-4 shadow-none backdrop-blur-xl transition-all sm:px-6 dark:bg-card/85">
                    <div className="flex h-16 items-center justify-between gap-4">
                        {/* Logo & Municipal Identity */}
                        <Link
                            href="/"
                            className="group flex items-center gap-3"
                        >
                            <div className="relative flex size-10 items-center justify-center rounded-none bg-violet-600/10 p-1 ring-1 ring-violet-600/20 transition-transform group-hover:scale-105 dark:bg-violet-400/10 dark:ring-violet-400/20">
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
                        </Link>

                        {/* Navigation Links */}
                        <nav className="hidden items-center gap-1 text-xs font-medium md:flex">
                            <Link
                                href="/"
                                className="rounded-none px-3 py-1.5 text-muted-foreground transition-colors hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-950/50 dark:hover:text-violet-300"
                            >
                                Home
                            </Link>
                            <Link
                                href="/announcements"
                                className="rounded-none bg-violet-50 px-3 py-1.5 font-semibold text-violet-700 dark:bg-violet-950/50 dark:text-violet-300"
                            >
                                {t('nav.announcements', 'Announcements')}
                            </Link>
                            <a
                                href="/#services"
                                className="rounded-none px-3 py-1.5 text-muted-foreground transition-colors hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-950/50 dark:hover:text-violet-300"
                            >
                                Services
                            </a>
                            <a
                                href="/#contact"
                                className="rounded-none px-3 py-1.5 text-muted-foreground transition-colors hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-950/50 dark:hover:text-violet-300"
                            >
                                Contact
                            </a>
                        </nav>

                        {/* Auth Access */}
                        <div className="flex items-center gap-2">
                            {auth.user ? (
                                <Link href="/dashboard">
                                    <Button
                                        size="sm"
                                        className="h-9 cursor-pointer rounded-none bg-violet-600 px-4 text-xs font-semibold text-white shadow-none hover:bg-violet-700"
                                    >
                                        {t(
                                            'nav.dashboard',
                                            'Resident Dashboard',
                                        )}
                                    </Button>
                                </Link>
                            ) : (
                                <div className="flex items-center gap-1.5">
                                    <Link href="/login">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 rounded-none px-3 text-xs font-medium text-foreground shadow-none hover:bg-muted"
                                        >
                                            {t('auth.sign_in', 'Sign In')}
                                        </Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button
                                            size="sm"
                                            className="h-8 cursor-pointer rounded-none bg-violet-600 px-3.5 text-xs font-semibold text-white shadow-none hover:bg-violet-700"
                                        >
                                            {t('auth.register_now', 'Register')}
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </header>
            </div>

            {/* Hero / Page Header */}
            <section className="relative overflow-hidden pt-12 pb-8 md:pt-16 md:pb-12">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="text-xs font-bold tracking-wider text-violet-700 uppercase">
                            BARANGAY
                        </span>
                        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                            {t(
                                'announcements.title',
                                'Announcements & Advisories',
                            )}
                        </h1>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                            {t(
                                'announcements.subtitle',
                                'Official community advisories, public events, schedules, and emergency alerts.',
                            )}
                        </p>
                    </div>

                    {/* Search & Filter Controls */}
                    <div className="mx-auto mt-6 max-w-xl space-y-4">
                        <form
                            onSubmit={handleSearchSubmit}
                            className="relative"
                        >
                            <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder={t(
                                    'announcements.search_placeholder',
                                    'Search announcements...',
                                )}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-10 rounded-lg border-border/80 bg-background pr-9 pl-9 text-xs shadow-xs placeholder:text-muted-foreground/60 sm:text-sm"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch('');
                                        router.get(
                                            '/announcements',
                                            {
                                                category:
                                                    selectedCategory !== 'all'
                                                        ? selectedCategory
                                                        : undefined,
                                            },
                                            {
                                                preserveState: true,
                                                replace: true,
                                            },
                                        );
                                    }}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                                >
                                    <X className="size-3.5" />
                                </button>
                            )}
                        </form>

                        {/* Category Filter Pills */}
                        <div className="flex flex-wrap items-center justify-center gap-2 overflow-x-auto py-1">
                            <button
                                type="button"
                                onClick={() => handleCategoryClick('all')}
                                className={`cursor-pointer rounded-md px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                                    selectedCategory === 'all'
                                        ? 'bg-violet-600 text-white shadow-xs'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                                }`}
                            >
                                {t('announcements.category_all', 'All')} (
                                {counts.all})
                            </button>
                            {categories.map((cat) => {
                                const catKey = cat.toLowerCase();
                                const catCount =
                                    counts[catKey as keyof typeof counts] ??
                                    counts[cat as keyof typeof counts] ??
                                    0;

                                return (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => handleCategoryClick(cat)}
                                        className={`cursor-pointer rounded-md px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap capitalize transition-all ${
                                            selectedCategory.toLowerCase() ===
                                            catKey
                                                ? 'bg-violet-600 text-white shadow-xs'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                                        }`}
                                    >
                                        {cat} ({catCount})
                                    </button>
                                );
                            })}
                            {(search || selectedCategory !== 'all') && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClearFilters}
                                    className="h-7 cursor-pointer rounded-none text-xs text-muted-foreground shadow-none hover:text-foreground"
                                >
                                    <X className="mr-1 size-3" />
                                    Clear filters
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Articles Grid */}
            <main className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
                {announcements.data.length === 0 ? (
                    <div className="mx-auto max-w-md rounded-none border border-border/80 bg-card p-12 text-center shadow-none">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-none bg-muted text-muted-foreground">
                            <Megaphone className="h-7 w-7" />
                        </div>
                        <h3 className="mt-4 text-base font-bold text-foreground">
                            {t(
                                'announcements.no_announcements',
                                'No announcements found',
                            )}
                        </h3>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                            {search || selectedCategory !== 'all'
                                ? t(
                                      'announcements.no_announcements_desc',
                                      'No articles match your search or filter criteria. Try adjusting your query.',
                                  )
                                : 'There are currently no active public announcements published.'}
                        </p>
                        {(search || selectedCategory !== 'all') && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleClearFilters}
                                className="mt-4 rounded-none text-xs shadow-none"
                            >
                                {t(
                                    'announcements.back_to_list',
                                    'View All Announcements',
                                )}
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {announcements.data.map((item) => (
                            <AnnouncementCard
                                key={item.id}
                                announcement={item}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {announcements.last_page > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-2">
                        {announcements.links.map((link, idx) => (
                            <Button
                                key={idx}
                                asChild={Boolean(link.url)}
                                disabled={!link.url}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                className="h-9 rounded-none px-3.5 text-xs shadow-none"
                            >
                                {link.url ? (
                                    <Link
                                        href={link.url}
                                        preserveScroll
                                        preserveState
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ) : (
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                )}
                            </Button>
                        ))}
                    </div>
                )}
            </main>

            {/* Simple Footer */}
            <footer className="border-t border-border/70 bg-card py-8 text-center text-xs text-muted-foreground">
                <div className="mx-auto max-w-6xl px-4">
                    <p>
                        © {new Date().getFullYear()} Barangay Lallana, Trece
                        Martires City, Cavite. Official E-Government System.
                    </p>
                </div>
            </footer>
        </div>
    );
}
