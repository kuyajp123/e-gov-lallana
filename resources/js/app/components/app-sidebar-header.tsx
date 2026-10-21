import { usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { UserMenuContent } from '@/app/components/user-menu-content';
import { Breadcrumbs } from '@/shared/components/breadcrumbs';
import { NotificationDropdown } from '@/shared/components/notification-dropdown';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/shared/components/ui/sidebar';
import { useInitials } from '@/shared/hooks/use-initials';
import type {
    BreadcrumbItem as BreadcrumbItemType,
    User,
} from '@/shared/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage<{ auth: { user?: User } }>().props;
    const getInitials = useInitials();

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="flex items-center gap-2">
                <NotificationDropdown />
                {auth.user && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="flex h-9 items-center gap-2 rounded-none px-2 text-left hover:bg-muted"
                                data-test="header-profile-selector"
                            >
                                <Avatar className="size-7 rounded-none border border-border">
                                    <AvatarImage
                                        src={auth.user.avatar}
                                        alt={auth.user.name}
                                    />
                                    <AvatarFallback className="rounded-none bg-neutral-200 text-xs font-semibold text-black">
                                        {getInitials(auth.user.name ?? '')}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="hidden flex-col items-start text-xs leading-none sm:flex">
                                    <span className="font-semibold text-foreground">
                                        {auth.user.name}
                                    </span>
                                </div>
                                <ChevronDown className="size-3.5 text-muted-foreground" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-56 rounded-none shadow-none"
                            align="end"
                        >
                            <UserMenuContent user={auth.user} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </header>
    );
}
