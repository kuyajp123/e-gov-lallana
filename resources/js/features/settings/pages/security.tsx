import { Form, Head } from '@inertiajs/react';
import { useRef } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import { edit } from '@/routes/security';
import Heading from '@/shared/components/heading';
import InputError from '@/shared/components/input-error';
import PasswordInput from '@/shared/components/password-input';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { useTranslation } from '@/shared/hooks/use-translation';

type Props = {
    passwordRules: string;
};

export default function Security(props: Props) {
    const { t } = useTranslation();
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <>
            <Head title={t('settings.security_title', 'Security settings')} />

            <h1 className="sr-only">
                {t('settings.security_title', 'Security settings')}
            </h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title={t('settings.update_password', 'Update password')}
                    description={t(
                        'settings.update_password_desc',
                        'Ensure your account is using a long, random password to stay secure',
                    )}
                />

                <Form
                    {...SecurityController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    resetOnError={[
                        'password',
                        'password_confirmation',
                        'current_password',
                    ]}
                    resetOnSuccess
                    onError={(errors) => {
                        if (errors.password) {
                            passwordInput.current?.focus();
                        }

                        if (errors.current_password) {
                            currentPasswordInput.current?.focus();
                        }
                    }}
                    className="space-y-6"
                >
                    {({ errors, processing }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="current_password">
                                    {t(
                                        'settings.current_password',
                                        'Current password',
                                    )}
                                </Label>

                                <PasswordInput
                                    id="current_password"
                                    ref={currentPasswordInput}
                                    name="current_password"
                                    className="mt-1 block w-full rounded-none shadow-none"
                                    autoComplete="current-password"
                                    placeholder={t(
                                        'settings.current_password',
                                        'Current password',
                                    )}
                                />

                                <InputError message={errors.current_password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">
                                    {t('settings.new_password', 'New password')}
                                </Label>

                                <PasswordInput
                                    id="password"
                                    ref={passwordInput}
                                    name="password"
                                    className="mt-1 block w-full rounded-none shadow-none"
                                    autoComplete="new-password"
                                    placeholder={t(
                                        'settings.new_password',
                                        'New password',
                                    )}
                                    passwordrules={props.passwordRules}
                                />

                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    {t(
                                        'settings.confirm_password',
                                        'Confirm password',
                                    )}
                                </Label>

                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    className="mt-1 block w-full rounded-none shadow-none"
                                    autoComplete="new-password"
                                    placeholder={t(
                                        'settings.confirm_password',
                                        'Confirm password',
                                    )}
                                    passwordrules={props.passwordRules}
                                />

                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing}
                                    loading={processing}
                                    className="rounded-none shadow-none"
                                    data-test="update-password-button"
                                >
                                    {t('common.save', 'Save')}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

Security.layout = {
    breadcrumbs: [
        {
            title: 'Security settings',
            href: edit(),
        },
    ],
};
