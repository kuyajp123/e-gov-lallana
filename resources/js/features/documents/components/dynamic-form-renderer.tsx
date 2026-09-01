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

export interface FormFieldSchema {
    name: string;
    label: string;
    type: 'text' | 'number' | 'textarea' | 'select';
    required?: boolean;
    placeholder?: string;
    options?: Array<{ value: string; label: string }>;
}

interface DynamicFormRendererProps {
    schema: FormFieldSchema[];
    values: Record<string, any>;
    onChange: (name: string, value: any) => void;
    errors?: Record<string, string>;
    disabled?: boolean;
}

export function DynamicFormRenderer({
    schema = [],
    values = {},
    onChange,
    errors = {},
    disabled = false,
}: DynamicFormRendererProps) {
    if (!schema || schema.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            {schema.map((field) => {
                const error =
                    errors[`submitted_data.${field.name}`] ||
                    errors[field.name];
                const value = values[field.name] ?? '';

                return (
                    <div key={field.name} className="space-y-1.5">
                        <Label
                            htmlFor={`field-${field.name}`}
                            className="text-xs font-semibold"
                        >
                            {field.label}
                            {field.required && (
                                <span className="ml-1 text-destructive">*</span>
                            )}
                        </Label>

                        {field.type === 'textarea' ? (
                            <Textarea
                                id={`field-${field.name}`}
                                value={value}
                                onChange={(e) =>
                                    onChange(field.name, e.target.value)
                                }
                                placeholder={field.placeholder || ''}
                                disabled={disabled}
                                rows={3}
                                className={error ? 'border-destructive' : ''}
                            />
                        ) : field.type === 'number' ? (
                            <Input
                                id={`field-${field.name}`}
                                type="number"
                                value={value}
                                onChange={(e) =>
                                    onChange(field.name, e.target.value)
                                }
                                placeholder={field.placeholder || ''}
                                disabled={disabled}
                                className={error ? 'border-destructive' : ''}
                            />
                        ) : field.type === 'select' && field.options ? (
                            <Select
                                value={value}
                                onValueChange={(val) =>
                                    onChange(field.name, val)
                                }
                                disabled={disabled}
                            >
                                <SelectTrigger
                                    id={`field-${field.name}`}
                                    className={
                                        error ? 'border-destructive' : ''
                                    }
                                >
                                    <SelectValue
                                        placeholder={
                                            field.placeholder || 'Select option'
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {field.options.map((opt) => (
                                        <SelectItem
                                            key={opt.value}
                                            value={opt.value}
                                        >
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : (
                            <Input
                                id={`field-${field.name}`}
                                type="text"
                                value={value}
                                onChange={(e) =>
                                    onChange(field.name, e.target.value)
                                }
                                placeholder={field.placeholder || ''}
                                disabled={disabled}
                                className={error ? 'border-destructive' : ''}
                            />
                        )}

                        {error && (
                            <p className="text-[11px] font-medium text-destructive">
                                {error}
                            </p>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
