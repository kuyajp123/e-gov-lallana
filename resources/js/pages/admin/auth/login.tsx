import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Lock } from 'lucide-react';
import React, { useState } from 'react';
import { home } from '@/routes';
import InputError from '@/shared/components/input-error';
import PasswordInput from '@/shared/components/password-input';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

type Props = {
    status?: string;
};

export default function AdminLogin({ status }: Props) {
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

        post('/admin/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Administrative Portal Sign In - Barangay Lallana" />

            <div className="flex min-h-[100dvh] w-full flex-col bg-background lg:flex-row">
                {/* Left Column: Authoritative Civic Architecture & Restricted Badge */}
                <div className="relative hidden w-full flex-col justify-between overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:w-1/2 xl:w-[52%] xl:p-14">
                    {/* Background Municipal Architecture Photo */}
                    <img
                        src="/hero-bg.jpg"
                        alt="Barangay Lallana Government Center"
                        className="absolute inset-0 h-full w-full object-cover object-[center_35%] opacity-40 transition-transform duration-1000 ease-out hover:scale-105"
                    />

                    {/* Deep Executive Blue/Violet Scrim Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/50" />
                    <div className="absolute inset-0 bg-indigo-950/35 mix-blend-multiply" />

                    {/* Top: Portal Navigation & Security Status */}
                    <div className="relative z-10 flex items-center justify-between">
                        <Link
                            href={home()}
                            className="inline-flex items-center gap-2 rounded-none border border-white/20 bg-black/40 px-3.5 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white"
                        >
                            <ArrowLeft className="size-3.5" />
                            <span>Back to Public Portal</span>
                        </Link>
                    </div>

                    {/* Center: Municipal Identity, Title & Administrative Subtitle */}
                    <div className="relative z-10 my-auto max-w-xl py-12">
                        <div className="mb-6 flex items-center gap-3.5">
                            <img
                                src="/lallana-seal.png"
                                alt="Barangay Lallana Seal"
                                className="size-16 object-contain drop-shadow-2xl"
                            />
                            <div>
                                <span className="block text-[11px] font-extrabold tracking-widest text-indigo-300 uppercase">
                                    Republic of the Philippines • Trece Martires
                                    City
                                </span>
                                <span className="block text-xs font-medium text-white/70">
                                    Barangay Government Executive Administration
                                </span>
                            </div>
                        </div>

                        <h1 className="text-3xl leading-tight font-extrabold tracking-tight text-white sm:text-4xl xl:text-5xl">
                            Barangay Lallana Administrative Portal
                        </h1>

                        <p className="mt-3 text-base font-semibold text-indigo-200/90 sm:text-lg">
                            Barangay Lallana, Trece Martires City, Cavite
                        </p>

                        <div className="mt-6 rounded-none border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
                            <div className="flex items-start gap-3">
                                <Lock className="mt-0.5 size-5 shrink-0 text-amber-400" />
                                <div className="space-y-1 text-xs leading-relaxed text-white/80">
                                    <p className="font-semibold text-white">
                                        Authorized Access Control Notice
                                    </p>
                                    <p>
                                        This terminal is exclusively dedicated
                                        to the Punong Barangay, Sangguniang
                                        Barangay Council, Barangay Secretary,
                                        authorized Staff Officers, and System
                                        Administrators.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom: Governance & Compliance Badges */}
                    <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-5 text-[11px] text-white/60">
                        <span>
                            © {new Date().getFullYear()} Barangay Lallana.
                            Administrative Services.
                        </span>
                    </div>
                </div>

                {/* Right Column: Admin Authentication Form */}
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
                                <span className="block text-[10px] font-semibold text-amber-700 dark:text-amber-400">
                                    Administrative Portal
                                </span>
                            </div>
                        </div>

                        <Link
                            href="/login"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <ArrowLeft className="size-3.5" />
                            <span>Resident Portal</span>
                        </Link>
                    </div>

                    {/* Form Container */}
                    <div className="mx-auto my-auto w-full max-w-md py-8">
                        <div className="mb-8 space-y-2 text-left">
                            <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                                Administrative Sign In
                            </h2>
                            <p className="text-xs text-muted-foreground sm:text-sm">
                                Enter your official administrative credentials
                                to access barangay management records.
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
                                    Official Email Address
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
                                    placeholder="official@barangaylallana.gov.ph"
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
                                        Password
                                    </Label>
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
                                    placeholder="Enter administrative password"
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
                                    Keep session authenticated on this
                                    workstation
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 h-11 w-full cursor-pointer rounded-none bg-slate-900 font-semibold text-white shadow-none transition-all hover:bg-slate-800 active:bg-slate-950 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                                tabIndex={4}
                                disabled={processing || !isPasswordValid}
                                loading={processing}
                                data-test="admin-login-button"
                            >
                                Sign In to Admin Portal
                            </Button>

                            {/* Advisory Notice */}
                            <div className="rounded-none border border-border/80 bg-muted/20 p-3 text-[11px] leading-relaxed text-muted-foreground">
                                <p className="mb-0.5 font-semibold text-foreground">
                                    Security & Compliance Notice
                                </p>
                                <p>
                                    All login transactions and administrative
                                    operations are cryptographically tracked for
                                    legal auditing. Unauthorized access is
                                    punishable under Philippine Cybercrime Law.
                                </p>
                            </div>

                            {/* Link back to Resident Portal */}
                            <div className="relative my-2">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-3 text-[10px] font-bold tracking-wider text-muted-foreground">
                                        Citizen Services
                                    </span>
                                </div>
                            </div>

                            <div className="rounded-none border border-border/80 bg-muted/20 p-3.5 text-center transition-colors hover:bg-muted/40">
                                <p className="mb-1.5 text-xs text-muted-foreground">
                                    Are you a resident requesting barangay
                                    certificates or clearances?
                                </p>
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-700 transition-colors hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-300"
                                >
                                    <span>Go to Resident Portal →</span>
                                </Link>
                            </div>
                        </form>
                    </div>

                    {/* Bottom Footnote */}
                    <div className="text-center text-[11px] text-muted-foreground">
                        <span>
                            Official Government Administration System • Trece
                            Martires City
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
