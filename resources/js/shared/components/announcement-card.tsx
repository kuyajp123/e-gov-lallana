import { Link } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    Calendar,
    Megaphone,
    Users,
} from 'lucide-react';
import React, { useState } from 'react';

export interface AnnouncementCardItem {
    id: number;
    title: string;
    slug: string;
    category: string;
    excerpt?: string | null;
    published_at_formatted?: string;
    published_at?: string;
    author_name?: string;
    banner_url?: string | null;
}

interface AnnouncementCardProps {
    announcement: AnnouncementCardItem;
    className?: string;
}

export function AnnouncementCard({
    announcement,
    className = '',
}: AnnouncementCardProps) {
    const [imageError, setImageError] = useState(false);

    const getCategoryBadge = (category: string) => {
        const cat = (category || '').toLowerCase();

        switch (cat) {
            case 'emergency':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#FFE4E6] px-2.5 py-0.5 text-[11px] font-semibold text-[#BE123C] shadow-xs dark:bg-rose-950/80 dark:text-rose-300">
                        <AlertTriangle className="size-3 shrink-0" />
                        <span>Emergency</span>
                    </span>
                );
            case 'event':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#D1FAE5] px-2.5 py-0.5 text-[11px] font-semibold text-[#065F46] shadow-xs dark:bg-emerald-950/80 dark:text-emerald-300">
                        <Calendar className="size-3 shrink-0" />
                        <span>Event</span>
                    </span>
                );
            case 'meeting':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-[11px] font-semibold text-[#92400E] shadow-xs dark:bg-amber-950/80 dark:text-amber-300">
                        <Users className="size-3 shrink-0" />
                        <span>Meeting</span>
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#EDE9FE] px-2.5 py-0.5 text-[11px] font-semibold text-[#6D28D9] shadow-xs dark:bg-violet-950/80 dark:text-violet-300">
                        <Megaphone className="size-3 shrink-0" />
                        <span>Advisory</span>
                    </span>
                );
        }
    };

    const displayDate =
        announcement.published_at_formatted ||
        announcement.published_at ||
        'Recently';

    return (
        <Link
            href={`/announcements/${announcement.slug}`}
            className={`group relative block aspect-[4/3] w-full overflow-hidden rounded-[14px] bg-slate-900 shadow-sm transition-all duration-300 hover:shadow-md focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:outline-hidden ${className}`}
        >
            {/* Background Image / Placeholder */}
            {announcement.banner_url && !imageError ? (
                <img
                    src={announcement.banner_url}
                    alt={announcement.title}
                    loading="lazy"
                    decoding="async"
                    onError={() => setImageError(true)}
                    className="size-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                />
            ) : (
                <div className="relative flex size-full items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
                    <img
                        src="/lallana-icon.png"
                        alt=""
                        aria-hidden="true"
                        className="size-24 object-contain opacity-20 transition-transform duration-300 group-hover:scale-110"
                    />
                </div>
            )}

            {/* Smooth dark bottom-to-top gradient overlay */}
            <div
                className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
                style={{
                    background:
                        'linear-gradient(to top, rgba(10,15,25,0.94) 0%, rgba(10,15,25,0.65) 45%, rgba(10,15,25,0.2) 75%, transparent 100%)',
                }}
            />

            {/* Subtle hover darkening */}
            <div className="pointer-events-none absolute inset-0 z-10 bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Text & Meta Content Overlay (bottom-aligned) */}
            <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end p-5 sm:p-6">
                {/* Top row: Category Badge & Publication Date */}
                <div className="flex items-center justify-between gap-2">
                    {getCategoryBadge(announcement.category)}
                    <span className="flex items-center gap-1.5 font-sans text-xs font-medium text-white/85">
                        <Calendar className="size-3.5 text-white/75" />
                        <span>{displayDate}</span>
                    </span>
                </div>

                {/* Announcement Title */}
                <h3 className="mt-2.5 line-clamp-2 text-lg font-bold tracking-tight text-white drop-shadow-xs transition-colors sm:text-xl">
                    {announcement.title}
                </h3>

                {/* Bottom row: Subtitle/Excerpt & Circular Arrow Button */}
                <div className="mt-1.5 flex items-end justify-between gap-3">
                    <p className="line-clamp-2 max-w-[85%] text-xs leading-relaxed font-normal text-white/80 sm:text-sm">
                        {announcement.excerpt ||
                            'Official community bulletin issued by the Barangay Lallana Council.'}
                    </p>
                    <div
                        aria-hidden="true"
                        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-xs transition-all duration-200 group-hover:scale-110 group-hover:bg-white/30"
                    >
                        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
