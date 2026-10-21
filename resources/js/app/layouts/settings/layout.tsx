import { Link, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import Heading from '@/shared/components/heading';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import { useCurrentUrl } from '@/shared/hooks/use-current-url';
import { useTranslation } from '@/shared/hooks/use-translation';
import { cn, toUrl } from '@/shared/lib/utils';
import type { NavItem } from '@/shared/types';

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { t } = useTranslation();
    const { isCurrentOrParentUrl } = useCurrentUrl();
    const { auth } = usePage<{
        auth: { user?: { can_access_admin?: boolean } };
    }>().props;

    const baseNavItems: NavItem[] = [
        {
            title: t('settings.nav_profile', 'Profile'),
            href: edit(),
            icon: null,
        },
        {
            title: t('settings.nav_security', 'Security'),
            href: editSecurity(),
            icon: null,
        },
        {
            title: t('settings.nav_language', 'Language'),
            href: '/settings/language',
            icon: null,
        },
        {
            title: t('settings.nav_notifications', 'Notifications'),
            href: '/settings/notifications',
            icon: null,
        },
    ];

    const navItems: NavItem[] = [
        ...baseNavItems,
        ...(auth.user?.can_access_admin
            ? [
                  {
                      title: 'System',
                      href: '/settings/system',
                      icon: null,
                  },
              ]
            : []),
    ];

    return (
        <div className="px-4 py-6">
            <Heading
                title={t('settings.title', 'Settings')}
                description={t(
                    'settings.subtitle',
                    'Manage your profile and account settings',
                )}
            />

            <div className="flex flex-col lg:flex-row lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav
                        className="flex flex-col space-y-1 space-x-0"
                        aria-label="Settings"
                    >
                        {navItems.map((item, index) => (
                            <Button
                                key={`${toUrl(item.href)}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start', {
                                    'bg-muted': isCurrentOrParentUrl(item.href),
                                })}
                            >
                                <Link href={item.href}>
                                    {item.icon && (
                                        <item.icon className="h-4 w-4" />
                                    )}
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <Separator className="my-6 lg:hidden" />

                <div className="min-w-0 flex-1 lg:max-w-4xl">
                    <section className="space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}
