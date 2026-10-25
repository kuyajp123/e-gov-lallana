import { Head, usePage } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { ProfileForm } from '@/features/resident/components/profile-form';
import type { ResidentProfileData } from '@/features/resident/components/profile-form';
import DeleteUser from '@/features/settings/components/delete-user';
import { edit } from '@/routes/profile';
import Heading from '@/shared/components/heading';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/shared/components/ui/alert';
import { Badge } from '@/shared/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';
import { useTranslation } from '@/shared/hooks/use-translation';
import { cn } from '@/shared/lib/utils';
import type { Auth } from '@/shared/types';

type PageProps = {
    auth: Auth;
};

export default function Profile({
    mustVerifyEmail,
    status,
    profile,
}: {
    mustVerifyEmail: boolean;
    status?: string;
    profile?: ResidentProfileData | null;
}) {
    const { auth } = usePage<PageProps>().props;
    const { t } = useTranslation();

    const isProfileComplete = Boolean(
        profile?.first_name &&
        profile?.last_name &&
        profile?.birthdate &&
        profile?.gender &&
        profile?.civil_status &&
        profile?.citizenship &&
        (profile?.government_id_url || profile?.government_id_file_id),
    );

    return (
        <>
            <Head title={t('settings.nav_profile', 'Profile')} />

            <h1 className="sr-only">{t('settings.nav_profile', 'Profile')}</h1>

            <div className="space-y-8">
                {/* Unified Resident Information */}
                <div className="space-y-6">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <Heading
                            variant="small"
                            title={t(
                                'settings.kyc_profile_title',
                                'Resident Profile Information',
                            )}
                            description={t(
                                'settings.kyc_profile_desc',
                                'Complete your official barangay resident record to access online document issuing and household verification.',
                            )}
                        />
                        <Badge
                            variant={
                                isProfileComplete ? 'default' : 'secondary'
                            }
                            className={cn(
                                'w-fit rounded-none text-xs font-semibold',
                                isProfileComplete
                                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
                            )}
                        >
                            {isProfileComplete ? (
                                <span className="flex items-center gap-1">
                                    <CheckCircle2 className="size-3.5" />
                                    {t(
                                        'settings.kyc_verified_badge',
                                        'Profile Complete',
                                    )}
                                </span>
                            ) : (
                                <span className="flex items-center gap-1">
                                    <AlertCircle className="size-3.5" />
                                    {t(
                                        'settings.kyc_incomplete_badge',
                                        'Profile Incomplete',
                                    )}
                                </span>
                            )}
                        </Badge>
                    </div>

                    {!isProfileComplete && (
                        <Alert className="rounded-none border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
                            <ShieldAlert className="size-4 text-amber-600 dark:text-amber-400" />
                            <AlertTitle className="font-semibold">
                                {t(
                                    'settings.kyc_alert_title',
                                    'Complete Profile & Government ID Required',
                                )}
                            </AlertTitle>
                            <AlertDescription className="text-xs">
                                {t(
                                    'settings.kyc_alert_desc',
                                    'Please fill in your resident demographic information and upload a valid government-issued ID below. Both a completed profile (with Government ID) and a verified household are required to request official barangay documents.',
                                )}
                            </AlertDescription>
                        </Alert>
                    )}

                    <Card className="rounded-none border-border shadow-none">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold">
                                {t(
                                    'settings.resident_info_form',
                                    'Resident Information Form',
                                )}
                            </CardTitle>
                            <CardDescription>
                                {t(
                                    'settings.resident_info_form_desc',
                                    'Official records are stored securely and verified by Barangay administrators.',
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ProfileForm
                                profile={profile}
                                user={auth.user}
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                submitUrl="/resident/profile"
                            />
                        </CardContent>
                    </Card>
                </div>

                <Separator />

                <DeleteUser />
            </div>
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Profile settings',
            href: edit(),
        },
    ],
};
