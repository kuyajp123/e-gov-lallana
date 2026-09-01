import { Link } from '@inertiajs/react';
import { FileText, Home, LayoutGrid, UserCircle } from 'lucide-react';
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
    {
        title: 'Resident Profile',
        href: '/resident/profile',
        icon: UserCircle,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
