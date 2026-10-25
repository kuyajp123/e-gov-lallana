import { Form } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { useRef } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import Heading from '@/shared/components/heading';
import InputError from '@/shared/components/input-error';
import PasswordInput from '@/shared/components/password-input';
import { Button } from '@/shared/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Label } from '@/shared/components/ui/label';
import { useTranslation } from '@/shared/hooks/use-translation';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <Heading
                variant="small"
                title={t('settings.delete_account', 'Delete account')}
                description={t(
                    'settings.delete_account_desc',
                    'Delete your account and all of its resources',
                )}
            />
            <div className="space-y-4 rounded-none border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-950/20">
                <div className="relative space-y-0.5 text-red-600 dark:text-red-400">
                    <p className="text-xs font-semibold tracking-wider uppercase">
                        {t('common.warning', 'Warning')}
                    </p>
                    <p className="text-sm">
                        {t(
                            'settings.delete_account_warning',
                            'Please proceed with caution, this cannot be undone.',
                        )}
                    </p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="destructive"
                            data-test="delete-user-button"
                            className="rounded-none shadow-none"
                        >
                            {t('settings.delete_account', 'Delete account')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-none shadow-none">
                        <DialogTitle>
                            {t(
                                'settings.delete_account_confirm_title',
                                'Are you sure you want to delete your account?',
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            {t(
                                'settings.delete_account_confirm_desc',
                                'Once your account is deleted, all of its resources and data will also be permanently deleted. Please enter your password to confirm you would like to permanently delete your account.',
                            )}
                        </DialogDescription>

                        <Form
                            {...(typeof ProfileController.destroy.form ===
                            'function'
                                ? ProfileController.destroy.form()
                                : {
                                      action: ProfileController.destroy.url({
                                          query: { _method: 'DELETE' },
                                      }),
                                      method: 'post' as const,
                                  })}
                            options={{
                                preserveScroll: true,
                            }}
                            onError={() => passwordInput.current?.focus()}
                            resetOnSuccess
                            className="space-y-6"
                        >
                            {({ resetAndClearErrors, processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="password"
                                            className="sr-only"
                                        >
                                            Password
                                        </Label>

                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            ref={passwordInput}
                                            placeholder="Password"
                                            autoComplete="current-password"
                                            className="rounded-none"
                                        />

                                        <InputError message={errors.password} />
                                    </div>

                                    <DialogFooter className="gap-2">
                                        <DialogClose asChild>
                                            <Button
                                                variant="secondary"
                                                className="rounded-none shadow-none"
                                                onClick={() =>
                                                    resetAndClearErrors()
                                                }
                                            >
                                                {t('common.cancel', 'Cancel')}
                                            </Button>
                                        </DialogClose>

                                        <Button
                                            variant="destructive"
                                            disabled={processing}
                                            className="rounded-none shadow-none"
                                            asChild
                                        >
                                            <button
                                                type="submit"
                                                data-test="confirm-delete-user-button"
                                                className="flex items-center gap-2"
                                            >
                                                {processing && (
                                                    <Loader2 className="size-4 animate-spin" />
                                                )}
                                                {t(
                                                    'settings.delete_account',
                                                    'Delete account',
                                                )}
                                            </button>
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
