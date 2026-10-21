import { router } from '@inertiajs/react';
import { Crown, Trash2, User } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { useTranslation } from '@/shared/hooks/use-translation';

export interface MemberItem {
    id: number;
    user_id?: number | null;
    full_name: string;
    first_name: string;
    middle_name?: string | null;
    last_name: string;
    suffix?: string | null;
    email?: string | null;
    invitation_status?: string | null;
    invited_at?: string | null;
    relationship_to_head: string;
    is_family_head: boolean;
    birthdate?: string | null;
    gender?: string | null;
    civil_status?: string | null;
    occupation?: string | null;
    residency_status: string;
}

interface MemberListTableProps {
    members: MemberItem[];
    isFamilyHead: boolean;
    householdStatus: string;
}

export function MemberListTable({
    members,
    isFamilyHead,
    householdStatus,
}: MemberListTableProps) {
    const { t } = useTranslation();

    const handleRemove = (member: MemberItem) => {
        if (
            confirm(
                `Are you sure you want to remove ${member.full_name} from this household?`,
            )
        ) {
            router.delete(`/household/members/${member.id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <div className="overflow-x-auto rounded-none border border-border bg-card shadow-none">
            <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase">
                    <tr>
                        <th className="px-4 py-3">
                            {t('household.member_name', 'Member Name')}
                        </th>
                        <th className="px-4 py-3">
                            {t('household.relationship', 'Relationship')}
                        </th>
                        <th className="px-4 py-3">
                            {t(
                                'household.sex_civil_status',
                                'Sex / Civil Status',
                            )}
                        </th>
                        <th className="px-4 py-3">
                            {t('household.occupation', 'Occupation')}
                        </th>
                        <th className="px-4 py-3">
                            {t('household.residency', 'Residency')}
                        </th>
                        {isFamilyHead && (
                            <th className="px-4 py-3 text-right">
                                {t('household.actions', 'Actions')}
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {members.map((member) => (
                        <tr
                            key={member.id}
                            className="transition-colors hover:bg-muted/20"
                        >
                            <td className="px-4 py-3 font-medium">
                                <div className="flex items-center gap-2">
                                    <div className="flex size-8 items-center justify-center rounded-none bg-primary/10 text-primary">
                                        {member.is_family_head ? (
                                            <Crown className="size-4 text-amber-500" />
                                        ) : (
                                            <User className="size-4" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-semibold text-foreground">
                                                {member.full_name}
                                            </span>
                                            {member.is_family_head && (
                                                <Badge className="rounded-none border-amber-300 bg-amber-100 py-0 text-[10px] text-amber-800 shadow-none dark:bg-amber-950 dark:text-amber-300">
                                                    Head
                                                </Badge>
                                            )}
                                            {member.invitation_status ===
                                                'pending' && (
                                                <Badge
                                                    variant="outline"
                                                    className="rounded-none border-amber-500/30 bg-amber-500/10 py-0 text-[10px] text-amber-600 shadow-none dark:text-amber-400"
                                                >
                                                    Invite Pending
                                                </Badge>
                                            )}
                                            {member.invitation_status ===
                                                'accepted' && (
                                                <Badge
                                                    variant="outline"
                                                    className="rounded-none border-emerald-500/30 bg-emerald-500/10 py-0 text-[10px] text-emerald-600 shadow-none dark:text-emerald-400"
                                                >
                                                    Linked
                                                </Badge>
                                            )}
                                            {member.invitation_status ===
                                                'rejected' && (
                                                <Badge
                                                    variant="outline"
                                                    className="rounded-none border-destructive/30 bg-destructive/10 py-0 text-[10px] text-destructive shadow-none"
                                                >
                                                    Declined
                                                </Badge>
                                            )}
                                        </div>
                                        {member.birthdate && (
                                            <span className="text-xs text-muted-foreground">
                                                Born:{' '}
                                                {new Date(
                                                    member.birthdate,
                                                ).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </td>

                            <td className="px-4 py-3 text-muted-foreground capitalize">
                                {member.relationship_to_head}
                            </td>

                            <td className="px-4 py-3 text-muted-foreground capitalize">
                                {member.gender || '—'} /{' '}
                                {member.civil_status || '—'}
                            </td>

                            <td className="px-4 py-3 text-muted-foreground">
                                {member.occupation || '—'}
                            </td>

                            <td className="px-4 py-3">
                                <Badge
                                    variant="outline"
                                    className="rounded-none text-xs capitalize shadow-none"
                                >
                                    {member.residency_status || 'Resident'}
                                </Badge>
                            </td>

                            {isFamilyHead && (
                                <td className="px-4 py-3 text-right">
                                    {!member.is_family_head &&
                                        householdStatus === 'verified' && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    handleRemove(member)
                                                }
                                                className="h-8 w-8 rounded-none p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                title="Remove member"
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
