import { Link, usePage } from '@inertiajs/react';
import {
    Building2,
    ClipboardList,
    FileCheck,
    FileText,
    Home,
    LayoutGrid,
    Megaphone,
    MessageSquare,
    QrCode,
    ShieldCheck,
    Terminal,
    UserCog,
    Users,
} from 'lucide-react';
import { NavMain } from '@/app/components/nav-main';
import { dashboard } from '@/routes';
import AppLogo from '@/shared/components/app-logo';
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/shared/components/ui/sidebar';
import { useTranslation } from '@/shared/hooks/use-translation';
import type { NavItem } from '@/shared/types';

export function AppSidebar() {
    const { t } = useTranslation();
    const { auth, isDevEnvironment } = usePage<{
        auth: {
            user?: {
                can_access_admin?: boolean;
                role?: { slug: string };
            };
        };
        isDevEnvironment?: boolean;
    }>().props;

    const mainNavItems: NavItem[] = [
        {
            title: t('nav.dashboard', 'Dashboard'),
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: t('nav.household', 'My Household'),
            href: '/household',
            icon: Home,
        },
        {
            title: t('nav.documents', 'Document Requests'),
            href: '/documents',
            icon: FileText,
        },
        {
            title: t('nav.announcements', 'Announcements'),
            href: '/announcements',
            icon: Megaphone,
        },
    ];

    const adminNavItems: NavItem[] = [
        {
            title: 'Admin Dashboard',
            href: '/admin',
            icon: ShieldCheck,
        },
        {
            title: 'Document Request',
            href: '/admin/document-requests',
            icon: FileCheck,
        },
        {
            title: 'QR Document Scanner',
            href: '/admin/qr-scanner',
            icon: QrCode,
        },
        {
            title: 'Households',
            href: '/admin/households',
            icon: Building2,
        },
        {
            title: 'Resident Registry',
            href: '/admin/resident-profiles',
            icon: Users,
        },
        {
            title: 'Announcements',
            href: '/admin/announcements',
            icon: Megaphone,
        },
        {
            title: 'Citizen Inquiries',
            href: '/admin/inquiries',
            icon: MessageSquare,
        },
    ];

    const isAdminUser = Boolean(
        auth.user?.can_access_admin ??
        (auth.user?.role?.slug === 'admin' ||
            auth.user?.role?.slug === 'sub_admin' ||
            auth.user?.role?.slug === 'super_admin'),
    );

    const isFullAdmin = Boolean(
        auth.user?.role?.slug === 'admin' ||
        auth.user?.role?.slug === 'super_admin',
    );

    const adminNav: NavItem[] = [
        ...adminNavItems,
        {
            title: 'Document Types',
            href: '/admin/document-types',
            icon: ClipboardList,
        },
        ...(isFullAdmin
            ? [
                  {
                      title: 'Staff Management',
                      href: '/admin/staff',
                      icon: UserCog,
                  },
              ]
            : []),
        ...((isDevEnvironment ?? true)
            ? [
                  {
                      title: 'Developer Diagnostics',
                      href: '/dev/sms',
                      icon: Terminal,
                  },
              ]
            : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link
                                href={isAdminUser ? '/admin' : dashboard()}
                                prefetch
                            >
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {isAdminUser && (
                    <NavMain label="Administration" items={adminNav} />
                )}
                <NavMain
                    label={t('nav.resident_portal', 'Resident Portal')}
                    items={mainNavItems}
                />
            </SidebarContent>
        </Sidebar>
    );
}
