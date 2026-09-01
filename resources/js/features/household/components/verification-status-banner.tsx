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
    if (status === 'verified') {
        return (
            <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-800 dark:text-emerald-300">
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <div>
                        <p className="text-sm font-semibold">
                            Official Verified Household — {householdCode}
                        </p>
                        <p className="text-xs text-emerald-700 dark:text-emerald-400">
                            All barangay e-services, document requests, and
                            member management are unlocked.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'returned') {
        return (
            <Alert className="rounded-xl border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200">
                <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400" />
                <div className="flex w-full flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                        <AlertTitle className="font-semibold text-amber-950 dark:text-amber-100">
                            Registration Returned for Correction —{' '}
                            {householdCode}
                        </AlertTitle>
                        <AlertDescription className="mt-1 text-xs text-amber-800 dark:text-amber-300">
                            <strong>Review Remarks:</strong>{' '}
                            {reviewNotes ||
                                'Please review and update the required household information.'}
                        </AlertDescription>
                    </div>
                    {isFamilyHead && (
                        <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="shrink-0 border-amber-600/40 text-amber-900 hover:bg-amber-600/20 dark:text-amber-100"
                        >
                            <Link href="/household/edit">
                                <Edit3 className="mr-1.5 size-3.5" />
                                Edit & Resubmit
                            </Link>
                        </Button>
                    )}
                </div>
            </Alert>
        );
    }

    if (status === 'rejected') {
        return (
            <Alert variant="destructive" className="rounded-xl">
                <AlertCircle className="size-5" />
                <div>
                    <AlertTitle className="font-semibold">
                        Household Registration Rejected — {householdCode}
                    </AlertTitle>
                    <AlertDescription className="mt-1 text-xs">
                        <strong>Reason:</strong>{' '}
                        {reviewNotes ||
                            'The registration did not meet barangay jurisdictional or verification criteria.'}
                        <br />
                        You may submit a new household registration with valid
                        supporting documentation.
                    </AlertDescription>
                </div>
            </Alert>
        );
    }

    if (status === 'restricted') {
        return (
            <Alert variant="destructive" className="rounded-xl">
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
        <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-4 text-foreground">
            <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <Clock className="size-5 shrink-0" />
                </div>
                <div>
                    <p className="text-sm font-semibold">
                        Household Registration Pending Verification —{' '}
                        {householdCode}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Your registration has been submitted and is currently
                        being reviewed by the Barangay Administration.
                    </p>
                </div>
            </div>
        </div>
    );
}
