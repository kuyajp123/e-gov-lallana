import { Head, Link } from '@inertiajs/react';
import { FileText, Lock } from 'lucide-react';
import type { DocumentTypeItem } from '@/features/documents/components/document-type-card';
import { DocumentTypeCard } from '@/features/documents/components/document-type-card';
import { StatusBadge } from '@/features/documents/components/status-badge';
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
import type { BreadcrumbItem } from '@/shared/types';

interface DocumentRequestItem {
    id: number;
    reference_code: string;
    document_type: {
        id: number;
        name: string;
        slug: string;
    };
    current_status: string;
    status_label: string;
    status_color: string;
    fee_cents: number;
    formatted_fee: string;
    payment_status: string;
    payment_label: string;
    purpose?: string | null;
    submitted_at?: string | null;
    completed_at?: string | null;
}

interface PaginationLink {
    url?: string | null;
    label: string;
    active: boolean;
}

interface DocumentIndexProps {
    documentTypes: DocumentTypeItem[];
    requests: {
        data: DocumentRequestItem[];
        links: PaginationLink[];
        total: number;
    };
    isHouseholdVerified: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Document Requests', href: '/documents' },
];

export default function DocumentIndex({
    documentTypes = [],
    requests,
    isHouseholdVerified = false,
}: DocumentIndexProps) {
    const userRequests = requests?.data || [];

    return (
        <>
            <Head title="Document Requests & Services" />

            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 md:p-8">
                {/* Header Banner */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Barangay Document Services
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Request official barangay clearances, certificates,
                            and indigency documents online.
                        </p>
                    </div>
                </div>

                {/* Verification Notice Banner if Unverified */}
                {!isHouseholdVerified && (
                    <Alert className="rounded-2xl border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200">
                        <Lock className="size-5 text-amber-600 dark:text-amber-400" />
                        <div className="flex w-full flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            <div>
                                <AlertTitle className="font-semibold text-amber-950 dark:text-amber-100">
                                    Household Verification Required
                                </AlertTitle>
                                <AlertDescription className="mt-1 text-xs text-amber-800 dark:text-amber-300">
                                    To maintain official barangay record
                                    integrity, you must belong to an approved
                                    and verified household before submitting
                                    document requests.
                                </AlertDescription>
                            </div>
                            <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="shrink-0 border-amber-600/30 bg-background text-foreground hover:bg-muted"
                            >
                                <Link href="/household">
                                    Check Household Status →
                                </Link>
                            </Button>
                        </div>
                    </Alert>
                )}

                {/* Available Document Types Catalog */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-bold tracking-tight text-foreground">
                                Available Document Types
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                Select a document to start a new request.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {documentTypes.map((docType) => (
                            <DocumentTypeCard
                                key={docType.id}
                                documentType={docType}
                                isHouseholdVerified={isHouseholdVerified}
                            />
                        ))}
                    </div>
                </div>

                {/* My Requests History Table */}
                <Card className="rounded-2xl border-border">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-base font-bold">
                                    <FileText className="size-4 text-primary" />
                                    My Document Requests ({requests?.total || 0}
                                    )
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Track the real-time processing and pickup
                                    status of your submitted requests.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        {userRequests.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-border/60 text-muted-foreground">
                                            <th className="py-3 font-semibold">
                                                Reference Code
                                            </th>
                                            <th className="py-3 font-semibold">
                                                Document Type
                                            </th>
                                            <th className="py-3 font-semibold">
                                                Status
                                            </th>
                                            <th className="py-3 font-semibold">
                                                Fee
                                            </th>
                                            <th className="py-3 font-semibold">
                                                Payment
                                            </th>
                                            <th className="py-3 font-semibold">
                                                Submitted
                                            </th>
                                            <th className="py-3 text-right font-semibold">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40">
                                        {userRequests.map((req) => (
                                            <tr
                                                key={req.id}
                                                className="transition-colors hover:bg-muted/30"
                                            >
                                                <td className="py-3 font-bold text-primary">
                                                    <Link
                                                        href={`/documents/${req.id}`}
                                                        className="hover:underline"
                                                    >
                                                        {req.reference_code}
                                                    </Link>
                                                </td>
                                                <td className="py-3 font-medium text-foreground">
                                                    {req.document_type.name}
                                                </td>
                                                <td className="py-3">
                                                    <StatusBadge
                                                        status={
                                                            req.current_status
                                                        }
                                                        label={req.status_label}
                                                    />
                                                </td>
                                                <td className="py-3 text-muted-foreground">
                                                    {req.formatted_fee}
                                                </td>
                                                <td className="py-3">
                                                    <Badge
                                                        variant="outline"
                                                        className="text-[10px] capitalize"
                                                    >
                                                        {req.payment_label}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 text-muted-foreground">
                                                    {req.submitted_at
                                                        ? new Date(
                                                              req.submitted_at,
                                                          ).toLocaleDateString(
                                                              [],
                                                              {
                                                                  month: 'short',
                                                                  day: 'numeric',
                                                                  year: 'numeric',
                                                              },
                                                          )
                                                        : '—'}
                                                </td>
                                                <td className="py-3 text-right">
                                                    <Button
                                                        asChild
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-7 text-xs"
                                                    >
                                                        <Link
                                                            href={`/documents/${req.id}`}
                                                        >
                                                            View Details
                                                        </Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Pagination */}
                                {requests.links &&
                                    requests.links.length > 3 && (
                                        <div className="mt-4 flex items-center justify-end gap-1">
                                            {requests.links.map((link, i) => (
                                                <Button
                                                    key={i}
                                                    asChild={!!link.url}
                                                    disabled={!link.url}
                                                    variant={
                                                        link.active
                                                            ? 'default'
                                                            : 'outline'
                                                    }
                                                    size="sm"
                                                    className="h-7 text-xs"
                                                >
                                                    {link.url ? (
                                                        <Link
                                                            href={link.url}
                                                            dangerouslySetInnerHTML={{
                                                                __html: link.label,
                                                            }}
                                                        />
                                                    ) : (
                                                        <span
                                                            dangerouslySetInnerHTML={{
                                                                __html: link.label,
                                                            }}
                                                        />
                                                    )}
                                                </Button>
                                            ))}
                                        </div>
                                    )}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed border-border/80 p-8 text-center">
                                <FileText className="mx-auto size-8 text-muted-foreground/50" />
                                <p className="mt-2 text-xs font-semibold text-foreground">
                                    No document requests yet
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Select any available document type above to
                                    submit your first request.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

DocumentIndex.layout = {
    breadcrumbs,
};
