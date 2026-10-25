import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';
import { home, register } from '@/routes';
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

    const isPasswordValid = data.password.length >= 8;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
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

            <div className="flex min-h-[100dvh] w-full flex-col bg-background lg:flex-row">
                {/* Left Column: Civic Hero with Landing Page Image */}
                <div className="relative hidden w-full flex-col justify-between overflow-hidden bg-zinc-950 p-10 text-white lg:flex lg:w-1/2 xl:w-[52%] xl:p-14">
                    {/* Background Municipal Architecture Photo */}
                    <img
                        src="/hero-bg.jpg"
                        alt="Barangay Lallana Government Center"
                        className="absolute inset-0 h-full w-full object-cover object-[center_35%] opacity-45 transition-transform duration-1000 ease-out hover:scale-105"
                    />

                    {/* Directional Scrim Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/65 to-zinc-950/45" />
                    <div className="absolute inset-0 bg-violet-950/30 mix-blend-multiply" />

                    {/* Top: Portal Navigation & Status Pill */}
                    <div className="relative z-10 flex items-center justify-between">
                        <Link
                            href={home()}
                            className="inline-flex items-center gap-2 rounded-none border border-white/20 bg-black/40 px-3.5 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white"
                        >
                            <ArrowLeft className="size-3.5" />
                            <span>
                                {t('common.back_to_home', 'Back to Home')}
                            </span>
                        </Link>
                    </div>

                    {/* Center: Municipal Identity, Official Title & Subtitle */}
                    <div className="relative z-10 my-auto max-w-xl py-12">
                        <div className="mb-6 flex items-center gap-3.5">
                            <img
                                src="/lallana-seal.png"
                                alt="Barangay Lallana Seal"
                                className="size-16 object-contain drop-shadow-2xl"
                            />
                            <div>
                                <span className="block text-[11px] font-extrabold tracking-widest text-violet-300 uppercase">
                                    Republic of the Philippines • Province of
                                    Cavite
                                </span>
                                <span className="block text-xs font-medium text-white/70">
                                    Local Government Electronic Information
                                    System
                                </span>
                            </div>
                        </div>

                        <h1 className="text-3xl leading-tight font-extrabold tracking-tight text-white sm:text-4xl xl:text-5xl">
                            Barangay Lallana E-Government Services
                        </h1>

                        <p className="mt-2 text-sm font-semibold tracking-wide text-violet-200">
                            Barangay Lallana, Trece Martires City, Cavite
                        </p>

                        <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/80">
                            Request official clearances, indigency certificates,
                            residency documents, and manage your civil records
                            seamlessly through your resident citizen account.
                        </p>
                    </div>

                    {/* Bottom: Governance & Compliance Badges */}
                    <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-5 text-[11px] text-white/60">
                        <span>
                            © {new Date().getFullYear()} Barangay Lallana. All
                            rights reserved.
                        </span>
                    </div>
                </div>

                {/* Right Column: Resident Authentication Form */}
                <div className="flex flex-1 flex-col justify-between bg-background p-6 sm:p-10 lg:p-12 xl:p-16">
                    {/* Top Navigation Row */}
                    <div className="flex items-center justify-between">
                        {/* Mobile Brand Identity */}
                        <div className="flex items-center gap-2.5 lg:hidden">
                            <img
                                src="/lallana-seal.png"
                                alt="Seal"
                                className="size-8 object-contain"
                            />
                            <div className="text-left">
                                <span className="block text-xs leading-tight font-bold text-foreground">
                                    Barangay Lallana
                                </span>
                            </div>
                        </div>

                        <Link
                            href={home()}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground lg:hidden"
                        >
                            <ArrowLeft className="size-3.5" />
                            <span>Home</span>
                        </Link>
                    </div>

                    {/* Form Container */}
                    <div className="mx-auto my-auto w-full max-w-md py-8">
                        <div className="mb-8 space-y-2 text-left">
                            <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                                {t(
                                    'auth.login_title',
                                    'Resident Portal Sign In',
                                )}
                            </h2>
                            <p className="text-xs text-muted-foreground sm:text-sm">
                                {t(
                                    'auth.login_subtitle',
                                    'Enter your registered credentials to access your barangay records',
                                )}
                            </p>
                        </div>

                        {status && (
                            <div className="mb-6 rounded-none border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                {status}
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-5"
                        >
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="email"
                                    className="text-xs font-semibold"
                                >
                                    {t('auth.email', 'Email Address')}
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="resident@example.com"
                                    className="h-10 rounded-none text-sm shadow-none"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="password"
                                        className="text-xs font-semibold"
                                    >
                                        {t('auth.password', 'Password')}
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-xs font-medium text-violet-700 hover:text-violet-800 dark:text-violet-400"
                                            tabIndex={5}
                                        >
                                            {t(
                                                'auth.forgot_password',
                                                'Forgot password?',
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
                                    placeholder="Enter your password"
                                    className="h-10 rounded-none text-sm shadow-none"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-2.5 pt-1">
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
                                <Label
                                    htmlFor="remember"
                                    className="cursor-pointer text-xs font-medium text-muted-foreground"
                                >
                                    {t(
                                        'auth.remember_me',
                                        'Keep me signed in on this device',
                                    )}
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 h-11 w-full cursor-pointer rounded-none bg-violet-600 font-semibold text-white shadow-none transition-all hover:bg-violet-700 active:bg-violet-800"
                                tabIndex={4}
                                disabled={processing || !isPasswordValid}
                                loading={processing}
                                data-test="login-button"
                            >
                                {t(
                                    'auth.sign_in',
                                    'Sign In to Resident Portal',
                                )}
                            </Button>

                            <div className="pt-1 text-center text-xs text-muted-foreground">
                                {t(
                                    'auth.no_account',
                                    "Don't have an official account yet?",
                                )}{' '}
                                <TextLink
                                    href={register()}
                                    tabIndex={5}
                                    className="font-bold text-violet-700 hover:text-violet-800 dark:text-violet-400"
                                >
                                    {t(
                                        'auth.register_now',
                                        'Register as Resident',
                                    )}
                                </TextLink>
                            </div>

                            {/* Discrete Separator & Admin Portal Link */}
                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-3 text-[10px] font-bold tracking-wider text-muted-foreground">
                                        Barangay Officials & Staff
                                    </span>
                                </div>
                            </div>

                            <div className="rounded-none border border-border/80 bg-muted/20 p-3.5 text-center transition-colors hover:bg-muted/40">
                                <p className="mb-1.5 text-xs text-muted-foreground">
                                    Are you a Barangay Official, Council Member,
                                    or Staff?
                                </p>
                                <Link
                                    href="/admin/login"
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-700 transition-colors hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-300"
                                >
                                    <span>Sign In to Admin Portal →</span>
                                </Link>
                            </div>
                        </form>
                    </div>

                    {/* Bottom Footnote */}
                    <div className="text-center text-[11px] text-muted-foreground">
                        <span>
                            Republic of the Philippines • City of Trece Martires
                            • Barangay Lallana
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
