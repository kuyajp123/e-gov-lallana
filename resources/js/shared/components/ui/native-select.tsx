import { ChevronDown } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/shared/lib/utils';

export interface NativeSelectProps extends React.ComponentProps<'select'> {
    className?: string;
    wrapperClassName?: string;
}

export function NativeSelect({
    className,
    wrapperClassName,
    children,
    disabled,
    ...props
}: NativeSelectProps) {
    return (
        <div className={cn('relative w-full', wrapperClassName)}>
            <select
                disabled={disabled}
                className={cn(
                    'flex h-9 w-full appearance-none rounded-none border border-input bg-background px-3 py-1 pr-8 text-sm text-foreground shadow-none transition-colors outline-none focus-visible:border-ring focus-visible:ring-[2px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50',
                    className,
                )}
                {...props}
            >
                {children}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground opacity-70" />
        </div>
    );
}
