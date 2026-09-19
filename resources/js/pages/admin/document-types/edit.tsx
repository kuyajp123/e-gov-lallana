import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Check, Plus, X } from 'lucide-react';
import React, { useState } from 'react';
import { FormSchemaBuilder } from '@/features/admin/document-types/components/form-schema-builder';
import type { FormSchemaField } from '@/features/admin/document-types/components/form-schema-builder';
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

interface DocumentTypeEditProps {
    documentType: {
        id: number;
        name: string;
        slug: string;
        description: string | null;
        fee_cents: number;
        fee_pesos: string;
        requirements: string[];
        form_schema: FormSchemaField[];
        is_active: boolean;
        document_requests_count: number;
    };
}

export default function DocumentTypeEdit({
    documentType,
}: DocumentTypeEditProps) {
    const [requirementInput, setRequirementInput] = useState('');

    const { data, setData, put, processing, errors } = useForm({
        name: documentType.name,
        slug: documentType.slug,
        fee_pesos: documentType.fee_pesos,
        fee_cents: documentType.fee_cents,
        description: documentType.description || '',
        requirements: documentType.requirements || [],
        form_schema: documentType.form_schema || [],
        is_active: documentType.is_active,
    });

    const handleFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        const numeric = parseFloat(val) || 0;
        setData((prev) => ({
            ...prev,
            fee_pesos: val,
            fee_cents: Math.round(numeric * 100),
        }));
    };

    const handleAddRequirement = () => {
        const trimmed = requirementInput.trim();

        if (!trimmed || data.requirements.includes(trimmed)) {
            return;
        }

        setData('requirements', [...data.requirements, trimmed]);
        setRequirementInput('');
    };

    const handleRemoveRequirement = (idx: number) => {
        setData(
            'requirements',
            data.requirements.filter((_, i) => i !== idx),
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/document-types/${documentType.id}`);
    };

    return (
        <>
            <Head title={`Edit ${documentType.name} | Admin Console`} />

            <div className="mx-auto w-full max-w-5xl space-y-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            asChild
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                        >
                            <Link href="/admin/document-types">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                                    Edit {documentType.name}
                                </h1>
                                <Badge
                                    variant={
                                        data.is_active ? 'default' : 'secondary'
                                    }
                                    className="text-[11px]"
                                >
                                    {data.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                            </div>
                            <p className="font-mono text-xs text-muted-foreground">
                                /{documentType.slug} •{' '}
                                {documentType.document_requests_count}{' '}
                                applications processed
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information Card */}
                    <Card className="border-border/70 shadow-xs">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base font-semibold text-foreground">
                                Document Basic Information
                            </CardTitle>
                            <CardDescription className="text-xs text-muted-foreground">
                                Primary identifiers, pricing, and citizen
                                description.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="name"
                                        className="text-xs font-medium"
                                    >
                                        Document Name{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. Barangay Clearance"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        className="h-9 text-xs"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-[11px] text-destructive">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="slug"
                                        className="text-xs font-medium"
                                    >
                                        URL Slug{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="slug"
                                        placeholder="e.g. barangay-clearance"
                                        value={data.slug}
                                        onChange={(e) =>
                                            setData('slug', e.target.value)
                                        }
                                        className="h-9 font-mono text-xs"
                                        required
                                    />
                                    {errors.slug && (
                                        <p className="text-[11px] text-destructive">
                                            {errors.slug}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="fee_pesos"
                                        className="text-xs font-medium"
                                    >
                                        Processing Fee (in Philippine Pesos ₱){' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute top-2.5 left-3 text-xs font-semibold text-muted-foreground">
                                            ₱
                                        </span>
                                        <Input
                                            id="fee_pesos"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            placeholder="0.00"
                                            value={data.fee_pesos}
                                            onChange={handleFeeChange}
                                            className="h-9 pl-7 text-xs font-semibold"
                                            required
                                        />
                                    </div>
                                    <p className="text-[11px] text-muted-foreground">
                                        Enter 0.00 for free services. Current
                                        centavos value: {data.fee_cents}.
                                    </p>
                                    {errors.fee_cents && (
                                        <p className="text-[11px] text-destructive">
                                            {errors.fee_cents}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col justify-center rounded-xl border border-border/70 bg-muted/20 p-3.5">
                                    <div className="flex items-center gap-2.5">
                                        <Checkbox
                                            id="is_active"
                                            checked={data.is_active}
                                            onCheckedChange={(checked) =>
                                                setData(
                                                    'is_active',
                                                    Boolean(checked),
                                                )
                                            }
                                        />
                                        <div>
                                            <Label
                                                htmlFor="is_active"
                                                className="cursor-pointer text-xs font-semibold text-foreground"
                                            >
                                                Active & Available to Citizens
                                            </Label>
                                            <p className="text-[11px] text-muted-foreground">
                                                When unchecked, residents cannot
                                                apply for this document.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="description"
                                    className="text-xs font-medium"
                                >
                                    Description & Purpose
                                </Label>
                                <Textarea
                                    id="description"
                                    placeholder="Explain the purpose, validity period, or typical use-cases of this barangay document..."
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    rows={3}
                                    className="text-xs"
                                />
                                {errors.description && (
                                    <p className="text-[11px] text-destructive">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            {/* Required Supporting Documents Checklist */}
                            <div className="space-y-2 border-t border-border/70 pt-2">
                                <Label className="text-xs font-medium">
                                    Required Supporting Documents Checklist
                                </Label>
                                <p className="text-[11px] text-muted-foreground">
                                    Items the resident must present upon
                                    claiming or attach during online
                                    application.
                                </p>

                                <div className="flex items-center gap-2">
                                    <Input
                                        placeholder="Add required document..."
                                        value={requirementInput}
                                        onChange={(e) =>
                                            setRequirementInput(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddRequirement();
                                            }
                                        }}
                                        className="h-8 max-w-md text-xs"
                                    />
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        onClick={handleAddRequirement}
                                        className="h-8 gap-1 text-xs"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        Add
                                    </Button>
                                </div>

                                {data.requirements.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {data.requirements.map((req, idx) => (
                                            <Badge
                                                key={idx}
                                                variant="secondary"
                                                className="gap-1.5 border border-border py-1 pr-1 pl-2.5 text-xs"
                                            >
                                                {req}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemoveRequirement(
                                                            idx,
                                                        )
                                                    }
                                                    className="rounded-full p-0.5 text-muted-foreground hover:bg-muted-foreground/20 hover:text-foreground"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dynamic Questionnaire Form Builder */}
                    <FormSchemaBuilder
                        fields={data.form_schema}
                        onChange={(fields) => setData('form_schema', fields)}
                    />

                    {/* Form Submit Bar */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button asChild variant="outline" size="sm">
                            <Link href="/admin/document-types">Cancel</Link>
                        </Button>
                        <Button
                            type="submit"
                            size="sm"
                            disabled={processing}
                            className="gap-1.5 shadow-xs"
                        >
                            <Check className="h-4 w-4" />
                            {processing ? 'Saving...' : 'Update Document Type'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
