import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, Info, Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';
import type { DocumentTypeItem } from '@/features/documents/components/document-type-card';
import { DynamicFormRenderer } from '@/features/documents/components/dynamic-form-renderer';
import { FileAttachmentsPreview } from '@/features/documents/components/file-attachments-preview';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/shared/components/ui/alert';
import { Badge } from '@/shared/components/ui/badge';
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
import { Textarea } from '@/shared/components/ui/textarea';
import { useTranslation } from '@/shared/hooks/use-translation';

interface ExistingGovernmentId {
    id: number;
    file_name: string;
    url: string;
}

interface DocumentCreateProps {
    documentType: DocumentTypeItem;
    existingGovernmentId: ExistingGovernmentId | null;
}

export default function DocumentCreate({
    documentType,
    existingGovernmentId,
}: DocumentCreateProps) {
    const { t } = useTranslation();
    const hasExistingId = !!existingGovernmentId;
    const [useExistingId, setUseExistingId] = useState<boolean>(hasExistingId);
    const governmentIdInputRef = useRef<HTMLInputElement>(null);
    const supportingFilesInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm<{
        document_type_id: number;
        purpose: string;
        submitted_data: Record<string, any>;
        use_existing_id: boolean;
        government_id_file: File | null;
        supporting_files: File[];
    }>({
        document_type_id: documentType.id,
        purpose: '',
        submitted_data: {},
        use_existing_id: hasExistingId,
        government_id_file: null,
        supporting_files: [],
    });

    const handleDynamicFieldChange = (fieldName: string, value: any) => {
        setData('submitted_data', {
            ...data.submitted_data,
            [fieldName]: value,
        });
    };

    const handleIdToggle = (checked: boolean) => {
        setUseExistingId(checked);
        setData('use_existing_id', checked);

        if (checked) {
            setData('government_id_file', null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/documents', {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title={`Request ${documentType.name}`} />

            <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-4 md:p-8">
                {/* Back button & Header */}
                <div className="flex items-center gap-3">
                    <Button
                        asChild
                        variant="outline"
                        size="icon"
                        className="size-9 rounded-none shadow-none"
                    >
                        <Link href="/documents">
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-foreground">
                            {t('documents.new_request', 'New Document Request')}{' '}
                            — {documentType.name}
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            {t(
                                'documents.subtitle',
                                'Request official barangay clearances, certificates, and indigency documents online.',
                            )}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Document Info Card */}
                    <Card className="rounded-none border border-border bg-card shadow-none">
                        <CardHeader className="pb-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <CardTitle className="text-base font-bold text-foreground">
                                    {documentType.name}
                                </CardTitle>
                                <Badge
                                    variant="secondary"
                                    className="rounded-none font-bold shadow-none"
                                >
                                    {t('documents.fee', 'Fee')}:{' '}
                                    {documentType.formatted_fee}
                                </Badge>
                            </div>
                            {documentType.description && (
                                <CardDescription className="text-xs">
                                    {documentType.description}
                                </CardDescription>
                            )}
                        </CardHeader>

                        {documentType.requirements &&
                            documentType.requirements.length > 0 && (
                                <CardContent className="pt-0">
                                    <div className="rounded-none border border-border/50 bg-muted/30 p-3">
                                        <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                            {t(
                                                'documents.required_documents',
                                                'Required Documents:',
                                            )}
                                        </span>
                                        <ul className="mt-1.5 list-inside list-disc space-y-0.5 text-xs text-foreground/90">
                                            {documentType.requirements.map(
                                                (req, index) => (
                                                    <li key={index}>{req}</li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                </CardContent>
                            )}
                    </Card>

                    {/* Step 1: Purpose & Dynamic Fields */}
                    <Card className="rounded-none border border-border bg-card shadow-none">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-bold">
                                1.{' '}
                                {t('documents.purpose', 'Purpose of Request')}
                            </CardTitle>
                            <CardDescription className="text-xs">
                                {t(
                                    'documents.stated_purpose',
                                    'Stated Purpose',
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-0">
                            {/* Standard Purpose Field */}
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="purpose"
                                    className="text-xs font-semibold"
                                >
                                    {t(
                                        'documents.purpose',
                                        'Purpose of Request',
                                    )}{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Textarea
                                    id="purpose"
                                    placeholder="e.g. Job Application, School Requirement, Scholarship, Bank Account Opening, Business Permit..."
                                    value={data.purpose}
                                    onChange={(e) =>
                                        setData('purpose', e.target.value)
                                    }
                                    rows={3}
                                    className={`rounded-none shadow-none ${
                                        errors.purpose
                                            ? 'border-destructive'
                                            : ''
                                    }`}
                                />
                                {errors.purpose && (
                                    <p className="text-[11px] font-medium text-destructive">
                                        {errors.purpose}
                                    </p>
                                )}
                            </div>

                            {/* Dynamic Fields from DocumentType form_schema */}
                            {documentType.form_schema &&
                                documentType.form_schema.length > 0 && (
                                    <div className="border-t border-border/50 pt-4">
                                        <DynamicFormRenderer
                                            schema={documentType.form_schema}
                                            values={data.submitted_data}
                                            onChange={handleDynamicFieldChange}
                                            errors={errors}
                                        />
                                    </div>
                                )}
                        </CardContent>
                    </Card>

                    {/* Step 2: Identification & Supporting Attachments */}
                    <Card className="rounded-none border border-border bg-card shadow-none">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-bold">
                                2.{' '}
                                {t(
                                    'documents.government_id',
                                    'Government-Issued ID',
                                )}{' '}
                                &{' '}
                                {t(
                                    'documents.supporting_files',
                                    'Supporting Documents',
                                )}
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Attach a valid government ID and any supporting
                                prerequisite documents.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-0">
                            {/* KYC ID Reuse Option */}
                            {hasExistingId && (
                                <div className="space-y-2 rounded-none border border-border/60 bg-muted/20 p-3.5">
                                    <div className="flex items-start gap-2.5">
                                        <Checkbox
                                            id="use_existing_id"
                                            checked={useExistingId}
                                            onCheckedChange={handleIdToggle}
                                            className="mt-0.5 rounded-none"
                                        />
                                        <div className="space-y-0.5">
                                            <Label
                                                htmlFor="use_existing_id"
                                                className="cursor-pointer text-xs font-bold text-foreground"
                                            >
                                                {t(
                                                    'documents.use_saved_id',
                                                    'Use my verified Government ID on file',
                                                )}
                                            </Label>
                                            <p className="text-[11px] text-muted-foreground">
                                                Reuses your existing verified
                                                ID:{' '}
                                                <span className="font-semibold text-foreground">
                                                    {
                                                        existingGovernmentId.file_name
                                                    }
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    {useExistingId && (
                                        <div className="mt-2 flex items-center gap-2 rounded-none bg-emerald-500/10 p-2 text-xs font-semibold text-emerald-900 dark:text-emerald-300">
                                            <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                                            Reusing profile identification. No
                                            additional ID upload needed.
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Fresh ID Upload input */}
                            {(!hasExistingId || !useExistingId) && (
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="government_id_file"
                                        className="text-xs font-semibold"
                                    >
                                        {t(
                                            'documents.upload_id',
                                            'Upload Government ID',
                                        )}{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        ref={governmentIdInputRef}
                                        id="government_id_file"
                                        type="file"
                                        accept="image/jpeg,image/png,application/pdf"
                                        onChange={(e) => {
                                            const file =
                                                e.target.files?.[0] || null;
                                            setData('government_id_file', file);
                                            if (governmentIdInputRef.current) {
                                                governmentIdInputRef.current.value = '';
                                            }
                                        }}
                                        className={`rounded-none shadow-none ${
                                            errors.government_id_file
                                                ? 'border-destructive'
                                                : ''
                                        }`}
                                    />
                                    <p className="text-[11px] text-muted-foreground">
                                        Accepts JPG, PNG, or PDF up to 5MB.
                                        (e.g. PhilID, Passport, Driver's
                                        License, Voter's ID)
                                    </p>

                                    {data.government_id_file && (
                                        <FileAttachmentsPreview
                                            files={[data.government_id_file]}
                                            onRemove={() =>
                                                setData(
                                                    'government_id_file',
                                                    null,
                                                )
                                            }
                                        />
                                    )}

                                    {errors.government_id_file && (
                                        <p className="text-[11px] font-medium text-destructive">
                                            {errors.government_id_file}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Supporting Files Upload */}
                            <div className="space-y-1.5 border-t border-border/50 pt-4">
                                <Label
                                    htmlFor="supporting_files"
                                    className="text-xs font-semibold"
                                >
                                    {t(
                                        'documents.supporting_files',
                                        'Supporting Documents',
                                    )}
                                </Label>
                                <Input
                                    ref={supportingFilesInputRef}
                                    id="supporting_files"
                                    type="file"
                                    multiple
                                    accept="image/jpeg,image/png,application/pdf"
                                    onChange={(e) => {
                                        const newFiles = Array.from(
                                            e.target.files || [],
                                        );
                                        if (newFiles.length > 0) {
                                            setData('supporting_files', [
                                                ...data.supporting_files,
                                                ...newFiles.filter(
                                                    (nf) =>
                                                        !data.supporting_files.some(
                                                            (ef) =>
                                                                ef.name ===
                                                                    nf.name &&
                                                                ef.size ===
                                                                    nf.size &&
                                                                ef.lastModified ===
                                                                    nf.lastModified,
                                                        ),
                                                ),
                                            ]);
                                        }
                                        if (supportingFilesInputRef.current) {
                                            supportingFilesInputRef.current.value =
                                                '';
                                        }
                                    }}
                                    className="rounded-none shadow-none"
                                />
                                <p className="text-[11px] text-muted-foreground">
                                    Upload bills, endorsements, certifications
                                    or other supporting documents if required
                                    (JPG, PNG, or PDF up to 5MB).
                                </p>

                                {data.supporting_files.length > 0 && (
                                    <FileAttachmentsPreview
                                        files={data.supporting_files}
                                        onRemove={(indexToRemove) => {
                                            setData(
                                                'supporting_files',
                                                data.supporting_files.filter(
                                                    (_, idx) =>
                                                        idx !== indexToRemove,
                                                ),
                                            );
                                        }}
                                    />
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notice Card */}
                    <Alert className="rounded-none border border-primary/30 bg-primary/5 shadow-none">
                        <Info className="size-5 text-primary" />
                        <AlertTitle className="text-xs font-bold text-foreground">
                            Processing & Physical Pickup Notice
                        </AlertTitle>
                        <AlertDescription className="mt-1 text-xs text-muted-foreground">
                            • Requests are typically reviewed and processed
                            within 1–2 working days.
                            <br />• Fees ({documentType.formatted_fee}) are
                            settled upon physical pickup at the Barangay Hall.
                            <br />• Official printed and signed documents must
                            be picked up physically by the applicant or
                            authorized representative.
                        </AlertDescription>
                    </Alert>

                    {/* Form Action Buttons */}
                    <div className="flex items-center justify-end gap-3">
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="rounded-none shadow-none"
                        >
                            <Link href="/documents">
                                {t('common.cancel', 'Cancel')}
                            </Link>
                        </Button>
                        <Button
                            type="submit"
                            size="sm"
                            disabled={processing}
                            loading={processing}
                            className="min-w-[140px] rounded-none shadow-none"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                                    {t('documents.submitting', 'Submitting...')}
                                </>
                            ) : (
                                t(
                                    'documents.submit_request',
                                    'Submit Document Request',
                                )
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
