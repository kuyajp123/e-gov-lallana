import { Eye, EyeOff, GripVertical, Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';

export interface FormSchemaField {
    name: string;
    label: string;
    type: 'text' | 'number' | 'textarea';
    placeholder?: string;
    required: boolean;
}

interface FormSchemaBuilderProps {
    fields: FormSchemaField[];
    onChange: (fields: FormSchemaField[]) => void;
    error?: string;
}

export function FormSchemaBuilder({
    fields,
    onChange,
    error,
}: FormSchemaBuilderProps) {
    const [showPreview, setShowPreview] = useState(false);

    const handleAddField = () => {
        const newField: FormSchemaField = {
            name: `custom_field_${fields.length + 1}`,
            label: `New Field ${fields.length + 1}`,
            type: 'text',
            placeholder: '',
            required: true,
        };
        onChange([...fields, newField]);
    };

    const handleUpdateField = (
        index: number,
        updated: Partial<FormSchemaField>,
    ) => {
        const newFields = [...fields];
        newFields[index] = { ...newFields[index], ...updated };

        // Auto-slugify name if label changed and name was default
        if (updated.label && !newFields[index].name.includes('_edited')) {
            const slugified = updated.label
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '_')
                .replace(/^_+|_+$/g, '');

            if (slugified) {
                newFields[index].name = slugified;
            }
        }

        onChange(newFields);
    };

    const handleRemoveField = (index: number) => {
        onChange(fields.filter((_, i) => i !== index));
    };

    const handleMoveField = (index: number, direction: 'up' | 'down') => {
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= fields.length) {
            return;
        }

        const newFields = [...fields];
        const [moved] = newFields.splice(index, 1);
        newFields.splice(targetIndex, 0, moved);
        onChange(newFields);
    };

    return (
        <Card className="border-border/70 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                    <CardTitle className="text-base font-semibold text-foreground">
                        Dynamic Form Schema (Extra Questions)
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                        Configure additional inputs or questions required from
                        residents when requesting this document.
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPreview(!showPreview)}
                        className="h-8 gap-1.5 text-xs"
                    >
                        {showPreview ? (
                            <>
                                <EyeOff className="h-3.5 w-3.5" />
                                Hide Preview
                            </>
                        ) : (
                            <>
                                <Eye className="h-3.5 w-3.5" />
                                Live Preview
                            </>
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={handleAddField}
                        className="h-8 gap-1.5 text-xs"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Add Question
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-0">
                {error && (
                    <p className="text-xs font-medium text-destructive">
                        {error}
                    </p>
                )}

                {showPreview && (
                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                        <div className="mb-3 flex items-center justify-between border-b border-primary/10 pb-2">
                            <span className="text-xs font-semibold tracking-wider text-primary uppercase">
                                Resident Perspective Preview
                            </span>
                            <Badge variant="outline" className="text-[10px]">
                                Interactive Mockup
                            </Badge>
                        </div>
                        {fields.length === 0 ? (
                            <p className="py-4 text-center text-xs text-muted-foreground italic">
                                No custom fields configured yet. Click "Add
                                Question" above to add requirements.
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {fields.map((f, i) => (
                                    <div
                                        key={i}
                                        className={
                                            f.type === 'textarea'
                                                ? 'sm:col-span-2'
                                                : ''
                                        }
                                    >
                                        <Label className="text-xs font-medium">
                                            {f.label || `Field ${i + 1}`}
                                            {f.required && (
                                                <span className="ml-0.5 text-destructive">
                                                    *
                                                </span>
                                            )}
                                        </Label>
                                        {f.type === 'textarea' ? (
                                            <Textarea
                                                placeholder={
                                                    f.placeholder ||
                                                    'Enter details...'
                                                }
                                                className="mt-1.5 text-xs"
                                                rows={3}
                                                disabled
                                            />
                                        ) : (
                                            <Input
                                                type={
                                                    f.type === 'number'
                                                        ? 'number'
                                                        : 'text'
                                                }
                                                placeholder={
                                                    f.placeholder ||
                                                    'Enter value...'
                                                }
                                                className="mt-1.5 h-8 text-xs"
                                                disabled
                                            />
                                        )}
                                        <span className="mt-1 block text-[10px] text-muted-foreground">
                                            Key:{' '}
                                            <code className="text-primary">
                                                {f.name}
                                            </code>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {fields.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-8 text-center">
                        <p className="text-xs text-muted-foreground">
                            No additional questions for this document type.
                        </p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground/80">
                            Standard applicant details (Name, Address, Purpose)
                            are collected by default.
                        </p>
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={handleAddField}
                            className="mt-3 h-8 gap-1.5 text-xs"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Add Custom Field
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {fields.map((field, index) => (
                            <div
                                key={index}
                                className="group relative rounded-xl border border-border bg-card p-3.5 shadow-2xs transition-colors hover:border-primary/40"
                            >
                                <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-12">
                                    <div className="hidden items-center justify-center pt-2 text-muted-foreground/50 sm:col-span-1 sm:flex">
                                        <GripVertical className="h-4 w-4" />
                                    </div>

                                    <div className="space-y-1.5 sm:col-span-4">
                                        <Label className="text-[11px] font-medium text-muted-foreground">
                                            Field Label (Shown to Citizen)
                                        </Label>
                                        <Input
                                            value={field.label}
                                            onChange={(e) =>
                                                handleUpdateField(index, {
                                                    label: e.target.value,
                                                })
                                            }
                                            placeholder="e.g. Purpose of Request"
                                            className="h-8 text-xs"
                                        />
                                    </div>

                                    <div className="space-y-1.5 sm:col-span-3">
                                        <Label className="text-[11px] font-medium text-muted-foreground">
                                            Field Key (snake_case)
                                        </Label>
                                        <Input
                                            value={field.name}
                                            onChange={(e) =>
                                                handleUpdateField(index, {
                                                    name: e.target.value
                                                        .toLowerCase()
                                                        .replace(
                                                            /[^a-z0-9_]/g,
                                                            '',
                                                        ),
                                                })
                                            }
                                            placeholder="e.g. ctc_number"
                                            className="h-8 font-mono text-xs"
                                        />
                                    </div>

                                    <div className="space-y-1.5 sm:col-span-2">
                                        <Label className="text-[11px] font-medium text-muted-foreground">
                                            Input Type
                                        </Label>
                                        <Select
                                            value={field.type}
                                            onValueChange={(
                                                val:
                                                    | 'text'
                                                    | 'number'
                                                    | 'textarea',
                                            ) =>
                                                handleUpdateField(index, {
                                                    type: val,
                                                })
                                            }
                                        >
                                            <SelectTrigger className="h-8 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem
                                                    value="text"
                                                    className="text-xs"
                                                >
                                                    Short Text
                                                </SelectItem>
                                                <SelectItem
                                                    value="number"
                                                    className="text-xs"
                                                >
                                                    Number
                                                </SelectItem>
                                                <SelectItem
                                                    value="textarea"
                                                    className="text-xs"
                                                >
                                                    Textarea
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex items-center justify-end gap-1 pt-6 sm:col-span-2 sm:pt-6">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                            disabled={index === 0}
                                            onClick={() =>
                                                handleMoveField(index, 'up')
                                            }
                                            title="Move Up"
                                        >
                                            ↑
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                            disabled={
                                                index === fields.length - 1
                                            }
                                            onClick={() =>
                                                handleMoveField(index, 'down')
                                            }
                                            title="Move Down"
                                        >
                                            ↓
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-destructive/80 hover:bg-destructive/10 hover:text-destructive"
                                            onClick={() =>
                                                handleRemoveField(index)
                                            }
                                            title="Delete Field"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 pt-1 sm:col-span-12 sm:col-start-2 sm:grid-cols-2">
                                        <div>
                                            <Label className="text-[10px] text-muted-foreground">
                                                Placeholder / Hint Text
                                                (Optional)
                                            </Label>
                                            <Input
                                                value={field.placeholder || ''}
                                                onChange={(e) =>
                                                    handleUpdateField(index, {
                                                        placeholder:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="e.g. Enter registered trade name..."
                                                className="h-7 text-[11px]"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 pt-4">
                                            <Checkbox
                                                id={`required-${index}`}
                                                checked={field.required}
                                                onCheckedChange={(checked) =>
                                                    handleUpdateField(index, {
                                                        required:
                                                            Boolean(checked),
                                                    })
                                                }
                                            />
                                            <Label
                                                htmlFor={`required-${index}`}
                                                className="cursor-pointer text-xs font-normal text-foreground"
                                            >
                                                Mandatory Field (Resident must
                                                fill this out)
                                            </Label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
