import { Form, Head } from '@inertiajs/react';
import { store } from '@/routes/password/confirm';
import InputError from '@/shared/components/input-error';
import PasswordInput from '@/shared/components/password-input';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Spinner } from '@/shared/components/ui/spinner';
import { useTranslation } from '@/shared/hooks/use-translation';

export default function ConfirmPassword() {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('auth.confirm_password', 'Confirm password')} />

            <Form {...store.form()} resetOnSuccess={['password']}>
                {({ processing, errors }) => (
                    <div className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="password">
                                {t('auth.password', 'Password')}
                            </Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                placeholder={t('auth.password', 'Password')}
                                autoComplete="current-password"
                                className="rounded-none"
                                autoFocus
                            />

                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center">
                            <Button
                                className="w-full rounded-none shadow-none"
                                disabled={processing}
                                data-test="confirm-password-button"
                            >
                                {processing && <Spinner className="mr-2" />}
                                {t('auth.confirm_password', 'Confirm password')}
                            </Button>
                        </div>
                    </div>
                )}
            </Form>
        </>
    );
}

ConfirmPassword.layout = {
    title: 'Confirm password',
    description:
        'This is a secure area of the application. Please confirm your password before continuing.',
};
