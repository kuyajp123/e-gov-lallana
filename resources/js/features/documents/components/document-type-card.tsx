import { Link } from '@inertiajs/react';
import { ArrowRight, CheckCircle2, FileText, Lock } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card';
import { useTranslation } from '@/shared/hooks/use-translation';

export interface DocumentTypeItem {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    fee_cents: number;
    formatted_fee: string;
    requirements?: string[];
    form_schema?: any[];
}

interface DocumentTypeCardProps {
    documentType: DocumentTypeItem;
    isHouseholdVerified: boolean;
}

export function DocumentTypeCard({
    documentType,
    isHouseholdVerified,
}: DocumentTypeCardProps) {
    const { t } = useTranslation();

    return (
        <Card className="flex flex-col justify-between rounded-none border border-border bg-card shadow-none transition-all">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex size-10 items-center justify-center rounded-none bg-primary/10 text-primary">
                        <FileText className="size-5" />
                    </div>
                    <Badge
                        variant={
                            documentType.fee_cents === 0
                                ? 'secondary'
                                : 'outline'
                        }
                        className={`rounded-none text-xs font-bold shadow-none ${
                            documentType.fee_cents === 0
                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                                : 'border-primary/30 text-primary'
                        }`}
                    >
                        {documentType.formatted_fee}
                    </Badge>
                </div>
                <CardTitle className="mt-3 text-base font-bold">
                    {documentType.name}
                </CardTitle>
                {documentType.description && (
                    <CardDescription className="line-clamp-2 text-xs">
                        {documentType.description}
                    </CardDescription>
                )}
            </CardHeader>

            <CardContent className="space-y-3 pt-0">
                {documentType.requirements &&
                    documentType.requirements.length > 0 && (
                        <div className="rounded-none bg-muted/40 p-3">
                            <p className="text-[11px] font-semibold text-muted-foreground">
                                {t(
                                    'documents.required_documents',
                                    'Required Documents:',
                                )}
                            </p>
                            <ul className="mt-1.5 space-y-1">
                                {documentType.requirements.map((req, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-start gap-1.5 text-xs text-foreground/80"
                                    >
                                        <CheckCircle2 className="mt-0.5 size-3 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                        <span>{req}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
            </CardContent>

            <CardFooter className="pt-2">
                {isHouseholdVerified ? (
                    <Button
                        asChild
                        className="w-full rounded-none shadow-none"
                        size="sm"
                    >
                        <Link href={`/documents/create/${documentType.slug}`}>
                            <span>
                                {t(
                                    'documents.request_document',
                                    'Request Document',
                                )}
                            </span>
                            <ArrowRight className="ml-1.5 size-3.5" />
                        </Link>
                    </Button>
                ) : (
                    <Button
                        variant="secondary"
                        disabled
                        className="w-full rounded-none text-xs shadow-none"
                        size="sm"
                    >
                        <Lock className="mr-1.5 size-3.5" />
                        {t(
                            'documents.verification_required',
                            'Verified Household Required',
                        )}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
