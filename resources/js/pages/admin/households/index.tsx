import { Head, Link, router } from '@inertiajs/react';
import {
    Archive,
    Building2,
    CheckCircle2,
    Clock,
    Eye,
    Home,
    MoreHorizontal,
    RotateCcw,
    Search,
    ShieldAlert,
    ShieldCheck,
    Undo2,
    Users,
    X,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import type { AdminHouseholdItem } from '@/features/admin/households/components/household-drawer';
import { HouseholdDrawer } from '@/features/admin/households/components/household-drawer';
import type { HouseholdActionType } from '@/features/admin/households/components/household-verification-modal';
import { HouseholdVerificationModal } from '@/features/admin/households/components/household-verification-modal';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Input } from '@/shared/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import type { BreadcrumbItem } from '@/shared/types';

interface PaginationLink {
    url?: string | null;
    label: string;
    active: boolean;
}

interface HouseholdStatusCounts {
    all: number;
    unverified: number;
    verified: number;
    returned: number;
    restricted: number;
    rejected: number;
    archived: number;
}

interface AdminHouseholdIndexProps {
    households: {
        data: AdminHouseholdItem[];
        links: PaginationLink[];
        total: number;
        from?: number;
        to?: number;
    };
    statusCounts: HouseholdStatusCounts;
    purokOptions: string[];
    filters: {
        search: string;
        status: string;
        purok_sitio: string;
    };
    canManageRestrictions: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Console', href: '/admin' },
    { title: 'Households', href: '/admin/households' },
];

const STATUS_TABS = [
    { key: 'all', label: 'All Households', countKey: 'all' },
    {
        key: 'unverified',
        label: 'Pending Review',
        countKey: 'unverified',
        alert: true,
    },
    { key: 'verified', label: 'Verified', countKey: 'verified', success: true },
    { key: 'returned', label: 'Returned', countKey: 'returned' },
    { key: 'restricted', label: 'Restricted', countKey: 'restricted' },
    { key: 'archived', label: 'Archived', countKey: 'archived' },
] as const;

export default function AdminHouseholdIndex({
    households,
    statusCounts,
    purokOptions,
    filters,
    canManageRestrictions,
}: AdminHouseholdIndexProps) {
    const [searchValue, setSearchValue] = useState(filters.search || '');
    const [selectedHousehold, setSelectedHousehold] =
        useState<AdminHouseholdItem | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Verification Modal
    const [modalAction, setModalAction] = useState<HouseholdActionType | null>(
        null,
    );
    const [modalHouseholdId, setModalHouseholdId] = useState<number | null>(
        null,
    );
    const [modalHouseholdCode, setModalHouseholdCode] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const updateFilter = (newParams: Record<string, any>) => {
        router.get(
            '/admin/households',
            {
                ...filters,
                ...newParams,
                page: 1,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            updateFilter({ search: searchValue.trim() });
        }
    };

    const handleTriggerAction = (
        type: HouseholdActionType,
        hh: AdminHouseholdItem,
    ) => {
        setModalAction(type);
        setModalHouseholdId(hh.id);
        setModalHouseholdCode(hh.household_code);
        setIsModalOpen(true);
    };

    const handleOpenDrawer = (hh: AdminHouseholdItem) => {
        setSelectedHousehold(hh);
        setIsDrawerOpen(true);
    };

    const hasActiveFilters =
        filters.search !== '' ||
        (filters.status !== 'all' && filters.status !== '') ||
        (filters.purok_sitio !== 'all' && filters.purok_sitio !== '');

    const householdList = households?.data || [];

    return (
        <>
            <Head title="Household Registry & Verification - Barangay Admin" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
                {/* Header Title Section */}
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                Household Registry & Verification
                            </h1>
                            <Badge
                                variant="outline"
                                className="font-mono text-xs font-semibold"
                            >
                                {households.total} total
                            </Badge>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Review civil household registrations, verify
                            residency documents, manage family heads, and
                            oversee community sectors.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1.5 text-xs"
                        >
                            <Link href="/admin">
                                <Building2 className="size-3.5" />
                                Admin Console
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Metric Strip */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-muted-foreground">
                                Pending Review
                            </p>
                            <span className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                <Clock className="size-4" />
                            </span>
                        </div>
                        <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                            {statusCounts.unverified}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-muted-foreground">
                                Verified Households
                            </p>
                            <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="size-4" />
                            </span>
                        </div>
                        <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                            {statusCounts.verified}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-muted-foreground">
                                Restricted Records
                            </p>
                            <span className="flex size-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                                <ShieldAlert className="size-4" />
                            </span>
                        </div>
                        <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                            {statusCounts.restricted}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-muted-foreground">
                                Total Registered
                            </p>
                            <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Home className="size-4" />
                            </span>
                        </div>
                        <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                            {statusCounts.all}
                        </p>
                    </div>
                </div>

                {/* Status Tabs Bar */}
                <div className="flex scrollbar-none items-center gap-1.5 overflow-x-auto pb-1">
                    {STATUS_TABS.map((tab) => {
                        const isActive = (filters.status || 'all') === tab.key;
                        const count =
                            statusCounts[
                                tab.countKey as keyof HouseholdStatusCounts
                            ] ?? 0;

                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() =>
                                    updateFilter({ status: tab.key })
                                }
                                className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                                    isActive
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                            >
                                <span>{tab.label}</span>
                                <span
                                    className={`py-0.2 rounded-full px-1.5 text-[10px] font-bold ${
                                        isActive
                                            ? 'bg-primary-foreground/20 text-primary-foreground'
                                            : 'alert' in tab &&
                                                tab.alert &&
                                                count > 0
                                              ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400'
                                              : 'bg-background/80 text-muted-foreground'
                                    }`}
                                >
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Filter Controls Row */}
                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                    {/* Search Input */}
                    <div className="relative flex-1 sm:max-w-md">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            placeholder="Search by household code, family head, or address..."
                            className="h-9 pr-8 pl-9 text-xs"
                        />
                        {searchValue && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchValue('');
                                    updateFilter({ search: '' });
                                }}
                                className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="size-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Purok Selector */}
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="w-44">
                            <Select
                                value={filters.purok_sitio || 'all'}
                                onValueChange={(val) =>
                                    updateFilter({ purok_sitio: val })
                                }
                            >
                                <SelectTrigger className="h-9 text-xs">
                                    <SelectValue placeholder="All Purok / Sitio" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Purok / Sitio
                                    </SelectItem>
                                    {purokOptions.map((purok) => (
                                        <SelectItem
                                            key={purok}
                                            value={purok}
                                            className="text-xs"
                                        >
                                            {purok}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {hasActiveFilters && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setSearchValue('');
                                    router.get(
                                        '/admin/households',
                                        {},
                                        {
                                            preserveState: true,
                                            preserveScroll: true,
                                        },
                                    );
                                }}
                                className="h-9 gap-1 px-2.5 text-xs text-muted-foreground hover:text-foreground"
                            >
                                <RotateCcw className="size-3.5" />
                                Reset
                            </Button>
                        )}
                    </div>
                </div>

                {/* Queue Data Table Card */}
                <Card className="overflow-hidden rounded-2xl border-border/70 shadow-sm">
                    <CardHeader className="border-b border-border/50 bg-muted/20 px-4 py-3.5 sm:px-6">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-semibold text-foreground">
                                Household Records
                            </CardTitle>
                            {households.from && households.to && (
                                <CardDescription className="text-xs">
                                    Showing {households.from}–{households.to} of{' '}
                                    {households.total}
                                </CardDescription>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {householdList.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-border/60 bg-muted/10 text-muted-foreground">
                                            <th className="px-4 py-3 font-semibold">
                                                Household Code
                                            </th>
                                            <th className="px-4 py-3 font-semibold">
                                                Family Head
                                            </th>
                                            <th className="px-4 py-3 font-semibold">
                                                Purok / Sitio
                                            </th>
                                            <th className="px-4 py-3 font-semibold">
                                                Members
                                            </th>
                                            <th className="px-4 py-3 font-semibold">
                                                Status
                                            </th>
                                            <th className="px-4 py-3 font-semibold">
                                                Submitted
                                            </th>
                                            <th className="px-4 py-3 text-right font-semibold">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40">
                                        {householdList.map((hh) => (
                                            <tr
                                                key={hh.id}
                                                className="cursor-pointer transition-colors hover:bg-muted/30"
                                                onClick={() =>
                                                    handleOpenDrawer(hh)
                                                }
                                            >
                                                {/* Household Code */}
                                                <td className="px-4 py-3.5 font-mono font-bold text-primary">
                                                    <span className="hover:underline">
                                                        {hh.household_code}
                                                    </span>
                                                </td>

                                                {/* Family Head */}
                                                <td className="px-4 py-3.5">
                                                    {hh.family_head ? (
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                                                {hh.family_head.name.charAt(
                                                                    0,
                                                                )}
                                                            </div>
                                                            <div className="max-w-[160px] min-w-0">
                                                                <p className="truncate font-semibold text-foreground">
                                                                    {
                                                                        hh
                                                                            .family_head
                                                                            .name
                                                                    }
                                                                </p>
                                                                <p className="truncate text-[11px] text-muted-foreground">
                                                                    {
                                                                        hh
                                                                            .family_head
                                                                            .email
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground italic">
                                                            None assigned
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Purok / Sitio */}
                                                <td className="px-4 py-3.5">
                                                    <div>
                                                        <p className="font-medium text-foreground">
                                                            {hh.purok_sitio}
                                                        </p>
                                                        <p className="max-w-[160px] truncate text-[11px] text-muted-foreground">
                                                            {hh.address}
                                                        </p>
                                                    </div>
                                                </td>

                                                {/* Members */}
                                                <td className="px-4 py-3.5 whitespace-nowrap">
                                                    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-semibold text-foreground">
                                                        <Users className="size-3 text-muted-foreground" />
                                                        {hh.members_count}{' '}
                                                        members
                                                    </span>
                                                </td>

                                                {/* Status Badge */}
                                                <td className="px-4 py-3.5 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                            hh.status_color ===
                                                            'success'
                                                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                                                : hh.status_color ===
                                                                    'danger'
                                                                  ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400'
                                                                  : hh.status_color ===
                                                                      'info'
                                                                    ? 'bg-sky-500/10 text-sky-700 dark:text-sky-400'
                                                                    : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                                                        }`}
                                                    >
                                                        {hh.status_label}
                                                    </span>
                                                </td>

                                                {/* Submitted */}
                                                <td className="px-4 py-3.5 whitespace-nowrap text-muted-foreground">
                                                    {hh.submitted_at_formatted}
                                                </td>

                                                {/* Actions */}
                                                <td
                                                    className="px-4 py-3.5 text-right whitespace-nowrap"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        {(hh.status ===
                                                            'unverified' ||
                                                            hh.status ===
                                                                'pending') && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() =>
                                                                    handleTriggerAction(
                                                                        'approve',
                                                                        hh,
                                                                    )
                                                                }
                                                                className="h-7 gap-1 border-emerald-500/40 text-xs text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                                                            >
                                                                <CheckCircle2 className="size-3" />
                                                                Verify
                                                            </Button>
                                                        )}

                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-7 w-7 p-0"
                                                                >
                                                                    <MoreHorizontal className="size-3.5 text-muted-foreground" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent
                                                                align="end"
                                                                className="w-48 text-xs"
                                                            >
                                                                <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground">
                                                                    Record
                                                                    Options
                                                                </DropdownMenuLabel>
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        handleOpenDrawer(
                                                                            hh,
                                                                        )
                                                                    }
                                                                >
                                                                    <Eye className="mr-2 size-3.5" />
                                                                    Quick Review
                                                                    Drawer
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    asChild
                                                                >
                                                                    <Link
                                                                        href={`/admin/households/${hh.id}`}
                                                                    >
                                                                        <Home className="mr-2 size-3.5" />
                                                                        Full
                                                                        Household
                                                                        Dossier
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />

                                                                {(hh.status ===
                                                                    'unverified' ||
                                                                    hh.status ===
                                                                        'pending') && (
                                                                    <>
                                                                        <DropdownMenuItem
                                                                            onClick={() =>
                                                                                handleTriggerAction(
                                                                                    'approve',
                                                                                    hh,
                                                                                )
                                                                            }
                                                                        >
                                                                            <CheckCircle2 className="mr-2 size-3.5 text-emerald-500" />
                                                                            Approve
                                                                            &
                                                                            Verify
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            onClick={() =>
                                                                                handleTriggerAction(
                                                                                    'return',
                                                                                    hh,
                                                                                )
                                                                            }
                                                                        >
                                                                            <Undo2 className="mr-2 size-3.5 text-amber-500" />
                                                                            Return
                                                                            for
                                                                            Correction
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            onClick={() =>
                                                                                handleTriggerAction(
                                                                                    'reject',
                                                                                    hh,
                                                                                )
                                                                            }
                                                                        >
                                                                            <XCircle className="mr-2 size-3.5 text-rose-500" />
                                                                            Reject
                                                                            Application
                                                                        </DropdownMenuItem>
                                                                    </>
                                                                )}

                                                                {hh.status ===
                                                                    'verified' &&
                                                                    canManageRestrictions && (
                                                                        <DropdownMenuItem
                                                                            onClick={() =>
                                                                                handleTriggerAction(
                                                                                    'restrict',
                                                                                    hh,
                                                                                )
                                                                            }
                                                                        >
                                                                            <ShieldAlert className="mr-2 size-3.5 text-rose-500" />
                                                                            Place
                                                                            Under
                                                                            Restriction
                                                                        </DropdownMenuItem>
                                                                    )}

                                                                {hh.status ===
                                                                    'restricted' &&
                                                                    canManageRestrictions && (
                                                                        <>
                                                                            <DropdownMenuItem
                                                                                onClick={() =>
                                                                                    handleTriggerAction(
                                                                                        'unrestrict',
                                                                                        hh,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <ShieldCheck className="mr-2 size-3.5 text-emerald-500" />
                                                                                Lift
                                                                                Restriction
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem
                                                                                onClick={() =>
                                                                                    handleTriggerAction(
                                                                                        'archive',
                                                                                        hh,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <Archive className="mr-2 size-3.5 text-zinc-500" />
                                                                                Archive
                                                                                Record
                                                                            </DropdownMenuItem>
                                                                        </>
                                                                    )}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <Home className="mx-auto size-10 text-muted-foreground/40" />
                                <h3 className="mt-3 text-sm font-semibold text-foreground">
                                    No household records found
                                </h3>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Try adjusting your search criteria or Purok
                                    selection.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
                {households.links && households.links.length > 3 && (
                    <div className="flex items-center justify-between pt-2">
                        <p className="text-xs text-muted-foreground">
                            Page{' '}
                            {households.from
                                ? Math.ceil((households.from || 1) / 15)
                                : 1}
                        </p>
                        <div className="flex items-center gap-1">
                            {households.links.map((link, i) => (
                                <Button
                                    key={i}
                                    asChild={!!link.url}
                                    disabled={!link.url}
                                    variant={
                                        link.active ? 'default' : 'outline'
                                    }
                                    size="sm"
                                    className="h-8 text-xs"
                                >
                                    {link.url ? (
                                        <Link
                                            href={link.url}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ) : (
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    )}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Slide-over Inspection Drawer */}
            <HouseholdDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                household={selectedHousehold}
                canManageRestrictions={canManageRestrictions}
                onTriggerAction={handleTriggerAction}
            />

            {/* Verification & Action Modal */}
            <HouseholdVerificationModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setModalAction(null);
                    setModalHouseholdId(null);
                    setModalHouseholdCode('');
                }}
                householdId={modalHouseholdId}
                householdCode={modalHouseholdCode}
                actionType={modalAction}
            />
        </>
    );
}

AdminHouseholdIndex.layout = {
    breadcrumbs,
};
