import { Head, useForm } from '@inertiajs/react';
import { Info } from 'lucide-react';
import React from 'react';
import AuthLayout from '@/app/layouts/auth-layout';
import { IdUploadDropzone } from '@/features/resident/components/id-upload-dropzone';
import { login } from '@/routes';
import { store } from '@/routes/register';
import InputError from '@/shared/components/input-error';
import PasswordInput from '@/shared/components/password-input';
import TextLink from '@/shared/components/text-link';
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

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        middle_name: '',
        last_name: '',
        suffix: '',
        email: '',
        phone_number: '',
        password: '',
        password_confirmation: '',
        birthdate: '',
        gender: '',
        civil_status: '',
        citizenship: 'Filipino',
        religion: '',
        residency_status: 'resident',
        date_of_residency: '',
        occupation: '',
        educational_attainment: '',
        employment_status: '',
        is_voter: false,
        voter_id_number: '',
        senior_citizen_status: false,
        pwd_status: false,
        pwd_id_number: '',
        solo_parent_status: false,
        solo_parent_id_number: '',
        government_id: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(store.url(), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Register" />

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <Alert className="border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-200">
                    <Info className="size-4 text-blue-600 dark:text-blue-400" />
                    <AlertTitle className="font-semibold">
                        Optional Resident KYC Details
                    </AlertTitle>
                    <AlertDescription className="text-xs">
                        Only Account Information is required to register.
                        Demographic and KYC details below are optional during
                        registration and can be completed later in your Profile
                        Settings before requesting documents.
                    </AlertDescription>
                </Alert>

                {/* Section 1: Account Information (Required) */}
                <Card className="rounded-xl border-border">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold">
                            Account Information
                        </CardTitle>
                        <CardDescription>
                            Your basic credentials to sign in and access the
                            e-government portal.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="grid gap-2">
                                <Label htmlFor="first_name">
                                    First Name{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="first_name"
                                    type="text"
                                    required
                                    autoFocus
                                    autoComplete="given-name"
                                    value={data.first_name}
                                    onChange={(e) =>
                                        setData('first_name', e.target.value)
                                    }
                                    placeholder="Juan"
                                />
                                <InputError message={errors.first_name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="middle_name">Middle Name</Label>
                                <Input
                                    id="middle_name"
                                    type="text"
                                    autoComplete="additional-name"
                                    value={data.middle_name}
                                    onChange={(e) =>
                                        setData('middle_name', e.target.value)
                                    }
                                    placeholder="Santos"
                                />
                                <InputError message={errors.middle_name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="last_name">
                                    Last Name{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="last_name"
                                    type="text"
                                    required
                                    autoComplete="family-name"
                                    value={data.last_name}
                                    onChange={(e) =>
                                        setData('last_name', e.target.value)
                                    }
                                    placeholder="Dela Cruz"
                                />
                                <InputError message={errors.last_name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="suffix">Suffix</Label>
                                <Input
                                    id="suffix"
                                    type="text"
                                    autoComplete="honorific-suffix"
                                    value={data.suffix}
                                    onChange={(e) =>
                                        setData('suffix', e.target.value)
                                    }
                                    placeholder="Jr., Sr., III"
                                />
                                <InputError message={errors.suffix} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="email">
                                    Email Address{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone_number">
                                    Mobile Phone Number
                                </Label>
                                <Input
                                    id="phone_number"
                                    type="tel"
                                    autoComplete="tel"
                                    value={data.phone_number}
                                    onChange={(e) =>
                                        setData('phone_number', e.target.value)
                                    }
                                    placeholder="09171234567"
                                />
                                <InputError message={errors.phone_number} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="password">
                                    Password{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    autoComplete="new-password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    placeholder="Password"
                                    passwordrules={passwordRules}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirm Password{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Confirm password"
                                    passwordrules={passwordRules}
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Section 2: Personal Details (Optional KYC) */}
                <Card className="rounded-xl border-border">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-semibold">
                                Personal Details
                            </CardTitle>
                            <span className="text-xs font-medium text-muted-foreground">
                                Optional
                            </span>
                        </div>
                        <CardDescription>
                            Your basic personal and demographic information.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="grid gap-2">
                                <Label htmlFor="birthdate">Date of Birth</Label>
                                <Input
                                    id="birthdate"
                                    type="date"
                                    value={data.birthdate}
                                    onChange={(e) =>
                                        setData('birthdate', e.target.value)
                                    }
                                />
                                <InputError message={errors.birthdate} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Select
                                    value={data.gender}
                                    onValueChange={(value) =>
                                        setData('gender', value)
                                    }
                                >
                                    <SelectTrigger id="gender">
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
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
                                <InputError message={errors.gender} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="civil_status">
                                    Civil Status
                                </Label>
                                <Select
                                    value={data.civil_status}
                                    onValueChange={(value) =>
                                        setData('civil_status', value)
                                    }
                                >
                                    <SelectTrigger id="civil_status">
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
                                        <SelectItem value="divorced">
                                            Divorced
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.civil_status} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="citizenship">Citizenship</Label>
                                <Input
                                    id="citizenship"
                                    type="text"
                                    value={data.citizenship}
                                    onChange={(e) =>
                                        setData('citizenship', e.target.value)
                                    }
                                    placeholder="Filipino"
                                />
                                <InputError message={errors.citizenship} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="religion">Religion</Label>
                                <Input
                                    id="religion"
                                    type="text"
                                    value={data.religion}
                                    onChange={(e) =>
                                        setData('religion', e.target.value)
                                    }
                                    placeholder="e.g. Roman Catholic"
                                />
                                <InputError message={errors.religion} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Section 3: Demographics & Residency (Optional KYC) */}
                <Card className="rounded-xl border-border">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-semibold">
                                Demographics & Residency
                            </CardTitle>
                            <span className="text-xs font-medium text-muted-foreground">
                                Optional
                            </span>
                        </div>
                        <CardDescription>
                            Your residency status and socio-economic background.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="residency_status">
                                    Residency Status
                                </Label>
                                <Select
                                    value={data.residency_status}
                                    onValueChange={(value) =>
                                        setData('residency_status', value)
                                    }
                                >
                                    <SelectTrigger id="residency_status">
                                        <SelectValue placeholder="Select residency status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="official">
                                            Official Resident
                                        </SelectItem>
                                        <SelectItem value="resident">
                                            Permanent Resident
                                        </SelectItem>
                                        <SelectItem value="new_resident">
                                            New Resident
                                        </SelectItem>
                                        <SelectItem value="tenant">
                                            Tenant
                                        </SelectItem>
                                        <SelectItem value="boarder">
                                            Boarder
                                        </SelectItem>
                                        <SelectItem value="student">
                                            Student
                                        </SelectItem>
                                        <SelectItem value="temporary">
                                            Temporary
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.residency_status} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="date_of_residency">
                                    Date of Residency
                                </Label>
                                <Input
                                    id="date_of_residency"
                                    type="date"
                                    value={data.date_of_residency}
                                    onChange={(e) =>
                                        setData(
                                            'date_of_residency',
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError
                                    message={errors.date_of_residency}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div className="grid gap-2">
                                <Label htmlFor="occupation">Occupation</Label>
                                <Input
                                    id="occupation"
                                    type="text"
                                    value={data.occupation}
                                    onChange={(e) =>
                                        setData('occupation', e.target.value)
                                    }
                                    placeholder="e.g. Teacher, Engineer"
                                />
                                <InputError message={errors.occupation} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="employment_status">
                                    Employment Status
                                </Label>
                                <Select
                                    value={data.employment_status}
                                    onValueChange={(value) =>
                                        setData('employment_status', value)
                                    }
                                >
                                    <SelectTrigger id="employment_status">
                                        <SelectValue placeholder="Select employment status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="employed">
                                            Employed
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
                                <InputError
                                    message={errors.employment_status}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="educational_attainment">
                                    Education
                                </Label>
                                <Select
                                    value={data.educational_attainment}
                                    onValueChange={(value) =>
                                        setData('educational_attainment', value)
                                    }
                                >
                                    <SelectTrigger id="educational_attainment">
                                        <SelectValue placeholder="Select education" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="elementary">
                                            Elementary
                                        </SelectItem>
                                        <SelectItem value="high_school">
                                            High School
                                        </SelectItem>
                                        <SelectItem value="vocational">
                                            Vocational
                                        </SelectItem>
                                        <SelectItem value="college">
                                            College
                                        </SelectItem>
                                        <SelectItem value="post_graduate">
                                            Post Graduate
                                        </SelectItem>
                                        <SelectItem value="none">
                                            None
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError
                                    message={errors.educational_attainment}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Section 4: Special Classifications (Optional KYC) */}
                <Card className="rounded-xl border-border">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-semibold">
                                Special Classifications
                            </CardTitle>
                            <span className="text-xs font-medium text-muted-foreground">
                                Optional
                            </span>
                        </div>
                        <CardDescription>
                            Eligibility for special community programs and
                            discounts.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2 rounded-lg border border-border p-3">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_voter"
                                        checked={data.is_voter}
                                        onCheckedChange={(checked) =>
                                            setData(
                                                'is_voter',
                                                Boolean(checked),
                                            )
                                        }
                                    />
                                    <Label
                                        htmlFor="is_voter"
                                        className="cursor-pointer font-medium"
                                    >
                                        Registered Voter
                                    </Label>
                                </div>
                                {data.is_voter && (
                                    <div className="pt-2">
                                        <Label
                                            htmlFor="voter_id_number"
                                            className="text-xs"
                                        >
                                            Voter's ID / VIN
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
                                            placeholder="Enter Voter ID"
                                            className="mt-1"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center space-x-2 rounded-lg border border-border p-3">
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
                                    className="cursor-pointer font-medium"
                                >
                                    Senior Citizen (60+ years old)
                                </Label>
                            </div>

                            <div className="space-y-2 rounded-lg border border-border p-3">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="pwd_status"
                                        checked={data.pwd_status}
                                        onCheckedChange={(checked) =>
                                            setData(
                                                'pwd_status',
                                                Boolean(checked),
                                            )
                                        }
                                    />
                                    <Label
                                        htmlFor="pwd_status"
                                        className="cursor-pointer font-medium"
                                    >
                                        Person with Disability (PWD)
                                    </Label>
                                </div>
                                {data.pwd_status && (
                                    <div className="pt-2">
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
                                                setData(
                                                    'pwd_id_number',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Enter PWD ID"
                                            className="mt-1"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2 rounded-lg border border-border p-3">
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
                                        className="cursor-pointer font-medium"
                                    >
                                        Solo Parent
                                    </Label>
                                </div>
                                {data.solo_parent_status && (
                                    <div className="pt-2">
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
                                            placeholder="Enter Solo Parent ID"
                                            className="mt-1"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Section 5: Government ID (Optional KYC during registration) */}
                <Card className="rounded-xl border-border">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-semibold">
                                Government ID Verification
                            </CardTitle>
                            <span className="text-xs font-medium text-muted-foreground">
                                Optional
                            </span>
                        </div>
                        <CardDescription>
                            Attach a valid government ID (Passport, Driver's
                            License, PhilSys, UMID, Postal ID, Voter's ID).
                            Required to request documents.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <IdUploadDropzone
                            onFileSelect={(file) =>
                                setData('government_id', file)
                            }
                            error={errors.government_id}
                        />
                    </CardContent>
                </Card>

                <div className="space-y-4 pt-2">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="w-full"
                        size="lg"
                        data-test="register-user-button"
                    >
                        {processing && <Spinner className="mr-2" />}
                        Create account
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <TextLink href={login()} tabIndex={6}>
                            Log in
                        </TextLink>
                    </div>
                </div>
            </form>
        </>
    );
}

Register.layout = (page: React.ReactNode) => (
    <AuthLayout
        title="Create an account"
        description="Enter your details below to register for e-Gov Barangay Lallana"
        className="max-w-2xl"
    >
        {page}
    </AuthLayout>
);
