import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    Calendar,
    ChevronRight,
    Megaphone,
    Search,
    Users,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

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

    const getCategoryBadge = (category: string) => {
        switch (category.toLowerCase()) {
            case 'emergency':
                return (
                    <Badge
                        variant="destructive"
                        className="gap-1 text-xs font-semibold capitalize"
                    >
                        <AlertTriangle className="h-3 w-3" />
                        Emergency
                    </Badge>
                );
            case 'event':
                return (
                    <span className="inline-flex items-center gap-1 rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-600 capitalize dark:text-indigo-400">
                        <Calendar className="h-3 w-3" />
                        Event
                    </span>
                );
            case 'meeting':
                return (
                    <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 capitalize dark:text-amber-400">
                        <Users className="h-3 w-3" />
                        Meeting
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 rounded-md border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-xs font-medium text-violet-700 capitalize dark:text-violet-300">
                        <Megaphone className="h-3 w-3" />
                        Advisory
                    </span>
                );
        }
    };

    return (
        <div className="min-h-screen bg-background font-sans text-foreground selection:bg-violet-600 selection:text-white">
            <Head title="Official Announcements & Public Advisories — Barangay Lallana" />

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
                    </div>
                </div>
            </div>

            {/* Sticky Navigation Header */}
            <div className="sticky top-3 z-50 px-4 sm:px-6 lg:px-8">
                <header className="mx-auto max-w-6xl rounded-2xl border border-border/80 bg-background/85 px-4 shadow-sm backdrop-blur-xl transition-all sm:px-6 dark:bg-card/85">
                    <div className="flex h-16 items-center justify-between gap-4">
                        {/* Logo & Municipal Identity */}
                        <Link
                            href="/"
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
                        </Link>

                        {/* Navigation Links */}
                        <nav className="hidden items-center gap-1 text-xs font-medium md:flex">
                            <Link
                                href="/"
                                className="rounded-lg px-3 py-1.5 text-muted-foreground transition-colors hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-950/50 dark:hover:text-violet-300"
                            >
                                Home
                            </Link>
                            <Link
                                href="/announcements"
                                className="rounded-lg bg-violet-50 px-3 py-1.5 font-semibold text-violet-700 dark:bg-violet-950/50 dark:text-violet-300"
                            >
                                Announcements
                            </Link>
                            <a
                                href="/#services"
                                className="rounded-lg px-3 py-1.5 text-muted-foreground transition-colors hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-950/50 dark:hover:text-violet-300"
                            >
                                Services
                            </a>
                            <a
                                href="/#contact"
                                className="rounded-lg px-3 py-1.5 text-muted-foreground transition-colors hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-950/50 dark:hover:text-violet-300"
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
                                            Sign In
                                        </Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button
                                            size="sm"
                                            className="h-8 cursor-pointer rounded-xl bg-violet-600 px-3.5 text-xs font-semibold text-white shadow-xs hover:bg-violet-700"
                                        >
                                            Register
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
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50/80 px-3 py-1 text-xs font-semibold text-violet-800 dark:border-violet-800/60 dark:bg-violet-950/50 dark:text-violet-300">
                            <Megaphone className="h-3.5 w-3.5" />
                            Official Barangay Bulletins
                        </span>
                        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                            Announcements & Public Advisories
                        </h1>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                            Stay informed on community events, health
                            advisories, civic sessions, and emergency notices
                            from the Barangay Council of Lallana.
                        </p>
                    </div>

                    {/* Search & Filter Controls */}
                    <div className="mx-auto mt-10 max-w-4xl space-y-4">
                        <form
                            onSubmit={handleSearchSubmit}
                            className="relative"
                        >
                            <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search advisories, events, or keywords..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-12 rounded-2xl border-border/80 bg-card pr-12 pl-12 text-sm shadow-xs"
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
                                    className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </form>

                        {/* Category Pills */}
                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <button
                                type="button"
                                onClick={() => handleCategoryClick('all')}
                                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                                    selectedCategory === 'all'
                                        ? 'bg-violet-600 text-white shadow-xs'
                                        : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                            >
                                All Bulletins ({counts.all})
                            </button>
                            {categories.map((cat) => {
                                const catCount =
                                    counts[cat as keyof typeof counts] ?? 0;

                                return (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => handleCategoryClick(cat)}
                                        className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition-all ${
                                            selectedCategory === cat
                                                ? 'bg-violet-600 text-white shadow-xs'
                                                : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
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
                                    className="h-7 text-xs text-muted-foreground hover:text-foreground"
                                >
                                    <X className="mr-1 h-3 w-3" />
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
                    <div className="mx-auto max-w-md rounded-2xl border border-border/80 bg-card p-12 text-center shadow-xs">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                            <Megaphone className="h-7 w-7" />
                        </div>
                        <h3 className="mt-4 text-base font-bold text-foreground">
                            No announcements found
                        </h3>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                            {search || selectedCategory !== 'all'
                                ? 'No articles match your search or filter criteria. Try adjusting your query.'
                                : 'There are currently no active public announcements published.'}
                        </p>
                        {(search || selectedCategory !== 'all') && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleClearFilters}
                                className="mt-4 text-xs"
                            >
                                View All Announcements
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {announcements.data.map((item) => (
                            <Link
                                key={item.id}
                                href={`/announcements/${item.slug}`}
                                className="group flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-2xs transition-all hover:border-violet-300 hover:shadow-md dark:hover:border-violet-700"
                            >
                                {/* Banner / Thumbnail */}
                                {item.banner_url ? (
                                    <div className="relative aspect-video w-full overflow-hidden bg-muted">
                                        <img
                                            src={item.banner_url}
                                            alt={item.title}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-violet-500/10 via-background to-muted/40 text-violet-600/50">
                                        <Megaphone className="h-12 w-12 transition-transform duration-300 group-hover:scale-110" />
                                    </div>
                                )}

                                {/* Content Details */}
                                <div className="flex flex-1 flex-col justify-between space-y-4 p-5">
                                    <div className="space-y-2.5">
                                        <div className="flex items-center justify-between text-xs">
                                            {getCategoryBadge(item.category)}
                                            <span className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                {item.published_at_formatted}
                                            </span>
                                        </div>

                                        <h2 className="line-clamp-2 text-base font-bold text-foreground transition-colors group-hover:text-violet-700 dark:group-hover:text-violet-300">
                                            {item.title}
                                        </h2>

                                        {item.excerpt && (
                                            <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                                                {item.excerpt}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between border-t border-border/70 pt-3 text-xs">
                                        <span className="text-2xs max-w-[150px] truncate text-muted-foreground">
                                            By {item.author_name}
                                        </span>
                                        <span className="flex items-center font-semibold text-violet-700 transition-transform group-hover:translate-x-0.5 dark:text-violet-400">
                                            Read Article
                                            <ChevronRight className="ml-1 h-3.5 w-3.5" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
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
                                className="h-9 rounded-xl px-3.5 text-xs"
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
