import { Form, Head, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, Loader2, ShieldAlert } from 'lucide-react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { ProfileForm } from '@/features/resident/components/profile-form';
import type { ResidentProfileData } from '@/features/resident/components/profile-form';
import DeleteUser from '@/features/settings/components/delete-user';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import Heading from '@/shared/components/heading';
import InputError from '@/shared/components/input-error';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/shared/components/ui/alert';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
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

    const nameParts = (auth.user.name || '').trim().split(' ');
    const defaultFirstName = profile?.first_name || nameParts[0] || '';
    const defaultLastName =
        profile?.last_name ||
        (nameParts.length > 1 ? nameParts.slice(1).join(' ') : '');
    const defaultMiddleName = profile?.middle_name ?? '';
    const defaultSuffix = profile?.suffix ?? '';

    const isKycComplete = Boolean(
        profile?.first_name &&
        profile?.last_name &&
        profile?.birthdate &&
        profile?.gender &&
        profile?.civil_status &&
        profile?.citizenship &&
        (profile?.government_id_url || profile?.government_id_file_id),
    );

    const updateFormProps =
        typeof ProfileController.update.form === 'function'
            ? ProfileController.update.form()
            : {
                  action: ProfileController.update.url({
                      query: { _method: 'PATCH' },
                  }),
                  method: 'post' as const,
              };

    return (
        <>
            <Head title={t('settings.nav_profile', 'Profile')} />

            <h1 className="sr-only">{t('settings.nav_profile', 'Profile')}</h1>

            <div className="space-y-8">
                {/* Account Details */}
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title={t(
                            'settings.account_info',
                            'Account Information',
                        )}
                        description={t(
                            'settings.account_info_desc',
                            'Update your account name, email address, and mobile phone number',
                        )}
                    />

                    <Form
                        {...updateFormProps}
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="first_name">
                                            {t(
                                                'settings.first_name',
                                                'First name',
                                            )}
                                        </Label>

                                        <Input
                                            id="first_name"
                                            className="mt-1 block w-full rounded-none"
                                            defaultValue={defaultFirstName}
                                            name="first_name"
                                            required
                                            autoComplete="given-name"
                                            placeholder={t(
                                                'settings.first_name',
                                                'First name',
                                            )}
                                        />

                                        <InputError
                                            className="mt-2"
                                            message={errors.first_name}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="middle_name">
                                            {t(
                                                'settings.middle_name',
                                                'Middle name',
                                            )}
                                        </Label>

                                        <Input
                                            id="middle_name"
                                            className="mt-1 block w-full rounded-none"
                                            defaultValue={defaultMiddleName}
                                            name="middle_name"
                                            autoComplete="additional-name"
                                            placeholder={t(
                                                'settings.middle_name',
                                                'Middle name',
                                            )}
                                        />

                                        <InputError
                                            className="mt-2"
                                            message={errors.middle_name}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="last_name">
                                            {t(
                                                'settings.last_name',
                                                'Last name',
                                            )}
                                        </Label>

                                        <Input
                                            id="last_name"
                                            className="mt-1 block w-full rounded-none"
                                            defaultValue={defaultLastName}
                                            name="last_name"
                                            required
                                            autoComplete="family-name"
                                            placeholder={t(
                                                'settings.last_name',
                                                'Last name',
                                            )}
                                        />

                                        <InputError
                                            className="mt-2"
                                            message={errors.last_name}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="suffix">
                                            {t('settings.suffix', 'Suffix')}
                                        </Label>

                                        <Input
                                            id="suffix"
                                            className="mt-1 block w-full rounded-none"
                                            defaultValue={defaultSuffix}
                                            name="suffix"
                                            autoComplete="honorific-suffix"
                                            placeholder="Jr., Sr., III"
                                        />

                                        <InputError
                                            className="mt-2"
                                            message={errors.suffix}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">
                                        {t('settings.email', 'Email address')}
                                    </Label>

                                    <Input
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full rounded-none"
                                        defaultValue={auth.user.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder={t(
                                            'settings.email',
                                            'Email address',
                                        )}
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.email}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="phone_number">
                                        {t(
                                            'settings.phone_number',
                                            'Mobile phone number',
                                        )}
                                    </Label>

                                    <Input
                                        id="phone_number"
                                        type="tel"
                                        className="mt-1 block w-full rounded-none"
                                        defaultValue={
                                            auth.user.phone_number ?? ''
                                        }
                                        name="phone_number"
                                        autoComplete="tel"
                                        placeholder="09171234567"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.phone_number}
                                    />
                                </div>

                                {mustVerifyEmail &&
                                    auth.user.email_verified_at === null && (
                                        <div>
                                            <p className="-mt-4 text-sm text-muted-foreground">
                                                Your email address is
                                                unverified.{' '}
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                                >
                                                    Click here to re-send the
                                                    verification email.
                                                </Link>
                                            </p>

                                            {status ===
                                                'verification-link-sent' && (
                                                <div className="mt-2 text-sm font-medium text-green-600">
                                                    A new verification link has
                                                    been sent to your email
                                                    address.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                <div className="flex items-center gap-4">
                                    <Button
                                        disabled={processing}
                                        data-test="update-profile-button"
                                        className="rounded-none shadow-none"
                                    >
                                        {processing && (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        {t('settings.save_account', 'Save')}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                <Separator />

                {/* Resident Profile & KYC Verification */}
                <div className="space-y-6">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <Heading
                            variant="small"
                            title={t(
                                'settings.kyc_profile_title',
                                'Resident Profile & KYC',
                            )}
                            description={t(
                                'settings.kyc_profile_desc',
                                'Official demographic information and identity verification for Barangay e-services',
                            )}
                        />
                        <Badge
                            variant={isKycComplete ? 'default' : 'secondary'}
                            className={cn(
                                'w-fit rounded-none text-xs font-semibold',
                                isKycComplete
                                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
                            )}
                        >
                            {isKycComplete ? (
                                <span className="flex items-center gap-1">
                                    <CheckCircle2 className="size-3.5" />
                                    {t(
                                        'settings.kyc_verified_badge',
                                        'KYC Complete',
                                    )}
                                </span>
                            ) : (
                                <span className="flex items-center gap-1">
                                    <AlertCircle className="size-3.5" />
                                    {t(
                                        'settings.kyc_incomplete_badge',
                                        'KYC Incomplete',
                                    )}
                                </span>
                            )}
                        </Badge>
                    </div>

                    {!isKycComplete && (
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
