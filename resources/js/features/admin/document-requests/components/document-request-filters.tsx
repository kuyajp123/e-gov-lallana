import { router } from '@inertiajs/react';
import { RotateCcw, Search, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';

export interface DocumentTypeOption {
    id: number;
    name: string;
    slug: string;
}

export interface StatusCounts {
    all: number;
    pending: number;
    processing: number;
    on_hold: number;
    ready_for_pickup: number;
    completed: number;
    returned: number;
    rejected: number;
    cancelled: number;
}

interface DocumentRequestFiltersProps {
    filters: {
        search: string;
        status: string;
        document_type_id: number | null;
        payment_status: string;
    };
    statusCounts: StatusCounts;
    documentTypes: DocumentTypeOption[];
}

const STATUS_TABS = [
    { key: 'all', label: 'All Requests', countKey: 'all' },
    {
        key: 'pending',
        label: 'Pending Review',
        countKey: 'pending',
        alert: true,
    },
    { key: 'processing', label: 'Processing', countKey: 'processing' },
    {
        key: 'ready_for_pickup',
        label: 'Ready for Pickup',
        countKey: 'ready_for_pickup',
        success: true,
    },
    { key: 'completed', label: 'Completed', countKey: 'completed' },
    { key: 'on_hold', label: 'On Hold', countKey: 'on_hold' },
    { key: 'returned', label: 'Returned', countKey: 'returned' },
    { key: 'rejected', label: 'Rejected', countKey: 'rejected' },
] as const;

export function DocumentRequestFilters({
    filters,
    statusCounts,
    documentTypes,
}: DocumentRequestFiltersProps) {
    const [searchValue, setSearchValue] = useState(filters.search || '');

    const updateFilter = (newParams: Record<string, any>) => {
        router.get(
            '/admin/document-requests',
            {
                ...filters,
                ...newParams,
                page: 1, // Reset page when filtering
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

    const handleClearSearch = () => {
        setSearchValue('');
        updateFilter({ search: '' });
    };

    const handleResetAll = () => {
        setSearchValue('');
        router.get(
            '/admin/document-requests',
            {},
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const hasActiveFilters =
        filters.search !== '' ||
        (filters.status !== 'all' && filters.status !== '') ||
        filters.document_type_id !== null ||
        (filters.payment_status !== 'all' && filters.payment_status !== '');

    return (
        <div className="space-y-4">
            {/* Status Pills Bar */}
            <div className="flex scrollbar-none items-center gap-1.5 overflow-x-auto pb-1">
                {STATUS_TABS.map((tab) => {
                    const isActive = (filters.status || 'all') === tab.key;
                    const count =
                        statusCounts[tab.countKey as keyof StatusCounts] ?? 0;

                    return (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => updateFilter({ status: tab.key })}
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
                        placeholder="Search by ref code, resident name, or email..."
                        className="h-9 pr-8 pl-9 text-xs"
                    />
                    {searchValue && (
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="size-3.5" />
                        </button>
                    )}
                </div>

                {/* Dropdowns */}
                <div className="flex flex-wrap items-center gap-2">
                    {/* Document Type Dropdown */}
                    <div className="w-44">
                        <Select
                            value={
                                filters.document_type_id
                                    ? String(filters.document_type_id)
                                    : 'all'
                            }
                            onValueChange={(val) =>
                                updateFilter({
                                    document_type_id:
                                        val === 'all' ? null : Number(val),
                                })
                            }
                        >
                            <SelectTrigger className="h-9 text-xs">
                                <SelectValue placeholder="All Document Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Document Types
                                </SelectItem>
                                {documentTypes.map((type) => (
                                    <SelectItem
                                        key={type.id}
                                        value={String(type.id)}
                                    >
                                        {type.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Payment Status Dropdown */}
                    <div className="w-36">
                        <Select
                            value={filters.payment_status || 'all'}
                            onValueChange={(val) =>
                                updateFilter({ payment_status: val })
                            }
                        >
                            <SelectTrigger className="h-9 text-xs">
                                <SelectValue placeholder="All Payments" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Payments
                                </SelectItem>
                                <SelectItem value="unpaid">Unpaid</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="waived">
                                    Waived / Free
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Reset Button */}
                    {hasActiveFilters && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleResetAll}
                            className="h-9 gap-1 px-2.5 text-xs text-muted-foreground hover:text-foreground"
                        >
                            <RotateCcw className="size-3.5" />
                            Reset
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
