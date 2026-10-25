import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Spinner } from '@/shared/components/ui/spinner';
import { cn } from '@/shared/lib/utils';

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 rounded-none text-sm font-medium whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[2px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    {
        variants: {
            variant: {
                default:
                    'bg-primary text-primary-foreground shadow-none hover:bg-primary/90',
                destructive:
                    'bg-destructive text-white shadow-none hover:bg-destructive/90 focus-visible:ring-destructive/20',
                outline:
                    'border border-input bg-background shadow-none hover:bg-accent hover:text-accent-foreground',
                secondary:
                    'bg-secondary text-secondary-foreground shadow-none hover:bg-secondary/80',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                link: 'text-primary underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-9 px-4 py-2 has-[>svg]:px-3',
                sm: 'h-8 px-3 has-[>svg]:px-2.5',
                lg: 'h-10 px-6 has-[>svg]:px-4',
                icon: 'size-9',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

function Button({
    className,
    variant,
    size,
    asChild = false,
    loading = false,
    disabled,
    children,
    ...props
}: React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
        loading?: boolean;
    }) {
    if (asChild) {
        return (
            <Slot
                data-slot="button"
                className={cn(buttonVariants({ variant, size, className }))}
                {...props}
            >
                {children}
            </Slot>
        );
    }

    return (
        <button
            data-slot="button"
            className={cn(buttonVariants({ variant, size, className }))}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <Spinner className="size-4 shrink-0 animate-spin" />}
            {children}
        </button>
    );
}

export { Button, buttonVariants };
