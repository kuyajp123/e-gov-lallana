import { Link, router } from '@inertiajs/react';
import { LayoutDashboard, LogOut, Settings } from 'lucide-react';
import { UserInfo } from '@/app/components/user-info';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '@/shared/components/ui/dropdown-menu';
import { useMobileNavigation } from '@/shared/hooks/use-mobile-navigation';
import type { User } from '@/shared/types';

type Props = {
    user: User;
};

export function UserMenuContent({ user }: Props) {
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    const isAdminUser = Boolean(
        user.can_access_admin ??
        (user.role?.slug === 'admin' ||
            user.role?.slug === 'sub_admin' ||
            user.role?.slug === 'super_admin'),
    );

    return (
        <>
            <DropdownMenuItem asChild>
                <Link
                    className="flex w-full cursor-pointer items-center gap-2 p-2 text-left text-sm hover:bg-accent focus:bg-accent"
                    href={edit()}
                    prefetch
                    onClick={cleanup}
                >
                    <UserInfo user={user} showEmail={true} />
                </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                {isAdminUser && (
                    <DropdownMenuItem asChild>
                        <a
                            className="flex w-full cursor-pointer items-center"
                            href="/admin"
                            onClick={cleanup}
                        >
                            <LayoutDashboard className="mr-2 size-4" />
                            Admin Dashboard
                        </a>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                    <Link
                        className="flex w-full cursor-pointer items-center"
                        href={edit()}
                        prefetch
                        onClick={cleanup}
                    >
                        <Settings className="mr-2 size-4" />
                        Settings
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link
                    className="flex w-full cursor-pointer items-center text-destructive focus:text-destructive"
                    href={logout()}
                    as="button"
                    onClick={handleLogout}
                    data-test="logout-button"
                >
                    <LogOut className="mr-2 size-4" />
                    Log out
                </Link>
            </DropdownMenuItem>
        </>
    );
}
