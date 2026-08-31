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

export function AddMemberDialog() {
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
                <Button size="sm" className="gap-1.5">
                    <Plus className="size-4" />
                    Add Family Member
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto rounded-2xl">
                <DialogHeader>
                    <DialogTitle>Add Household Member</DialogTitle>
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
                                First Name{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="mem_first_name"
                                value={data.first_name}
                                onChange={(e) =>
                                    setData('first_name', e.target.value)
                                }
                                placeholder="e.g. Maria"
                                required
                            />
                            {errors.first_name && (
                                <p className="text-xs text-destructive">
                                    {errors.first_name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="mem_middle_name">Middle Name</Label>
                            <Input
                                id="mem_middle_name"
                                value={data.middle_name}
                                onChange={(e) =>
                                    setData('middle_name', e.target.value)
                                }
                                placeholder="e.g. Reyes"
                            />
                            {errors.middle_name && (
                                <p className="text-xs text-destructive">
                                    {errors.middle_name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="mem_last_name">
                                Last Name{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="mem_last_name"
                                value={data.last_name}
                                onChange={(e) =>
                                    setData('last_name', e.target.value)
                                }
                                placeholder="e.g. Santos"
                                required
                            />
                            {errors.last_name && (
                                <p className="text-xs text-destructive">
                                    {errors.last_name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="mem_suffix">Suffix</Label>
                            <Input
                                id="mem_suffix"
                                value={data.suffix}
                                onChange={(e) =>
                                    setData('suffix', e.target.value)
                                }
                                placeholder="Jr., III"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="relationship_to_head">
                                Relationship to Head{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={data.relationship_to_head}
                                onValueChange={(val) =>
                                    setData('relationship_to_head', val)
                                }
                            >
                                <SelectTrigger id="relationship_to_head">
                                    <SelectValue placeholder="Select relationship" />
                                </SelectTrigger>
                                <SelectContent>
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
                            <Label htmlFor="mem_birthdate">Birthdate</Label>
                            <Input
                                id="mem_birthdate"
                                type="date"
                                value={data.birthdate}
                                onChange={(e) =>
                                    setData('birthdate', e.target.value)
                                }
                            />
                            {errors.birthdate && (
                                <p className="text-xs text-destructive">
                                    {errors.birthdate}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="mem_gender">Sex</Label>
                            <Select
                                value={data.gender}
                                onValueChange={(val) => setData('gender', val)}
                            >
                                <SelectTrigger id="mem_gender">
                                    <SelectValue placeholder="Select sex" />
                                </SelectTrigger>
                                <SelectContent>
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
                                Civil Status
                            </Label>
                            <Select
                                value={data.civil_status}
                                onValueChange={(val) =>
                                    setData('civil_status', val)
                                }
                            >
                                <SelectTrigger id="mem_civil_status">
                                    <SelectValue placeholder="Select civil status" />
                                </SelectTrigger>
                                <SelectContent>
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
                            <Label htmlFor="mem_occupation">Occupation</Label>
                            <Input
                                id="mem_occupation"
                                value={data.occupation}
                                onChange={(e) =>
                                    setData('occupation', e.target.value)
                                }
                                placeholder="e.g. Student, Driver, Self-Employed"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 border-t border-border pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? (
                                <div className="flex items-center gap-1.5">
                                    <Spinner className="size-4" />
                                    <span>Saving...</span>
                                </div>
                            ) : (
                                'Add Member'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
