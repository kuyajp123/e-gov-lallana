import { FileDown, FileText, Calendar, Filter } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';
import { Label } from '@/shared/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';

interface RbiExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    activePurok?: string;
}

export function RbiExportModal({
    isOpen,
    onClose,
    activePurok,
}: RbiExportModalProps) {
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState<string>(
        String(currentYear),
    );
    const [selectedSemester, setSelectedSemester] = useState<'1st' | '2nd'>(
        '1st',
    );

    const handleDownloadFormC = () => {
        const url = `/admin/households/export/form-c?year=${encodeURIComponent(selectedYear)}&semester=${encodeURIComponent(selectedSemester)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
        onClose();
    };

    const handleDownloadSummary = () => {
        const url =
            activePurok && activePurok !== 'all'
                ? `/admin/households/export/rbi-pdf?purok=${encodeURIComponent(activePurok)}`
                : '/admin/households/export/rbi-pdf';
        window.open(url, '_blank', 'noopener,noreferrer');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-base font-bold">
                        <FileDown className="size-5 text-emerald-600 dark:text-emerald-400" />
                        Export RBI Official Reports (PDF)
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        Generate official DILG Registry of Barangay Inhabitants
                        (Revised 2024) compliant reports in PDF format.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Section 1: Form C Semestral Monitoring */}
                    <div className="space-y-3 rounded-xl border border-border/80 bg-muted/20 p-3.5">
                        <div className="flex items-start justify-between">
                            <div>
                                <h4 className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                                    <FileText className="size-3.5 text-primary" />
                                    RBI Form C — Semestral Monitoring Report
                                </h4>
                                <p className="mt-0.5 text-[11px] text-muted-foreground">
                                    Official age-bracketing & sector summary
                                    matrix for DILG BIS-BPS submission.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="space-y-1">
                                <Label
                                    htmlFor="form-c-sem"
                                    className="flex items-center gap-1 text-[11px] text-muted-foreground"
                                >
                                    <Calendar className="size-3" /> Semester
                                </Label>
                                <Select
                                    value={selectedSemester}
                                    onValueChange={(val: '1st' | '2nd') =>
                                        setSelectedSemester(val)
                                    }
                                >
                                    <SelectTrigger
                                        id="form-c-sem"
                                        className="h-8 text-xs"
                                    >
                                        <SelectValue placeholder="Select semester" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1st">
                                            1st Semester (Jan–Jun)
                                        </SelectItem>
                                        <SelectItem value="2nd">
                                            2nd Semester (Jul–Dec)
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <Label
                                    htmlFor="form-c-year"
                                    className="flex items-center gap-1 text-[11px] text-muted-foreground"
                                >
                                    Calendar Year
                                </Label>
                                <Select
                                    value={selectedYear}
                                    onValueChange={(val) =>
                                        setSelectedYear(val)
                                    }
                                >
                                    <SelectTrigger
                                        id="form-c-year"
                                        className="h-8 text-xs"
                                    >
                                        <SelectValue placeholder="Select year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[
                                            currentYear,
                                            currentYear - 1,
                                            currentYear - 2,
                                        ].map((yr) => (
                                            <SelectItem
                                                key={yr}
                                                value={String(yr)}
                                            >
                                                CY {yr}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Button
                            size="sm"
                            onClick={handleDownloadFormC}
                            className="h-8 w-full gap-1.5 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
                        >
                            <FileDown className="size-3.5" />
                            Download RBI Form C (PDF)
                        </Button>
                    </div>

                    {/* Section 2: Summary Report */}
                    <div className="space-y-2 rounded-xl border border-border/80 bg-muted/20 p-3.5">
                        <div>
                            <h4 className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                                <Filter className="size-3.5 text-primary" />
                                General RBI Demographic Summary (PDF)
                            </h4>
                            <p className="mt-0.5 text-[11px] text-muted-foreground">
                                Complete household listing with head names,
                                member count, and sectoral breakdown
                                {activePurok && activePurok !== 'all'
                                    ? ` (Filtered to: ${activePurok})`
                                    : ' (All Puroks)'}
                                .
                            </p>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDownloadSummary}
                            className="h-8 w-full gap-1.5 border-emerald-500/40 text-xs text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400"
                        >
                            <FileDown className="size-3.5" />
                            Download Demographic Summary (PDF)
                        </Button>
                    </div>

                    {/* Helper text about Form A and Form B */}
                    <div className="space-y-1 rounded-lg bg-muted/40 p-2.5 text-[11px] text-muted-foreground">
                        <p>
                            • <strong>RBI Form A (Household):</strong> Download
                            directly from any household details page or row
                            menu.
                        </p>
                        <p>
                            • <strong>RBI Form B (Individual):</strong> Download
                            directly from any resident's profile card or row
                            menu.
                        </p>
                    </div>
                </div>

                <DialogFooter className="sm:justify-end">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                        className="h-8 text-xs"
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
