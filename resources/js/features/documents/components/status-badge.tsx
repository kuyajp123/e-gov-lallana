import { Badge } from '@/shared/components/ui/badge';

interface StatusBadgeProps {
    status: string;
    label?: string;
    className?: string;
}

export function StatusBadge({
    status,
    label,
    className = '',
}: StatusBadgeProps) {
    const statusLabel = label || formatStatus(status);

    const getVariant = (s: string) => {
        switch (s) {
            case 'completed':
            case 'ready_for_pickup':
            case 'paid':
                return 'default'; // primary / emerald
            case 'processing':
                return 'secondary';
            case 'pending':
            case 'returned':
            case 'unpaid':
                return 'outline';
            case 'rejected':
            case 'cancelled':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

    const getCustomClasses = (s: string) => {
        switch (s) {
            case 'completed':
            case 'ready_for_pickup':
                return 'bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-gray-950 border-transparent';
            case 'processing':
                return 'bg-blue-600/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
            case 'returned':
                return 'bg-amber-600/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
            case 'pending':
                return 'bg-muted text-muted-foreground border-border';
            case 'rejected':
            case 'cancelled':
                return 'bg-destructive/10 text-destructive border-destructive/20';
            default:
                return '';
        }
    };

    return (
        <Badge
            variant={getVariant(status)}
            className={`text-[11px] font-semibold capitalize ${getCustomClasses(status)} ${className}`}
        >
            {statusLabel}
        </Badge>
    );
}

function formatStatus(status: string): string {
    return status
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
