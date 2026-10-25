import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    CreditCard,
    FileCheck,
    FilePlus,
    FileText,
    Info,
    Loader2,
    Search,
    User,
    UserCheck,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { DocumentTypeOption } from '@/features/admin/document-requests/components/document-request-filters';
import { DynamicFormRenderer } from '@/features/documents/components/dynamic-form-renderer';
import type { FormFieldSchema } from '@/features/documents/components/dynamic-form-renderer';
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
import { NativeSelect } from '@/shared/components/ui/native-select';
import { Textarea } from '@/shared/components/ui/textarea';
import type { BreadcrumbItem } from '@/shared/types';

interface ResidentSearchResult {
    id: number;
    name: string;
    email: string;
    phone_number?: string | null;
    birthdate?: string | null;
    age?: number | null;
    gender?: string | null;
    civil_status?: string | null;
    purok?: string | null;
    address?: string | null;
    household_code?: string | null;
}

interface WalkinDocumentPageProps {
    documentTypes: (DocumentTypeOption & {
        fee_cents?: number;
        description?: string | null;
        form_schema?: FormFieldSchema[] | null;
    })[];
    purokOptions: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin' },
    { title: 'Document Requests', href: '/admin/document-requests' },
    {
        title: 'Issue Walk-in Document',
        href: '/admin/document-requests/walkin',
    },
];

export default function AdminWalkinDocumentCreate({
    documentTypes,
    purokOptions,
}: WalkinDocumentPageProps) {
    const [residentMode, setResidentMode] = useState<
        'unregistered' | 'registered'
    >('unregistered');

    // Search state for registered residents
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<ResidentSearchResult[]>(
        [],
    );
    const [isSearching, setIsSearching] = useState(false);
    const [selectedResident, setSelectedResident] =
        useState<ResidentSearchResult | null>(null);

    // Unregistered resident form data
    const [walkinName, setWalkinName] = useState('');
    const [walkinPurok, setWalkinPurok] = useState(
        purokOptions[0] || 'Purok 1',
    );
    const [walkinAddress, setWalkinAddress] = useState('');
    const [walkinBirthdate, setWalkinBirthdate] = useState('');
    const [walkinAge, setWalkinAge] = useState('');
    const [walkinGender, setWalkinGender] = useState('Male');
    const [walkinCivilStatus, setWalkinCivilStatus] = useState('Single');
    const [walkinContactNumber, setWalkinContactNumber] = useState('');
    const [walkinEmail, setWalkinEmail] = useState('');

    // Document info & Dynamic Form Schema values
    const [documentTypeId, setDocumentTypeId] = useState<string>(
        documentTypes.length > 0 ? String(documentTypes[0].id) : '',
    );
    const [submittedData, setSubmittedData] = useState<Record<string, any>>({});

    // Request & Payment
    const [purpose, setPurpose] = useState('');
    const [paymentStatus, setPaymentStatus] = useState<
        'paid' | 'waived' | 'unpaid'
    >('paid');
    const [adminNotes, setAdminNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittingAction, setSubmittingAction] = useState<string | null>(
        null,
    );
    const [validationError, setValidationError] = useState<string | null>(null);

    // Debounced search for registered residents
    useEffect(() => {
        if (residentMode !== 'registered' || searchQuery.trim().length < 2) {
            return;
        }

        let isMounted = true;
        const timer = setTimeout(async () => {
            setIsSearching(true);

            try {
                const response = await fetch(
                    `/admin/document-requests/residents/search?q=${encodeURIComponent(
                        searchQuery.trim(),
                    )}`,
                );

                if (response.ok && isMounted) {
                    const data = await response.json();
                    setSearchResults(data.residents || []);
                }
            } catch (err) {
                console.error('Failed to search residents:', err);
            } finally {
                if (isMounted) {
                    setIsSearching(false);
                }
            }
        }, 300);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [searchQuery, residentMode]);

    const handleSelectResident = (res: ResidentSearchResult) => {
        setSelectedResident(res);
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleClearSelectedResident = () => {
        setSelectedResident(null);
    };

    // Calculate current fee
    const selectedDocType = documentTypes.find(
        (d) => String(d.id) === documentTypeId,
    );
    const baseFeeCents = selectedDocType?.fee_cents ?? 0;
    const formattedFee =
        paymentStatus === 'waived'
            ? 'Free / Waived'
            : baseFeeCents === 0
              ? 'Free / Libre'
              : `₱${(baseFeeCents / 100).toFixed(2)}`;

    const handleSubmit = (
        actionType: 'complete_and_print' | 'create_processing',
    ) => {
        setValidationError(null);

        if (residentMode === 'registered' && !selectedResident) {
            setValidationError(
                'Please search and select a registered resident.',
            );
            window.scrollTo({ top: 0, behavior: 'smooth' });

            return;
        }

        if (residentMode === 'unregistered' && !walkinName.trim()) {
            setValidationError(
                'Citizen full name is required for walk-in issuance.',
            );
            window.scrollTo({ top: 0, behavior: 'smooth' });

            return;
        }

        if (!documentTypeId) {
            setValidationError('Please select a document type.');
            window.scrollTo({ top: 0, behavior: 'smooth' });

            return;
        }

        if (selectedDocType?.form_schema) {
            for (const field of selectedDocType.form_schema) {
                if (
                    field.required &&
                    !submittedData[field.name]?.toString().trim()
                ) {
                    setValidationError(
                        `Please answer the required document question: "${field.label}".`,
                    );
                    window.scrollTo({ top: 0, behavior: 'smooth' });

                    return;
                }
            }
        }

        if (!purpose.trim()) {
            setValidationError(
                'Please specify the stated purpose of the document.',
            );
            window.scrollTo({ top: 0, behavior: 'smooth' });

            return;
        }

        const payload = {
            resident_mode: residentMode,
            user_id:
                residentMode === 'registered' ? selectedResident?.id : null,
            walkin_name:
                residentMode === 'unregistered' ? walkinName.trim() : null,
            walkin_purok: residentMode === 'unregistered' ? walkinPurok : null,
            walkin_address:
                residentMode === 'unregistered' ? walkinAddress.trim() : null,
            walkin_birthdate:
                residentMode === 'unregistered' && walkinBirthdate
                    ? walkinBirthdate
                    : null,
            walkin_age:
                residentMode === 'unregistered' && walkinAge
                    ? parseInt(walkinAge, 10)
                    : null,
            walkin_gender:
                residentMode === 'unregistered' ? walkinGender : null,
            walkin_civil_status:
                residentMode === 'unregistered' ? walkinCivilStatus : null,
            walkin_contact_number:
                residentMode === 'unregistered'
                    ? walkinContactNumber.trim()
                    : null,
            walkin_email:
                residentMode === 'unregistered' ? walkinEmail.trim() : null,
            document_type_id: parseInt(documentTypeId, 10),
            submitted_data: submittedData,
            purpose: purpose.trim(),
            payment_status: paymentStatus,
            admin_notes: adminNotes.trim() ? adminNotes.trim() : null,
            action: actionType,
        };

        setIsSubmitting(true);
        setSubmittingAction(actionType);

        router.post('/admin/document-requests/walkin', payload, {
            onFinish: () => {
                setIsSubmitting(false);
                setSubmittingAction(null);
            },
            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                setValidationError(
                    typeof firstError === 'string'
                        ? firstError
                        : 'Failed to issue walk-in document. Please check the form.',
                );
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
        });
    };

    return (
        <>
            <Head title="Issue Walk-in Document - Barangay Admin" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
                {/* Header Section */}
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                        <Button
                            asChild
                            variant="outline"
                            size="icon"
                            className="size-9 rounded-none border-border"
                        >
                            <Link href="/admin/document-requests">
                                <ArrowLeft className="size-4" />
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-2">
                                <FilePlus className="size-5 text-primary" />
                                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                    Issue Walk-in Document
                                </h1>
                            </div>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                                Process over-the-counter document requests for
                                visiting residents, generate instant
                                cryptographic certificates, and record fees.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1.5 rounded-none text-xs"
                        >
                            <Link href="/admin/document-requests">
                                View Document Queue
                            </Link>
                        </Button>
                    </div>
                </div>

                {validationError && (
                    <div className="rounded-none border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs font-semibold text-rose-700 dark:text-rose-400">
                        {validationError}
                    </div>
                )}

                {/* Two-Column Form Layout */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Main Form (8 cols) */}
                    <div className="space-y-6 lg:col-span-8">
                        {/* 1. Citizen Applicant Registry */}
                        <Card className="rounded-none border-border shadow-none">
                            <CardHeader className="border-b border-border bg-muted/20 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <User className="size-4 text-primary" />
                                        <CardTitle className="text-sm font-bold text-foreground">
                                            1. Citizen Applicant Profile
                                        </CardTitle>
                                    </div>
                                    <span className="text-[11px] font-medium text-muted-foreground">
                                        Registry Selection
                                    </span>
                                </div>
                                <CardDescription className="text-xs">
                                    Determine whether the walk-in applicant
                                    already has a registered citizen profile or
                                    is an unregistered visitor.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 p-6">
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setResidentMode('unregistered');
                                            setSearchResults([]);
                                            setSearchQuery('');
                                        }}
                                        className={`flex items-center justify-center gap-2 border p-3.5 text-xs font-semibold transition-colors ${
                                            residentMode === 'unregistered'
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-border bg-muted/10 text-muted-foreground hover:bg-muted/30'
                                        }`}
                                    >
                                        <User className="size-4" />
                                        Unregistered Walk-in Citizen
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setResidentMode('registered');
                                            setSearchResults([]);
                                        }}
                                        className={`flex items-center justify-center gap-2 border p-3.5 text-xs font-semibold transition-colors ${
                                            residentMode === 'registered'
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-border bg-muted/10 text-muted-foreground hover:bg-muted/30'
                                        }`}
                                    >
                                        <UserCheck className="size-4" />
                                        Registered Resident Account
                                    </button>
                                </div>

                                {/* Mode A: Registered Search */}
                                {residentMode === 'registered' && (
                                    <div className="space-y-3 border border-border bg-muted/10 p-4">
                                        {!selectedResident ? (
                                            <div className="space-y-2">
                                                <Label className="text-xs font-medium text-foreground">
                                                    Search Active Resident
                                                    Registry
                                                </Label>
                                                <div className="relative">
                                                    <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                                    <Input
                                                        type="text"
                                                        value={searchQuery}
                                                        onChange={(e) => {
                                                            const val =
                                                                e.target.value;

                                                            setSearchQuery(val);

                                                            if (
                                                                val.trim()
                                                                    .length < 2
                                                            ) {
                                                                setSearchResults(
                                                                    [],
                                                                );
                                                            }
                                                        }}
                                                        placeholder="Type resident name, email, or mobile number..."
                                                        className="pl-9 text-xs"
                                                    />
                                                    {isSearching && (
                                                        <Loader2 className="absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                                                    )}
                                                </div>

                                                {/* Search Results Dropdown */}
                                                {searchResults.length > 0 && (
                                                    <div className="max-h-52 divide-y divide-border overflow-y-auto border border-border bg-popover text-xs shadow-none">
                                                        {searchResults.map(
                                                            (res) => (
                                                                <button
                                                                    key={res.id}
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleSelectResident(
                                                                            res,
                                                                        )
                                                                    }
                                                                    className="flex w-full items-center justify-between p-3 text-left transition-colors hover:bg-muted"
                                                                >
                                                                    <div>
                                                                        <p className="font-bold text-foreground">
                                                                            {
                                                                                res.name
                                                                            }
                                                                        </p>
                                                                        <p className="text-[11px] text-muted-foreground">
                                                                            {
                                                                                res.email
                                                                            }{' '}
                                                                            {res.phone_number
                                                                                ? `• ${res.phone_number}`
                                                                                : ''}
                                                                        </p>
                                                                    </div>
                                                                    <div className="text-right text-[11px] text-muted-foreground">
                                                                        <span>
                                                                            {res.purok ||
                                                                                'Brgy. Lallana'}
                                                                        </span>
                                                                        {res.household_code && (
                                                                            <span className="ml-1.5 font-mono text-primary">
                                                                                [
                                                                                {
                                                                                    res.household_code
                                                                                }

                                                                                ]
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </button>
                                                            ),
                                                        )}
                                                    </div>
                                                )}

                                                {searchQuery.trim().length >=
                                                    2 &&
                                                    !isSearching &&
                                                    searchResults.length ===
                                                        0 && (
                                                        <p className="text-[11px] text-muted-foreground italic">
                                                            No registered
                                                            residents found
                                                            matching &quot;
                                                            {searchQuery}&quot;.
                                                            If this resident
                                                            does not have an
                                                            account, switch to
                                                            &quot;Unregistered
                                                            Walk-in
                                                            Citizen&quot;.
                                                        </p>
                                                    )}
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between border border-border bg-card p-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex size-10 items-center justify-center border border-border bg-primary/10 text-xs font-bold text-primary">
                                                        {selectedResident.name.charAt(
                                                            0,
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-foreground">
                                                            {
                                                                selectedResident.name
                                                            }
                                                        </p>
                                                        <p className="text-[11px] text-muted-foreground">
                                                            {
                                                                selectedResident.email
                                                            }{' '}
                                                            •{' '}
                                                            {selectedResident.phone_number ||
                                                                'No phone'}{' '}
                                                            •{' '}
                                                            {selectedResident.purok ||
                                                                'Brgy. Lallana'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={
                                                        handleClearSelectedResident
                                                    }
                                                    className="h-8 rounded-none text-xs"
                                                >
                                                    Change Resident
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Mode B: Unregistered Resident Snapshot */}
                                {residentMode === 'unregistered' && (
                                    <div className="space-y-4 border border-border bg-muted/10 p-4">
                                        <div className="flex items-start gap-2 text-[11px] text-muted-foreground">
                                            <Info className="mt-0.5 size-3.5 shrink-0 text-primary" />
                                            <span>
                                                Details entered below are
                                                recorded directly onto this
                                                document request record for
                                                audit history. They will{' '}
                                                <strong>not</strong> create an
                                                account in the master resident
                                                registry.
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            <div className="space-y-1 sm:col-span-2">
                                                <Label className="text-xs font-semibold">
                                                    Full Name{' '}
                                                    <span className="text-rose-500">
                                                        *
                                                    </span>
                                                </Label>
                                                <Input
                                                    type="text"
                                                    value={walkinName}
                                                    onChange={(e) =>
                                                        setWalkinName(
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Juan Dela Cruz"
                                                    className="text-xs"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <Label className="text-xs font-semibold">
                                                    Purok / Sitio
                                                </Label>
                                                <NativeSelect
                                                    value={walkinPurok}
                                                    onChange={(e) =>
                                                        setWalkinPurok(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="text-xs"
                                                >
                                                    {purokOptions.map((p) => (
                                                        <option
                                                            key={p}
                                                            value={p}
                                                        >
                                                            {p}
                                                        </option>
                                                    ))}
                                                </NativeSelect>
                                            </div>

                                            <div className="space-y-1">
                                                <Label className="text-xs font-semibold">
                                                    Complete Address
                                                </Label>
                                                <Input
                                                    type="text"
                                                    value={walkinAddress}
                                                    onChange={(e) =>
                                                        setWalkinAddress(
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="House # / Street, Purok..."
                                                    className="text-xs"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <Label className="text-xs font-semibold">
                                                    Civil Status
                                                </Label>
                                                <NativeSelect
                                                    value={walkinCivilStatus}
                                                    onChange={(e) =>
                                                        setWalkinCivilStatus(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="text-xs"
                                                >
                                                    <option value="Single">
                                                        Single
                                                    </option>
                                                    <option value="Married">
                                                        Married
                                                    </option>
                                                    <option value="Widowed">
                                                        Widowed
                                                    </option>
                                                    <option value="Separated">
                                                        Separated
                                                    </option>
                                                </NativeSelect>
                                            </div>

                                            <div className="space-y-1">
                                                <Label className="text-xs font-semibold">
                                                    Gender
                                                </Label>
                                                <NativeSelect
                                                    value={walkinGender}
                                                    onChange={(e) =>
                                                        setWalkinGender(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="text-xs"
                                                >
                                                    <option value="Male">
                                                        Male
                                                    </option>
                                                    <option value="Female">
                                                        Female
                                                    </option>
                                                    <option value="Other">
                                                        Other
                                                    </option>
                                                </NativeSelect>
                                            </div>

                                            <div className="space-y-1">
                                                <Label className="text-xs font-semibold">
                                                    Age
                                                </Label>
                                                <Input
                                                    type="number"
                                                    value={walkinAge}
                                                    onChange={(e) =>
                                                        setWalkinAge(
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="e.g. 35"
                                                    className="text-xs"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <Label className="text-xs font-semibold">
                                                    Birthdate (Optional)
                                                </Label>
                                                <Input
                                                    type="date"
                                                    value={walkinBirthdate}
                                                    onChange={(e) =>
                                                        setWalkinBirthdate(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="text-xs"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <Label className="text-xs font-semibold">
                                                    Contact Number (Optional)
                                                </Label>
                                                <Input
                                                    type="tel"
                                                    value={walkinContactNumber}
                                                    onChange={(e) =>
                                                        setWalkinContactNumber(
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="0917XXXXXXX (For SMS updates)"
                                                    className="text-xs"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <Label className="text-xs font-semibold">
                                                    Email Address (Optional)
                                                </Label>
                                                <Input
                                                    type="email"
                                                    value={walkinEmail}
                                                    onChange={(e) =>
                                                        setWalkinEmail(
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="citizen@example.com (For email updates)"
                                                    className="text-xs"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* 2. Document Selection */}
                        <Card className="rounded-none border-border shadow-none">
                            <CardHeader className="border-b border-border bg-muted/20 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FileText className="size-4 text-primary" />
                                        <CardTitle className="text-sm font-bold text-foreground">
                                            2. Document Selection
                                        </CardTitle>
                                    </div>
                                    <span className="text-[11px] font-medium text-muted-foreground">
                                        Catalog Selection
                                    </span>
                                </div>
                                <CardDescription className="text-xs">
                                    Select the official document requested by
                                    the resident.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 p-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold">
                                        Document Type{' '}
                                        <span className="text-rose-500">*</span>
                                    </Label>
                                    <NativeSelect
                                        value={documentTypeId}
                                        onChange={(e) => {
                                            setDocumentTypeId(e.target.value);
                                            setSubmittedData({});
                                        }}
                                        className="text-xs"
                                    >
                                        {documentTypes.map((dt) => (
                                            <option key={dt.id} value={dt.id}>
                                                {dt.name}{' '}
                                                {dt.fee_cents
                                                    ? `(₱${(dt.fee_cents / 100).toFixed(2)})`
                                                    : '(Free / Libre)'}
                                            </option>
                                        ))}
                                    </NativeSelect>
                                    {selectedDocType?.description && (
                                        <p className="text-[11px] text-muted-foreground">
                                            {selectedDocType.description}
                                        </p>
                                    )}
                                </div>

                                {/* Dynamic Form Schema Questions */}
                                {selectedDocType?.form_schema &&
                                    selectedDocType.form_schema.length > 0 && (
                                        <div className="space-y-3 rounded-none border border-border/70 bg-muted/10 p-4">
                                            <div className="border-b border-border/50 pb-2">
                                                <p className="text-xs font-semibold text-foreground">
                                                    Document-Specific Questions
                                                </p>
                                                <p className="text-[11px] text-muted-foreground">
                                                    Please fill out the extra
                                                    information configured for
                                                    this document type.
                                                </p>
                                            </div>
                                            <DynamicFormRenderer
                                                schema={
                                                    selectedDocType.form_schema
                                                }
                                                values={submittedData}
                                                onChange={(name, value) => {
                                                    setSubmittedData(
                                                        (prev) => ({
                                                            ...prev,
                                                            [name]: value,
                                                        }),
                                                    );
                                                }}
                                            />
                                        </div>
                                    )}
                            </CardContent>
                        </Card>

                        {/* 3. Stated Purpose & Staff Notes */}
                        <Card className="rounded-none border-border shadow-none">
                            <CardHeader className="border-b border-border bg-muted/20 px-6 py-4">
                                <CardTitle className="text-sm font-bold text-foreground">
                                    3. Stated Purpose & Internal Notes
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Official legal intent of issuance and
                                    confidential administrative notes.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 p-6">
                                <div className="space-y-1">
                                    <Label className="text-xs font-semibold">
                                        Stated Purpose{' '}
                                        <span className="text-rose-500">*</span>
                                    </Label>
                                    <Input
                                        type="text"
                                        value={purpose}
                                        onChange={(e) =>
                                            setPurpose(e.target.value)
                                        }
                                        placeholder="e.g. Local Employment, Scholarship, Postal ID, Bank Requirement"
                                        className="text-xs"
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs font-semibold">
                                        Internal Administrative Notes
                                    </Label>
                                    <Textarea
                                        value={adminNotes}
                                        onChange={(e) =>
                                            setAdminNotes(e.target.value)
                                        }
                                        placeholder="Record counter staff verification notes, receipt numbers, or special instructions..."
                                        rows={3}
                                        className="text-xs"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Fee, Payment, & Submission (4 cols) */}
                    <div className="space-y-6 lg:col-span-4">
                        <Card className="rounded-none border-border shadow-none">
                            <CardHeader className="border-b border-border bg-muted/20 px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="size-4 text-primary" />
                                    <CardTitle className="text-sm font-bold text-foreground">
                                        Fee & Payment
                                    </CardTitle>
                                </div>
                                <CardDescription className="text-xs">
                                    Collection status for counter processing.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 p-6">
                                <div className="flex items-center justify-between border-b border-border pb-3">
                                    <span className="text-xs text-muted-foreground">
                                        Document Fee
                                    </span>
                                    <span className="text-base font-bold text-foreground">
                                        {formattedFee}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold">
                                        Payment Status
                                    </Label>
                                    <NativeSelect
                                        value={paymentStatus}
                                        onChange={(e) =>
                                            setPaymentStatus(
                                                e.target.value as
                                                    | 'paid'
                                                    | 'waived'
                                                    | 'unpaid',
                                            )
                                        }
                                        className="text-xs"
                                    >
                                        <option value="paid">
                                            Paid (Cash Over-the-Counter)
                                        </option>
                                        <option value="waived">
                                            Waived / Free (Senior / Indigent)
                                        </option>
                                        <option value="unpaid">
                                            Unpaid (Pay Later)
                                        </option>
                                    </NativeSelect>
                                </div>

                                <div className="rounded-none border border-border bg-muted/10 p-3 text-[11px] text-muted-foreground">
                                    <p className="font-semibold text-foreground">
                                        Counter Guidelines:
                                    </p>
                                    <ul className="mt-1.5 list-disc space-y-1 pl-4">
                                        <li>
                                            Fee waivers apply to Senior
                                            Citizens, PWDs, and registered
                                            indigent residents.
                                        </li>
                                        <li>
                                            Issuing & completing will
                                            immediately render the cryptographic
                                            QR code and printable PDF.
                                        </li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action Card */}
                        <Card className="rounded-none border-border shadow-none">
                            <CardHeader className="border-b border-border bg-muted/20 px-6 py-4">
                                <CardTitle className="text-sm font-bold text-foreground">
                                    Issuance Actions
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Execute request creation and PDF generation.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 p-6">
                                <Button
                                    type="button"
                                    variant="default"
                                    size="sm"
                                    disabled={isSubmitting}
                                    onClick={() =>
                                        handleSubmit('complete_and_print')
                                    }
                                    className="w-full rounded-none py-2.5 text-xs font-semibold"
                                >
                                    {isSubmitting &&
                                    submittingAction ===
                                        'complete_and_print' ? (
                                        <>
                                            <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                                            Issuing & Generating PDF...
                                        </>
                                    ) : (
                                        <>
                                            <FileCheck className="mr-1.5 size-3.5" />
                                            Issue & Complete Immediately
                                        </>
                                    )}
                                </Button>

                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    disabled={isSubmitting}
                                    onClick={() =>
                                        handleSubmit('create_processing')
                                    }
                                    className="w-full rounded-none py-2 text-xs"
                                >
                                    {isSubmitting &&
                                    submittingAction === 'create_processing' ? (
                                        <>
                                            <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                                            Saving to Queue...
                                        </>
                                    ) : (
                                        <>Queue for Later Processing</>
                                    )}
                                </Button>

                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="w-full rounded-none text-xs"
                                >
                                    <Link href="/admin/document-requests">
                                        Cancel & Return
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

AdminWalkinDocumentCreate.layout = {
    breadcrumbs,
};
