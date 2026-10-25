import { Head } from '@inertiajs/react';
import { HouseholdWizard } from '@/features/household/components/household-wizard';
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

interface RegisterProps {
    profile: ResidentProfileData | null;
    purokOptions: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'My Household', href: '/household' },
    { title: 'Register', href: '/household/register' },
];

export default function HouseholdRegister({
    profile,
    purokOptions,
}: RegisterProps) {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('household.register_title', 'Register Household')} />

            <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-4 md:p-8">
                <Card className="rounded-none border-border shadow-none">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-bold">
                            {t(
                                'household.register_title',
                                'Barangay Lallana Household Registration',
                            )}
                        </CardTitle>
                        <CardDescription>
                            {t(
                                'household.edit_household_desc',
                                'Establish your official family household record to unlock barangay clearance issuance, certificate requests, and family member accounts.',
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <HouseholdWizard
                            profile={profile}
                            purokOptions={purokOptions}
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

HouseholdRegister.layout = {
    breadcrumbs,
};
