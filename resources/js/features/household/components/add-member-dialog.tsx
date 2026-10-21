import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/shared/components/ui/dialog';
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
import { useTranslation } from '@/shared/hooks/use-translation';

export function AddMemberDialog() {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        middle_name: '',
        last_name: '',
        suffix: '',
        relationship_to_head: 'spouse',
        birthdate: '',
        gender: 'female',
        civil_status: 'single',
        occupation: '',
        residency_status: 'resident',
        email: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/household/members', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5 rounded-none shadow-none">
                    <Plus className="size-4" />
                    {t('household.add_member', 'Add Family Member')}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto rounded-none shadow-none">
                <DialogHeader>
                    <DialogTitle>
                        {t('household.add_member', 'Add Household Member')}
                    </DialogTitle>
                    <DialogDescription>
                        Register an immediate or extended family member residing
                        in this household. Submitted members will undergo
                        barangay verification.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="mem_first_name">
                                {t('profile.first_name', 'First Name')}{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="mem_first_name"
                                value={data.first_name}
                                onChange={(e) =>
                                    setData('first_name', e.target.value)
                                }
                                placeholder="e.g. Maria"
                                className="rounded-none"
                                required
                            />
                            {errors.first_name && (
                                <p className="text-xs text-destructive">
                                    {errors.first_name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="mem_middle_name">
                                {t('profile.middle_name', 'Middle Name')}
                            </Label>
                            <Input
                                id="mem_middle_name"
                                value={data.middle_name}
                                onChange={(e) =>
                                    setData('middle_name', e.target.value)
                                }
                                placeholder="e.g. Reyes"
                                className="rounded-none"
                            />
                            {errors.middle_name && (
                                <p className="text-xs text-destructive">
                                    {errors.middle_name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="mem_last_name">
                                {t('profile.last_name', 'Last Name')}{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="mem_last_name"
                                value={data.last_name}
                                onChange={(e) =>
                                    setData('last_name', e.target.value)
                                }
                                placeholder="e.g. Santos"
                                className="rounded-none"
                                required
                            />
                            {errors.last_name && (
                                <p className="text-xs text-destructive">
                                    {errors.last_name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="mem_suffix">
                                {t('profile.suffix', 'Suffix')}
                            </Label>
                            <Input
                                id="mem_suffix"
                                value={data.suffix}
                                onChange={(e) =>
                                    setData('suffix', e.target.value)
                                }
                                placeholder="Jr., III"
                                className="rounded-none"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="relationship_to_head">
                                {t(
                                    'household.relationship',
                                    'Relationship to Head',
                                )}{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={data.relationship_to_head}
                                onValueChange={(val) =>
                                    setData('relationship_to_head', val)
                                }
                            >
                                <SelectTrigger
                                    id="relationship_to_head"
                                    className="rounded-none"
                                >
                                    <SelectValue placeholder="Select relationship" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="spouse">
                                        Spouse / Partner
                                    </SelectItem>
                                    <SelectItem value="son">Son</SelectItem>
                                    <SelectItem value="daughter">
                                        Daughter
                                    </SelectItem>
                                    <SelectItem value="parent">
                                        Parent (Father/Mother)
                                    </SelectItem>
                                    <SelectItem value="relative">
                                        Relative (Sibling, In-law, etc.)
                                    </SelectItem>
                                    <SelectItem value="other">
                                        Other Resident
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.relationship_to_head && (
                                <p className="text-xs text-destructive">
                                    {errors.relationship_to_head}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="mem_birthdate">
                                {t('profile.birthdate', 'Birthdate')}
                            </Label>
                            <Input
                                id="mem_birthdate"
                                type="date"
                                value={data.birthdate}
                                onChange={(e) =>
                                    setData('birthdate', e.target.value)
                                }
                                className="rounded-none"
                            />
                            {errors.birthdate && (
                                <p className="text-xs text-destructive">
                                    {errors.birthdate}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="mem_gender">
                                {t('profile.sex', 'Sex')}
                            </Label>
                            <Select
                                value={data.gender}
                                onValueChange={(val) => setData('gender', val)}
                            >
                                <SelectTrigger
                                    id="mem_gender"
                                    className="rounded-none"
                                >
                                    <SelectValue placeholder="Select sex" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">
                                        Female
                                    </SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="mem_civil_status">
                                {t('profile.civil_status', 'Civil Status')}
                            </Label>
                            <Select
                                value={data.civil_status}
                                onValueChange={(val) =>
                                    setData('civil_status', val)
                                }
                            >
                                <SelectTrigger
                                    id="mem_civil_status"
                                    className="rounded-none"
                                >
                                    <SelectValue placeholder="Select civil status" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
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

                        <div className="space-y-1.5 sm:col-span-2">
                            <Label htmlFor="mem_occupation">
                                {t('household.occupation', 'Occupation')}
                            </Label>
                            <Input
                                id="mem_occupation"
                                value={data.occupation}
                                onChange={(e) =>
                                    setData('occupation', e.target.value)
                                }
                                placeholder="e.g. Student, Driver, Self-Employed"
                                className="rounded-none"
                            />
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="mem_email">Account Email</Label>
                                <span className="text-xs text-muted-foreground">
                                    Optional — portal invitation
                                </span>
                            </div>
                            <Input
                                id="mem_email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                placeholder="e.g. resident@example.com"
                                className="rounded-none"
                            />
                            <p className="text-[11px] text-muted-foreground">
                                If provided, an invitation will be sent for the
                                member to link their portal account.
                            </p>
                            {errors.email && (
                                <p className="text-xs text-destructive">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 border-t border-border pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="rounded-none shadow-none"
                            onClick={() => setOpen(false)}
                        >
                            {t('common.cancel', 'Cancel')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="rounded-none shadow-none"
                        >
                            {processing ? (
                                <div className="flex items-center gap-1.5">
                                    <Spinner className="size-4" />
                                    <span>
                                        {t('common.saving', 'Saving...')}
                                    </span>
                                </div>
                            ) : (
                                t('household.add_member', 'Add Member')
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
