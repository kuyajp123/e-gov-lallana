import { Form, Head } from '@inertiajs/react';
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
import { Spinner } from '@/shared/components/ui/spinner';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Log in" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-sm"
                                            tabIndex={5}
                                        >
                                            Forgot your password?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label htmlFor="remember">Remember me</Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 h-11 w-full cursor-pointer rounded-xl bg-violet-600 font-semibold text-white shadow-xs transition-all hover:bg-violet-700 active:scale-[0.98]"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Sign In to Resident Portal
                            </Button>
                        </div>

                        <div className="text-center text-xs text-muted-foreground">
                            Don't have an official account yet?{' '}
                            <TextLink href={register()} tabIndex={5} className="font-semibold text-violet-700 dark:text-violet-400">
                                Register as Resident
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>

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
    description: 'Enter your registered credentials to access your barangay records',
};
