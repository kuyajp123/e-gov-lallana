import { Head, Link, useForm } from '@inertiajs/react';
import {
    Bell,
    Check,
    Mail,
    MessageSquare,
    ShieldAlert,
    Smartphone,
} from 'lucide-react';
import type { FormEventHandler } from 'react';
import Heading from '@/shared/components/heading';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/shared/components/ui/alert';
import { Button } from '@/shared/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Label } from '@/shared/components/ui/label';
import type {
    BreadcrumbItem,
    NotificationPreferenceType,
} from '@/shared/types';

type Props = {
    preference: NotificationPreferenceType;
    hasPhoneNumber: boolean;
    phoneNumber?: string | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Settings', href: '/settings/profile' },
    { title: 'Notifications', href: '/settings/notifications' },
];

export default function NotificationsSettings({
    preference,
    hasPhoneNumber,
    phoneNumber,
}: Props) {
    const { data, setData, patch, processing, recentlySuccessful, errors } =
        useForm({
            preferred_channel: preference.preferred_channel || 'email',
            notify_document_updates: Boolean(
                preference.notify_document_updates,
            ),
            notify_household_updates: Boolean(
                preference.notify_household_updates,
            ),
            notify_announcements: Boolean(preference.notify_announcements),
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch('/settings/notifications', {
            preserveScroll: true,
        });
    };

    const channels = [
        {
            id: 'in_app_only',
            title: 'In-App Only',
            description:
                'View alerts only within the portal notification bell.',
            icon: Bell,
        },
        {
            id: 'email',
            title: 'In-App + Email (Recommended)',
            description:
                'Receive email notifications when documents or household records change.',
            icon: Mail,
        },
        {
            id: 'sms',
            title: 'In-App + SMS Text Message',
            description:
                'Receive SMS text notifications on your registered mobile number.',
            icon: MessageSquare,
            requiresPhone: true,
        },
        {
            id: 'both',
            title: 'All Channels (In-App + Email + SMS)',
            description:
                'Receive updates across all channels for critical announcements and requests.',
            icon: Smartphone,
            requiresPhone: true,
        },
    ];

    return (
        <>
            <Head title="Notification settings" />

            <h1 className="sr-only">Notification settings</h1>

            <div className="max-w-2xl space-y-6">
                <Heading
                    variant="small"
                    title="Notification Preferences"
                    description="Choose how and when you want to receive alerts and official updates."
                />

                <form onSubmit={submit} className="space-y-6">
                    {/* Channel Selection */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">
                                Primary Notification Channel
                            </CardTitle>
                            <CardDescription>
                                Select your preferred delivery method for
                                notifications and alerts.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {channels.map((channel) => {
                                const Icon = channel.icon;
                                const isSelected =
                                    data.preferred_channel === channel.id;
                                const isDisabled =
                                    channel.requiresPhone && !hasPhoneNumber;

                                return (
                                    <div
                                        key={channel.id}
                                        onClick={() => {
                                            if (!isDisabled) {
                                                setData(
                                                    'preferred_channel',
                                                    channel.id as any,
                                                );
                                            }
                                        }}
                                        className={`flex cursor-pointer items-start gap-3.5 rounded-lg border p-3.5 transition-all ${
                                            isSelected
                                                ? 'border-primary bg-primary/[0.03] ring-1 ring-primary dark:bg-primary/[0.08]'
                                                : isDisabled
                                                  ? 'cursor-not-allowed bg-muted/40 opacity-50'
                                                  : 'hover:border-muted-foreground/40 hover:bg-muted/30'
                                        }`}
                                    >
                                        <div className="mt-0.5 shrink-0 rounded-full bg-muted p-2">
                                            <Icon className="size-4 text-foreground" />
                                        </div>
                                        <div className="min-w-0 flex-1 space-y-0.5">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-foreground">
                                                    {channel.title}
                                                </p>
                                                {isSelected && (
                                                    <Check className="size-4 shrink-0 text-primary" />
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {channel.description}
                                            </p>
                                            {channel.requiresPhone && (
                                                <p className="pt-0.5 text-[11px] text-muted-foreground">
                                                    {hasPhoneNumber
                                                        ? `Mobile: ${phoneNumber}`
                                                        : 'No verified mobile number in profile.'}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            {!hasPhoneNumber && (
                                <Alert
                                    variant="default"
                                    className="border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300"
                                >
                                    <ShieldAlert className="size-4 text-amber-600 dark:text-amber-400" />
                                    <AlertTitle className="text-xs font-semibold">
                                        Want SMS text alerts?
                                    </AlertTitle>
                                    <AlertDescription className="mt-1 text-xs">
                                        Add a mobile number in your{' '}
                                        <Link
                                            href="/settings/profile"
                                            className="font-semibold underline"
                                        >
                                            Profile Settings
                                        </Link>{' '}
                                        to enable SMS notifications.
                                    </AlertDescription>
                                </Alert>
                            )}

                            {errors.preferred_channel && (
                                <p className="text-xs text-red-600 dark:text-red-400">
                                    {errors.preferred_channel}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Topic Toggles */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">
                                Notification Topics
                            </CardTitle>
                            <CardDescription>
                                Choose which services and updates send you
                                alerts.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <Checkbox
                                    id="notify_document_updates"
                                    checked={data.notify_document_updates}
                                    onCheckedChange={(checked) =>
                                        setData(
                                            'notify_document_updates',
                                            Boolean(checked),
                                        )
                                    }
                                />
                                <div className="space-y-0.5 leading-none">
                                    <Label
                                        htmlFor="notify_document_updates"
                                        className="cursor-pointer text-sm font-medium"
                                    >
                                        Document Request Updates
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                        Alerts when your document is ready for
                                        pickup or returned for correction.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <Checkbox
                                    id="notify_household_updates"
                                    checked={data.notify_household_updates}
                                    onCheckedChange={(checked) =>
                                        setData(
                                            'notify_household_updates',
                                            Boolean(checked),
                                        )
                                    }
                                />
                                <div className="space-y-0.5 leading-none">
                                    <Label
                                        htmlFor="notify_household_updates"
                                        className="cursor-pointer text-sm font-medium"
                                    >
                                        Household & Verification Updates
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                        Alerts regarding verification progress
                                        and status updates for your household.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <Checkbox
                                    id="notify_announcements"
                                    checked={data.notify_announcements}
                                    onCheckedChange={(checked) =>
                                        setData(
                                            'notify_announcements',
                                            Boolean(checked),
                                        )
                                    }
                                />
                                <div className="space-y-0.5 leading-none">
                                    <Label
                                        htmlFor="notify_announcements"
                                        className="cursor-pointer text-sm font-medium"
                                    >
                                        Barangay Announcements & Advisories
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                        Official public advisories, community
                                        news, and public safety bulletins.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center gap-4">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Preferences'}
                        </Button>

                        {recentlySuccessful && (
                            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                Preferences saved successfully.
                            </span>
                        )}
                    </div>
                </form>
            </div>
        </>
    );
}

NotificationsSettings.layout = {
    breadcrumbs,
};
