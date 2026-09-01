import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, RotateCcw } from 'lucide-react';
import type { DocumentTypeItem } from '@/features/documents/components/document-type-card';
import { DynamicFormRenderer } from '@/features/documents/components/dynamic-form-renderer';
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
import { Textarea } from '@/shared/components/ui/textarea';

interface DocumentEditProps {
    documentRequest: {
        id: number;
        reference_code: string;
        current_status: string;
        purpose: string;
        submitted_data: Record<string, any>;
        return_remarks: string;
        document_type: DocumentTypeItem;
    };
}

export default function DocumentEdit({ documentRequest }: DocumentEditProps) {
    const { data, setData, put, processing, errors } = useForm<{
        purpose: string;
        submitted_data: Record<string, any>;
        government_id_file: File | null;
        supporting_files: File[];
    }>({
        purpose: documentRequest.purpose || '',
        submitted_data: documentRequest.submitted_data || {},
        government_id_file: null,
        supporting_files: [],
    });

    const handleDynamicFieldChange = (fieldName: string, value: any) => {
        setData('submitted_data', {
            ...data.submitted_data,
            [fieldName]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/documents/${documentRequest.id}`, {
            // Note: Inertia method spoofing for file uploads handled via PUT
        });
    };

    return (
        <>
            <Head title={`Correct Request ${documentRequest.reference_code}`} />

            <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 p-4 md:p-8">
                {/* Back button & Header */}
                <div className="flex items-center gap-3">
                    <Button
                        asChild
                        variant="outline"
                        size="icon"
                        className="size-9 rounded-xl"
                    >
                        <Link href={`/documents/${documentRequest.id}`}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-foreground">
                            Correct & Resubmit Request
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            Reference:{' '}
                            <span className="font-semibold text-foreground">
                                {documentRequest.reference_code}
                            </span>{' '}
                            • {documentRequest.document_type.name}
                        </p>
                    </div>
                </div>

                {/* Reviewer Remarks Alert Banner */}
                <Alert className="rounded-2xl border-amber-500/40 bg-amber-500/10 text-amber-950 dark:text-amber-100">
                    <RotateCcw className="size-5 text-amber-600 dark:text-amber-400" />
                    <div>
                        <AlertTitle className="font-bold">
                            Barangay Admin Remarks:
                        </AlertTitle>
                        <AlertDescription className="mt-1 text-xs text-amber-900 dark:text-amber-200">
                            {documentRequest.return_remarks}
                        </AlertDescription>
                    </div>
                </Alert>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Step 1: Correct Purpose & Dynamic Form fields */}
                    <Card className="rounded-2xl border-border">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-bold">
                                1. Correct Request Information
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Update the request purpose or specific form
                                answers.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-0">
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="purpose"
                                    className="text-xs font-semibold"
                                >
                                    Purpose of Request{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Textarea
                                    id="purpose"
                                    value={data.purpose}
                                    onChange={(e) =>
                                        setData('purpose', e.target.value)
                                    }
                                    rows={3}
                                    className={
                                        errors.purpose
                                            ? 'border-destructive'
                                            : ''
                                    }
                                />
                                {errors.purpose && (
                                    <p className="text-[11px] font-medium text-destructive">
                                        {errors.purpose}
                                    </p>
                                )}
                            </div>

                            {/* Dynamic Fields */}
                            {documentRequest.document_type.form_schema &&
                                documentRequest.document_type.form_schema
                                    .length > 0 && (
                                    <div className="border-t border-border/50 pt-4">
                                        <DynamicFormRenderer
                                            schema={
                                                documentRequest.document_type
                                                    .form_schema
                                            }
                                            values={data.submitted_data}
                                            onChange={handleDynamicFieldChange}
                                            errors={errors}
                                        />
                                    </div>
                                )}
                        </CardContent>
                    </Card>

                    {/* Step 2: Upload Replacement Documents if needed */}
                    <Card className="rounded-2xl border-border">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-bold">
                                2. Updated Document Attachments (Optional)
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Upload a replacement Government ID or additional
                                supporting documents if requested.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-0">
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="government_id_file"
                                    className="text-xs font-semibold"
                                >
                                    Replacement Government ID (Leave empty to
                                    keep existing)
                                </Label>
                                <Input
                                    id="government_id_file"
                                    type="file"
                                    accept="image/jpeg,image/png,application/pdf"
                                    onChange={(e) => {
                                        const file =
                                            e.target.files?.[0] || null;
                                        setData('government_id_file', file);
                                    }}
                                />
                                {errors.government_id_file && (
                                    <p className="text-[11px] font-medium text-destructive">
                                        {errors.government_id_file}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5 border-t border-border/50 pt-4">
                                <Label
                                    htmlFor="supporting_files"
                                    className="text-xs font-semibold"
                                >
                                    Additional Supporting Files
                                </Label>
                                <Input
                                    id="supporting_files"
                                    type="file"
                                    multiple
                                    accept="image/jpeg,image/png,application/pdf"
                                    onChange={(e) => {
                                        const files = Array.from(
                                            e.target.files || [],
                                        );
                                        setData('supporting_files', files);
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3">
                        <Button asChild variant="outline" size="sm">
                            <Link href={`/documents/${documentRequest.id}`}>
                                Cancel
                            </Link>
                        </Button>
                        <Button
                            type="submit"
                            size="sm"
                            disabled={processing}
                            className="min-w-[140px] bg-primary"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                                    Resubmitting...
                                </>
                            ) : (
                                'Resubmit Request'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
