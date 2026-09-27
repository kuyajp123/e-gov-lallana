import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    Calendar,
    FileText,
    Home,
    MapPin,
    QrCode,
    Shield,
    ShieldAlert,
    ShieldCheck,
    User,
    XCircle,
} from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from '@/shared/components/ui/card';

interface VerifiedDocument {
    token: string;
    reference_code: string;
    document_type: string;
    issued_at: string;
    issued_at_formatted: string;
    expires_at_formatted: string | null;
    is_expired: boolean;
    status: string;
    masked_name: string;
    purpose: string;
    purok: string | null;
    issuing_authority: string;
}

interface PublicVerifyDocumentProps {
    valid: boolean;
    status: 'authentic' | 'expired' | 'revoked' | 'tampered' | 'not_found';
    message: string;
    document: VerifiedDocument | null;
}

export default function PublicVerifyDocument({
    status,
    message,
    document,
}: PublicVerifyDocumentProps) {
    const getStatusHeader = () => {
        switch (status) {
            case 'authentic':
                return {
                    icon: ShieldCheck,
                    iconColor: 'text-emerald-600 dark:text-emerald-400',
                    bgGradient:
                        'from-emerald-500/10 via-emerald-500/5 to-transparent',
                    borderColor: 'border-emerald-200 dark:border-emerald-800',
                    badge: 'Authentic & Valid',
                    badgeVariant: 'default' as const,
                    title: 'Official Document Verified',
                };
            case 'expired':
                return {
                    icon: AlertTriangle,
                    iconColor: 'text-amber-600 dark:text-amber-400',
                    bgGradient:
                        'from-amber-500/10 via-amber-500/5 to-transparent',
                    borderColor: 'border-amber-200 dark:border-amber-800',
                    badge: 'Expired',
                    badgeVariant: 'outline' as const,
                    title: 'Document Has Expired',
                };
            case 'revoked':
                return {
                    icon: ShieldAlert,
                    iconColor: 'text-rose-600 dark:text-rose-400',
                    bgGradient:
                        'from-rose-500/10 via-rose-500/5 to-transparent',
                    borderColor: 'border-rose-200 dark:border-rose-800',
                    badge: 'Revoked',
                    badgeVariant: 'destructive' as const,
                    title: 'Document Officially Revoked',
                };
            case 'tampered':
            case 'not_found':
            default:
                return {
                    icon: XCircle,
                    iconColor: 'text-rose-600 dark:text-rose-400',
                    bgGradient:
                        'from-rose-500/10 via-rose-500/5 to-transparent',
                    borderColor: 'border-rose-200 dark:border-rose-800',
                    badge: 'Invalid / Unverified',
                    badgeVariant: 'destructive' as const,
                    title: 'Verification Failed',
                };
        }
    };

    const statusConfig = getStatusHeader();
    const StatusIcon = statusConfig.icon;

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-background to-slate-100/50 px-4 py-10 sm:px-6 lg:px-8 dark:from-slate-950 dark:via-background dark:to-slate-900/50">
            <Head title="Verify Document - Barangay Lallana" />

            <div className="mx-auto max-w-xl">
                {/* Header branding */}
                <div className="mb-8 text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-3 transition-transform hover:scale-105"
                    >
                        <img
                            src="/lallana-icon.png"
                            alt="Barangay Lallana Seal"
                            className="size-14 object-contain drop-shadow"
                        />
                        <div className="text-left">
                            <h1 className="text-lg font-black tracking-tight text-foreground">
                                BARANGAY LALLANA
                            </h1>
                            <p className="text-xs font-semibold tracking-wider text-violet-600 uppercase dark:text-violet-400">
                                Trece Martires City &bull; Cavite
                            </p>
                        </div>
                    </Link>
                    <p className="mt-2 text-xs font-medium text-muted-foreground">
                        Official Document Digital Verification & Anti-Fraud
                        Portal
                    </p>
                </div>

                {/* Verification Card */}
                <Card
                    className={`overflow-hidden border-2 shadow-lg backdrop-blur-sm ${statusConfig.borderColor}`}
                >
                    <div
                        className={`bg-gradient-to-b ${statusConfig.bgGradient} p-6 text-center sm:p-8`}
                    >
                        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-background/80 shadow-xs ring-1 ring-black/5 dark:bg-background/40">
                            <StatusIcon
                                className={`size-10 ${statusConfig.iconColor}`}
                            />
                        </div>
                        <Badge
                            variant={statusConfig.badgeVariant}
                            className="px-3 py-1 text-xs font-bold tracking-wider uppercase"
                        >
                            {statusConfig.badge}
                        </Badge>
                        <CardTitle className="mt-3 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                            {statusConfig.title}
                        </CardTitle>
                        <CardDescription className="mx-auto mt-2 max-w-md text-xs sm:text-sm">
                            {message}
                        </CardDescription>
                    </div>

                    {document && (
                        <CardContent className="space-y-4 p-6 sm:p-8">
                            <div className="space-y-3 rounded-xl border border-border/70 bg-card p-4 shadow-2xs">
                                <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                                    <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                        <FileText className="size-3.5 text-violet-600" />
                                        Document Type
                                    </span>
                                    <span className="text-sm font-bold text-foreground">
                                        {document.document_type}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                                    <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                        <QrCode className="size-3.5 text-violet-600" />
                                        Reference Code
                                    </span>
                                    <span className="font-mono text-sm font-bold text-violet-700 dark:text-violet-300">
                                        {document.reference_code}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                                    <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                        <User className="size-3.5 text-violet-600" />
                                        Issued To
                                    </span>
                                    <span className="font-mono text-sm font-semibold text-foreground">
                                        {document.masked_name}
                                    </span>
                                </div>

                                {document.purok && (
                                    <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                                        <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                            <MapPin className="size-3.5 text-violet-600" />
                                            Jurisdiction
                                        </span>
                                        <span className="text-xs font-semibold text-foreground">
                                            {document.purok}, Barangay Lallana
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                                    <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                        <Calendar className="size-3.5 text-violet-600" />
                                        Issuance Date
                                    </span>
                                    <span className="text-xs font-medium text-foreground">
                                        {document.issued_at_formatted}
                                    </span>
                                </div>

                                {document.expires_at_formatted && (
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                            <Shield className="size-3.5 text-violet-600" />
                                            Validity Period
                                        </span>
                                        <span className="text-xs font-semibold text-foreground">
                                            Valid until{' '}
                                            {document.expires_at_formatted}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="rounded-xl bg-muted/50 p-3.5 text-[11px] leading-relaxed text-muted-foreground">
                                <strong className="text-foreground">
                                    Privacy Notice (R.A. 10173):
                                </strong>{' '}
                                In compliance with the Philippine Data Privacy
                                Act of 2012, personal details on this public
                                verification portal are masked. Authenticated
                                barangay staff can view the full record via the
                                internal admin scanner.
                            </div>
                        </CardContent>
                    )}

                    <div className="border-t border-border/60 bg-muted/20 p-4 text-center">
                        <Link href="/">
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                            >
                                <Home className="size-3.5" />
                                Return to Barangay Portal
                            </Button>
                        </Link>
                    </div>
                </Card>

                {/* Footer security notes */}
                <div className="mt-8 text-center text-xs text-muted-foreground">
                    <p>
                        Office of the Punong Barangay &bull; Trece Martires
                        City, Cavite
                    </p>
                    <p className="mt-1 text-[11px]">
                        Cryptographic tamper verification secured by e-Gov
                        Lallana
                    </p>
                </div>
            </div>
        </div>
    );
}
