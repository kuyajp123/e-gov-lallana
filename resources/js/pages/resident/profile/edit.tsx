import { Head, usePage } from '@inertiajs/react';
import { ProfileForm } from '@/features/resident/components/profile-form';
import type { ResidentProfileData } from '@/features/resident/components/profile-form';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card';
import { useTranslation } from '@/shared/hooks/use-translation';
import type { BreadcrumbItem } from '@/shared/types';

interface ProfileEditProps {
    profile: ResidentProfileData | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Resident Profile', href: '/resident/profile' },
    { title: 'Edit', href: '/resident/profile/edit' },
];

export default function ProfileEdit({ profile }: ProfileEditProps) {
    const { auth } = usePage().props;
    const { t } = useTranslation();
    const user = auth.user;

    return (
        <>
            <Head
                title={t('profile.edit_profile', 'Complete Resident Profile')}
            />

            <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-4 md:p-8">
                <Card className="rounded-none border-border shadow-none">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-bold">
                            {t(
                                'settings.kyc_profile_title',
                                'Resident Profile Information',
                            )}
                        </CardTitle>
                        <CardDescription>
                            {t(
                                'settings.kyc_profile_desc',
                                'Please provide your official demographic information and upload a valid government-issued ID to access Barangay Lallana e-services.',
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ProfileForm
                            profile={profile}
                            user={user}
                            submitUrl="/resident/profile"
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ProfileEdit.layout = {
    breadcrumbs,
};
