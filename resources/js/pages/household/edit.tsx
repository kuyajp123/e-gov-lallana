import { Head, useForm } from '@inertiajs/react';
import { AlertCircle } from 'lucide-react';
import React from 'react';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/shared/components/ui/alert';
import { Button } from '@/shared/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import { Spinner } from '@/shared/components/ui/spinner';
import { Textarea } from '@/shared/components/ui/textarea';
import type { BreadcrumbItem } from '@/shared/types';

interface EditHouseholdProps {
    household: {
        id: number;
        household_code: string;
        address: string;
        purok_sitio: string;
        notes?: string | null;
        status: string;
        verification_notes?: string | null;
    };
    purokOptions: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'My Household', href: '/household' },
    { title: 'Edit & Resubmit', href: '/household/edit' },
];

export default function HouseholdEdit({
    household,
    purokOptions,
}: EditHouseholdProps) {
    const { data, setData, put, processing, errors } = useForm({
        purok_sitio: household.purok_sitio,
        address: household.address,
        notes: household.notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/household', { preserveScroll: true });
    };

    return (
        <>
            <Head title="Edit & Resubmit Household" />

            <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-4 md:p-8">
                {household.verification_notes && (
                    <Alert className="rounded-2xl border-amber-500/40 bg-amber-500/10 text-amber-950 dark:text-amber-100">
                        <AlertCircle className="size-5 text-amber-600 dark:text-amber-400" />
                        <AlertTitle className="font-semibold">
                            Review Remarks from Barangay Administration
                        </AlertTitle>
                        <AlertDescription className="mt-1 text-xs text-amber-800 dark:text-amber-300">
                            {household.verification_notes}
                        </AlertDescription>
                    </Alert>
                )}

                <Card className="rounded-2xl border-border">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-bold">
                            Update Household Details —{' '}
                            {household.household_code}
                        </CardTitle>
                        <CardDescription>
                            Please correct the requested information and
                            resubmit for administrative verification.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="purok_sitio">
                                        Purok / Sitio{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Select
                                        value={data.purok_sitio}
                                        onValueChange={(val) =>
                                            setData('purok_sitio', val)
                                        }
                                    >
                                        <SelectTrigger id="purok_sitio">
                                            <SelectValue placeholder="Select Purok / Sitio" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {purokOptions.map((purok) => (
                                                <SelectItem
                                                    key={purok}
                                                    value={purok}
                                                >
                                                    {purok}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.purok_sitio && (
                                        <p className="text-xs text-destructive">
                                            {errors.purok_sitio}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="address">
                                        Street Address / House No.{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="address"
                                        value={data.address}
                                        onChange={(e) =>
                                            setData('address', e.target.value)
                                        }
                                        required
                                    />
                                    {errors.address && (
                                        <p className="text-xs text-destructive">
                                            {errors.address}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="notes">
                                        Landmark / Clarification Remarks
                                    </Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) =>
                                            setData('notes', e.target.value)
                                        }
                                        rows={3}
                                    />
                                    {errors.notes && (
                                        <p className="text-xs text-destructive">
                                            {errors.notes}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end border-t border-border pt-4">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="min-w-44"
                                >
                                    {processing ? (
                                        <div className="flex items-center gap-2">
                                            <Spinner className="size-4" />
                                            <span>Resubmitting...</span>
                                        </div>
                                    ) : (
                                        'Resubmit for Verification'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

HouseholdEdit.layout = {
    breadcrumbs,
};
