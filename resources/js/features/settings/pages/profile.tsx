import { Form, Head, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
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

    const isKycComplete = Boolean(
        profile?.first_name &&
        profile?.last_name &&
        profile?.birthdate &&
        profile?.gender &&
        profile?.civil_status,
    );

    return (
        <>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile settings</h1>

            <div className="space-y-8">
                {/* Account Details */}
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Account Information"
                        description="Update your account name, email address, and mobile phone number"
                    />

                    <Form
                        {...ProfileController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>

                                    <Input
                                        id="name"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.name}
                                        name="name"
                                        required
                                        autoComplete="name"
                                        placeholder="Full name"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.name}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email address</Label>

                                    <Input
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder="Email address"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.email}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="phone_number">
                                        Mobile phone number
                                    </Label>

                                    <Input
                                        id="phone_number"
                                        type="tel"
                                        className="mt-1 block w-full"
                                        defaultValue={
                                            auth.user.phone_number ?? ''
                                        }
                                        name="phone_number"
                                        autoComplete="tel"
                                        placeholder="e.g. 09171234567 or +639171234567"
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
                                    >
                                        Save
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
                            title="Resident Profile & KYC"
                            description="Official demographic information and identity verification for Barangay e-services"
                        />
                        <Badge
                            variant={isKycComplete ? 'default' : 'secondary'}
                            className={cn(
                                'w-fit text-xs font-semibold',
                                isKycComplete
                                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
                            )}
                        >
                            {isKycComplete ? (
                                <span className="flex items-center gap-1">
                                    <CheckCircle2 className="size-3.5" />
                                    KYC Complete
                                </span>
                            ) : (
                                <span className="flex items-center gap-1">
                                    <AlertCircle className="size-3.5" />
                                    KYC Incomplete
                                </span>
                            )}
                        </Badge>
                    </div>

                    {!isKycComplete && (
                        <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
                            <ShieldAlert className="size-4 text-amber-600 dark:text-amber-400" />
                            <AlertTitle className="font-semibold">
                                KYC Verification Required
                            </AlertTitle>
                            <AlertDescription className="text-xs">
                                Please fill in your resident demographic
                                information and upload a valid government-issued
                                ID below. This unlocks official document
                                requests and automated Barangay services.
                            </AlertDescription>
                        </Alert>
                    )}

                    <Card className="rounded-xl border-border">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold">
                                Resident Information Form
                            </CardTitle>
                            <CardDescription>
                                Official records are stored securely and
                                verified by Barangay administrators.
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
