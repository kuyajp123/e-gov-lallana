import { Head, Link, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    Edit,
    FileText,
    ShieldAlert,
    User as UserIcon,
} from 'lucide-react';
import type { ResidentProfileData } from '@/features/resident/components/profile-form';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/shared/components/ui/alert';
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
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card';
import { useTranslation } from '@/shared/hooks/use-translation';
import type { BreadcrumbItem } from '@/shared/types';

interface ProfileShowProps {
    profile: ResidentProfileData | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Resident Profile', href: '/resident/profile' },
];

export default function ProfileShow({ profile }: ProfileShowProps) {
    const { auth } = usePage().props;
    const user = auth.user;
    const { t } = useTranslation();

    const isComplete =
        profile !== null &&
        Boolean(profile.first_name) &&
        Boolean(profile.last_name) &&
        Boolean(profile.birthdate) &&
        Boolean(profile.gender) &&
        Boolean(profile.civil_status);

    return (
        <>
            <Head title={t('profile.title', 'Resident Profile')} />

            <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 p-4 md:p-8">
                {/* Header Profile Card */}
                <Card className="overflow-hidden rounded-none border border-border bg-card shadow-none">
                    <div className="h-24 bg-gradient-to-r from-violet-600 to-indigo-600" />
                    <CardContent className="relative px-6 pt-0 pb-6">
                        <div className="-mt-12 mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                            <div className="flex items-end gap-4">
                                <Avatar className="size-24 rounded-none border-4 border-background shadow-none">
                                    <AvatarImage
                                        src={profile?.avatar_url || ''}
                                    />
                                    <AvatarFallback className="rounded-none bg-violet-100 text-xl font-bold text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                                        {(
                                            profile?.first_name?.[0] ||
                                            user.name[0] ||
                                            'U'
                                        ).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="text-xl font-bold text-foreground">
                                        {profile
                                            ? `${profile.first_name} ${profile.middle_name || ''} ${profile.last_name} ${profile.suffix || ''}`.trim()
                                            : user.name}
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        {user.email}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    asChild
                                    size="sm"
                                    className="rounded-none shadow-none"
                                >
                                    <Link href="/resident/profile/edit">
                                        <Edit className="mr-1.5 size-4" />
                                        {isComplete
                                            ? t(
                                                  'profile.edit_profile',
                                                  'Edit Profile',
                                              )
                                            : t(
                                                  'profile.complete_profile',
                                                  'Complete Profile',
                                              )}
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {!isComplete && (
                            <Alert
                                variant="destructive"
                                className="mt-4 rounded-none shadow-none"
                            >
                                <ShieldAlert className="size-4" />
                                <AlertTitle>
                                    {t(
                                        'profile.profile_incomplete',
                                        'Profile Incomplete',
                                    )}
                                </AlertTitle>
                                <AlertDescription>
                                    {t(
                                        'profile.profile_incomplete_desc',
                                        'Please complete your resident information and demographic profile to unlock barangay document requests and household services.',
                                    )}
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>

                {profile ? (
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Personal Information */}
                        <Card className="rounded-none border border-border bg-card shadow-none">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                    <UserIcon className="size-4 text-primary" />
                                    {t(
                                        'profile.personal_info',
                                        'Personal Information',
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex justify-between border-b border-border/50 py-1">
                                    <span className="text-muted-foreground">
                                        {t('profile.sex', 'Sex')}
                                    </span>
                                    <span className="font-medium capitalize">
                                        {profile.gender || '—'}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b border-border/50 py-1">
                                    <span className="text-muted-foreground">
                                        {t('profile.birthdate', 'Birthdate')}
                                    </span>
                                    <span className="font-medium">
                                        {profile.birthdate
                                            ? new Date(
                                                  profile.birthdate,
                                              ).toLocaleDateString()
                                            : '—'}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b border-border/50 py-1">
                                    <span className="text-muted-foreground">
                                        {t(
                                            'profile.civil_status',
                                            'Civil Status',
                                        )}
                                    </span>
                                    <span className="font-medium capitalize">
                                        {profile.civil_status || '—'}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b border-border/50 py-1">
                                    <span className="text-muted-foreground">
                                        {t(
                                            'profile.citizenship',
                                            'Citizenship',
                                        )}
                                    </span>
                                    <span className="font-medium">
                                        {profile.citizenship || 'Filipino'}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b border-border/50 py-1">
                                    <span className="text-muted-foreground">
                                        {t('profile.religion', 'Religion')}
                                    </span>
                                    <span className="font-medium">
                                        {profile.religion || '—'}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Demographics & Residency */}
                        <Card className="rounded-none border border-border bg-card shadow-none">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                    <FileText className="size-4 text-primary" />
                                    {t(
                                        'profile.demographics',
                                        'Demographics & Residency',
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex justify-between border-b border-border/50 py-1">
                                    <span className="text-muted-foreground">
                                        {t(
                                            'profile.residency_status',
                                            'Residency Status',
                                        )}
                                    </span>
                                    <Badge
                                        variant="secondary"
                                        className="rounded-none capitalize shadow-none"
                                    >
                                        {profile.residency_status || 'Resident'}
                                    </Badge>
                                </div>
                                <div className="flex justify-between border-b border-border/50 py-1">
                                    <span className="text-muted-foreground">
                                        {t('profile.occupation', 'Occupation')}
                                    </span>
                                    <span className="font-medium">
                                        {profile.occupation || '—'}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b border-border/50 py-1">
                                    <span className="text-muted-foreground">
                                        {t(
                                            'profile.educational_attainment',
                                            'Educational Attainment',
                                        )}
                                    </span>
                                    <span className="font-medium capitalize">
                                        {profile.educational_attainment?.replace(
                                            '_',
                                            ' ',
                                        ) || '—'}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b border-border/50 py-1">
                                    <span className="text-muted-foreground">
                                        {t(
                                            'profile.employment_status',
                                            'Employment Status',
                                        )}
                                    </span>
                                    <span className="font-medium capitalize">
                                        {profile.employment_status?.replace(
                                            '_',
                                            ' ',
                                        ) || '—'}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b border-border/50 py-1">
                                    <span className="text-muted-foreground">
                                        {t(
                                            'profile.voter_status',
                                            'Voter Status',
                                        )}
                                    </span>
                                    <span className="flex items-center gap-1 font-medium">
                                        {profile.is_voter ? (
                                            <>
                                                <CheckCircle2 className="size-3.5 text-emerald-600" />
                                                <span>
                                                    {t(
                                                        'profile.voter_status',
                                                        'Registered Voter',
                                                    )}
                                                </span>
                                            </>
                                        ) : (
                                            'Non-Voter'
                                        )}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Special Classifications */}
                        <Card className="rounded-none border border-border bg-card shadow-none md:col-span-2">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold">
                                    Special Classifications & Identification
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {profile.senior_citizen_status && (
                                        <Badge className="rounded-none border-amber-300 bg-amber-100 text-amber-800 shadow-none dark:bg-amber-950 dark:text-amber-300">
                                            {t(
                                                'profile.senior_status',
                                                'Senior Citizen',
                                            )}
                                        </Badge>
                                    )}
                                    {profile.pwd_status && (
                                        <Badge className="rounded-none border-blue-300 bg-blue-100 text-blue-800 shadow-none dark:bg-blue-950 dark:text-blue-300">
                                            {t(
                                                'profile.pwd_status',
                                                'Person with Disability (PWD)',
                                            )}{' '}
                                            (
                                            {profile.pwd_id_number ||
                                                'Registered'}
                                            )
                                        </Badge>
                                    )}
                                    {profile.solo_parent_status && (
                                        <Badge className="rounded-none border-purple-300 bg-purple-100 text-purple-800 shadow-none dark:bg-purple-950 dark:text-purple-300">
                                            {t(
                                                'profile.solo_parent_status',
                                                'Solo Parent',
                                            )}{' '}
                                            (
                                            {profile.solo_parent_id_number ||
                                                'Registered'}
                                            )
                                        </Badge>
                                    )}
                                    {!profile.senior_citizen_status &&
                                        !profile.pwd_status &&
                                        !profile.solo_parent_status && (
                                            <span className="text-xs text-muted-foreground">
                                                No special classifications
                                                indicated.
                                            </span>
                                        )}
                                </div>

                                {profile.government_id_url && (
                                    <div className="border-t border-border pt-2">
                                        <p className="mb-1 text-xs font-semibold text-foreground">
                                            {t(
                                                'profile.government_id',
                                                'Attached Government ID',
                                            )}
                                            :
                                        </p>
                                        <a
                                            href={profile.government_id_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                                        >
                                            <FileText className="size-3.5" />
                                            {t(
                                                'profile.id_on_file',
                                                'View Uploaded ID Document (Secure Link)',
                                            )}
                                        </a>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <Card className="rounded-none border border-border bg-card p-8 text-center shadow-none">
                        <p className="mb-4 text-sm text-muted-foreground">
                            No resident profile record found for this account.
                        </p>
                        <Button asChild className="rounded-none shadow-none">
                            <Link href="/resident/profile/edit">
                                Set Up Resident Profile
                            </Link>
                        </Button>
                    </Card>
                )}
            </div>
        </>
    );
}

ProfileShow.layout = {
    breadcrumbs,
};

ProfileShow.layout = {
    breadcrumbs,
};
