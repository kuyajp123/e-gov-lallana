import { router } from '@inertiajs/react';
import { Check, Home, MapPin, User, X } from 'lucide-react';
import { useState } from 'react';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card';
import { Spinner } from '@/shared/components/ui/spinner';

export interface PendingHouseholdInvitation {
    id: number;
    relationship_to_head: string;
    invited_at: string | null;
    household: {
        id: number;
        household_code: string;
        address: string;
        purok_sitio: string;
        family_head_name: string;
        family_head_avatar: string | null;
    } | null;
}

interface HouseholdInvitationCardProps {
    invitation: PendingHouseholdInvitation;
}

export function HouseholdInvitationCard({
    invitation,
}: HouseholdInvitationCardProps) {
    const [actionLoading, setActionLoading] = useState<
        'accept' | 'reject' | null
    >(null);

    const handleAccept = () => {
        setActionLoading('accept');
        router.post(
            `/household/invitations/${invitation.id}/accept`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setActionLoading(null),
            },
        );
    };

    const handleReject = () => {
        if (
            !confirm(
                'Are you sure you want to decline this household invitation?',
            )
        ) {
            return;
        }

        setActionLoading('reject');
        router.post(
            `/household/invitations/${invitation.id}/reject`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setActionLoading(null),
            },
        );
    };

    const relationshipFormatted =
        invitation.relationship_to_head.charAt(0).toUpperCase() +
        invitation.relationship_to_head.slice(1);

    const initials = invitation.household?.family_head_name
        ? invitation.household.family_head_name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
        : 'FH';

    return (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card shadow-sm">
            <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Home className="size-5" />
                        </div>
                        <div>
                            <CardTitle className="text-base font-semibold">
                                Household Membership Invitation
                            </CardTitle>
                            <CardDescription className="text-xs">
                                You have been invited to join this registered
                                household
                            </CardDescription>
                        </div>
                    </div>
                    <Badge
                        variant="outline"
                        className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    >
                        Action Required
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-4 text-sm">
                <div className="grid gap-3 rounded-xl border border-border/70 bg-card/60 p-3 sm:grid-cols-2">
                    <div className="flex items-center gap-3">
                        <Avatar className="size-10 border border-border">
                            {invitation.household?.family_head_avatar && (
                                <AvatarImage
                                    src={
                                        invitation.household.family_head_avatar
                                    }
                                    alt={invitation.household.family_head_name}
                                />
                            )}
                            <AvatarFallback className="text-xs font-semibold">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Family Head
                            </p>
                            <p className="font-medium text-foreground">
                                {invitation.household?.family_head_name ??
                                    'Family Head'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground sm:justify-end">
                        <Badge
                            variant="secondary"
                            className="font-mono text-xs"
                        >
                            {invitation.household?.household_code ??
                                'HH-UNKNOWN'}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground sm:col-span-2">
                        <MapPin className="size-3.5 shrink-0 text-primary" />
                        <span>
                            {invitation.household?.address},{' '}
                            {invitation.household?.purok_sitio}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground sm:col-span-2">
                        <User className="size-3.5 shrink-0 text-primary" />
                        <span>
                            Your designated role:{' '}
                            <strong className="font-semibold text-foreground">
                                {relationshipFormatted}
                            </strong>
                        </span>
                    </div>
                </div>

                <p className="text-xs text-muted-foreground">
                    Accepting this invitation links your portal account to this
                    household. You will be able to access verified household
                    e-services and request barangay documents under this
                    household address.
                </p>
            </CardContent>

            <CardFooter className="flex justify-end gap-2 border-t border-border/60 pt-3">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReject}
                    disabled={actionLoading !== null}
                    className="gap-1.5 text-muted-foreground hover:text-destructive"
                >
                    {actionLoading === 'reject' ? (
                        <Spinner className="size-3.5" />
                    ) : (
                        <X className="size-3.5" />
                    )}
                    Decline
                </Button>

                <Button
                    size="sm"
                    onClick={handleAccept}
                    disabled={actionLoading !== null}
                    className="gap-1.5"
                >
                    {actionLoading === 'accept' ? (
                        <Spinner className="size-3.5" />
                    ) : (
                        <Check className="size-3.5" />
                    )}
                    Accept Invitation
                </Button>
            </CardFooter>
        </Card>
    );
}
