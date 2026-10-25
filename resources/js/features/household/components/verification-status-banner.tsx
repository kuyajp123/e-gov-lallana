import { Link } from '@inertiajs/react';
import {
    AlertCircle,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Edit3,
    ShieldAlert,
} from 'lucide-react';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/shared/components/ui/alert';
import { Button } from '@/shared/components/ui/button';
import { useTranslation } from '@/shared/hooks/use-translation';

interface VerificationStatusBannerProps {
    status:
        | 'unverified'
        | 'verified'
        | 'returned'
        | 'rejected'
        | 'restricted'
        | string;
    householdCode: string;
    reviewNotes?: string | null;
    isFamilyHead?: boolean;
}

export function VerificationStatusBanner({
    status,
    householdCode,
    reviewNotes,
    isFamilyHead = false,
}: VerificationStatusBannerProps) {
    const { t } = useTranslation();

    if (status === 'verified') {
        return (
            <div className="flex items-center justify-between rounded-none border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-800 shadow-none dark:text-emerald-300">
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <div>
                        <p className="text-sm font-semibold">
                            {t(
                                'household.verified_banner_title',
                                { code: householdCode },
                                `Official Verified Household — ${householdCode}`,
                            )}
                        </p>
                        <p className="text-xs text-emerald-700 dark:text-emerald-400">
                            {t(
                                'household.verified_banner_desc',
                                'All barangay e-services, document requests, and member management are unlocked.',
                            )}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'returned') {
        return (
            <Alert className="rounded-none border-amber-500/40 bg-amber-500/10 text-amber-900 shadow-none dark:text-amber-200">
                <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400" />
                <div className="flex w-full flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                        <AlertTitle className="font-semibold text-amber-950 dark:text-amber-100">
                            {t(
                                'household.returned_banner_title',
                                { code: householdCode },
                                `Registration Returned for Correction — ${householdCode}`,
                            )}
                        </AlertTitle>
                        <AlertDescription className="mt-1 text-xs text-amber-800 dark:text-amber-300">
                            <strong>
                                {t(
                                    'household.returned_review_remarks',
                                    'Review Remarks:',
                                )}
                            </strong>{' '}
                            {reviewNotes ||
                                t(
                                    'household.returned_default_remark',
                                    'Please review and update the required household information.',
                                )}
                        </AlertDescription>
                    </div>
                    {isFamilyHead && (
                        <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="shrink-0 rounded-none border-amber-600/40 text-amber-900 shadow-none hover:bg-amber-600/20 dark:text-amber-100"
                        >
                            <Link href="/household/edit">
                                <Edit3 className="mr-1.5 size-3.5" />
                                {t(
                                    'household.edit_and_resubmit',
                                    'Edit & Resubmit',
                                )}
                            </Link>
                        </Button>
                    )}
                </div>
            </Alert>
        );
    }

    if (status === 'rejected') {
        return (
            <Alert variant="destructive" className="rounded-none shadow-none">
                <AlertCircle className="size-5" />
                <div>
                    <AlertTitle className="font-semibold">
                        {t(
                            'household.rejected_banner_title',
                            { code: householdCode },
                            `Household Registration Rejected — ${householdCode}`,
                        )}
                    </AlertTitle>
                    <AlertDescription className="mt-1 text-xs">
                        <strong>{t('common.details', 'Reason:')}</strong>{' '}
                        {reviewNotes ||
                            t(
                                'household.rejected_default_reason',
                                'The registration did not meet barangay jurisdictional or verification criteria.',
                            )}
                    </AlertDescription>
                </div>
            </Alert>
        );
    }

    if (status === 'restricted') {
        return (
            <Alert variant="destructive" className="rounded-none shadow-none">
                <ShieldAlert className="size-5" />
                <div>
                    <AlertTitle className="font-semibold">
                        Household Account Restricted
                    </AlertTitle>
                    <AlertDescription className="mt-1 text-xs">
                        This household account has been placed under
                        administrative restriction:{' '}
                        {reviewNotes ||
                            'Please contact the Barangay Hall for assistance.'}
                    </AlertDescription>
                </div>
            </Alert>
        );
    }

    // Default: unverified / pending
    return (
        <div className="flex items-center justify-between rounded-none border border-primary/20 bg-primary/5 p-4 text-foreground shadow-none">
            <div className="flex items-center gap-3">
                <div className="rounded-none bg-primary/10 p-2 text-primary">
                    <Clock className="size-5 shrink-0" />
                </div>
                <div>
                    <p className="text-sm font-semibold">
                        {t('household.pending', 'Pending Verification Review')}{' '}
                        — {householdCode}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Your registration has been submitted and is currently
                        being reviewed by the Barangay Administration.
                    </p>
                </div>
            </div>
            {isFamilyHead && (
                <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="rounded-none shadow-none"
                >
                    <Link href="/household/edit">
                        <Edit3 className="mr-1.5 size-3.5" />
                        {t('common.edit', 'Edit')}
                    </Link>
                </Button>
            )}
        </div>
    );
}
