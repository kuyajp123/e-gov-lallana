import { useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import { IdUploadDropzone } from '@/features/resident/components/id-upload-dropzone';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
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

export interface ResidentProfileData {
    id?: number;
    user_id?: number;
    first_name: string;
    middle_name?: string | null;
    last_name: string;
    suffix?: string | null;
    birthdate: string;
    gender: string;
    civil_status: string;
    citizenship: string;
    religion?: string | null;
    residency_status: string;
    date_of_residency?: string | null;
    occupation?: string | null;
    educational_attainment?: string | null;
    employment_status?: string | null;
    is_voter: boolean;
    voter_id_number?: string | null;
    senior_citizen_status: boolean;
    pwd_status: boolean;
    pwd_id_number?: string | null;
    solo_parent_status: boolean;
    solo_parent_id_number?: string | null;
    government_id_url?: string | null;
    avatar_url?: string | null;
}

interface ProfileFormProps {
    profile?: ResidentProfileData | null;
    user?: { name: string; email: string };
    submitUrl: string;
    method?: 'post' | 'put';
}

export function ProfileForm({ profile, user, submitUrl }: ProfileFormProps) {
    // Split user's name if first profile creation
    const nameParts = (user?.name || '').trim().split(' ');
    const defaultFirstName = profile?.first_name || nameParts[0] || '';
    const defaultLastName =
        profile?.last_name ||
        (nameParts.length > 1 ? nameParts.slice(1).join(' ') : '');

    const { data, setData, post, processing, errors } = useForm({
        first_name: profile?.first_name ?? defaultFirstName,
        middle_name: profile?.middle_name ?? '',
        last_name: profile?.last_name ?? defaultLastName,
        suffix: profile?.suffix ?? '',
        birthdate: profile?.birthdate ? profile.birthdate.split('T')[0] : '',
        gender: profile?.gender ?? 'male',
        civil_status: profile?.civil_status ?? 'single',
        citizenship: profile?.citizenship ?? 'Filipino',
        religion: profile?.religion ?? '',
        residency_status: profile?.residency_status ?? 'resident',
        date_of_residency: profile?.date_of_residency
            ? profile.date_of_residency.split('T')[0]
            : '',
        occupation: profile?.occupation ?? '',
        educational_attainment: profile?.educational_attainment ?? 'college',
        employment_status: profile?.employment_status ?? 'employed',
        is_voter: profile?.is_voter ?? false,
        voter_id_number: profile?.voter_id_number ?? '',
        senior_citizen_status: profile?.senior_citizen_status ?? false,
        pwd_status: profile?.pwd_status ?? false,
        pwd_id_number: profile?.pwd_id_number ?? '',
        solo_parent_status: profile?.solo_parent_status ?? false,
        solo_parent_id_number: profile?.solo_parent_id_number ?? '',
        government_id: null as File | null,
    });

    const [activeTab, setActiveTab] = useState<
        'personal' | 'demographics' | 'special' | 'id'
    >('personal');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(submitUrl, {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step / Section Navigation Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-border pb-3">
                <Button
                    type="button"
                    variant={activeTab === 'personal' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('personal')}
                >
                    1. Personal Details
                </Button>
                <Button
                    type="button"
                    variant={activeTab === 'demographics' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('demographics')}
                >
                    2. Demographics & Work
                </Button>
                <Button
                    type="button"
                    variant={activeTab === 'special' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('special')}
                >
                    3. Special Classifications
                </Button>
                <Button
                    type="button"
                    variant={activeTab === 'id' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('id')}
                >
                    4. Government ID
                </Button>
            </div>

            {/* Tab 1: Personal Details */}
            {activeTab === 'personal' && (
                <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="first_name">
                                First Name{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="first_name"
                                value={data.first_name}
                                onChange={(e) =>
                                    setData('first_name', e.target.value)
                                }
                                placeholder="e.g. Juan"
                                required
                            />
                            {errors.first_name && (
                                <p className="text-xs text-destructive">
                                    {errors.first_name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="middle_name">Middle Name</Label>
                            <Input
                                id="middle_name"
                                value={data.middle_name}
                                onChange={(e) =>
                                    setData('middle_name', e.target.value)
                                }
                                placeholder="e.g. Dela Cruz"
                            />
                            {errors.middle_name && (
                                <p className="text-xs text-destructive">
                                    {errors.middle_name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="suffix">Suffix</Label>
                            <Input
                                id="suffix"
                                value={data.suffix}
                                onChange={(e) =>
                                    setData('suffix', e.target.value)
                                }
                                placeholder="Jr., III, etc."
                            />
                            {errors.suffix && (
                                <p className="text-xs text-destructive">
                                    {errors.suffix}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="last_name">
                                Last Name{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="last_name"
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

                        <div className="space-y-2">
                            <Label htmlFor="birthdate">
                                Birthdate{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="birthdate"
                                type="date"
                                value={data.birthdate}
                                onChange={(e) =>
                                    setData('birthdate', e.target.value)
                                }
                                required
                            />
                            {errors.birthdate && (
                                <p className="text-xs text-destructive">
                                    {errors.birthdate}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="gender">
                                Sex <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={data.gender}
                                onValueChange={(val) => setData('gender', val)}
                            >
                                <SelectTrigger id="gender">
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
                            {errors.gender && (
                                <p className="text-xs text-destructive">
                                    {errors.gender}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="civil_status">
                                Civil Status{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={data.civil_status}
                                onValueChange={(val) =>
                                    setData('civil_status', val)
                                }
                            >
                                <SelectTrigger id="civil_status">
                                    <SelectValue placeholder="Select status" />
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
                                    <SelectItem value="divorced">
                                        Divorced
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.civil_status && (
                                <p className="text-xs text-destructive">
                                    {errors.civil_status}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="citizenship">
                                Citizenship{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="citizenship"
                                value={data.citizenship}
                                onChange={(e) =>
                                    setData('citizenship', e.target.value)
                                }
                                required
                            />
                            {errors.citizenship && (
                                <p className="text-xs text-destructive">
                                    {errors.citizenship}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="religion">Religion</Label>
                            <Input
                                id="religion"
                                value={data.religion}
                                onChange={(e) =>
                                    setData('religion', e.target.value)
                                }
                                placeholder="e.g. Roman Catholic"
                            />
                            {errors.religion && (
                                <p className="text-xs text-destructive">
                                    {errors.religion}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button
                            type="button"
                            onClick={() => setActiveTab('demographics')}
                        >
                            Next: Demographics & Work →
                        </Button>
                    </div>
                </div>
            )}

            {/* Tab 2: Demographics & Work */}
            {activeTab === 'demographics' && (
                <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="educational_attainment">
                                Educational Attainment
                            </Label>
                            <Select
                                value={data.educational_attainment}
                                onValueChange={(val) =>
                                    setData('educational_attainment', val)
                                }
                            >
                                <SelectTrigger id="educational_attainment">
                                    <SelectValue placeholder="Select attainment" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">
                                        None / Preschool
                                    </SelectItem>
                                    <SelectItem value="elementary">
                                        Elementary
                                    </SelectItem>
                                    <SelectItem value="high_school">
                                        High School / Senior High
                                    </SelectItem>
                                    <SelectItem value="vocational">
                                        Vocational
                                    </SelectItem>
                                    <SelectItem value="college">
                                        College / Undergraduate
                                    </SelectItem>
                                    <SelectItem value="post_graduate">
                                        Post Graduate (Master's/PhD)
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.educational_attainment && (
                                <p className="text-xs text-destructive">
                                    {errors.educational_attainment}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="employment_status">
                                Employment Status
                            </Label>
                            <Select
                                value={data.employment_status}
                                onValueChange={(val) =>
                                    setData('employment_status', val)
                                }
                            >
                                <SelectTrigger id="employment_status">
                                    <SelectValue placeholder="Select employment" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="employed">
                                        Employed
                                    </SelectItem>
                                    <SelectItem value="self_employed">
                                        Self-Employed / Freelance
                                    </SelectItem>
                                    <SelectItem value="unemployed">
                                        Unemployed
                                    </SelectItem>
                                    <SelectItem value="student">
                                        Student
                                    </SelectItem>
                                    <SelectItem value="retired">
                                        Retired
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.employment_status && (
                                <p className="text-xs text-destructive">
                                    {errors.employment_status}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="occupation">
                                Occupation / Profession
                            </Label>
                            <Input
                                id="occupation"
                                value={data.occupation}
                                onChange={(e) =>
                                    setData('occupation', e.target.value)
                                }
                                placeholder="e.g. Teacher, Driver, Business Owner"
                            />
                            {errors.occupation && (
                                <p className="text-xs text-destructive">
                                    {errors.occupation}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="residency_status">
                                Residency Classification
                            </Label>
                            <Select
                                value={data.residency_status}
                                onValueChange={(val) =>
                                    setData('residency_status', val)
                                }
                            >
                                <SelectTrigger id="residency_status">
                                    <SelectValue placeholder="Select classification" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="official">
                                        Official Resident (Permanent)
                                    </SelectItem>
                                    <SelectItem value="resident">
                                        Resident
                                    </SelectItem>
                                    <SelectItem value="new_resident">
                                        New Resident
                                    </SelectItem>
                                    <SelectItem value="tenant">
                                        Tenant / Renting
                                    </SelectItem>
                                    <SelectItem value="boarder">
                                        Boarder
                                    </SelectItem>
                                    <SelectItem value="student">
                                        Student Resident
                                    </SelectItem>
                                    <SelectItem value="temporary">
                                        Temporary Resident
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.residency_status && (
                                <p className="text-xs text-destructive">
                                    {errors.residency_status}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="date_of_residency">
                                Date Started Living in Barangay Lallana
                            </Label>
                            <Input
                                id="date_of_residency"
                                type="date"
                                value={data.date_of_residency}
                                onChange={(e) =>
                                    setData('date_of_residency', e.target.value)
                                }
                            />
                            {errors.date_of_residency && (
                                <p className="text-xs text-destructive">
                                    {errors.date_of_residency}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setActiveTab('personal')}
                        >
                            ← Back
                        </Button>
                        <Button
                            type="button"
                            onClick={() => setActiveTab('special')}
                        >
                            Next: Special Classifications →
                        </Button>
                    </div>
                </div>
            )}

            {/* Tab 3: Special Classifications */}
            {activeTab === 'special' && (
                <div className="space-y-6">
                    <div className="space-y-4 rounded-xl border border-border bg-card p-4">
                        <h4 className="text-sm font-semibold text-foreground">
                            Voter Information
                        </h4>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="is_voter"
                                checked={data.is_voter}
                                onCheckedChange={(checked) =>
                                    setData('is_voter', Boolean(checked))
                                }
                            />
                            <Label
                                htmlFor="is_voter"
                                className="cursor-pointer"
                            >
                                Registered Voter in Barangay Lallana / Trece
                                Martires City
                            </Label>
                        </div>
                        {data.is_voter && (
                            <div className="mt-3 max-w-sm space-y-2">
                                <Label htmlFor="voter_id_number">
                                    Voter ID / VIN (Optional)
                                </Label>
                                <Input
                                    id="voter_id_number"
                                    value={data.voter_id_number}
                                    onChange={(e) =>
                                        setData(
                                            'voter_id_number',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Enter Voter Identification No."
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 rounded-xl border border-border bg-card p-4">
                        <h4 className="text-sm font-semibold text-foreground">
                            Sectoral & Vulnerability Classifications
                        </h4>

                        {/* Senior Citizen */}
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="senior_citizen_status"
                                checked={data.senior_citizen_status}
                                onCheckedChange={(checked) =>
                                    setData(
                                        'senior_citizen_status',
                                        Boolean(checked),
                                    )
                                }
                            />
                            <Label
                                htmlFor="senior_citizen_status"
                                className="cursor-pointer"
                            >
                                Senior Citizen (60 years old or above)
                            </Label>
                        </div>

                        {/* PWD */}
                        <div className="space-y-2 pt-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="pwd_status"
                                    checked={data.pwd_status}
                                    onCheckedChange={(checked) =>
                                        setData('pwd_status', Boolean(checked))
                                    }
                                />
                                <Label
                                    htmlFor="pwd_status"
                                    className="cursor-pointer"
                                >
                                    Person with Disability (PWD)
                                </Label>
                            </div>
                            {data.pwd_status && (
                                <div className="mt-2 max-w-sm space-y-2 pl-6">
                                    <Label htmlFor="pwd_id_number">
                                        PWD ID Number
                                    </Label>
                                    <Input
                                        id="pwd_id_number"
                                        value={data.pwd_id_number}
                                        onChange={(e) =>
                                            setData(
                                                'pwd_id_number',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="e.g. PWD-2026-XXXX"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Solo Parent */}
                        <div className="space-y-2 pt-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="solo_parent_status"
                                    checked={data.solo_parent_status}
                                    onCheckedChange={(checked) =>
                                        setData(
                                            'solo_parent_status',
                                            Boolean(checked),
                                        )
                                    }
                                />
                                <Label
                                    htmlFor="solo_parent_status"
                                    className="cursor-pointer"
                                >
                                    Solo Parent
                                </Label>
                            </div>
                            {data.solo_parent_status && (
                                <div className="mt-2 max-w-sm space-y-2 pl-6">
                                    <Label htmlFor="solo_parent_id_number">
                                        Solo Parent ID Number
                                    </Label>
                                    <Input
                                        id="solo_parent_id_number"
                                        value={data.solo_parent_id_number}
                                        onChange={(e) =>
                                            setData(
                                                'solo_parent_id_number',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="e.g. SP-2026-XXXX"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setActiveTab('demographics')}
                        >
                            ← Back
                        </Button>
                        <Button
                            type="button"
                            onClick={() => setActiveTab('id')}
                        >
                            Next: Government ID →
                        </Button>
                    </div>
                </div>
            )}

            {/* Tab 4: Government ID */}
            {activeTab === 'id' && (
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label>Government-Issued Valid Identification</Label>
                        <p className="text-xs text-muted-foreground">
                            Upload a clear photo or scanned copy of a valid
                            government ID (e.g. PhilSys National ID, Driver's
                            License, Passport, UMID, Postal ID, Voter's ID).
                        </p>
                        <IdUploadDropzone
                            currentFileUrl={profile?.government_id_url}
                            onFileSelect={(file) =>
                                setData('government_id', file)
                            }
                            error={errors.government_id}
                        />
                    </div>

                    <div className="flex items-center justify-between border-t border-border pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setActiveTab('special')}
                        >
                            ← Back
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="min-w-36"
                        >
                            {processing ? (
                                <div className="flex items-center gap-2">
                                    <Spinner className="size-4" />
                                    <span>Saving...</span>
                                </div>
                            ) : (
                                'Save Profile'
                            )}
                        </Button>
                    </div>
                </div>
            )}
        </form>
    );
}
