import { Link } from '@inertiajs/react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { home } from '@/routes';
import AppLogoIcon from '@/shared/components/app-logo-icon';
import { cn } from '@/shared/lib/utils';
import type { AuthLayoutProps } from '@/shared/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
    className,
}: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center bg-background p-4 sm:p-8">
            {/* Subtle background ambient gradient */}
            <div className="pointer-events-none absolute inset-0 -z-10 bg-radial from-violet-600/5 via-transparent to-transparent dark:from-violet-500/10" />

            {/* Back to Portal Home Button */}
            <div className="absolute top-6 left-6">
                <Link
                    href={home()}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-3.5 py-1.5 text-xs font-semibold text-muted-foreground shadow-xs transition-all hover:bg-muted hover:text-foreground active:scale-[0.98]"
                >
                    <ArrowLeft className="size-3.5" />
                    <span>Back to Portal Home</span>
                </Link>
            </div>

            <div className={cn('w-full max-w-md', className)}>
                <div className="bezel-outer">
                    <div className="bezel-inner p-6 sm:p-8 space-y-6">
                        {/* Civic Header */}
                        <div className="flex flex-col items-center gap-3 text-center">
                            <Link
                                href={home()}
                                className="group flex flex-col items-center gap-2"
                            >
                                <div className="flex size-16 items-center justify-center rounded-2xl bg-violet-600/10 p-2 ring-1 ring-violet-600/20 transition-transform group-hover:scale-105 dark:bg-violet-400/10 dark:ring-violet-400/20">
                                    <AppLogoIcon className="size-12 object-contain" />
                                </div>
                                <span className="sr-only">Barangay Lallana</span>
                            </Link>

                            <div className="space-y-1">
                                <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    Republic of the Philippines • Trece Martires City
                                </span>
                                <h1 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                                    {title}
                                </h1>
                                {description && (
                                    <p className="text-xs text-muted-foreground max-w-sm">
                                        {description}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className="pt-2">
                            {children}
                        </div>

                        {/* Security Notice */}
                        <div className="flex items-center justify-center gap-1.5 border-t border-border/70 pt-4 text-[11px] text-muted-foreground">
                            <ShieldCheck className="size-3.5 text-violet-600 dark:text-violet-400" />
                            <span>Secured Official Government Portal</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
