import type { LucideIcon } from 'lucide-react';
import { Sun } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import type { Appearance } from '@/shared/hooks/use-appearance';
import { useAppearance } from '@/shared/hooks/use-appearance';
import { cn } from '@/shared/lib/utils';

export default function AppearanceToggleTab({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    const tabs: { value: Appearance; icon: LucideIcon; label: string }[] = [
        { value: 'light', icon: Sun, label: 'Light' },
    ];

    return (
        <div
            className={cn(
                'inline-flex gap-1 rounded-none border border-border bg-muted/40 p-1',
                className,
            )}
            {...props}
        >
            {tabs.map(({ value, icon: Icon, label }) => (
                <button
                    key={value}
                    onClick={() => updateAppearance(value)}
                    className={cn(
                        'flex items-center rounded-none px-3.5 py-1.5 transition-colors',
                        appearance === value
                            ? 'border border-border bg-card font-medium text-foreground shadow-none'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                >
                    <Icon className="-ml-1 h-4 w-4" />
                    <span className="ml-1.5 text-sm">{label}</span>
                </button>
            ))}
        </div>
    );
}
