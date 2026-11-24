import { Head, Link, router } from '@inertiajs/react';
import {
    Building2,
    ChevronDown,
    ChevronUp,
    Eye,
    FileDown,
    RotateCcw,
    Search,
    SlidersHorizontal,
    User,
    Users,
    X,
} from 'lucide-react';
import { useState } from 'react';
import type { AdminResidentProfileItem } from '@/features/admin/resident-profiles/components/resident-profile-drawer';
import {
    AdminRoleBadge,
    ResidentProfileDrawer,
} from '@/features/admin/resident-profiles/components/resident-profile-drawer';
import { RbiExportModal } from '@/shared/components/rbi-export-modal';
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
    sectorCounts?: SectorCounts;
    filters: {
        search?: string;
        sector?: string;
        gender?: string;
        civil_status?: string;
        residency_status?: string;
        employment_status?: string;
        citizenship?: string;
        is_voter?: string;
        senior_citizen_status?: string;
        pwd_status?: string;
        solo_parent_status?: string;
        is_ofw?: string;
        is_ip?: string;
        is_out_of_school?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin' },
    { title: 'Resident Registry', href: '/admin/resident-profiles' },
];

export default function AdminResidentIndex({
    residents,
    filters,
}: AdminResidentIndexProps) {
    const [searchValue, setSearchValue] = useState(filters.search || '');
    const [selectedResident, setSelectedResident] =
        useState<AdminResidentProfileItem | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    const activeAdvancedCount = [
        filters.gender,
        filters.civil_status,
        filters.residency_status,
        filters.employment_status,
        filters.citizenship,
        filters.is_voter,
        filters.senior_citizen_status,
        filters.pwd_status,
        filters.solo_parent_status,
        filters.is_ofw,
        filters.is_ip,
        filters.is_out_of_school,
    ].filter((val) => Boolean(val) && val !== 'all').length;

    const [isAdvancedOpen, setIsAdvancedOpen] = useState(
        activeAdvancedCount > 0,
    );

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

    const handleClearAdvancedFilters = () => {
        router.get(
            '/admin/resident-profiles',
            {
                search: filters.search || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const handleExportPdf = () => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value && value !== 'all') {
                params.set(key, value);
            }
        });
        const queryString = params.toString();
        const url = `/admin/resident-profiles/export-pdf${queryString ? `?${queryString}` : ''}`;
        window.open(url, '_blank');
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

    const hasActiveFilters = Boolean(filters.search) || activeAdvancedCount > 0;

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
                            variant="outline"
                            size="sm"
                            onClick={() => setIsExportModalOpen(true)}
                            className="h-8 gap-1.5 border-emerald-500/40 text-xs text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400"
                        >
                            <FileDown className="size-3.5" />
                            Export RBI Reports (PDF)
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1.5 text-xs"
                        >
                            <Link href="/admin">
                                <Building2 className="size-3.5" />
                                Admin Dashboard
                            </Link>
                        </Button>
                    </div>
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

                    {/* Filter Actions */}
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Advance Filter Toggle Button */}
                        <Button
                            type="button"
                            variant={isAdvancedOpen ? 'secondary' : 'outline'}
                            size="sm"
                            onClick={() => setIsAdvancedOpen((prev) => !prev)}
                            className="h-9 gap-1.5 text-xs font-medium"
                        >
                            <SlidersHorizontal className="size-3.5" />
                            <span>Advance Filter</span>
                            {activeAdvancedCount > 0 && (
                                <Badge
                                    variant="default"
                                    className="ml-0.5 rounded-full px-1.5 py-0 text-[10px] font-bold"
                                >
                                    {activeAdvancedCount}
                                </Badge>
                            )}
                            {isAdvancedOpen ? (
                                <ChevronUp className="size-3.5 text-muted-foreground" />
                            ) : (
                                <ChevronDown className="size-3.5 text-muted-foreground" />
                            )}
                        </Button>

                        {/* Export PDF Button */}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleExportPdf}
                            className="h-9 gap-1.5 border-emerald-500/40 text-xs font-medium text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400"
                            title="Export filtered resident registry list as landscape PDF"
                        >
                            <FileDown className="size-3.5" />
                            <span>Export PDF</span>
                            {hasActiveFilters && (
                                <span className="py-0.2 rounded bg-emerald-500/20 px-1 text-[10px] font-bold">
                                    Filtered
                                </span>
                            )}
                        </Button>

                        {/* Reset All Filters Button */}
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

                {/* Collapsible Advance Filter Section */}
                {isAdvancedOpen && (
                    <div className="rounded-2xl border border-border/80 bg-card/60 p-4 shadow-xs backdrop-blur-xs transition-all">
                        <div className="mb-3.5 flex items-center justify-between border-b border-border/50 pb-2.5">
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal className="size-4 text-primary" />
                                <span className="text-xs font-semibold text-foreground">
                                    Advanced Candidate Filters for Registry
                                    &amp; Export
                                </span>
                                <span className="hidden text-[11px] text-muted-foreground sm:inline">
                                    — Combine multiple candidates to export
                                    specific cohorts
                                </span>
                            </div>
                            {activeAdvancedCount > 0 && (
                                <button
                                    type="button"
                                    onClick={handleClearAdvancedFilters}
                                    className="text-[11px] font-medium text-muted-foreground underline decoration-dotted hover:text-foreground"
                                >
                                    Clear advanced filters (
                                    {activeAdvancedCount})
                                </button>
                            )}
                        </div>

                        {/* Grid of 12 Candidate Filters */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                            {/* 1. Sex Status */}
                            <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-medium text-muted-foreground">
                                    Sex / Gender
                                </label>
                                <Select
                                    value={filters.gender || 'all'}
                                    onValueChange={(val) =>
                                        updateFilter({ gender: val })
                                    }
                                >
                                    <SelectTrigger className="h-8.5 text-xs">
                                        <SelectValue placeholder="All Sex" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Sex
                                        </SelectItem>
                                        <SelectItem value="male">
                                            Male
                                        </SelectItem>
                                        <SelectItem value="female">
                                            Female
                                        </SelectItem>
                                        <SelectItem value="other">
                                            Other
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* 2. Civil / Relationship Status */}
                            <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-medium text-muted-foreground">
                                    Relationship / Civil Status
                                </label>
                                <Select
                                    value={filters.civil_status || 'all'}
                                    onValueChange={(val) =>
                                        updateFilter({ civil_status: val })
                                    }
                                >
                                    <SelectTrigger className="h-8.5 text-xs">
                                        <SelectValue placeholder="All Status" />
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

                            {/* 3. Resident Status */}
                            <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-medium text-muted-foreground">
                                    Resident Status
                                </label>
                                <Select
                                    value={filters.residency_status || 'all'}
                                    onValueChange={(val) =>
                                        updateFilter({ residency_status: val })
                                    }
                                >
                                    <SelectTrigger className="h-8.5 text-xs">
                                        <SelectValue placeholder="All Residency" />
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
                                        <SelectItem value="temporary">
                                            Temporary
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* 4. Employment Status */}
                            <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-medium text-muted-foreground">
                                    Employment Status
                                </label>
                                <Select
                                    value={filters.employment_status || 'all'}
                                    onValueChange={(val) =>
                                        updateFilter({ employment_status: val })
                                    }
                                >
                                    <SelectTrigger className="h-8.5 text-xs">
                                        <SelectValue placeholder="All Employment" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Employment
                                        </SelectItem>
                                        <SelectItem value="employed">
                                            Employed / Labor
                                        </SelectItem>
                                        <SelectItem value="unemployed">
                                            Unemployed
                                        </SelectItem>
                                        <SelectItem value="self_employed">
                                            Self-Employed
                                        </SelectItem>
                                        <SelectItem value="student">
                                            Student
                                        </SelectItem>
                                        <SelectItem value="retired">
                                            Retired
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* 5. Citizenship */}
                            <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-medium text-muted-foreground">
                                    Citizenship
                                </label>
                                <Select
                                    value={filters.citizenship || 'all'}
                                    onValueChange={(val) =>
                                        updateFilter({ citizenship: val })
                                    }
                                >
                                    <SelectTrigger className="h-8.5 text-xs">
                                        <SelectValue placeholder="All Citizenship" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Citizenship
                                        </SelectItem>
                                        <SelectItem value="filipino">
                                            Filipino
                                        </SelectItem>
                                        <SelectItem value="foreigner">
                                            Foreigner
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* 6. Registered Voters */}
                            <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-medium text-muted-foreground">
                                    Registered Voters
                                </label>
                                <Select
                                    value={filters.is_voter || 'all'}
                                    onValueChange={(val) =>
                                        updateFilter({ is_voter: val })
                                    }
                                >
                                    <SelectTrigger className="h-8.5 text-xs">
                                        <SelectValue placeholder="All Voters" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="yes">
                                            Voters Only
                                        </SelectItem>
                                        <SelectItem value="no">
                                            Non-Voters
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* 7. Senior Citizens */}
                            <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-medium text-muted-foreground">
                                    Senior Citizens (60+)
                                </label>
                                <Select
                                    value={
                                        filters.senior_citizen_status || 'all'
                                    }
                                    onValueChange={(val) =>
                                        updateFilter({
                                            senior_citizen_status: val,
                                        })
                                    }
                                >
                                    <SelectTrigger className="h-8.5 text-xs">
                                        <SelectValue placeholder="All" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="yes">
                                            Senior Citizens Only
                                        </SelectItem>
                                        <SelectItem value="no">
                                            Non-Seniors
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* 8. Persons with Disabilities (PWD) */}
                            <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-medium text-muted-foreground">
                                    Persons with Disability (PWD)
                                </label>
                                <Select
                                    value={filters.pwd_status || 'all'}
                                    onValueChange={(val) =>
                                        updateFilter({ pwd_status: val })
                                    }
                                >
                                    <SelectTrigger className="h-8.5 text-xs">
                                        <SelectValue placeholder="All" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="yes">
                                            PWD Only
                                        </SelectItem>
                                        <SelectItem value="no">
                                            Non-PWD
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* 9. Solo Parents */}
                            <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-medium text-muted-foreground">
                                    Solo Parents
                                </label>
                                <Select
                                    value={filters.solo_parent_status || 'all'}
                                    onValueChange={(val) =>
                                        updateFilter({
                                            solo_parent_status: val,
                                        })
                                    }
                                >
                                    <SelectTrigger className="h-8.5 text-xs">
                                        <SelectValue placeholder="All" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="yes">
                                            Solo Parents Only
                                        </SelectItem>
                                        <SelectItem value="no">
                                            Non-Solo Parents
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* 10. Overseas Filipino Worker (OFW) */}
                            <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-medium text-muted-foreground">
                                    OFW
                                </label>
                                <Select
                                    value={filters.is_ofw || 'all'}
                                    onValueChange={(val) =>
                                        updateFilter({ is_ofw: val })
                                    }
                                >
                                    <SelectTrigger className="h-8.5 text-xs">
                                        <SelectValue placeholder="All" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="yes">
                                            OFW Only
                                        </SelectItem>
                                        <SelectItem value="no">
                                            Non-OFW
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* 11. Indigenous Peoples (IP) */}
                            <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-medium text-muted-foreground">
                                    Indigenous Peoples (IP)
                                </label>
                                <Select
                                    value={filters.is_ip || 'all'}
                                    onValueChange={(val) =>
                                        updateFilter({ is_ip: val })
                                    }
                                >
                                    <SelectTrigger className="h-8.5 text-xs">
                                        <SelectValue placeholder="All" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="yes">
                                            Indigenous Peoples Only
                                        </SelectItem>
                                        <SelectItem value="no">
                                            Non-IP
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* 12. Out of School (OSC / OSY) */}
                            <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-medium text-muted-foreground">
                                    Out of School (OSC / OSY)
                                </label>
                                <Select
                                    value={filters.is_out_of_school || 'all'}
                                    onValueChange={(val) =>
                                        updateFilter({ is_out_of_school: val })
                                    }
                                >
                                    <SelectTrigger className="h-8.5 text-xs">
                                        <SelectValue placeholder="All" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="yes">
                                            Out of School Only
                                        </SelectItem>
                                        <SelectItem value="no">
                                            In-School / N/A
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Advance Filter Footer with Landscape PDF Export Action */}
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-3">
                            <p className="text-xs text-muted-foreground">
                                Matching{' '}
                                <strong className="text-foreground">
                                    {residents.total}
                                </strong>{' '}
                                registered resident
                                {residents.total === 1 ? '' : 's'}. The exported
                                PDF report will reflect all selected filter
                                candidates.
                            </p>
                            <Button
                                type="button"
                                size="sm"
                                onClick={handleExportPdf}
                                className="h-8.5 gap-1.5 bg-emerald-600 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700"
                            >
                                <FileDown className="size-3.5" />
                                Export Filtered Registry
                            </Button>
                        </div>
                    </div>
                )}

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
                                                                    {
                                                                        res.full_name
                                                                    }
                                                                </p>
                                                                <AdminRoleBadge
                                                                    isAdmin={
                                                                        res.is_admin
                                                                    }
                                                                    isSubAdmin={
                                                                        res.is_sub_admin
                                                                    }
                                                                    isSuperAdmin={
                                                                        res.is_super_admin
                                                                    }
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
                                                            className="h-7 w-7 p-0 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
                                                            title="Export RBI Form B (PDF)"
                                                        >
                                                            <a
                                                                href={`/admin/resident-profiles/${res.id}/export/form-b`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <FileDown className="size-3.5" />
                                                            </a>
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

            {/* Inspection Modal */}
            <ResidentProfileDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                resident={selectedResident}
            />

            {/* RBI Official Reports Export Modal */}
            <RbiExportModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
            />
        </>
    );
}

AdminResidentIndex.layout = {
    breadcrumbs,
};
