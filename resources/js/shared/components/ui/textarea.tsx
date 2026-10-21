import * as React from 'react';

import { cn } from '@/shared/lib/utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
    return (
        <textarea
            data-slot="textarea"
            className={cn(
                'flex min-h-[80px] w-full rounded-none border border-input bg-transparent px-3 py-2 text-base shadow-none transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                'focus-visible:border-ring focus-visible:ring-[2px] focus-visible:ring-ring/50',
                'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
                className,
            )}
            {...props}
        />
    );
}

export { Textarea };
