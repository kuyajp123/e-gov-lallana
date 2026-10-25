import {
    Eye,
    FileText,
    Image as ImageIcon,
    UploadCloud,
    X,
    ZoomIn,
} from 'lucide-react';
import React, { useRef, useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';
import { useTranslation } from '@/shared/hooks/use-translation';

interface IdUploadDropzoneProps {
    onFileSelect: (file: File | null) => void;
    currentFileUrl?: string | null;
    error?: string;
}

export function IdUploadDropzone({
    onFileSelect,
    currentFileUrl,
    error,
}: IdUploadDropzoneProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageError, setImageError] = useState(false);
    const { t } = useTranslation();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;

        if (file) {
            setSelectedFile(file);
            onFileSelect(file);
            setImageError(false);

            if (file.type.startsWith('image/')) {
                setPreviewUrl(URL.createObjectURL(file));
            } else {
                setPreviewUrl(null);
            }
        }
    };

    const handleRemove = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        onFileSelect(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const activeUrl = previewUrl || currentFileUrl || null;
    const isPdf = Boolean(
        selectedFile?.type.includes('pdf') ||
        (!selectedFile &&
            currentFileUrl &&
            currentFileUrl.toLowerCase().split('?')[0].endsWith('.pdf')),
    );

    return (
        <div className="space-y-3">
            <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.pdf"
                className="hidden"
                onChange={handleFileChange}
            />

            {!selectedFile && !currentFileUrl ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-none border border-dashed border-border/80 bg-muted/30 p-6 text-center transition-colors hover:border-primary/50 hover:bg-muted/60"
                >
                    <div className="mb-3 rounded-none bg-primary/10 p-3 text-primary">
                        <UploadCloud className="size-6" />
                    </div>
                    <p className="text-sm font-medium text-foreground">
                        {t(
                            'profile.upload_id_prompt',
                            'Click to upload or drag & drop image',
                        )}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {t(
                            'profile.upload_id_formats',
                            'Accepted formats: JPG, PNG, WebP, PDF (Max 5MB)',
                        )}
                    </p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-none border border-border bg-card">
                    {/* Control Bar */}
                    <div className="flex items-center justify-between border-b border-border/70 p-3 sm:px-4">
                        <div className="flex items-center gap-2.5">
                            <div className="flex size-8 items-center justify-center rounded-none bg-primary/10 text-primary">
                                {isPdf ? (
                                    <FileText className="size-4" />
                                ) : (
                                    <ImageIcon className="size-4" />
                                )}
                            </div>
                            <div className="max-w-[200px] sm:max-w-xs">
                                <p className="truncate text-xs font-semibold text-foreground sm:text-sm">
                                    {selectedFile?.name ||
                                        t(
                                            'profile.attached_id',
                                            'Attached Government ID',
                                        )}
                                </p>
                                {selectedFile && (
                                    <p className="text-[11px] text-muted-foreground">
                                        {(
                                            selectedFile.size /
                                            1024 /
                                            1024
                                        ).toFixed(2)}{' '}
                                        MB
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8 rounded-none text-xs shadow-none"
                                onClick={() => {
                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = '';
                                    }

                                    fileInputRef.current?.click();
                                }}
                            >
                                {t('profile.replace_id', 'Replace')}
                            </Button>
                            {selectedFile && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleRemove}
                                    className="h-8 rounded-none px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                >
                                    <X className="size-4" />
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Immediate Image / PDF Display */}
                    {activeUrl &&
                        (isPdf ? (
                            <div className="flex flex-col items-center justify-center gap-2 bg-neutral-950/5 p-6 text-center dark:bg-neutral-950/30">
                                <FileText className="size-12 text-primary/70" />
                                <p className="text-xs font-medium text-foreground">
                                    PDF Document Attached
                                </p>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsModalOpen(true)}
                                    className="mt-1 inline-flex items-center gap-1.5 rounded-none text-xs shadow-none"
                                >
                                    <Eye className="size-3.5" />
                                    <span>Preview Document</span>
                                </Button>
                            </div>
                        ) : imageError ? (
                            <div className="flex flex-col items-center justify-center gap-2 bg-neutral-950/5 p-6 text-center dark:bg-neutral-950/30">
                                <ImageIcon className="size-8 text-muted-foreground/60" />
                                <p className="text-xs text-muted-foreground">
                                    Preview not available
                                </p>
                            </div>
                        ) : (
                            <div
                                onClick={() => setIsModalOpen(true)}
                                className="group relative flex max-h-72 cursor-pointer items-center justify-center bg-neutral-950/5 p-3 transition-colors hover:bg-neutral-950/10 dark:bg-neutral-950/30 dark:hover:bg-neutral-950/40"
                            >
                                <img
                                    src={activeUrl}
                                    alt="Attached Government ID"
                                    onError={() => setImageError(true)}
                                    className="max-h-64 w-auto max-w-full object-contain transition-transform duration-200 group-hover:scale-[1.01]"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 backdrop-blur-[1px] transition-opacity duration-200 group-hover:opacity-100">
                                    <span className="inline-flex items-center gap-1.5 rounded-none bg-background/95 px-3 py-1.5 text-xs font-semibold text-foreground shadow-md">
                                        <ZoomIn className="size-3.5" />
                                        Click for full view
                                    </span>
                                </div>
                            </div>
                        ))}
                </div>
            )}

            {/* Full-view Modal Dialog */}
            {activeUrl && (
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="max-w-4xl rounded-none p-4 sm:p-6">
                        <DialogHeader className="border-b border-border pb-3 text-left">
                            <DialogTitle className="text-base font-bold">
                                {selectedFile?.name ||
                                    t(
                                        'profile.attached_id',
                                        'Attached Government ID',
                                    )}
                            </DialogTitle>
                            <DialogDescription className="text-xs">
                                Official valid government-issued identification
                                document.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex max-h-[75vh] w-full items-center justify-center overflow-auto rounded-none border border-border bg-neutral-950/5 p-2 dark:bg-neutral-950/40">
                            {isPdf ? (
                                <iframe
                                    src={activeUrl}
                                    title="PDF Document Preview"
                                    className="h-[65vh] w-full rounded-none border-0"
                                />
                            ) : (
                                <img
                                    src={activeUrl}
                                    alt="Government ID Full View"
                                    className="max-h-[70vh] w-auto max-w-full object-contain select-none"
                                />
                            )}
                        </div>

                        <div className="flex items-center justify-end pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsModalOpen(false)}
                                className="rounded-none shadow-none"
                            >
                                Close
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}
