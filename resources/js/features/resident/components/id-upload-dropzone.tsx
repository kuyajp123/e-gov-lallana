import { FileText, Image as ImageIcon, UploadCloud, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { Button } from '@/shared/components/ui/button';

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;

        if (file) {
            setSelectedFile(file);
            onFileSelect(file);

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
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/80 bg-muted/30 p-6 text-center transition-colors hover:border-primary/50 hover:bg-muted/60"
                >
                    <div className="mb-3 rounded-full bg-primary/10 p-3 text-primary">
                        <UploadCloud className="size-6" />
                    </div>
                    <p className="text-sm font-medium text-foreground">
                        Click to upload or drag & drop Government ID
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Accepted formats: JPG, PNG, WebP, PDF (Max 5MB)
                    </p>
                </div>
            ) : (
                <div className="relative flex items-center justify-between rounded-xl border border-border bg-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            {selectedFile?.type.includes('pdf') ? (
                                <FileText className="size-5" />
                            ) : (
                                <ImageIcon className="size-5" />
                            )}
                        </div>
                        <div className="max-w-[200px] sm:max-w-xs">
                            <p className="truncate text-sm font-medium text-foreground">
                                {selectedFile?.name || 'Attached Government ID'}
                            </p>
                            {selectedFile && (
                                <p className="text-xs text-muted-foreground">
                                    {(selectedFile.size / 1024 / 1024).toFixed(
                                        2,
                                    )}{' '}
                                    MB
                                </p>
                            )}
                            {currentFileUrl && !selectedFile && (
                                <a
                                    href={currentFileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs font-medium text-primary hover:underline"
                                >
                                    View Uploaded Document
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Replace
                        </Button>
                        {selectedFile && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleRemove}
                                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            >
                                <X className="size-4" />
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {previewUrl && (
                <div className="mt-2 overflow-hidden rounded-lg border border-border">
                    <img
                        src={previewUrl}
                        alt="ID Preview"
                        className="max-h-48 w-full bg-neutral-950/5 object-contain p-2 dark:bg-neutral-950/40"
                    />
                </div>
            )}

            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}
