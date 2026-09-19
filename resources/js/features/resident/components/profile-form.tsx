import { useForm } from '@inertiajs/react';
import { AlertCircle } from 'lucide-react';
import React from 'react';
import { IdUploadDropzone } from '@/features/resident/components/id-upload-dropzone';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/shared/components/ui/alert';
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
import { cn } from '@/shared/lib/utils';

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
    government_id_file_id?: number | null;
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

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const maxBirthdate = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(submitUrl, {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Validation Errors Notice */}
            {Object.keys(errors).length > 0 && (
                <Alert
                    variant="destructive"
                    className="border-destructive/50 bg-destructive/10 text-destructive dark:border-destructive/40 dark:bg-destructive/20"
                >
                    <AlertCircle className="size-4" />
                    <AlertTitle className="font-semibold">
                        Please correct the following (
                        {Object.keys(errors).length}) error(s):
                    </AlertTitle>
                    <AlertDescription className="text-xs">
                        <ul className="mt-1.5 list-inside list-disc space-y-1">
                            {Object.entries(errors).map(([field, msg]) => (
                                <li key={field}>
                                    <span className="font-semibold capitalize">
                                        {field.replace(/_/g, ' ')}
                                    </span>
                                    : {msg}
                                </li>
                            ))}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}

            {/* Section 1: Personal Details */}
            <div className="space-y-4">
                <div className="border-b border-border pb-2">
                    <h3 className="text-base font-semibold text-foreground">
                        1. Personal Details
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        Official personal information matching your valid civil
                        identity documents.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="kyc_first_name">
                            First Name{' '}
                            <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="kyc_first_name"
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
                        <Label htmlFor="kyc_middle_name">Middle Name</Label>
                        <Input
                            id="kyc_middle_name"
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
                        <Label htmlFor="kyc_suffix">Suffix</Label>
                        <Input
                            id="kyc_suffix"
                            value={data.suffix}
                            onChange={(e) => setData('suffix', e.target.value)}
                            placeholder="Jr., III, etc."
                        />
                        {errors.suffix && (
                            <p className="text-xs text-destructive">
                                {errors.suffix}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="kyc_last_name">
                            Last Name{' '}
                            <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="kyc_last_name"
                            value={data.last_name}
                            onChange={(e) =>
                                setData('last_name', e.target.value)
                            }
                            placeholder="e.g. Santos"
                            className={cn(
                                errors.last_name &&
                                    'border-destructive focus-visible:ring-destructive',
                            )}
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
                            max={maxBirthdate}
                            value={data.birthdate}
                            onChange={(e) =>
                                setData('birthdate', e.target.value)
                            }
                            className={cn(
                                errors.birthdate &&
                                    'border-destructive focus-visible:ring-destructive',
                            )}
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
                            Sex / Gender{' '}
                            <span className="text-destructive">*</span>
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
                                <SelectItem value="female">Female</SelectItem>
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
                                <SelectValue placeholder="Select civil status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="single">Single</SelectItem>
                                <SelectItem value="married">Married</SelectItem>
                                <SelectItem value="widowed">Widowed</SelectItem>
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
            </div>

            {/* Section 2: Demographics & Work */}
            <div className="space-y-4 border-t border-border pt-6">
                <div className="border-b border-border pb-2">
                    <h3 className="text-base font-semibold text-foreground">
                        2. Demographics & Work
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        Residency classification, employment, and educational
                        background.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                        <Label htmlFor="occupation">
                            Occupation / Job Title
                        </Label>
                        <Input
                            id="occupation"
                            value={data.occupation}
                            onChange={(e) =>
                                setData('occupation', e.target.value)
                            }
                            placeholder="e.g. Teacher, Engineer, Driver"
                        />
                        {errors.occupation && (
                            <p className="text-xs text-destructive">
                                {errors.occupation}
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
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="employed">
                                    Employed
                                </SelectItem>
                                <SelectItem value="unemployed">
                                    Unemployed
                                </SelectItem>
                                <SelectItem value="self_employed">
                                    Self-Employed / Freelance
                                </SelectItem>
                                <SelectItem value="student">Student</SelectItem>
                                <SelectItem value="retired">Retired</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.employment_status && (
                            <p className="text-xs text-destructive">
                                {errors.employment_status}
                            </p>
                        )}
                    </div>

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
                                    No Formal Education
                                </SelectItem>
                                <SelectItem value="elementary">
                                    Elementary Level / Graduate
                                </SelectItem>
                                <SelectItem value="high_school">
                                    High School Level / Graduate
                                </SelectItem>
                                <SelectItem value="vocational">
                                    Vocational / Technical
                                </SelectItem>
                                <SelectItem value="college">
                                    College Level / Graduate
                                </SelectItem>
                                <SelectItem value="post_graduate">
                                    Post Graduate
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
                        <Label htmlFor="residency_status">
                            Residency Status
                        </Label>
                        <Select
                            value={data.residency_status}
                            onValueChange={(val) =>
                                setData('residency_status', val)
                            }
                        >
                            <SelectTrigger id="residency_status">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="official">
                                    Official Resident (Registered Voter)
                                </SelectItem>
                                <SelectItem value="resident">
                                    Resident
                                </SelectItem>
                                <SelectItem value="new_resident">
                                    New Resident
                                </SelectItem>
                                <SelectItem value="tenant">
                                    Tenant / Renter
                                </SelectItem>
                                <SelectItem value="boarder">
                                    Boarder / Bedspacer
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
            </div>

            {/* Section 3: Special Classifications */}
            <div className="space-y-4 border-t border-border pt-6">
                <div className="border-b border-border pb-2">
                    <h3 className="text-base font-semibold text-foreground">
                        3. Special Classifications
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        Special sector designations for targeted barangay
                        assistance, senior benefits, and voting status.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="rounded-lg border border-border p-4">
                        <div className="flex items-start space-x-3">
                            <Checkbox
                                id="is_voter"
                                checked={data.is_voter}
                                onCheckedChange={(checked) =>
                                    setData('is_voter', Boolean(checked))
                                }
                                className="mt-0.5"
                            />
                            <div className="space-y-1">
                                <Label
                                    htmlFor="is_voter"
                                    className="cursor-pointer font-medium"
                                >
                                    Registered Voter in Barangay Lallana
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Check if you are registered to vote at the
                                    local COMELEC precinct.
                                </p>
                            </div>
                        </div>
                        {data.is_voter && (
                            <div className="mt-3 ml-7 max-w-sm space-y-2">
                                <Label
                                    htmlFor="voter_id_number"
                                    className="text-xs"
                                >
                                    Voter ID / VIN Number
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
                                    placeholder="Enter Voter's Identification Number"
                                />
                                {errors.voter_id_number && (
                                    <p className="text-xs text-destructive">
                                        {errors.voter_id_number}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="rounded-lg border border-border p-4">
                        <div className="flex items-start space-x-3">
                            <Checkbox
                                id="senior_citizen_status"
                                checked={data.senior_citizen_status}
                                onCheckedChange={(checked) =>
                                    setData(
                                        'senior_citizen_status',
                                        Boolean(checked),
                                    )
                                }
                                className="mt-0.5"
                            />
                            <div className="space-y-1">
                                <Label
                                    htmlFor="senior_citizen_status"
                                    className="cursor-pointer font-medium"
                                >
                                    Senior Citizen (60 years old and above)
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Enables senior citizen benefits and priority
                                    barangay lanes.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-border p-4">
                        <div className="flex items-start space-x-3">
                            <Checkbox
                                id="pwd_status"
                                checked={data.pwd_status}
                                onCheckedChange={(checked) =>
                                    setData('pwd_status', Boolean(checked))
                                }
                                className="mt-0.5"
                            />
                            <div className="space-y-1">
                                <Label
                                    htmlFor="pwd_status"
                                    className="cursor-pointer font-medium"
                                >
                                    Person with Disability (PWD)
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Qualified for PWD accessibility assistance
                                    and municipal discounts.
                                </p>
                            </div>
                        </div>
                        {data.pwd_status && (
                            <div className="mt-3 ml-7 max-w-sm space-y-2">
                                <Label
                                    htmlFor="pwd_id_number"
                                    className="text-xs"
                                >
                                    PWD ID Number
                                </Label>
                                <Input
                                    id="pwd_id_number"
                                    value={data.pwd_id_number}
                                    onChange={(e) =>
                                        setData('pwd_id_number', e.target.value)
                                    }
                                    placeholder="e.g. 13-7404-000-0000001"
                                />
                                {errors.pwd_id_number && (
                                    <p className="text-xs text-destructive">
                                        {errors.pwd_id_number}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="rounded-lg border border-border p-4">
                        <div className="flex items-start space-x-3">
                            <Checkbox
                                id="solo_parent_status"
                                checked={data.solo_parent_status}
                                onCheckedChange={(checked) =>
                                    setData(
                                        'solo_parent_status',
                                        Boolean(checked),
                                    )
                                }
                                className="mt-0.5"
                            />
                            <div className="space-y-1">
                                <Label
                                    htmlFor="solo_parent_status"
                                    className="cursor-pointer font-medium"
                                >
                                    Solo Parent
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Enables solo parent assistance and social
                                    services privileges.
                                </p>
                            </div>
                        </div>
                        {data.solo_parent_status && (
                            <div className="mt-3 ml-7 max-w-sm space-y-2">
                                <Label
                                    htmlFor="solo_parent_id_number"
                                    className="text-xs"
                                >
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
                                    placeholder="Enter Solo Parent ID Number"
                                />
                                {errors.solo_parent_id_number && (
                                    <p className="text-xs text-destructive">
                                        {errors.solo_parent_id_number}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Section 4: Government ID */}
            <div className="space-y-4 border-t border-border pt-6">
                <div className="border-b border-border pb-2">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-semibold text-foreground">
                            4. Government-Issued Identification
                        </h3>
                        <span className="text-xs font-semibold text-destructive">
                            * Required for Document Requests
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Upload a clear photo or scanned copy of a valid
                        government ID (PhilSys National ID, Driver's License,
                        Passport, UMID, Postal ID, Voter's ID).
                    </p>
                </div>

                <div className="space-y-2">
                    <IdUploadDropzone
                        currentFileUrl={profile?.government_id_url}
                        onFileSelect={(file) => setData('government_id', file)}
                        error={errors.government_id}
                    />
                </div>
            </div>

            {/* Form Submit Action */}
            <div className="flex items-center justify-end border-t border-border pt-6">
                <Button
                    type="submit"
                    disabled={processing}
                    className="min-w-40"
                    data-test="save-profile-button"
                >
                    {processing ? (
                        <div className="flex items-center gap-2">
                            <Spinner className="size-4" />
                            <span>Saving...</span>
                        </div>
                    ) : (
                        'Save Resident Profile'
                    )}
                </Button>
            </div>
        </form>
    );
}
