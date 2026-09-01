import { Badge } from '@/shared/components/ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card';
import { StatusBadge } from './status-badge';

interface RequestSummaryCardProps {
    referenceCode: string;
    documentName: string;
    currentStatus: string;
    statusLabel?: string;
    feeFormatted: string;
    paymentStatus: string;
    paymentLabel?: string;
    purpose?: string | null;
    submittedAt?: string | null;
    submittedAtFormatted?: string | null;
}

export function RequestSummaryCard({
    referenceCode,
    documentName,
    currentStatus,
    statusLabel,
    feeFormatted,
    paymentStatus,
    paymentLabel,
    purpose,
    submittedAt,
    submittedAtFormatted,
}: RequestSummaryCardProps) {
    const displayDate = submittedAtFormatted || submittedAt || '—';

    return (
        <Card className="rounded-2xl border-border">
            <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <span className="text-[11px] font-semibold text-muted-foreground">
                            Reference Code
                        </span>
                        <CardTitle className="text-lg font-bold tracking-tight text-primary">
                            {referenceCode}
                        </CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <StatusBadge
                            status={currentStatus}
                            label={statusLabel}
                        />
                        <Badge variant="outline" className="text-xs capitalize">
                            {paymentLabel || paymentStatus}
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
                <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl bg-muted/40 p-3">
                        <span className="text-[11px] font-semibold text-muted-foreground">
                            Document Type
                        </span>
                        <p className="mt-0.5 text-xs font-bold text-foreground">
                            {documentName}
                        </p>
                    </div>
                    <div className="rounded-xl bg-muted/40 p-3">
                        <span className="text-[11px] font-semibold text-muted-foreground">
                            Processing Fee
                        </span>
                        <p className="mt-0.5 text-xs font-bold text-foreground">
                            {feeFormatted}
                        </p>
                    </div>
                    <div className="rounded-xl bg-muted/40 p-3">
                        <span className="text-[11px] font-semibold text-muted-foreground">
                            Date Submitted
                        </span>
                        <p className="mt-0.5 text-xs font-bold text-foreground">
                            {displayDate}
                        </p>
                    </div>
                </div>

                {purpose && (
                    <div className="rounded-xl border border-border/50 bg-background p-3 text-xs">
                        <span className="font-semibold text-muted-foreground">
                            Stated Purpose:{' '}
                        </span>
                        <span className="text-foreground">{purpose}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
