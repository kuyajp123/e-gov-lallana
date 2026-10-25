import { Eye, FileText, X, ZoomIn } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';

interface FileAttachmentsPreviewProps {
    files: File[];
    onRemove: (index: number) => void;
    className?: string;
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024) {
        return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function FileAttachmentsPreview({
    files,
    onRemove,
    className = '',
}: FileAttachmentsPreviewProps) {
    const [previewUrls, setPreviewUrls] = useState<Record<number, string>>({});
    const [selectedImage, setSelectedImage] = useState<{
        url: string;
        name: string;
    } | null>(null);

    useEffect(() => {
        const urls: Record<number, string> = {};
        files.forEach((file, index) => {
            if (file.type.startsWith('image/')) {
                urls[index] = URL.createObjectURL(file);
            }
        });
        setPreviewUrls(urls);

        return () => {
            Object.values(urls).forEach((url) => URL.revokeObjectURL(url));
        };
    }, [files]);

    if (!files || files.length === 0) {
        return null;
    }

    return (
        <div className={`space-y-2 pt-1 ${className}`}>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {files.map((file, index) => {
                    const isImage = file.type.startsWith('image/');
                    const previewUrl = previewUrls[index];

                    return (
                        <div
                            key={`${file.name}-${file.size}-${index}`}
                            className="flex items-center justify-between gap-3 border border-border bg-card p-2 sm:p-2.5 transition-colors hover:border-border/80"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                {isImage && previewUrl ? (
                                    <div
                                        onClick={() =>
                                            setSelectedImage({
                                                url: previewUrl,
                                                name: file.name,
                                            })
                                        }
                                        className="group relative size-14 shrink-0 cursor-pointer overflow-hidden border border-border bg-muted/30"
                                        title="Click to view full image"
                                    >
                                        <img
                                            src={previewUrl}
                                            alt={file.name}
                                            className="size-full object-cover transition-transform duration-150 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                                            <ZoomIn className="size-4 text-white" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex size-14 shrink-0 items-center justify-center border border-border bg-rose-500/10 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">
                                        <FileText className="size-6" />
                                    </div>
                                )}

                                <div className="min-w-0 flex-1 space-y-0.5">
                                    <p
                                        className="truncate text-xs font-semibold text-foreground"
                                        title={file.name}
                                    >
                                        {file.name}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">
                                        {formatFileSize(file.size)} •{' '}
                                        {isImage ? 'Image' : 'PDF Document'}
                                    </p>
                                    {isImage && previewUrl && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSelectedImage({
                                                    url: previewUrl,
                                                    name: file.name,
                                                })
                                            }
                                            className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                                        >
                                            <Eye className="size-3" />
                                            <span>Full view</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => onRemove(index)}
                                className="size-8 shrink-0 rounded-none text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                title={`Remove ${file.name}`}
                            >
                                <X className="size-4" />
                                <span className="sr-only">
                                    Remove {file.name}
                                </span>
                            </Button>
                        </div>
                    );
                })}
            </div>

            {/* Modal Dialog for Full View Image */}
            <Dialog
                open={selectedImage !== null}
                onOpenChange={(open) => !open && setSelectedImage(null)}
            >
                <DialogContent className="max-w-4xl rounded-none p-4 sm:p-6">
                    <DialogHeader className="border-b border-border pb-3 text-left">
                        <DialogTitle className="truncate text-base font-bold">
                            {selectedImage?.name}
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Uploaded Document Preview
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex max-h-[75vh] w-full items-center justify-center overflow-auto rounded-none border border-border bg-neutral-950/5 p-2 dark:bg-neutral-950/40">
                        {selectedImage && (
                            <img
                                src={selectedImage.url}
                                alt={selectedImage.name}
                                className="max-h-[70vh] w-auto max-w-full select-none object-contain"
                            />
                        )}
                    </div>

                    <div className="flex items-center justify-end pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedImage(null)}
                            className="rounded-none shadow-none"
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
