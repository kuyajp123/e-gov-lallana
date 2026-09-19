import { Head, Link, router } from '@inertiajs/react';
import {
    Building2,
    Eye,
    RotateCcw,
    Search,
    User,
    Users,
    X,
} from 'lucide-react';
import { useState } from 'react';
import {
    AdminRoleBadge,
    ResidentProfileDrawer,
} from '@/features/admin/resident-profiles/components/resident-profile-drawer';
import type { AdminResidentProfileItem } from '@/features/admin/resident-profiles/components/resident-profile-drawer';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card';
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

interface SectorCounts {
    all: number;
    voters: number;
    seniors: number;
    pwd: number;
    solo_parents: number;
}

interface AdminResidentIndexProps {
    residents: {
        data: AdminResidentProfileItem[];
        links: PaginationLink[];
        total: number;
        from?: number;
        to?: number;
    };
    sectorCounts: SectorCounts;
    filters: {
        search: string;
        sector: string;
        gender: string;
        civil_status: string;
        residency_status: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Console', href: '/admin' },
    { title: 'Resident Registry', href: '/admin/resident-profiles' },
];

const SECTOR_TABS = [
    { key: 'all', label: 'All Residents', countKey: 'all' },
    { key: 'voters', label: 'Registered Voters', countKey: 'voters' },
    { key: 'seniors', label: 'Senior Citizens', countKey: 'seniors' },
    { key: 'pwd', label: 'Persons with Disability', countKey: 'pwd' },
    { key: 'solo_parents', label: 'Solo Parents', countKey: 'solo_parents' },
] as const;

export default function AdminResidentIndex({
    residents,
    sectorCounts,
    filters,
}: AdminResidentIndexProps) {
    const [searchValue, setSearchValue] = useState(filters.search || '');
    const [selectedResident, setSelectedResident] =
        useState<AdminResidentProfileItem | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const updateFilter = (newParams: Record<string, any>) => {
        router.get(
            '/admin/resident-profiles',
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

    const handleOpenDrawer = (resident: AdminResidentProfileItem) => {
        setSelectedResident(resident);
        setIsDrawerOpen(true);
    };

    const hasActiveFilters =
        filters.search !== '' ||
        (filters.sector !== 'all' && filters.sector !== '') ||
        (filters.gender !== 'all' && filters.gender !== '') ||
        (filters.civil_status !== 'all' && filters.civil_status !== '') ||
        (filters.residency_status !== 'all' && filters.residency_status !== '');

    const residentList = residents?.data || [];

    return (
        <>
            <Head title="Civil Registry & Resident Profiles - Barangay Admin" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
                {/* Header Title Section */}
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                Civil Registry & Resident Profiles
                            </h1>
                            <Badge
                                variant="outline"
                                className="font-mono text-xs font-semibold"
                            >
                                {residents.total} residents
                            </Badge>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Official master registry of citizens residing within
                            Barangay Lallana, including voter registration,
                            demographic cohorts, and vulnerable sectors.
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

                {/* Sectoral Tabs Bar */}
                <div className="flex scrollbar-none items-center gap-1.5 overflow-x-auto pb-1">
                    {SECTOR_TABS.map((tab) => {
                        const isActive = (filters.sector || 'all') === tab.key;
                        const count =
                            sectorCounts[tab.countKey as keyof SectorCounts] ??
                            0;

                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() =>
                                    updateFilter({ sector: tab.key })
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
                            placeholder="Search by name, email, phone, or voter ID..."
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

                    {/* Filter Dropdowns */}
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Gender */}
                        <div className="w-32">
                            <Select
                                value={filters.gender || 'all'}
                                onValueChange={(val) =>
                                    updateFilter({ gender: val })
                                }
                            >
                                <SelectTrigger className="h-9 text-xs">
                                    <SelectValue placeholder="All Sex" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Sex</SelectItem>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">
                                        Female
                                    </SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Civil Status */}
                        <div className="w-32">
                            <Select
                                value={filters.civil_status || 'all'}
                                onValueChange={(val) =>
                                    updateFilter({ civil_status: val })
                                }
                            >
                                <SelectTrigger className="h-9 text-xs">
                                    <SelectValue placeholder="Civil Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Status
                                    </SelectItem>
                                    <SelectItem value="single">
                                        Single
                                    </SelectItem>
                                    <SelectItem value="married">
                                        Married
                                    </SelectItem>
                                    <SelectItem value="widowed">
                                        Widowed
                                    </SelectItem>
                                    <SelectItem value="separated">
                                        Separated
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Residency */}
                        <div className="w-36">
                            <Select
                                value={filters.residency_status || 'all'}
                                onValueChange={(val) =>
                                    updateFilter({ residency_status: val })
                                }
                            >
                                <SelectTrigger className="h-9 text-xs">
                                    <SelectValue placeholder="Residency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Residency
                                    </SelectItem>
                                    <SelectItem value="official">
                                        Official Resident
                                    </SelectItem>
                                    <SelectItem value="resident">
                                        Resident
                                    </SelectItem>
                                    <SelectItem value="new_resident">
                                        New Resident
                                    </SelectItem>
                                    <SelectItem value="tenant">
                                        Tenant
                                    </SelectItem>
                                    <SelectItem value="student">
                                        Student
                                    </SelectItem>
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
                                        '/admin/resident-profiles',
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
                                Registered Resident Records
                            </CardTitle>
                            {residents.from && residents.to && (
                                <CardDescription className="text-xs">
                                    Showing {residents.from}–{residents.to} of{' '}
                                    {residents.total}
                                </CardDescription>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {residentList.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-border/60 bg-muted/10 text-muted-foreground">
                                            <th className="px-4 py-3 font-semibold">
                                                Resident Full Name
                                            </th>
                                            <th className="px-4 py-3 font-semibold">
                                                Age / Sex
                                            </th>
                                            <th className="px-4 py-3 font-semibold">
                                                Civil Status
                                            </th>
                                            <th className="px-4 py-3 font-semibold">
                                                Residency
                                            </th>
                                            <th className="px-4 py-3 font-semibold">
                                                Special Sectors
                                            </th>
                                            <th className="px-4 py-3 font-semibold">
                                                Registered
                                            </th>
                                            <th className="px-4 py-3 text-right font-semibold">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40">
                                        {residentList.map((res) => (
                                            <tr
                                                key={res.id}
                                                className="cursor-pointer transition-colors hover:bg-muted/30"
                                                onClick={() =>
                                                    handleOpenDrawer(res)
                                                }
                                            >
                                                {/* Full Name */}
                                                <td className="px-4 py-3.5">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                                            {res.first_name.charAt(
                                                                0,
                                                            )}
                                                        </div>
                                                        <div className="max-w-[210px] min-w-0">
                                                            <div className="flex items-center gap-1.5">
                                                                <p className="truncate font-semibold text-foreground hover:underline">
                                                                    {res.full_name}
                                                                </p>
                                                                <AdminRoleBadge
                                                                    isAdmin={res.is_admin}
                                                                    isSubAdmin={res.is_sub_admin}
                                                                    isSuperAdmin={res.is_super_admin}
                                                                    className="h-4 shrink-0 px-1.5 py-0 text-[9px] leading-none"
                                                                />
                                                            </div>
                                                            <p className="truncate text-[11px] text-muted-foreground">
                                                                {res.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Age / Sex */}
                                                <td className="px-4 py-3.5 whitespace-nowrap">
                                                    <span className="font-medium text-foreground">
                                                        {res.age
                                                            ? `${res.age} yrs`
                                                            : '—'}
                                                    </span>
                                                    <span className="ml-1 text-muted-foreground">
                                                        • {res.gender}
                                                    </span>
                                                </td>

                                                {/* Civil Status */}
                                                <td className="px-4 py-3.5 whitespace-nowrap text-muted-foreground">
                                                    {res.civil_status}
                                                </td>

                                                {/* Residency */}
                                                <td className="px-4 py-3.5 whitespace-nowrap">
                                                    <Badge
                                                        variant="outline"
                                                        className="border-border/70 text-[11px]"
                                                    >
                                                        {res.residency_status}
                                                    </Badge>
                                                </td>

                                                {/* Special Sectors */}
                                                <td className="px-4 py-3.5 whitespace-nowrap">
                                                    <div className="flex flex-wrap items-center gap-1">
                                                        {res.is_voter && (
                                                            <Badge
                                                                variant="outline"
                                                                className="border-emerald-500/30 text-[10px] text-emerald-700 dark:text-emerald-400"
                                                            >
                                                                Voter
                                                            </Badge>
                                                        )}
                                                        {res.senior_citizen_status && (
                                                            <Badge
                                                                variant="outline"
                                                                className="border-amber-500/30 text-[10px] text-amber-700 dark:text-amber-400"
                                                            >
                                                                Senior
                                                            </Badge>
                                                        )}
                                                        {res.pwd_status && (
                                                            <Badge
                                                                variant="outline"
                                                                className="border-indigo-500/30 text-[10px] text-indigo-700 dark:text-indigo-400"
                                                            >
                                                                PWD
                                                            </Badge>
                                                        )}
                                                        {res.solo_parent_status && (
                                                            <Badge
                                                                variant="outline"
                                                                className="border-rose-500/30 text-[10px] text-rose-700 dark:text-rose-400"
                                                            >
                                                                Solo Parent
                                                            </Badge>
                                                        )}
                                                        {!res.is_voter &&
                                                            !res.senior_citizen_status &&
                                                            !res.pwd_status &&
                                                            !res.solo_parent_status && (
                                                                <span className="text-[10px] text-muted-foreground">
                                                                    —
                                                                </span>
                                                            )}
                                                    </div>
                                                </td>

                                                {/* Registered */}
                                                <td className="px-4 py-3.5 whitespace-nowrap text-muted-foreground">
                                                    {res.created_at_formatted}
                                                </td>

                                                {/* Actions */}
                                                <td
                                                    className="px-4 py-3.5 text-right whitespace-nowrap"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() =>
                                                                handleOpenDrawer(
                                                                    res,
                                                                )
                                                            }
                                                            className="h-7 gap-1 text-xs"
                                                        >
                                                            <Eye className="size-3" />
                                                            Quick Review
                                                        </Button>

                                                        <Button
                                                            asChild
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-7 w-7 p-0"
                                                        >
                                                            <Link
                                                                href={`/admin/resident-profiles/${res.id}`}
                                                            >
                                                                <User className="size-3.5 text-muted-foreground" />
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <Users className="mx-auto size-10 text-muted-foreground/40" />
                                <h3 className="mt-3 text-sm font-semibold text-foreground">
                                    No resident records found
                                </h3>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Try adjusting your search criteria or
                                    sectoral category.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
                {residents.links && residents.links.length > 3 && (
                    <div className="flex items-center justify-between pt-2">
                        <p className="text-xs text-muted-foreground">
                            Page{' '}
                            {residents.from
                                ? Math.ceil((residents.from || 1) / 15)
                                : 1}
                        </p>
                        <div className="flex items-center gap-1">
                            {residents.links.map((link, i) => (
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
            <ResidentProfileDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                resident={selectedResident}
            />
        </>
    );
}

AdminResidentIndex.layout = {
    breadcrumbs,
};
