import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Check, Megaphone, UploadCloud, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import InputError from '@/shared/components/input-error';
import { RichTextEditor } from '@/shared/components/rich-text-editor';
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

interface CreateAnnouncementProps {
    categories: string[];
}

export default function CreateAnnouncement({
    categories,
}: CreateAnnouncementProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm<{
        title: string;
        category: string;
        excerpt: string;
        content: string;
        banner: File | null;
        is_published: boolean;
        published_at: string;
    }>({
        title: '',
        category: 'advisory',
        excerpt: '',
        content: '',
        banner: null,
        is_published: true,
        published_at: '',
    });

    // Helper to generate a URL-friendly slug preview
    const slugPreview = data.title
        ? data.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, '')
        : 'your-announcement-title';

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setData('banner', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveBanner = () => {
        setData('banner', null);
        setPreviewUrl(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/announcements', {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title="Create Announcement | Admin Console" />

            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 md:p-6">
                {/* Back button and title */}
                <div className="flex flex-col gap-2">
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="-ml-2 w-fit text-muted-foreground hover:text-foreground"
                    >
                        <Link href="/admin/announcements">
                            <ArrowLeft className="mr-1.5 h-4 w-4" />
                            Back to Announcements
                        </Link>
                    </Button>
                    <div className="flex items-center gap-2.5">
                        <div className="rounded-lg bg-primary/10 p-2 text-primary">
                            <Megaphone className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                                Create New Announcement
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                Publish public advisories, community updates, or
                                meeting notices for Barangay Lallana.
                            </p>
                        </div>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 gap-6 lg:grid-cols-3"
                >
                    {/* Left & Middle: Article Content */}
                    <div className="flex flex-col gap-6 lg:col-span-2">
                        <Card className="border-border/70 shadow-2xs">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-base font-semibold">
                                    Article Information
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Provide the headline, category, and brief
                                    summary.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Title */}
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="title"
                                        className="text-xs font-semibold"
                                    >
                                        Title{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        placeholder="e.g. Barangay General Assembly & Townhall Schedule"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData('title', e.target.value)
                                        }
                                        className="h-10 text-sm"
                                        required
                                    />
                                    <div className="text-2xs flex items-center gap-1.5 text-muted-foreground">
                                        <span>Public URL slug:</span>
                                        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground/80">
                                            /announcements/{slugPreview}
                                        </code>
                                    </div>
                                    <InputError message={errors.title} />
                                </div>

                                {/* Category */}
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="category"
                                        className="text-xs font-semibold"
                                    >
                                        Category{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() =>
                                                    setData('category', cat)
                                                }
                                                className={`flex items-center justify-center gap-1.5 rounded-lg border p-2.5 text-xs font-medium capitalize transition-all ${
                                                    data.category === cat
                                                        ? 'border-primary bg-primary/10 font-semibold text-primary ring-1 ring-primary'
                                                        : 'border-border/70 bg-card text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                                                }`}
                                            >
                                                {data.category === cat && (
                                                    <Check className="h-3.5 w-3.5" />
                                                )}
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                    <InputError message={errors.category} />
                                </div>

                                {/* Excerpt */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <Label
                                            htmlFor="excerpt"
                                            className="text-xs font-semibold"
                                        >
                                            Short Excerpt / Teaser
                                        </Label>
                                        <span className="text-2xs text-muted-foreground">
                                            {data.excerpt.length}/500
                                        </span>
                                    </div>
                                    <Textarea
                                        id="excerpt"
                                        placeholder="A concise 1-2 sentence preview that appears on feed cards and social previews..."
                                        rows={3}
                                        maxLength={500}
                                        value={data.excerpt}
                                        onChange={(e) =>
                                            setData('excerpt', e.target.value)
                                        }
                                        className="text-xs"
                                    />
                                    <InputError message={errors.excerpt} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Rich Text Body Card */}
                        <Card className="border-border/70 shadow-2xs">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold">
                                    Announcement Body{' '}
                                    <span className="text-destructive">*</span>
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Format the announcement details using
                                    headings, lists, links, or quotes.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <RichTextEditor
                                    value={data.content}
                                    onChange={(html) =>
                                        setData('content', html)
                                    }
                                    placeholder="Write full announcement details, official guidelines, schedules, or emergency directives here..."
                                />
                                <InputError message={errors.content} />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Publication & Banner Media */}
                    <div className="flex flex-col gap-6">
                        {/* Publication Status Card */}
                        <Card className="border-border/70 shadow-2xs">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold">
                                    Publishing Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-2 rounded-lg border border-border/70 bg-muted/20 p-3">
                                    <Checkbox
                                        id="is_published"
                                        checked={data.is_published}
                                        onCheckedChange={(checked) =>
                                            setData(
                                                'is_published',
                                                Boolean(checked),
                                            )
                                        }
                                    />
                                    <div className="grid gap-1 leading-none">
                                        <Label
                                            htmlFor="is_published"
                                            className="cursor-pointer text-xs font-semibold"
                                        >
                                            Publish to Public Immediately
                                        </Label>
                                        <p className="text-2xs text-muted-foreground">
                                            If unchecked, saved as an internal
                                            draft visible only to admins.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="published_at"
                                        className="text-xs font-semibold"
                                    >
                                        Publish Date (Optional)
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="published_at"
                                            type="datetime-local"
                                            value={data.published_at}
                                            onChange={(e) =>
                                                setData(
                                                    'published_at',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-9 text-xs"
                                        />
                                    </div>
                                    <p className="text-2xs text-muted-foreground">
                                        Defaults to current time when published.
                                    </p>
                                    <InputError message={errors.published_at} />
                                </div>

                                <div className="pt-2">
                                    <Button
                                        type="submit"
                                        className="h-10 w-full gap-2 font-medium shadow-xs"
                                        disabled={processing}
                                    >
                                        <Megaphone className="h-4 w-4" />
                                        {processing
                                            ? 'Publishing...'
                                            : 'Save & Publish'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Banner Image Card */}
                        <Card className="border-border/70 shadow-2xs">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold">
                                    Featured Banner
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Optional cover image displayed at the top of
                                    the announcement. Max 5MB (JPG, PNG, WEBP).
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/png,image/jpeg,image/webp"
                                    className="hidden"
                                />

                                {previewUrl ? (
                                    <div className="relative overflow-hidden rounded-xl border border-border/80">
                                        <img
                                            src={previewUrl}
                                            alt="Cover preview"
                                            className="h-44 w-full object-cover"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 h-7 w-7 rounded-full shadow-md"
                                            onClick={handleRemoveBanner}
                                            title="Remove image"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/80 bg-muted/20 p-6 text-center transition-colors hover:border-primary/50 hover:bg-primary/5"
                                    >
                                        <div className="rounded-full bg-muted p-2.5 text-muted-foreground">
                                            <UploadCloud className="h-5 w-5" />
                                        </div>
                                        <p className="mt-2 text-xs font-semibold text-foreground">
                                            Upload cover banner
                                        </p>
                                        <p className="text-2xs mt-0.5 text-muted-foreground">
                                            PNG, JPG or WEBP up to 5MB
                                        </p>
                                    </div>
                                )}

                                <InputError message={errors.banner} />
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </>
    );
}
