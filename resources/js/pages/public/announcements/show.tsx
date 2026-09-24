import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    AlertTriangle,
    ArrowLeft,
    Calendar,
    ChevronRight,
    Clock,
    Megaphone,
    Pencil,
    Share2,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';

interface RelatedAnnouncement {
    id: number;
    title: string;
    slug: string;
    category: string;
    published_at_formatted: string;
    banner_url: string | null;
}

interface AnnouncementArticle {
    id: number;
    title: string;
    slug: string;
    category: string;
    excerpt: string | null;
    content: string;
    is_published: boolean;
    published_at_formatted: string;
    author_name: string;
    banner_url: string | null;
}

interface PublicAnnouncementShowProps {
    announcement: AnnouncementArticle;
    relatedAnnouncements: RelatedAnnouncement[];
    canEdit: boolean;
}

export default function PublicAnnouncementShow({
    announcement,
    relatedAnnouncements,
    canEdit,
}: PublicAnnouncementShowProps) {
    const { auth } = usePage<{
        auth: { user?: { name: string } };
    }>().props;

    const [copied, setCopied] = useState(false);

    const handleShare = () => {
        if (navigator.share) {
            navigator
                .share({
                    title: announcement.title,
                    text: announcement.excerpt || announcement.title,
                    url: window.location.href,
                })
                .catch(() => {});
        } else {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    const getCategoryBadge = (category: string) => {
        switch (category.toLowerCase()) {
            case 'emergency':
                return (
                    <Badge
                        variant="destructive"
                        className="gap-1 text-xs font-semibold capitalize"
                    >
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Emergency Advisory
                    </Badge>
                );
            case 'event':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600 capitalize dark:text-indigo-400">
                        <Calendar className="h-3.5 w-3.5" />
                        Community Event
                    </span>
                );
            case 'meeting':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 capitalize dark:text-amber-400">
                        <Users className="h-3.5 w-3.5" />
                        Barangay Session
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-700 capitalize dark:text-violet-300">
                        <Megaphone className="h-3.5 w-3.5" />
                        Official Advisory
                    </span>
                );
        }
    };

    return (
        <div className="min-h-screen bg-background font-sans text-foreground selection:bg-violet-600 selection:text-white">
            <Head title={`${announcement.title} — Barangay Lallana`} />

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

            {/* Admin Draft Banner (If applicable) */}
            {!announcement.is_published && (
                <div className="mx-auto mt-6 max-w-4xl px-4 sm:px-6">
                    <div className="flex flex-col justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-900 sm:flex-row sm:items-center dark:text-amber-200">
                        <div className="flex items-center gap-2.5">
                            <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                            <div>
                                <p className="font-bold">
                                    Unpublished Draft Preview
                                </p>
                                <p className="text-amber-800/80 dark:text-amber-300/80">
                                    This announcement is not visible to the
                                    general public. Only administrators and
                                    staff can preview this page.
                                </p>
                            </div>
                        </div>
                        {canEdit && (
                            <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="h-8 shrink-0 gap-1.5 border-amber-500/40 text-xs"
                            >
                                <Link
                                    href={`/admin/announcements/${announcement.id}/edit`}
                                >
                                    <Pencil className="h-3.5 w-3.5" />
                                    Edit Article
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {/* Article Container */}
            <main className="mx-auto max-w-4xl px-4 pt-8 pb-20 sm:px-6 lg:px-8">
                {/* Back Link & Admin Edit */}
                <div className="flex items-center justify-between pb-6">
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="-ml-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                        <Link href="/announcements">
                            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                            Back to All Announcements
                        </Link>
                    </Button>

                    <div className="flex items-center gap-2">
                        {canEdit && (
                            <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="h-8 gap-1.5 text-xs"
                            >
                                <Link
                                    href={`/admin/announcements/${announcement.id}/edit`}
                                >
                                    <Pencil className="h-3.5 w-3.5" />
                                    Edit in Admin
                                </Link>
                            </Button>
                        )}
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleShare}
                            className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                        >
                            <Share2 className="h-3.5 w-3.5" />
                            {copied ? 'Link Copied!' : 'Share'}
                        </Button>
                    </div>
                </div>

                {/* Article Header */}
                <article className="space-y-6">
                    <header className="space-y-4 border-b border-border/70 pb-6">
                        <div className="flex items-center gap-2">
                            {getCategoryBadge(announcement.category)}
                        </div>

                        <h1 className="text-2xl leading-tight font-extrabold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                            {announcement.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                            <span className="font-semibold text-foreground">
                                Issued by {announcement.author_name}
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span className="flex items-center gap-1 font-mono">
                                <Clock className="h-3.5 w-3.5" />
                                {announcement.published_at_formatted}
                            </span>
                        </div>
                    </header>

                    {/* Featured Banner Image */}
                    {announcement.banner_url && (
                        <div className="overflow-hidden rounded-2xl border border-border/80 bg-muted shadow-sm">
                            <img
                                src={announcement.banner_url}
                                alt={announcement.title}
                                className="max-h-[480px] w-full object-cover"
                            />
                        </div>
                    )}

                    {/* Excerpt Lead */}
                    {announcement.excerpt && (
                        <div className="rounded-xl border-l-4 border-violet-600 bg-muted/40 p-4 text-sm leading-relaxed font-medium text-muted-foreground italic dark:border-violet-400">
                            {announcement.excerpt}
                        </div>
                    )}

                    {/* Formatted Article Body */}
                    <div
                        className="space-y-4 text-sm leading-relaxed text-foreground sm:text-base [&_a]:text-violet-600 [&_a]:underline [&_a]:underline-offset-2 dark:[&_a]:text-violet-400 [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-violet-500/50 [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_blockquote]:italic [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground [&_hr]:my-6 [&_hr]:border-border [&_li]:mb-1.5 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_p]:leading-relaxed [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6"
                        dangerouslySetInnerHTML={{
                            __html: announcement.content,
                        }}
                    />
                </article>

                {/* Related Announcements */}
                {relatedAnnouncements.length > 0 && (
                    <section className="mt-16 border-t border-border/80 pt-10">
                        <div className="flex items-center justify-between pb-6">
                            <div>
                                <h3 className="text-lg font-bold text-foreground">
                                    Related Announcements
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    More advisories and updates from Barangay
                                    Lallana.
                                </p>
                            </div>
                            <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="text-xs text-violet-700 hover:text-violet-800 dark:text-violet-400"
                            >
                                <Link href="/announcements">
                                    View all
                                    <ChevronRight className="ml-1 h-3.5 w-3.5" />
                                </Link>
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            {relatedAnnouncements.map((rel) => (
                                <Link
                                    key={rel.id}
                                    href={`/announcements/${rel.slug}`}
                                    className="group flex flex-col justify-between overflow-hidden rounded-xl border border-border/70 bg-card p-4 transition-all hover:border-violet-300 hover:shadow-xs dark:hover:border-violet-700"
                                >
                                    <div className="space-y-2">
                                        <div className="text-2xs flex items-center justify-between">
                                            <span className="font-semibold text-violet-700 capitalize dark:text-violet-400">
                                                {rel.category}
                                            </span>
                                            <span className="font-mono text-muted-foreground">
                                                {rel.published_at_formatted}
                                            </span>
                                        </div>
                                        <h4 className="line-clamp-2 text-xs font-bold text-foreground transition-colors group-hover:text-violet-700 dark:group-hover:text-violet-300">
                                            {rel.title}
                                        </h4>
                                    </div>
                                    <span className="text-2xs mt-3 inline-flex items-center font-semibold text-violet-700 dark:text-violet-400">
                                        Read more{' '}
                                        <ChevronRight className="ml-0.5 h-3 w-3" />
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </section>
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
