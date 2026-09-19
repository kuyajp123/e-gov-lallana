import { Link, usePage } from '@inertiajs/react';
import {
    Building2,
    ClipboardList,
    FileCheck,
    FileText,
    Home,
    LayoutGrid,
    ShieldCheck,
    Terminal,
    UserCog,
    Users,
} from 'lucide-react';
import { NavMain } from '@/app/components/nav-main';
import { NavUser } from '@/app/components/nav-user';
import { dashboard } from '@/routes';
import AppLogo from '@/shared/components/app-logo';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/shared/components/ui/sidebar';
import type { NavItem } from '@/shared/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'My Household',
        href: '/household',
        icon: Home,
    },
    {
        title: 'Document Requests',
        href: '/documents',
        icon: FileText,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Admin Console',
        href: '/admin',
        icon: ShieldCheck,
    },
    {
        title: 'Document Queue',
        href: '/admin/document-requests',
        icon: FileCheck,
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
];

export function AppSidebar() {
    const { auth, isDevEnvironment } = usePage<{
        auth: {
            user?: {
                can_access_admin?: boolean;
                role?: { slug: string };
            };
        };
        isDevEnvironment?: boolean;
    }>().props;

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
                <NavMain label="Resident Portal" items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
