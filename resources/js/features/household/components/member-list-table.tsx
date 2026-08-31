import { router } from '@inertiajs/react';
import { Crown, Trash2, User } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';

export interface MemberItem {
    id: number;
    user_id?: number | null;
    full_name: string;
    first_name: string;
    middle_name?: string | null;
    last_name: string;
    suffix?: string | null;
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
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase">
                    <tr>
                        <th className="px-4 py-3">Member Name</th>
                        <th className="px-4 py-3">Relationship</th>
                        <th className="px-4 py-3">Sex / Civil Status</th>
                        <th className="px-4 py-3">Occupation</th>
                        <th className="px-4 py-3">Residency</th>
                        {isFamilyHead && (
                            <th className="px-4 py-3 text-right">Actions</th>
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
                                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
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
                                                <Badge className="border-amber-300 bg-amber-100 py-0 text-[10px] text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                                    Head
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
                                    className="text-xs capitalize"
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
                                                className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
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
