import {
    AlertCircle,
    Building2,
    CheckCircle2,
    Clock,
    FileText,
    PauseCircle,
    RotateCcw,
    XCircle,
} from 'lucide-react';

export interface TimelineEntry {
    id: number;
    status: string;
    status_label: string;
    status_color: string;
    remarks?: string | null;
    changed_by: string;
    created_at?: string | null;
    created_at_formatted?: string | null;
}

interface StatusTimelineProps {
    entries: TimelineEntry[];
}

export function StatusTimeline({ entries = [] }: StatusTimelineProps) {
    if (!entries || entries.length === 0) {
        return (
            <p className="text-xs text-muted-foreground">
                No status history recorded.
            </p>
        );
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="size-4 text-amber-500" />;
            case 'processing':
                return <FileText className="size-4 text-blue-500" />;
            case 'on_hold':
                return <PauseCircle className="size-4 text-gray-500" />;
            case 'returned':
                return <RotateCcw className="size-4 text-amber-500" />;
            case 'completed':
                return <CheckCircle2 className="size-4 text-emerald-500" />;
            case 'ready_for_pickup':
                return <Building2 className="size-4 text-emerald-600" />;
            case 'rejected':
            case 'cancelled':
                return <XCircle className="size-4 text-destructive" />;
            default:
                return <AlertCircle className="size-4 text-muted-foreground" />;
        }
    };

    return (
        <div className="relative pl-6 before:absolute before:top-2 before:bottom-2 before:left-[11px] before:w-[2px] before:bg-border/60">
            <div className="space-y-6">
                {entries.map((entry, index) => {
                    const isLatest = index === entries.length - 1;
                    const displayDate =
                        entry.created_at_formatted || entry.created_at;

                    return (
                        <div key={entry.id || index} className="relative">
                            {/* Circle dot / icon container */}
                            <div
                                className={`absolute -left-[31px] flex size-6 items-center justify-center rounded-full border-2 bg-background ${
                                    isLatest
                                        ? 'border-primary shadow-sm'
                                        : 'border-muted-foreground/30'
                                }`}
                            >
                                {getStatusIcon(entry.status)}
                            </div>

                            <div className="flex flex-col gap-1">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <span
                                        className={`text-xs font-bold ${
                                            isLatest
                                                ? 'text-foreground'
                                                : 'text-muted-foreground'
                                        }`}
                                    >
                                        {entry.status_label}
                                    </span>
                                    {displayDate && (
                                        <span className="text-[10px] text-muted-foreground">
                                            {displayDate}
                                        </span>
                                    )}
                                </div>

                                <p className="text-[11px] text-muted-foreground">
                                    Action by:{' '}
                                    <span className="font-medium text-foreground">
                                        {entry.changed_by}
                                    </span>
                                </p>

                                {entry.remarks && (
                                    <div className="mt-1.5 rounded-lg border border-border/50 bg-muted/30 p-2.5 text-xs text-foreground/90">
                                        <span className="font-semibold text-muted-foreground">
                                            Remarks:{' '}
                                        </span>
                                        {entry.remarks}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
