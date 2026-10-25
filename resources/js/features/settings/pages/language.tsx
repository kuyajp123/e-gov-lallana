import { Head, router, usePage } from '@inertiajs/react';
import { Check, Globe } from 'lucide-react';
import React, { useState } from 'react';
import Heading from '@/shared/components/heading';
import { Button } from '@/shared/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { NativeSelect } from '@/shared/components/ui/native-select';
import { useTranslation } from '@/shared/hooks/use-translation';

interface LanguageProps {
    currentLocale?: string;
}

export default function LanguageSettings({ currentLocale }: LanguageProps) {
    const { t } = useTranslation();
    const page = usePage();
    const activeLocale = currentLocale || (page.props.locale as string) || 'en';
    const [selectedLocale, setSelectedLocale] = useState<string>(activeLocale);
    const [processing, setProcessing] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);

    const handleLanguageChange = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setSavedSuccess(false);

        router.post(
            '/locale',
            { locale: selectedLocale },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setProcessing(false);
                    setSavedSuccess(true);
                    setTimeout(() => setSavedSuccess(false), 3000);
                },
                onError: () => {
                    setProcessing(false);
                },
            },
        );
    };

    return (
        <>
            <Head title={t('settings.language_title', 'Language Settings')} />

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title={t('settings.language_title', 'Language Settings')}
                    description={t(
                        'settings.language_subtitle',
                        'Choose your preferred portal language for notifications, interfaces, and records.',
                    )}
                />

                <Card className="rounded-none border border-border bg-card shadow-none">
                    <CardHeader className="border-b border-border/70 pb-4">
                        <div className="flex items-center gap-2">
                            <Globe className="size-4 text-violet-600" />
                            <CardTitle className="text-base font-semibold">
                                {t(
                                    'settings.select_language',
                                    'Portal Display Language',
                                )}
                            </CardTitle>
                        </div>
                        <CardDescription className="text-xs">
                            {t(
                                'settings.language_subtitle',
                                'Select between English and Filipino (Tagalog) for all system-generated announcements, document descriptions, and dashboard labels.',
                            )}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-6">
                        <form
                            onSubmit={handleLanguageChange}
                            className="space-y-6"
                        >
                            <div className="max-w-md space-y-2">
                                <Label
                                    htmlFor="language-select"
                                    className="text-xs font-semibold"
                                >
                                    {t(
                                        'settings.select_language',
                                        'Preferred Language',
                                    )}
                                </Label>

                                {/* Native selection dropdown for minimalist design */}
                                <NativeSelect
                                    id="language-select"
                                    value={selectedLocale}
                                    onChange={(e) =>
                                        setSelectedLocale(e.target.value)
                                    }
                                    className="h-10 text-sm"
                                    disabled={processing}
                                >
                                    <option value="en">
                                        English (Philippines / International)
                                    </option>
                                    <option value="fil">
                                        Wikang Filipino (Tagalog)
                                    </option>
                                </NativeSelect>

                                <p className="text-[11px] text-muted-foreground">
                                    {activeLocale === 'fil'
                                        ? 'Kasalukuyang aktibong wika: '
                                        : 'Current active language: '}
                                    <span className="font-semibold text-foreground uppercase">
                                        {activeLocale === 'fil'
                                            ? 'Filipino (Tagalog)'
                                            : 'English'}
                                    </span>
                                </p>
                            </div>

                            {savedSuccess && (
                                <div className="flex items-center gap-2 rounded-none border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800">
                                    <Check className="size-4 text-emerald-600" />
                                    <span>
                                        {t(
                                            'settings.saved_feedback',
                                            selectedLocale === 'fil'
                                                ? 'Matagumpay na na-update ang wika ng sistema!'
                                                : 'Language preference successfully updated!',
                                        )}
                                    </span>
                                </div>
                            )}

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        selectedLocale === activeLocale
                                    }
                                    loading={processing}
                                    className="h-10 cursor-pointer rounded-none bg-violet-600 px-6 font-semibold text-white shadow-none hover:bg-violet-700"
                                >
                                    {t(
                                        'settings.save_language',
                                        'Save Language Preference',
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

LanguageSettings.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Settings', href: '/settings/profile' },
        { title: 'Language', href: '/settings/language' },
    ],
};
