import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import InputError from '@/shared/components/input-error';
import PasswordInput from '@/shared/components/password-input';
import TextLink from '@/shared/components/text-link';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useTranslation } from '@/shared/hooks/use-translation';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [passwordTouched, setPasswordTouched] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const getPasswordError = (pwd: string): string | null => {
        if (!pwd) {
            return t('auth.password_required', 'Password is required.');
        }

        if (pwd.length < 8) {
            return t(
                'auth.password_min_length',
                'Password must be at least 8 characters long.',
            );
        }

        return null;
    };

    const isPasswordValid = data.password.length >= 8;
    const clientPasswordError =
        passwordTouched || submitted ? getPasswordError(data.password) : null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setPasswordTouched(true);

        if (!isPasswordValid) {
            return;
        }

        post(store.url(), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title={t('auth.login_title', 'Resident Portal Sign In')} />

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">
                            {t('auth.email', 'Email address')}
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            placeholder="email@example.com"
                            className="rounded-none shadow-none"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">
                                {t('auth.password', 'Password')}
                            </Label>
                            {canResetPassword && (
                                <TextLink
                                    href={request()}
                                    className="ml-auto text-sm"
                                    tabIndex={5}
                                >
                                    {t(
                                        'auth.forgot_password',
                                        'Forgot your password?',
                                    )}
                                </TextLink>
                            )}
                        </div>
                        <PasswordInput
                            id="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => {
                                setData('password', e.target.value);

                                if (!passwordTouched) {
                                    setPasswordTouched(true);
                                }
                            }}
                            onBlur={() => setPasswordTouched(true)}
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            placeholder="Password"
                            className="rounded-none shadow-none"
                        />
                        {/* Instant client-side validation error takes priority; falls back to backend error */}
                        <InputError
                            message={clientPasswordError || errors.password}
                        />

                        {/* Immediate live requirement hint */}
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <span
                                className={`size-1.5 rounded-none ${
                                    data.password.length >= 8
                                        ? 'bg-emerald-600'
                                        : 'bg-muted-foreground/60'
                                }`}
                            />
                            <span
                                className={
                                    data.password.length >= 8
                                        ? 'font-medium text-emerald-700'
                                        : ''
                                }
                            >
                                {t(
                                    'auth.min_characters_hint',
                                    'Minimum of 8 characters required',
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onCheckedChange={(checked) =>
                                setData('remember', checked === true)
                            }
                            tabIndex={3}
                            className="rounded-none"
                        />
                        <Label htmlFor="remember" className="cursor-pointer">
                            {t('auth.remember_me', 'Remember me')}
                        </Label>
                    </div>

                    <Button
                        type="submit"
                        className="mt-4 h-11 w-full cursor-pointer rounded-none bg-violet-600 font-semibold text-white shadow-none transition-all hover:bg-violet-700"
                        tabIndex={4}
                        disabled={processing || !isPasswordValid}
                        loading={processing}
                        data-test="login-button"
                    >
                        {t('auth.sign_in', 'Sign In to Resident Portal')}
                    </Button>
                </div>

                <div className="text-center text-xs text-muted-foreground">
                    {t(
                        'auth.no_account',
                        "Don't have an official account yet?",
                    )}{' '}
                    <TextLink
                        href={register()}
                        tabIndex={5}
                        className="font-semibold text-violet-700"
                    >
                        {t('auth.register_now', 'Register as Resident')}
                    </TextLink>
                </div>
            </form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-emerald-600">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Resident Portal Sign In',
    description:
        'Enter your registered credentials to access your barangay records',
};
